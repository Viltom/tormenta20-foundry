// ============================================================
// T20 PDF Importer
// ------------------------------------------------------------
// Lê uma ficha em PDF do Jambo Editora (AcroForm preenchido)
// e transfere os campos preenchidos para um Actor do sistema.
//
// A ficha oficial do T20 (editada por Vinicius Soares Lima)
// é um formulário com 236 campos nomeados. Abordagem:
//  1. Carregar pdf.js (via CDN se não estiver global).
//  2. Chamar `getFieldObjects()` → { fieldName: [{value}] }
//  3. Mapear campos pro schema do Actor (template.json).
//  4. Aplicar em única operação `actor.update()`.
//  5. Criar embeddeds: armas (ataque1..5) e armaduras (armadura1..2).
// ============================================================

/* ──────────────────────────────────────────────────────────────
 *  pdf.js loader — bundle LOCAL (sem dependência de CDN/internet).
 *  Os arquivos ficam em systems/tormenta20/vendor/pdfjs/.
 *  Versão embutida: pdfjs-dist@4.4.168 (legacy build, minificada)
 * ────────────────────────────────────────────────────────────── */
const PDFJS_BASE = "systems/tormenta20/vendor/pdfjs/";
const PDFJS_MAIN   = `${PDFJS_BASE}pdf.min.mjs`;
const PDFJS_WORKER = `${PDFJS_BASE}pdf.worker.min.mjs`;

async function loadPdfJs() {
  if (globalThis.pdfjsLib && globalThis.pdfjsLib.getDocument) {
    return globalThis.pdfjsLib;
  }
  try {
    // foundry.utils.getRoute aplica o prefixo correto do servidor (sR/routePrefix),
    // garantindo que funciona mesmo em hosts que servem o Foundry em subpath.
    const path = (typeof foundry !== "undefined" && foundry.utils?.getRoute)
      ? foundry.utils.getRoute(PDFJS_MAIN)
      : `/${PDFJS_MAIN}`;
    const workerPath = (typeof foundry !== "undefined" && foundry.utils?.getRoute)
      ? foundry.utils.getRoute(PDFJS_WORKER)
      : `/${PDFJS_WORKER}`;

    // Import absoluto a partir da raiz do servidor Foundry
    const mod = await import(/* webpackIgnore: true */ path);
    const lib = mod.default ?? mod;
    if (!lib.GlobalWorkerOptions && mod.GlobalWorkerOptions) Object.assign(lib, mod);

    lib.GlobalWorkerOptions.workerSrc = workerPath;
    globalThis.pdfjsLib = lib;
    console.log("T20 | pdf.js carregado localmente:", path);
    return lib;
  } catch (err) {
    console.error("T20 | Falha ao carregar pdf.js local:", err);
    ui.notifications.error("Não foi possível carregar o pdf.js do sistema. Reinstale o sistema (pode ter ficado corrompido).");
    throw err;
  }
}

/* ──────────────────────────────────────────────────────────────
 *  Extração bruta: lê o PDF e retorna um objeto simples
 *  { nomeDoCampo: valor } onde valor é string (text) ou bool (checkbox).
 * ────────────────────────────────────────────────────────────── */
async function extractPdfFields(file) {
  const pdfjsLib = await loadPdfJs();
  const buf = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: buf }).promise;

  const out = {};

  // Abordagem 1: getFieldObjects (rápida, centralizada)
  try {
    const fobjs = await doc.getFieldObjects();
    if (fobjs) {
      for (const [name, arr] of Object.entries(fobjs)) {
        if (!arr?.length) continue;
        const v = arr[0].value;
        out[name] = v ?? "";
      }
    }
  } catch (err) {
    console.warn("T20 | getFieldObjects falhou, usando fallback de anotações:", err);
  }

  // Abordagem 2 (fallback): iterar annotations de cada página
  if (Object.keys(out).length === 0) {
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const anns = await page.getAnnotations();
      for (const a of anns) {
        if (a.subtype !== "Widget" || !a.fieldName) continue;
        let v = a.fieldValue;
        if (v === undefined || v === null) {
          // Checkbox: buttonValue preenche quando marcada
          if (a.checkBox) v = a.exportValue || false;
          else v = "";
        }
        out[a.fieldName] = v;
      }
    }
  }

  // Normaliza todos para string (com exceção de checkboxes → bool)
  for (const k of Object.keys(out)) {
    const v = out[k];
    if (typeof v === "string") out[k] = v.trim();
    else if (v === null || v === undefined) out[k] = "";
  }

  return out;
}

