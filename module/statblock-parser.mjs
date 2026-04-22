// ========================================================
// T20 Statblock Parser
// Parseia statblocks do Livro Básico T20 (formato Jogo do Ano)
// e retorna um objeto estruturado pronto para criar Actor+Items
// ========================================================

/**
 * Entrada: texto colado do livro (pode ter \r\n, soft-hyphens \u0002,
 *          espaços estranhos etc.)
 * Saída:  objeto { name, nd, tipo, tamanho, pv, pm, defesa, pericias,
 *                  atributos, ataques[], habilidades[], ... }
 *
 * Filosofia:
 * - Tudo que não for reconhecido vira `warnings[]` (o usuário pode revisar)
 * - Nunca quebra: campos faltantes viram defaults sensatos
 * - Puro: não depende de Foundry, só devolve dados
 */
export function parseStatblock(rawText) {
  const out = {
    name: "NPC",
    nd: "1",
    descricao: "",
    tipo: "Monstro",
    tamanho: "Médio",
    deslocamento: 9,
    deslocamentoExtra: "",
    iniciativa: 0,
    percepcao: 0,
    sentidos: "",
    defesa: 10,
    fortitude: 0,
    reflexos: 0,
    vontade: 0,
    resistencias: [],
    pv: 10,
    pm: 0,
    atributos: { for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 },
    pericias: {}, // { nomeKey: bonus }
    ataques: [], // [{ nome, bonusAtaque, dano, critico, tipoDano, numAtaques, efeitos, distancia }]
    habilidades: [], // [{ nome, acao, custoPM, descricao }]
    magias: [], // [{ nome, acao, custoPM, descricao }]
    equipamento: "",
    tesouro: "",
    warnings: [],
  };

  // ── 1. Pré-processamento ──
  const text = _normalize(rawText);
  if (!text.trim()) {
    out.warnings.push("Texto vazio");
    return out;
  }

  // Transforma o texto em linhas limpas
  const rawLines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);

  // ── 2. Achar linha-chave com ND ──
  // Padrões: "NOME ND X" ou "ND X" isolado ou em linha subsequente
  const { name, nd, headerIdx } = _extractNameAndND(rawLines);
  out.name = name || "NPC";
  out.nd = nd || "1";

  // ── 3. Dividir o texto em zonas ──
  // [nome+ND] → [descrição prosa] → [tipo tamanho] → [stats] → [atributos] → [extras]
  const zones = _splitIntoZones(rawLines, headerIdx);

  // Descrição (prosa entre header e "Tipo Tamanho")
  out.descricao = zones.descricao;

  // ── 4. Tipo + Tamanho ──
  const tt = _parseTipoTamanho(zones.tipoTamanho);
  if (tt.tipo) out.tipo = tt.tipo;
  if (tt.tamanho) out.tamanho = tt.tamanho;

  // ── 5. Linhas de stats (Iniciativa/Defesa/PV/Deslocamento/etc.) ──
  for (const line of zones.stats) {
    _parseStatsLine(line, out);
  }

  // ── 6. Atributos ──
  _parseAtributos(zones.atributosLine, out);

  // ── 7. Ataques, habilidades, magias (zona média) ──
  _parseMidZone(zones.meio, out);

  // ── 8. Extras (Perícias, Equipamento, Tesouro) ──
  for (const line of zones.extras) {
    _parseExtraLine(line, out);
  }

  return out;
}

// ========================================================
// HELPERS
// ========================================================

/**
 * Remove caracteres de controle, soft-hyphens, normaliza dashes e quebras.
 */
function _normalize(text) {
  return String(text || "")
    // soft hyphen usado nas quebras do PDF
    .replace(/\u00AD/g, "")
    .replace(/\u0002/g, "")
    // CR isolado → LF
    .replace(/\r\n?/g, "\n")
    // Junta linhas que quebram uma palavra (word-\n word → word word)
    .replace(/(\w)[-\u2010-\u2015]\n(\w)/g, "$1$2")
    // Normaliza diferentes dashes para ASCII hyphen quando usado como negativo
    // (mantém — como "nulo" no contexto de atributos)
    .replace(/[\u2212\u2013]/g, "-")  // minus, en-dash → hyphen
    // Remove tabs
    .replace(/\t/g, " ")
    // Colapsa espaços múltiplos
    .replace(/[ ]{2,}/g, " ");
}