/* ──────────────────────────────────────────────────────────────
 *  Helpers de normalização
 * ────────────────────────────────────────────────────────────── */
function asInt(v, def = 0) {
  if (v === undefined || v === null || v === "") return def;
  const s = String(v).replace(/[^\d\-+]/g, "");
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : def;
}

function isChecked(v) {
  if (v === true) return true;
  if (!v) return false;
  const s = String(v).toLowerCase();
  return s.includes("sim") || s === "/yes" || s === "yes" || s === "/on"
         || s === "on"    || s === "true"  || s === "1";
}

/**
 * Extrai o bônus inteiro de uma string de rolagem tipo "1d20+3" ou "1d20-1".
 * Retorna 0 se não encontrar.
 */
function parseAttackBonus(str) {
  if (!str) return 0;
  const m = String(str).match(/1d20\s*([+\-]\s*\d+)/i);
  if (!m) return 0;
  return parseInt(m[1].replace(/\s+/g, ""), 10) || 0;
}

/* ──────────────────────────────────────────────────────────────
 *  Constantes de mapeamento — derivadas da análise da ficha oficial
 * ────────────────────────────────────────────────────────────── */

// Ordem das perícias na ficha PDF (índices 1..30). O slot 22 é a
// segunda linha de "Ofício", que o nosso sistema não desdobra, então
// consolidamos os dois slots na mesma perícia (toma o maior valor).
const PDF_PERICIA_ORDER = [
  null,               // 0 (não usado — PDF é 1-indexed)
  "acrobacia",        // 1
  "adestramento",     // 2
  "atletismo",        // 3
  "atuacao",          // 4
  "cavalgar",         // 5
  "conhecimento",     // 6
  "cura",             // 7
  "diplomacia",       // 8
  "enganacao",        // 9
  "fortitude",        // 10
  "furtividade",      // 11
  "guerra",           // 12
  "iniciativa",       // 13
  "intimidacao",      // 14
  "intuicao",         // 15
  "investigacao",     // 16
  "jogatina",         // 17
  "ladinagem",        // 18
  "luta",             // 19
  "misticismo",       // 20
  "nobreza",          // 21
  "oficio",           // 22 (1º slot de Ofício)
  "oficio",           // 23 (2º slot — consolidado no mesmo)
  "percepcao",        // 24
  "pilotagem",        // 25
  "pontaria",         // 26
  "reflexos",         // 27
  "religiao",         // 28
  "sobrevivencia",    // 29
  "vontade",          // 30
];

// Mapeia modSelect (ex: "modDes") → chave do atributo no schema
const MOD_SELECT_MAP = {
  modFor: "for", modDes: "des", modCon: "con",
  modInt: "int", modSab: "sab", modCar: "car",
};

/* ──────────────────────────────────────────────────────────────
 *  Conversor principal: campos brutos → payload de update()
 *  Retorna { updates, itemsToCreate }.
 * ────────────────────────────────────────────────────────────── */