/**
 * Encontra "NOME ND X" — pode estar tudo na mesma linha ou quebrado.
 * Retorna { name, nd, headerIdx (linha onde termina o header) }
 */
function _extractNameAndND(lines) {
  // Procura na primeira ocorrência de "ND " em qualquer linha (primeiras 5)
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    // Caso 1: "Nome do Monstro ND 1/2"
    const m = line.match(/^(.+?)\s+ND\s+(\d+(?:\/\d+)?)\s*$/i);
    if (m) {
      return { name: _titleCase(m[1].trim()), nd: m[2], headerIdx: i };
    }
    // Caso 2: "ND 1/2" sozinho — nome na linha anterior
    const m2 = line.match(/^ND\s+(\d+(?:\/\d+)?)\s*$/i);
    if (m2 && i > 0) {
      return { name: _titleCase(lines[i - 1].trim()), nd: m2[1], headerIdx: i };
    }
  }
  // Fallback: primeira linha é o nome, sem ND
  return { name: lines[0] ? _titleCase(lines[0]) : "NPC", nd: "1", headerIdx: 0 };
}

/**
 * Divide as linhas pós-header em zonas:
 *  - descricao (prosa) → até achar "Tipo Tamanho"
 *  - tipoTamanho (linha única)
 *  - stats (Iniciativa/Defesa/PV/Deslocamento/PM)
 *  - meio (ataques + habilidades + magias) → até linha "For X, Des Y..."
 *  - atributosLine
 *  - extras (Perícias, Equipamento, Tesouro)
 */
function _splitIntoZones(lines, headerIdx) {
  const after = lines.slice(headerIdx + 1);
  const z = { descricao: "", tipoTamanho: "", stats: [], meio: [], atributosLine: "", extras: [] };

  // Regex reconhecedoras
  const reTipoTamanho = /^(Humanoide|Humano|Animal|Construto|Espírito|Espirito|Monstro|Monstruosidade|Morto-?\s?vivo|Lefou|Dragão|Dragao|Gigante|Fada|Extraplanar)(\s*\([^)]+\))?\s+(Minúsculo|Minusculo|Diminuto|Pequeno|Médio|Medio|Grande|Enorme|Colossal)\b/i;
  const reStatKey = /^(Iniciativa|Defesa|Pontos de Vida|Pontos de Mana|Deslocamento|Sentidos)\b/i;
  const reAtributos = /^For\s+[-]?\d+|^For\s+—|^For\s+-/i;
  const reExtra = /^(Perícias|Pericias|Equipamento|Tesouro|Habilidades)\b/i;

  // Estado: descricao → tipoTamanho → stats → meio → atributos → extras
  let estado = "descricao";

  for (const line of after) {
    if (estado === "descricao") {
      if (reTipoTamanho.test(line)) {
        z.tipoTamanho = line;
        estado = "stats";
        continue;
      }
      z.descricao += (z.descricao ? " " : "") + line;
      continue;
    }

    if (estado === "stats") {
      if (reStatKey.test(line)) { z.stats.push(line); continue; }
      // Se encontrou atributos, pular pra lá
      if (reAtributos.test(line)) {
        z.atributosLine = line;
        estado = "extras";
        continue;
      }
      // Caiu em conteúdo (ataques/habilidades)
      estado = "meio";
      z.meio.push(line);
      continue;
    }

    if (estado === "meio") {
      if (reAtributos.test(line)) {
        z.atributosLine = line;
        estado = "extras";
        continue;
      }
      // Linhas de stats que aparecem no meio (ex: "Pontos de Mana" após ataques)
      if (reStatKey.test(line)) { z.stats.push(line); continue; }
      z.meio.push(line);
      continue;
    }

    if (estado === "extras") {
      if (reExtra.test(line)) {
        z.extras.push(line);
        continue;
      }
      // Continuação de extra anterior (linha de perícias multi-linha, etc.)
      if (z.extras.length) {
        z.extras[z.extras.length - 1] += " " + line;
      }
    }
  }

  return z;
}

/**
 * "Monstro Pequeno" → { tipo: "Monstro", tamanho: "Pequeno" }
 * "Humanoide (orc) Médio" → { tipo: "Humanoide", subtipo: "orc", tamanho: "Médio" }
 * "Espírito (demônio) Grande" → { tipo: "Espírito", subtipo: "demônio", tamanho: "Grande" }
 */
function _parseTipoTamanho(line) {
  if (!line) return {};
  const m = line.match(/^(\S+)(\s*\(([^)]+)\))?\s+(\S+)\b/);
  if (!m) return {};
  let tipo = _titleCase(m[1]);
  // Normalizações
  tipo = tipo.replace(/^Espirito$/i, "Espírito")
             .replace(/^Dragao$/i, "Dragão")
             .replace(/^Morto-?vivo$/i, "Morto-Vivo");
  let tamanho = m[4].replace(/^Medio$/i, "Médio").replace(/^Minusculo$/i, "Minúsculo");
  return { tipo: _titleCase(tipo), subtipo: m[3] || "", tamanho: _titleCase(tamanho) };
}

/**
 * Parseia linhas como:
 *  "Iniciativa +7, Percepção +3, visão no escuro"
 *  "Defesa 19, Fort +8, Ref +11, Von +3"
 *  "Pontos de Vida 77"
 *  "Pontos de Mana 55"
 *  "Deslocamento 12m (8q), escalar 12m (8q)"
 */
function _parseStatsLine(line, out) {
  // Iniciativa e Percepção
  const ini = line.match(/Iniciativa\s+([+-]?\d+)/i);
  if (ini) out.iniciativa = parseInt(ini[1]);
  const per = line.match(/Percepção\s+([+-]?\d+)/i);
  if (per) out.percepcao = parseInt(per[1]);

  // Sentidos (tudo depois de Percepção)
  const sense = line.match(/Percepção\s+[+-]?\d+,?\s*(.+)$/i);
  if (sense) {
    const clean = sense[1].trim().replace(/^[,\s]+/, "");
    if (clean) out.sentidos = clean;
  }

  // Defesa + resistências
  const def = line.match(/^Defesa\s+(\d+)/i);
  if (def) out.defesa = parseInt(def[1]);
  const fort = line.match(/Fort\.?\s+([+-]?\d+)/i);
  if (fort) out.fortitude = parseInt(fort[1]);
  const ref = line.match(/Ref\.?\s+([+-]?\d+)/i);
  if (ref) out.reflexos = parseInt(ref[1]);
  const von = line.match(/Von\.?\s+([+-]?\d+)/i);
  if (von) out.vontade = parseInt(von[1]);

  // Imunidades / reduções na linha de Defesa
  if (/^Defesa\s+\d+/i.test(line)) {
    const after = line.replace(/^Defesa\s+\d+,\s*Fort\s+[+-]?\d+,\s*Ref\s+[+-]?\d+,\s*Von\s+[+-]?\d+/i, "").trim();
    if (after) {
      // Ex: ", imunidade a ácido, redução de dano 5"
      const parts = after.replace(/^[,\s]+/, "").split(/\s*,\s*/);
      for (const p of parts) {
        if (p.trim()) out.resistencias.push(_titleCaseFirst(p.trim()));
      }
    }
  }

  // PV / PM
  const pv = line.match(/^Pontos de Vida\s+(\d+)/i);
  if (pv) out.pv = parseInt(pv[1]);
  const pm = line.match(/^Pontos de Mana\s+(\d+)/i);
  if (pm) out.pm = parseInt(pm[1]);

  // Deslocamento
  const desl = line.match(/^Deslocamento\s+(\d+)m/i);
  if (desl) out.deslocamento = parseInt(desl[1]);
  // Deslocamentos extras (escalar/voo/etc.)
  const deslExtra = line.match(/^Deslocamento\s+\d+m\s*\(\d+q\)\s*,\s*(.+)$/i);
  if (deslExtra) out.deslocamentoExtra = deslExtra[1].trim();
}