function mapFieldsToActor(f) {
  const u = {};
  const items = [];

  // ── Identidade ──
  const pdfName = f["Nome"] || "";
  if (pdfName) u["name"] = pdfName;

  u["system.biografia.nome"]      = pdfName;
  u["system.biografia.raca"]      = f["Raca"]       || "";
  u["system.biografia.origem"]    = f["Origem"]     || "";
  u["system.biografia.classe"]    = f["Classe"]     || "";
  u["system.biografia.nivel"]     = asInt(f["nivel"], 1);
  u["system.biografia.divindade"] = f["Divindade"]  || "";

  // Deslocamento vem como string tipo "9m/18m"; extrai o 1º número
  if (f["deslocamento"]) {
    const m = String(f["deslocamento"]).match(/(\d+)/);
    if (m) u["system.biografia.deslocamento"] = parseInt(m[1], 10);
  }

  // Tamanho — a ficha não tem campo nominal "Pequeno/Médio";
  // inferimos por modTamanho: +2→Minúsculo, +1→Pequeno, 0→Médio, -1→Grande, -2→Enorme
  const modTam = asInt(f["modTamanho"], 0);
  const tamMap = { 4:"Minúsculo", 2:"Pequeno", 1:"Pequeno", 0:"Médio", "-1":"Grande", "-2":"Enorme", "-4":"Colossal" };
  if (tamMap[modTam]) u["system.biografia.tamanho"] = tamMap[modTam];

  // ── Atributos (T20 armazena modificador direto — bate com modXxx do PDF) ──
  u["system.atributos.for.value"] = asInt(f["modFor"]);
  u["system.atributos.des.value"] = asInt(f["modDes"]);
  u["system.atributos.con.value"] = asInt(f["modCon"]);
  u["system.atributos.int.value"] = asInt(f["modInt"]);
  u["system.atributos.sab.value"] = asInt(f["modSab"]);
  u["system.atributos.car.value"] = asInt(f["modCar"]);

  // ── Recursos ──
  u["system.pv.max"]   = asInt(f["vidaMax"]);
  u["system.pv.value"] = asInt(f["vidaAtual"]);
  u["system.pm.max"]   = asInt(f["manaMax"]);
  u["system.pm.value"] = asInt(f["manaAtual"]);

  // ── Defesa ──
  // A ficha divide armadura em dois slots (armadura + escudo ou 2 peças).
  // defesa1 = 1ª peça, defesa2 = 2ª peça; Texto13 = total calculado da ficha.
  u["system.defesa.armadura"]   = asInt(f["defesa1"]);
  u["system.defesa.escudo"]     = asInt(f["defesa2"]);
  u["system.defesa.outros"]     = asInt(f["defesaOutros"]);
  u["system.defesa.penalidade"] = asInt(f["penalidade1"]) + asInt(f["penalidade2"]);

  // ── Dinheiro (T$ e TO) ──
  u["system.detalhes.dinheiro.tb"] = asInt(f["T$"]);
  u["system.detalhes.dinheiro.to"] = asInt(f["TO"]);

  // ── Atributo-chave de magia ──
  const magiaAtr = MOD_SELECT_MAP[f["modSelectMagia"]];
  if (magiaAtr) u["system.magia.atributoChave"] = magiaAtr;

  // ── Perícias (treinamento + bônus "Outros") ──
  const periciaAgg = {}; // { nome: { treinada, bonus } } — consolida Ofício duplicado
  for (let i = 1; i <= 30; i++) {
    const pname = PDF_PERICIA_ORDER[i];
    if (!pname) continue;

    // treinado1..30 — checkbox /sim
    const trained = isChecked(f[`treinado${i}`]);
    // outros1..30 — string tipo "+2" ou "-7" ou ""
    const bonus   = asInt(f[`outros${i}`]);

    const prev = periciaAgg[pname];
    if (!prev) {
      periciaAgg[pname] = { treinada: trained, bonus };
    } else {
      // Consolida: treinada se qualquer slot foi marcado; bônus pega o maior em módulo
      periciaAgg[pname] = {
        treinada: prev.treinada || trained,
        bonus: Math.abs(bonus) > Math.abs(prev.bonus) ? bonus : prev.bonus,
      };
    }
  }
  for (const [pname, data] of Object.entries(periciaAgg)) {
    u[`system.pericias.${pname}.treinada`] = data.treinada;
    u[`system.pericias.${pname}.bonus`]    = data.bonus;
  }

  // ── Campos de Descrição / Notas (concatenados em biografia.descricao) ──
  const descSections = [
    ["Descrição",                    f["Descrição"]],
    ["Habilidades de Raça e Origem", f["Habilidades de Raça e Origem"]],
    ["Habilidades de Classe e Poderes", f["Habilidades de classe e poderes"]],
    ["Magias",                       f["Magias"]],
    ["Proficiências",                f["caracteristicas"]],
    ["Equipamento (Inventário)",     [f["item1"], f["item2"]].filter(Boolean).join("\n\n")],
    ["Anotações",                    f["Anotações"]],
    ["Atualização",                  f["Atualização"]],
    ["Histórico",                    f["Historico"]],
  ];
  const descHtml = descSections
    .filter(([_, txt]) => txt && String(txt).trim())
    .map(([title, txt]) => {
      const safe = String(txt)
        .replace(/\r\n?/g, "\n")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      // Converte quebras de linha em <br> preservando parágrafos vazios
      const body = safe.split(/\n{2,}/).map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
      return `<h2>${title}</h2>${body}`;
    })
    .join('<hr style="border:0;border-top:1px solid #555;margin:12px 0">');
  if (descHtml) u["system.biografia.descricao"] = descHtml;

  // ── Armas (ataque1..5) → Items embedded tipo "arma" ──
  for (let i = 1; i <= 5; i++) {
    const nome = String(f[`ataque${i}`] || "").trim();
    if (!nome) continue;
    const dano   = String(f[`dano${i}`]    || "").trim();
    const crit   = String(f[`critico${i}`] || "").trim() || "20/x2";
    const tipo   = String(f[`tipo${i}`]    || "").trim();
    const alc    = String(f[`alcance${i}`] || "").trim();
    const bonus  = parseAttackBonus(f[`tAtak${i}`]);
    items.push({
      name: nome,
      type: "arma",
      img: "icons/svg/sword.svg",
      system: {
        dano,
        critico: crit,
        tipo,
        alcance: alc,
        bonusAtaque: 0,      // deixamos 0; o sistema calcula pelo atributo
        bonus,               // bônus literal adicional vindo do PDF
        equipada: true,
        ignoraAtributoDano: false,
        ataqueNatural: /natural|garras?|presas?|mordida|chifres?/i.test(nome),
      },
    });
  }

  // ── Armaduras (armadura1, armadura2) → Items embedded tipo "armadura" ──
  for (let i = 1; i <= 2; i++) {
    const nome = String(f[`armadura${i}`] || "").trim();
    if (!nome) continue;
    items.push({
      name: nome,
      type: "armadura",
      img: "icons/svg/statue.svg",
      system: {
        defesa: asInt(f[`defesa${i}`]),
        penalidade: asInt(f[`penalidade${i}`]),
        equipada: true,
      },
    });
  }

  return { updates: u, itemsToCreate: items };
}