/**
 * "For 6, Des 2, Con 4, Int -2, Sab -2, Car -2"
 * Também aceita "Int —" (nulo) → 0 + warning.
 */
function _parseAtributos(line, out) {
  if (!line) return;
  const keys = ["for", "des", "con", "int", "sab", "car"];
  const labels = { for: "For", des: "Des", con: "Con", int: "Int", sab: "Sab", car: "Car" };
  for (const k of keys) {
    // captura "For 5", "For -2", "For —", "For —"
    const re = new RegExp(`${labels[k]}\\s+(-?\\d+|—|–|-)`, "i");
    const m = line.match(re);
    if (m) {
      const raw = m[1];
      if (raw === "—" || raw === "–" || raw === "-") {
        out.atributos[k] = 0;
        out.warnings.push(`Atributo ${labels[k]} é nulo (—) — definido como 0.`);
      } else {
        out.atributos[k] = parseInt(raw);
      }
    }
  }
}

/**
 * Zona entre Deslocamento/PM e Atributos.
 * Processa linha a linha para preservar fronteiras naturais entre tópicos.
 * Cada "tópico" começa numa nova linha — isso é como o livro formata.
 *
 * Tipos de tópicos:
 *  - Corpo a Corpo / Distância (ATAQUES)
 *  - "Magias" + bullets (MAGIAS conjuradas)
 *  - Qualquer outro (HABILIDADE especial — passiva, ativa ou reação)
 */