/* ──────────────────────────────────────────────────────────────
 *  Normalizador de nomes (acentos, caixa, pontuação)
 * ────────────────────────────────────────────────────────────── */
const normName = (s) => String(s || "").toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, " ").trim();

/* ──────────────────────────────────────────────────────────────
 *  (Opcional) Tenta fazer match de armas/armaduras nos compêndios
 *  pra trazer dados completos (grupo, propriedades, etc.).
 *  Se achar, mescla: mantém o nome/dano/crit/tipo do PDF (que pode
 *  ter customizações do personagem) mas completa os outros campos.
 * ────────────────────────────────────────────────────────────── */
async function enrichItemsFromCompendium(items) {
  const packs = {
    arma: game.packs.get("tormenta20.armas"),
    armadura: game.packs.get("tormenta20.armaduras"),
  };
  const caches = {};
  for (const type of Object.keys(packs)) {
    const pack = packs[type];
    caches[type] = pack ? await pack.getDocuments() : [];
  }

  for (const it of items) {
    const cache = caches[it.type];
    if (!cache || !cache.length) continue;
    const target = normName(it.name);
    // exact normalized match > starts-with > contains
    let match = cache.find(d => normName(d.name) === target);
    if (!match) match = cache.find(d => normName(d.name).startsWith(target));
    if (!match) match = cache.find(d => normName(d.name).includes(target) || target.includes(normName(d.name)));
    if (!match) continue;

    // Merge: mantém campos que o PDF definiu, pega o resto do compêndio
    const base = foundry.utils.deepClone(match.system);
    it.system = foundry.utils.mergeObject(base, it.system, { inplace: false });
    it.img = match.img || it.img;
  }
}

/* ──────────────────────────────────────────────────────────────
 *  Linkagem com compêndios de Raça / Classe / Origem
 *  ---
 *  Dada uma string do PDF (ex.: "Duende Animal (Cão)", "Treinadora",
 *  "Mensageira"), tenta achar a entrada correspondente no compêndio
 *  e retorna o documento achado (ou null).
 *
 *  Cascata de busca (da mais estrita pra mais solta):
 *    1. Nome exato normalizado.
 *    2. Nome com parênteses removidos.
 *    3. Flexão feminino → masculino (Treinadora→Treinador, etc.).
 *    4. Primeira palavra apenas (Duende Animal → Duende).
 *    5. startsWith com palavra completa.
 * ────────────────────────────────────────────────────────────── */