function _parseMidZone(lines, out) {
  // 1ª passada: agrupar linhas em "blocos" (cada bloco = um tópico).
  // Uma nova linha começa um novo bloco se ela parece ser título.
  // Caso contrário, anexa ao bloco anterior.
  const blocks = [];
  let cur = "";

  const isNewTopic = (line) => {
    // Começa com palavra-chave conhecida
    if (/^(?:Corpo a Corpo|Distância|Distancia|Magias)\b/.test(line)) return true;
    // Começa com bullet de magia "•"
    if (/^•\s/.test(line)) return true;
    // Começa com [Nome capitalizado] + "(Ação[, N PM])" nos primeiros 50 chars
    if (/^[A-ZÁÉÍÓÚÂÊÎÔÛÀÇÃÕ][\wáéíóúâêîôûàçãõÁÉÍÓÚÂÊÎÔÛÀÇÃÕ\-]*(?:\s+[\wáéíóúâêîôûàçãõÁÉÍÓÚÂÊÎÔÛÀÇÃÕ\-]+){0,5}\s*\((?:Livre|Reação|Reacao|Movimento|Padrão|Padrao|Completa|Passiva)/i.test(line)) return true;
    // Heurística para habilidade passiva: começa com 1-4 palavras capitalizadas seguidas de texto
    // que não começa com minúscula conectiva (Se, Uma, Por, Quando são início de sentença VÁLIDO)
    // A ideia: se tivermos uma linha nova E ela começa com capital, é um novo tópico.
    // Isso só é falso quando o livro quebra uma palavra no meio da linha — mas nesse caso
    // a próxima linha começaria com minúscula.
    if (/^[A-ZÁÉÍÓÚÂÊÎÔÛÀÇÃÕ]/.test(line)) {
      // mas não se for claramente continuação (começando com "Se ", "Uma ", "Por ", "Quando ", etc.
      // seguido por texto claramente narrativo — só aceita como novo se tiver ≥ 2 palavras
      // Title Case seguidas OU tiver um ":" OU o começo parecer "NomeAbc descricao..."
      const firstWords = line.split(/\s+/).slice(0, 5);
      // Uma habilidade tem geralmente "Nome [Mais]* descricao". Se a 2ª palavra também é capital,
      // é forte indício de título.
      if (firstWords.length >= 2 && /^[A-ZÁÉÍÓÚÂÊÎÔÛÀÇÃÕ]/.test(firstWords[1] || "")) return true;
      // Ou se só tem 1 palavra no começo (ex: "Imobilidade") seguida de texto longo, também serve
      if (firstWords.length === 1 || /^[a-záéíóú]/.test(firstWords[1] || "")) return true;
    }
    return false;
  };

  for (const line of lines) {
    if (!cur) { cur = line; continue; }
    if (isNewTopic(line)) {
      blocks.push(cur);
      cur = line;
    } else {
      cur += " " + line;
    }
  }
  if (cur) blocks.push(cur);

  // 2ª passada: classificar cada bloco
  let inMagiaSection = false;
  for (const rawBlock of blocks) {
    const block = rawBlock.trim();
    if (!block) continue;

    // ATAQUES
    if (/^Corpo a Corpo\b/i.test(block)) {
      inMagiaSection = false;
      _parseAttackBlock(block.replace(/^Corpo a Corpo\s+/i, ""), out, false);
      continue;
    }
    if (/^(?:Distância|Distancia)\b/i.test(block)) {
      inMagiaSection = false;
      _parseAttackBlock(block.replace(/^(?:Distância|Distancia)\s+/i, ""), out, true);
      continue;
    }

    // MAGIAS — linha "Magias ..." introduz, bullets "• ..." listam
    if (/^Magias\b/i.test(block)) {
      inMagiaSection = true;
      // A linha "Magias X lança magias como..." em si só descreve contexto,
      // os bullets vêm em blocos separados.
      // Extrai CD se presente para guardar como warning/info
      const cdm = block.match(/CD\s+(\d+)/i);
      if (cdm) out.warnings.push(`Conjurador: CD de magias no livro = ${cdm[1]} (NPC usa CD calculada dos atributos).`);
      continue;
    }

    if (/^•/.test(block) && inMagiaSection) {
      const magia = _parseMagiaBullet(block);
      if (magia) out.magias.push(magia);
      continue;
    }

    // HABILIDADE (ativa ou passiva)
    const hab = _parseAbilityBlock(block);
    if (hab) out.habilidades.push(hab);
  }
}

/**
 * "• Amedrontar (Padrão, 7 PM) Animais e humanoides..."
 */
function _parseMagiaBullet(block) {
  const t = block.replace(/^•\s*/, "").trim();
  const m = t.match(/^([^(]+?)\s*\(([^)]+)\)\s*(.+)$/);
  if (!m) return null;
  const nome = m[1].trim().replace(/\*$/, "");
  const meta = m[2].trim();
  const desc = m[3].trim().replace(/\.$/, "");
  const custoPM = (meta.match(/(\d+)\s*PM/i) || [])[1] || "";
  const acao = meta.replace(/,\s*\d+\s*PM.*$/i, "").trim();
  return {
    nome,
    acao,
    custoPM: parseInt(custoPM) || 0,
    descricao: desc + ".",
  };
}

/**
 * "Mordida +7 (1d4+3 mais doença)"
 * "duas garras +12 (1d6+6)"
 * "Mordida +18 (1d10+12) e duas garras +18 (1d8+12)"
 * "Machado de guerra +14 (1d12+16, x3) ou chifres +14 (2d6+10 impacto)"
 */
function _parseAttackBlock(block, out, distancia) {
  // Remove ponto final
  let b = block.replace(/\.\s*$/, "").trim();

  // Divide por " e " e " ou " — mas só quando NÃO estiver dentro de parênteses
  const parts = _splitOutsideParens(b, /\s+(?:e|ou)\s+/);
  for (const part of parts) {
    const atk = _parseSingleAttack(part);
    if (atk) {
      if (distancia) atk.alcance = "curto";
      out.ataques.push(atk);
    }
  }
}

/**
 * "duas garras +12 (1d6+6)" → { nome: "Garra", numAtaques: 2, bonusAtaque: 12, dano: "1d6+6" }
 * "Mordida +7 (1d4+3 mais doença)"
 * "Machado de guerra +14 (1d12+16, x3)"
 * "Adaga +22 (1d4, 19, mais 1d8 trevas)"  ← 19 é a faixa de crítico
 */
function _parseSingleAttack(text) {
  const t = text.trim();
  // Regex principal: nome +bonus (conteúdo entre parens)
  const m = t.match(/^(.+?)\s+([+-]?\d+)\s*\(([^)]+)\)/);
  if (!m) return null;

  let nome = m[1].trim();
  const bonusAtaque = parseInt(m[2]);
  const inside = m[3].trim();

  // Extrai número de ataques de prefixos "duas", "três", "quatro", "N"
  let numAtaques = 1;
  const prefixos = { "duas": 2, "dois": 2, "duas ": 2, "três": 3, "tres": 3, "quatro": 4, "cinco": 5 };
  const preMatch = nome.toLowerCase().match(/^(duas?|dois|três|tres|quatro|cinco|seis)\s+(.+)$/);
  if (preMatch) {
    numAtaques = prefixos[preMatch[1].toLowerCase()] || 1;
    nome = preMatch[2].trim();
  }
  // Ou prefixo numérico "2 garras"
  const numMatch = nome.match(/^(\d+)\s+(.+)$/);
  if (numMatch) {
    numAtaques = parseInt(numMatch[1]);
    nome = numMatch[2].trim();
  }

  // Dentro dos parênteses:
  //  - Primeira expressão de dado (XdY+Z) é o dano principal
  //  - ", 19" ou ", 19/x2" é crítico alternativo
  //  - ", x3" é multiplicador alternativo
  //  - "mais ..." é efeito extra
  //  - Palavras como "impacto", "corte", "perfuração" são tipo de dano

  const parts = inside.split(",").map(p => p.trim());
  let dano = "1d4";
  let critico = "20/x2";
  let tipoDano = "";
  const efeitos = [];

  for (const p of parts) {
    // Dano principal — primeiro pedaço com XdY
    if (/^\d*d\d+/i.test(p) && dano === "1d4") {
      // Pode ter "1d6+6 impacto" — separar tipoDano
      const dm = p.match(/^(\d*d\d+(?:[+-]\d+)?)(?:\s+(corte|impacto|perfuração|perfuracao|fogo|frio|ácido|acido|eletricidade|trevas|luz|essência|essencia|sônico|sonico))?/i);
      if (dm) {
        dano = dm[1];
        if (dm[2]) tipoDano = dm[2].toLowerCase();
      } else {
        dano = p;
      }
      continue;
    }
    // Crítico: "x3", "x4", "19", "19/x3"
    if (/^x\d+$/i.test(p)) {
      critico = `20/${p.toLowerCase()}`;
      continue;
    }
    if (/^\d+$/.test(p) && parseInt(p) >= 17 && parseInt(p) <= 20) {
      // é uma faixa de crítico
      critico = `${p}/x2`;
      continue;
    }
    if (/^\d+\/x\d+$/i.test(p)) {
      critico = p.toLowerCase();
      continue;
    }
    // "mais veneno", "mais doença", "mais 1d6 fogo"
    if (/^mais\s+/i.test(p)) {
      efeitos.push(p.replace(/^mais\s+/i, "").trim());
      continue;
    }
    // Tipo de dano isolado
    if (/^(corte|impacto|perfuração|perfuracao|fogo|frio|ácido|acido|eletricidade|trevas|luz|essência|essencia|sônico|sonico)/i.test(p)) {
      tipoDano = p.toLowerCase();
      continue;
    }
    // Caso tenha "(1d4+3 mais veneno)" — já foi processado no split, mas pode haver fallback
    const pm = p.match(/^mais\s+(.+)/i);
    if (pm) efeitos.push(pm[1]);
  }

  // Fallback para casos onde "mais X" não foi separado por vírgula
  if (!efeitos.length) {
    const maisMatch = inside.match(/\bmais\s+([^,)]+)/i);
    if (maisMatch) efeitos.push(maisMatch[1].trim());
  }

  return {
    nome: _titleCaseFirst(nome),
    numAtaques,
    bonusAtaque,
    dano,
    critico,
    tipoDano,
    efeitos: efeitos.join("; "),
  };
}

/**
 * Extrai "Nome (Ação, N PM) descrição" ou "Nome descrição"
 */
function _parseAbilityBlock(block) {
  if (!block || block.length < 10) return null;

  // Tenta casar: "Nome (acao, N PM) desc" ou "Nome (acao) desc"
  const m = block.match(/^([\w\sáéíóúâêîôûàçãõÁÉÍÓÚÂÊÎÔÛÀÇÃÕ\-]+?)\s*\(([^)]+)\)\s*(.+)$/s);
  if (m) {
    const meta = m[2].trim();
    const custoPM = (meta.match(/(\d+)\s*PM/i) || [])[1] || "";
    const acao = meta.replace(/,\s*\d+\s*PM.*$/i, "").trim();
    return {
      nome: _titleCaseFirst(m[1].trim()),
      acao,
      custoPM: parseInt(custoPM) || 0,
      descricao: m[3].trim().replace(/\.$/, "") + ".",
    };
  }

  // Passiva — "Nome descricao." Precisa extrair o nome com limite.
  // Um nome passivo tem até 3 palavras; para onde encontrar uma stop-word narrativa.
  return _extractPassiveAbility(block);
}

/**
 * Stop-words de narrativa — palavras que iniciam o corpo de uma descrição
 * e portanto marcam o fim do nome da habilidade.
 */