function _femToMasc(name) {
  // Retorna array de candidatos aplicando heurísticas de flexão
  const candidates = new Set();
  const raw = name.trim();
  candidates.add(raw);

  // Remove conteúdo em parênteses: "Duende Animal (Cão)" → "Duende Animal"
  const noParen = raw.replace(/\s*\([^)]*\)/g, "").trim();
  if (noParen) candidates.add(noParen);

  // Conjugações comuns PT-BR (feminino → masculino)
  const flexions = [
    [/ora$/i, "or"],    // Treinadora → Treinador
    [/eira$/i, "eiro"], // Mensageira → Mensageiro, Guerreira → Guerreiro
    [/ina$/i, "ino"],   // Assassina → Assassino
    [/ária$/i, "ário"], // Mercenária → Mercenário
    [/ica$/i, "ico"],   // Clériga → Clérigo
    [/ista$/i, "ista"], // Arcanista (invariável)
    [/ã$/i, "ão"],      // Irmã → Irmão
    [/dora$/i, "dor"],  // Caçadora → Caçador
  ];
  for (const cand of [raw, noParen]) {
    for (const [re, rep] of flexions) {
      if (re.test(cand)) candidates.add(cand.replace(re, rep));
    }
  }

  // Primeira palavra isolada
  const first = noParen.split(/\s+/)[0];
  if (first && first.length >= 3) candidates.add(first);

  return [...candidates];
}

async function findCompendiumEntry(packId, pdfName) {
  if (!pdfName) return null;
  const pack = game.packs.get(packId);
  if (!pack) return null;
  const docs = await pack.getDocuments();
  if (!docs.length) return null;

  const candidates = _femToMasc(pdfName);
  for (const cand of candidates) {
    const target = normName(cand);
    if (!target) continue;
    // 1. exact
    let m = docs.find(d => normName(d.name) === target);
    if (m) return m;
    // 2. startsWith palavra-inteira
    m = docs.find(d => {
      const n = normName(d.name);
      return n.startsWith(target + " ") || target.startsWith(n + " ");
    });
    if (m) return m;
    // 3. includes (só se candidato longo suficiente pra evitar false positive)
    if (target.length >= 4) {
      m = docs.find(d => normName(d.name).includes(target));
      if (m) return m;
    }
  }
  return null;
}

/**
 * Cria items embedded "habilidade" na ficha pra cada link achado.
 * Respeita o mesmo formato do _onHeaderPick quando o usuário escolhe
 * manualmente: name = "Raça: X", type = "habilidade".
 *
 * IMPORTANTE: NÃO chama _autoApply — os atributos do PDF já estão finais.
 */
async function applyCompendiumLinks(actor, fields) {
  const linkTargets = [
    { field: "Raca",    label: "Raça",   pack: "tormenta20.racas"   },
    { field: "Classe",  label: "Classe", pack: "tormenta20.classes" },
    { field: "Origem",  label: "Origem", pack: "tormenta20.origens" },
  ];
  const toCreate = [];
  const foundNames = [];
  const notFound = [];
  for (const t of linkTargets) {
    const pdfVal = fields[t.field];
    if (!pdfVal) continue;
    const doc = await findCompendiumEntry(t.pack, pdfVal);
    if (doc) {
      foundNames.push(`${t.label}: ${doc.name}`);
      toCreate.push({
        name: `${t.label}: ${doc.name}`,
        type: "habilidade",
        img: doc.img,
        system: foundry.utils.deepClone(doc.system),
      });
    } else {
      notFound.push(`${t.label}="${pdfVal}"`);
    }
  }
  if (toCreate.length) {
    await actor.createEmbeddedDocuments("Item", toCreate);
  }
  return { foundNames, notFound };
}

/* ──────────────────────────────────────────────────────────────
 *  Parsing de magias a partir do bloco textual "Magias" do PDF
 *  ---
 *  Formato esperado (escrito livremente pelos jogadores):
 *    ===========================1º Círculo (1 PM)=================
 *    Bola de Fogo, universal, padrão, curto, 6m, instantânea, Ref, 5d6
 *    Cura Moderada,divina,padrão,toque,-,instantânea,-,cura
 *    ...
 *    ===========================2º Círculo (3 PM)=================
 *    Bola de Fogo Maior
 *
 *  Heurística: ignora linhas de cabeçalho (======), para cada linha
 *  útil pega o texto antes da primeira vírgula (ou a linha toda) como
 *  nome da magia. Tudo passado por normName pra casar com o compêndio.
 * ────────────────────────────────────────────────────────────── */