const NARRATIVE_STOPS = new Set([
  "Uma", "Um", "Os", "As", "A", "O",
  "Se", "Quando", "Caso", "Assim", "Sempre", "Toda", "Todo", "Todas", "Todos",
  "Por", "Em", "Para", "Nos", "Nas", "No", "Na", "Com", "Sem", "Ao", "Aos",
  "Esse", "Este", "Essa", "Esta", "Isso", "Isto", "Esses", "Estes", "Essas", "Estas",
  "Ele", "Ela", "Eles", "Elas",
  "Depois", "Antes", "Enquanto", "Durante", "Após",
  "Qualquer", "Cada", "Alguns", "Algumas", "Muitos", "Muitas",
  "Criaturas", "Criatura", "Inimigos", "Inimigo", "Alvos", "Alvo",
  "Quem", "Qual", "Quais",
]);

/**
 * Conectivas válidas no meio de um nome (ex: "Sensibilidade a Luz").
 */
const NAME_CONNECTIVES = new Set(["a", "à", "ao", "aos", "de", "da", "do", "das", "dos", "com", "em", "na", "no"]);

function _extractPassiveAbility(block) {
  const words = block.split(/\s+/);
  if (words.length < 2) return null;

  // Primeira palavra sempre faz parte do nome (já confirmada capitalizada antes)
  const nameParts = [words[0]];
  let i = 1;
  while (i < words.length && nameParts.length < 5) {
    const w = words[i];
    const cleaned = w.replace(/[.,;:!?]$/, "");
    // Pontuação? fim do nome
    if (/[.,;:!?]$/.test(w)) break;
    // Stop-word narrativa? fim do nome
    if (NARRATIVE_STOPS.has(cleaned)) break;
    // Conectiva minúscula + próxima palavra capitalizada → continua ("Sensibilidade a Luz")
    if (NAME_CONNECTIVES.has(cleaned.toLowerCase()) && /^[A-ZÁÉÍÓÚÂÊÎÔÛÀÇÃÕ]/.test(words[i + 1] || "")) {
      nameParts.push(cleaned, words[i + 1]);
      i += 2;
      continue;
    }
    // Outra palavra capitalizada sem conectiva → continua APENAS se for a 2ª palavra
    // (ex: "Ataque Furtivo", "Cauda Giratória", "Aura de Medo"), mas limitamos a 3 palavras totais
    if (/^[A-ZÁÉÍÓÚÂÊÎÔÛÀÇÃÕ]/.test(cleaned) && nameParts.length < 3) {
      nameParts.push(cleaned);
      i++;
      continue;
    }
    // Qualquer outra coisa (lowercase não-conectiva) → fim do nome
    break;
  }

  const nome = nameParts.join(" ");
  const descricao = words.slice(i).join(" ").trim();
  if (!descricao || descricao.length < 10) return null;

  return {
    nome: _titleCaseFirst(nome),
    acao: "Passiva",
    custoPM: 0,
    descricao: descricao.replace(/\.$/, "") + ".",
  };
}