function parseSpellNamesFromBlock(magiasText) {
  if (!magiasText) return [];
  const lines = String(magiasText).replace(/\r\n?/g, "\n").split("\n");
  const names = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    // pula cabeçalhos de círculo (=== N° Círculo ===) e marcadores
    if (/^[=\-_*]+/.test(line)) continue;
    if (/círculo|circulo/i.test(line) && /\d|pm/i.test(line)) continue;
    if (/não.?conjur/i.test(line)) continue;
    // pega o nome antes da primeira vírgula (ou a linha toda)
    let name = line.split(/[,;|]/)[0].trim();
    // remove prefixos como "-", "•", "*", "> " etc.
    name = name.replace(/^[>\-\*•·]+\s*/, "").trim();
    if (!name) continue;
    // filtra linhas muito longas (>60 chars) que provavelmente não são só nome
    if (name.length > 60) continue;
    names.push(name);
  }
  return names;
}

/**
 * Busca cada nome no compêndio de magias e cria items embedded.
 * Retorna { created: [names], missing: [names] }.
 */
async function importSpellsFromMagiasBlock(actor, magiasText) {
  const names = parseSpellNamesFromBlock(magiasText);
  if (!names.length) return { created: [], missing: [] };
  const pack = game.packs.get("tormenta20.magias");
  if (!pack) return { created: [], missing: names };
  const docs = await pack.getDocuments();

  const created = [];
  const missing = [];
  const toCreate = [];
  const seen = new Set(); // evita duplicados se o usuário listou a mesma magia 2x

  for (const name of names) {
    const target = normName(name);
    if (!target || seen.has(target)) continue;
    seen.add(target);

    let match = docs.find(d => normName(d.name) === target);
    if (!match) match = docs.find(d => normName(d.name).startsWith(target));
    if (!match && target.length >= 5) match = docs.find(d => normName(d.name).includes(target));

    if (match) {
      toCreate.push({
        name: match.name,
        type: "magia",
        img: match.img,
        system: foundry.utils.deepClone(match.system),
      });
      created.push(match.name);
    } else {
      missing.push(name);
    }
  }

  if (toCreate.length) {
    await actor.createEmbeddedDocuments("Item", toCreate);
  }
  return { created, missing };
}

/* ──────────────────────────────────────────────────────────────
 *  Fluxo completo: seleciona arquivo → lê → aplica
 *
 *  options:
 *    - skipConfirm (bool)  pula o dialog de confirmação
 *    - file        (File)  arquivo já selecionado (pula seletor)
 * ────────────────────────────────────────────────────────────── */