/**
 * "Perícias Furtividade +9."
 * "Perícias Intimidação +4, Sobrevivência +5 (+7 em subterrâneos)."
 * "Equipamento Machado de guerra, couro batido. Tesouro Padrão."
 */
function _parseExtraLine(line, out) {
  // Perícias (pode vir em bloco só)
  const pm = line.match(/^(?:Perícias|Pericias)\s+(.+)$/i);
  if (pm) {
    // Separar em pares "Nome +N"
    const skills = pm[1].replace(/\.$/, "").split(/,\s*/);
    for (const sk of skills) {
      // Pega "Furtividade +9" ignorando parênteses secundários
      const m = sk.trim().match(/^([\wáéíóúâêîôûàçãõÁÉÍÓÚÂÊÎÔÛÀÇÃÕ\-\s]+?)\s+([+-]\d+)/);
      if (m) {
        const key = _periciaKey(m[1]);
        if (key) out.pericias[key] = parseInt(m[2]);
        else out.warnings.push(`Perícia não reconhecida: ${m[1]}`);
      }
    }
    return;
  }

  // Equipamento + Tesouro podem aparecer na mesma linha
  const eq = line.match(/^Equipamento\s+(.+?)(?:\s+Tesouro\s+(.+))?$/i);
  if (eq) {
    out.equipamento = eq[1].trim().replace(/\.$/, "");
    if (eq[2]) out.tesouro = eq[2].trim().replace(/\.$/, "");
    return;
  }
  const te = line.match(/^Tesouro\s+(.+)$/i);
  if (te) {
    out.tesouro = te[1].trim().replace(/\.$/, "");
  }
}

// ========================================================
// Utilidades
// ========================================================

function _titleCase(s) {
  return String(s || "").split(/\s+/).map(w => {
    if (!w) return w;
    if (/^(de|da|do|das|dos|e|a|o|em)$/i.test(w)) return w.toLowerCase();
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }).join(" ");
}

function _titleCaseFirst(s) {
  const v = String(s || "").trim();
  if (!v) return v;
  return v.charAt(0).toUpperCase() + v.slice(1);
}

function _splitOutsideParens(str, regex) {
  // Divide `str` pelo regex, mas ignora matches dentro de parênteses
  const parts = [];
  let depth = 0, last = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === "(") depth++;
    else if (c === ")") depth--;
    if (depth > 0) continue;
    // Testa regex no trecho restante
    const rest = str.substring(i);
    const m = rest.match(new RegExp("^" + regex.source));
    if (m) {
      parts.push(str.substring(last, i).trim());
      i += m[0].length - 1;
      last = i + 1;
    }
  }
  parts.push(str.substring(last).trim());
  return parts.filter(p => p.length > 0);
}

function _periciaKey(name) {
  const map = {
    "acrobacia": "acrobacia", "adestramento": "adestramento", "atletismo": "atletismo",
    "atuação": "atuacao", "atuacao": "atuacao",
    "cavalgar": "cavalgar", "conhecimento": "conhecimento", "cura": "cura",
    "diplomacia": "diplomacia", "enganação": "enganacao", "enganacao": "enganacao",
    "fortitude": "fortitude", "furtividade": "furtividade", "guerra": "guerra",
    "iniciativa": "iniciativa", "intimidação": "intimidacao", "intimidacao": "intimidacao",
    "intuição": "intuicao", "intuicao": "intuicao",
    "investigação": "investigacao", "investigacao": "investigacao",
    "jogatina": "jogatina", "ladinagem": "ladinagem", "luta": "luta",
    "misticismo": "misticismo", "nobreza": "nobreza", "ofício": "oficio", "oficio": "oficio",
    "percepção": "percepcao", "percepcao": "percepcao",
    "pilotagem": "pilotagem", "pontaria": "pontaria", "reflexos": "reflexos",
    "religião": "religiao", "religiao": "religiao",
    "sobrevivência": "sobrevivencia", "sobrevivencia": "sobrevivencia",
    "vontade": "vontade",
  };
  const norm = String(name || "").toLowerCase().trim();
  return map[norm] || null;
}