export async function importT20CharacterPdf(actor, options = {}) {
  if (!actor) {
    ui.notifications.error("Ator não informado.");
    return;
  }

  // Abre input file nativo (ou usa o arquivo passado por opts)
  const file = options.file || await pickPdfFile();
  if (!file) return;

  // Confirma com o usuário (importação sobrescreve atributos/bio)
  if (!options.skipConfirm) {
    const confirmed = await Dialog.confirm({
      title: "Importar Ficha PDF",
      content: `
        <p>Vou importar <b>${file.name}</b> para <b>${actor.name}</b>.</p>
        <p style="color:#c7a16b">Isso vai <b>sobrescrever</b> atributos, perícias, PV/PM, defesa,
        dinheiro, biografia e criar armas/armaduras a partir dos campos do PDF.</p>
        <p>Itens já existentes no ator <b>não serão apagados</b>. Continuar?</p>
      `,
      yes: () => true, no: () => false, defaultYes: true,
    });
    if (!confirmed) return;
  }

  ui.notifications.info("Lendo PDF...");

  let fields;
  try {
    fields = await extractPdfFields(file);
  } catch (err) {
    console.error("T20 | Erro ao extrair campos do PDF:", err);
    ui.notifications.error("Erro ao ler o PDF. Veja o console (F12).");
    return;
  }

  const fieldCount = Object.keys(fields).length;
  if (fieldCount === 0) {
    ui.notifications.warn("Nenhum campo de formulário encontrado. O PDF é um formulário preenchível?");
    return;
  }
  console.log(`T20 | PDF lido: ${fieldCount} campos`, fields);

  const { updates, itemsToCreate } = mapFieldsToActor(fields);

  // Enriquecer armas/armaduras com dados do compêndio (best-effort)
  try {
    await enrichItemsFromCompendium(itemsToCreate);
  } catch (err) {
    console.warn("T20 | Falha ao buscar compêndio (armas/armaduras):", err);
  }

  // Aplica no ator
  try {
    await actor.update(updates);
    if (itemsToCreate.length) {
      await actor.createEmbeddedDocuments("Item", itemsToCreate);
    }
  } catch (err) {
    console.error("T20 | Erro ao aplicar dados no ator:", err);
    ui.notifications.error("Erro ao aplicar no ator. Veja o console (F12).");
    return;
  }

  // Linkar Raça/Classe/Origem aos compêndios (cria items habilidade)
  let linkResult = { foundNames: [], notFound: [] };
  try {
    linkResult = await applyCompendiumLinks(actor, fields);
  } catch (err) {
    console.warn("T20 | Falha ao linkar raça/classe/origem:", err);
  }

  // Importar magias a partir do bloco textual
  let spellResult = { created: [], missing: [] };
  try {
    spellResult = await importSpellsFromMagiasBlock(actor, fields["Magias"]);
  } catch (err) {
    console.warn("T20 | Falha ao importar magias:", err);
  }

  // Notificação final sumarizando tudo
  const summary = [];
  summary.push(`${itemsToCreate.length} equipamento(s)`);
  if (linkResult.foundNames.length) summary.push(`${linkResult.foundNames.length} habilidade(s) linkada(s)`);
  if (spellResult.created.length)   summary.push(`${spellResult.created.length} magia(s)`);
  ui.notifications.info(`Ficha importada! ${summary.join(", ")}.`);

  // Avisa sobre coisas não achadas (no console, não spam de toast)
  if (linkResult.notFound.length) {
    console.warn("T20 | Não linkado ao compêndio:", linkResult.notFound);
  }
  if (spellResult.missing.length) {
    console.warn("T20 | Magias não encontradas no compêndio:", spellResult.missing);
  }
}

/* ──────────────────────────────────────────────────────────────
 *  Cria um novo ator a partir de um PDF (sem precisar criar o ator
 *  antes). Usado pelo botão no ActorDirectory.
 * ────────────────────────────────────────────────────────────── */
export async function createActorFromPdf() {
  const file = await pickPdfFile();
  if (!file) return null;

  // Lê o PDF primeiro pra saber o nome (melhor UX do que "Novo Ator" temporário)
  ui.notifications.info("Lendo PDF...");
  let fields;
  try {
    fields = await extractPdfFields(file);
  } catch (err) {
    console.error("T20 | Erro ao ler PDF:", err);
    ui.notifications.error("Erro ao ler o PDF. Veja o console (F12).");
    return null;
  }

  const actorName = (fields["Nome"] || "Novo Personagem").trim();
  const confirmed = await Dialog.confirm({
    title: "Criar Ator a partir de PDF",
    content: `
      <p>Vou criar um novo ator <b>${actorName}</b> e importar todos os dados de <b>${file.name}</b>.</p>
      <p>Continuar?</p>
    `,
    yes: () => true, no: () => false, defaultYes: true,
  });
  if (!confirmed) return null;

  // Cria o ator vazio
  let actor;
  try {
    actor = await Actor.create({
      name: actorName,
      type: "personagem",
      img: "icons/svg/mystery-man.svg",
    });
  } catch (err) {
    console.error("T20 | Falha ao criar ator:", err);
    ui.notifications.error("Erro ao criar o ator.");
    return null;
  }

  // Reusa o fluxo padrão, passando o arquivo já lido e pulando confirmação
  await importT20CharacterPdf(actor, { file, skipConfirm: true });

  // Abre a ficha
  actor.sheet.render(true);
  return actor;
}

/**
 * Abre o seletor de arquivo nativo e retorna o File selecionado (ou null).
 */
function pickPdfFile() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf,.pdf";
    input.style.display = "none";
    input.addEventListener("change", () => {
      const f = input.files?.[0] || null;
      document.body.removeChild(input);
      resolve(f);
    });
    input.addEventListener("cancel", () => {
      document.body.removeChild(input);
      resolve(null);
    });
    document.body.appendChild(input);
    input.click();
  });
}
