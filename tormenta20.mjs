// ========================================================
// Tormenta 20 - Sistema para Foundry VTT
// ========================================================

import { T20Actor } from "./module/actor/actor-document.mjs";
import { T20ActorSheet } from "./module/actor/actor-sheet.mjs";
import { T20NpcSheet } from "./module/actor/npc-sheet.mjs";
import { T20ItemSheet } from "./module/item/item-sheet.mjs";
import { parseStatblock } from "./module/statblock-parser.mjs";
import { importT20CharacterPdf, createActorFromPdf } from "./module/pdf-importer.mjs";

/* ---------------------------------------- */
/*  Handlebars Helpers                      */
/* ---------------------------------------- */
function registerHandlebarsHelpers() {

  Handlebars.registerHelper("upper", (str) =>
    typeof str === "string" ? str.toUpperCase() : str
  );

  Handlebars.registerHelper("capitalize", (str) => {
    if (typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  Handlebars.registerHelper("math", function (...args) {
    args.pop();
    let result = parseFloat(args[0]) || 0;
    for (let i = 1; i < args.length; i += 2) {
      const op = args[i];
      const val = parseFloat(args[i + 1]) || 0;
      switch (op) {
        case "+": result += val; break;
        case "-": result -= val; break;
        case "*": result *= val; break;
        case "/": result = val !== 0 ? result / val : 0; break;
      }
    }
    return result;
  });

  Handlebars.registerHelper("gte", (a, b) => Number(a) >= Number(b));
  Handlebars.registerHelper("gt", (a, b) => Number(a) > Number(b));
  Handlebars.registerHelper("eq", (a, b) => a === b);
  Handlebars.registerHelper("ne", (a, b) => a !== b);
  Handlebars.registerHelper("or", (a, b) => a || b);
  Handlebars.registerHelper("and", (a, b) => a && b);

  // Renderiza atributo `checked` para checkboxes se o valor for truthy
  Handlebars.registerHelper("checked", (v) => v ? "checked" : "");

  // Sinal do modificador: +0, +2, -1
  Handlebars.registerHelper("signedNum", (val) => {
    const n = Number(val) || 0;
    return n >= 0 ? `+${n}` : `${n}`;
  });

  console.log("T20 | Handlebars helpers registrados.");
}

/* ---------------------------------------- */
/*  Init Hook                               */
/* ---------------------------------------- */
Hooks.once("init", function () {
  console.log("T20 | Inicializando sistema Tormenta 20...");

  registerHandlebarsHelpers();

  // ── Registrar classe Actor customizada ──
  CONFIG.Actor.documentClass = T20Actor;

  game.tormenta20 = {
    T20Actor, T20ActorSheet, T20NpcSheet, T20ItemSheet,
    parseStatblock,
    importT20CharacterPdf,
    createActorFromPdf,
    /**
     * API: importa uma ficha de PDF T20 (formulário AcroForm Jambo)
     * para o ator passado. Ex. para macros:
     *   game.tormenta20.importPdfForSelected();
     */
    async importPdfForSelected() {
      const actor = game.user.character
        ?? canvas.tokens?.controlled?.[0]?.actor
        ?? game.actors.get(ui.activeWindow?.actor?.id);
      if (!actor) {
        ui.notifications.error("Selecione um token ou abra uma ficha antes.");
        return;
      }
      return importT20CharacterPdf(actor);
    },
    /**
     * API: cria um novo Actor NPC a partir de um statblock T20 completo.
     * Ideal para uso em macros. Exemplo:
     *   const a = await game.tormenta20.createNpcFromStatblock(`...texto...`);
     */
    async createNpcFromStatblock(statblockText, opts = {}) {
      const parsed = parseStatblock(statblockText);
      const actor = await Actor.create({
        name: parsed.name,
        type: "npc",
        img: "icons/svg/mystery-man.svg",
      });
      if (!actor) { ui.notifications.error("Falha ao criar Actor."); return null; }
      // Abrir a ficha e aplicar
      const sheet = actor.sheet;
      sheet.render(true);
      // Usa o applicador da sheet (que conhece os detalhes do schema)
      // Como a sheet pode não estar renderizada ainda, chama diretamente o método
      await sheet._applyParsedStatblock(parsed, { overwrite: true, linkMagias: opts.linkMagias ?? true });
      return actor;
    },
  };

  // ── Actor Sheets ──
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("tormenta20", T20ActorSheet, {
    types: ["personagem"],
    makeDefault: true,
    label: "T20.SheetPersonagem",
  });
  Actors.registerSheet("tormenta20", T20NpcSheet, {
    types: ["npc"],
    makeDefault: true,
    label: "T20.SheetNpc",
  });

  // ── Item Sheets ──
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("tormenta20", T20ItemSheet, {
    makeDefault: true,
    label: "T20.SheetItem",
  });

  preloadHandlebarsTemplates();
  console.log("T20 | Sistema inicializado!");
});

async function preloadHandlebarsTemplates() {
  return loadTemplates([
    "systems/tormenta20/templates/actor/actor-sheet.hbs",
    "systems/tormenta20/templates/actor/npc-sheet.hbs",
    "systems/tormenta20/templates/item/item-sheet.hbs",
  ]);
}

Hooks.once("ready", () => {
  console.log("T20 | Pronto para jogar!");
  // Marca o <body> pra que as regras de CSS com escopo no sistema funcionem
  document.body.classList.add("system-tormenta20");
  // Helper: detecta ausência de cena ativa pra aplicar fundo Firelink
  const board = document.getElementById("board");
  const refreshNoScene = () => {
    const hasScene = !!document.querySelector("canvas.scene, #board canvas[data-layer]");
    if (board) board.classList.toggle("no-scene", !hasScene);
    document.body.classList.toggle("no-scene", !hasScene);
  };
  refreshNoScene();
  Hooks.on("canvasReady", refreshNoScene);
  Hooks.on("canvasInit", refreshNoScene);

  // ───────────────────────────────────────────────────────────────
  // Compatibilidade com módulos externos
  // ───────────────────────────────────────────────────────────────

  // 1. Dice So Nice — já funciona automaticamente via Roll API padrão.
  //    Só reportamos presença no console pra debug.
  const dsn = game.modules.get("dice-so-nice");
  if (dsn?.active) console.log("T20 | Dice So Nice detectado — rolagens 3D ativas.");

  // 2. Dice Tray (dice-calculator) — só precisa que o chat-form não esteja
  //    escondido. CSS já cuida disso.
  const diceTray = game.modules.get("dice-calculator");
  if (diceTray?.active) console.log("T20 | Dice Tray detectado.");

  // 3. DFreds Effects Panel — Active Effects funcionam pela base do Foundry.
  //    Só alertamos se Active Effects estiverem desabilitados.
  const dfreds = game.modules.get("dfreds-effects-panel");
  if (dfreds?.active) {
    console.log("T20 | DFreds Effects Panel detectado — Active Effects habilitados.");
  }

  // 4. Token Action HUD Tormenta20 — esse módulo foi feito pro sistema T20
  //    oficial, NÃO pra este sistema custom. Se o usuário tentar usar,
  //    os paths de dados podem não bater. Alerta no console.
  const tahT20 = game.modules.get("token-action-hud-tormenta20");
  if (tahT20?.active) {
    console.warn("T20 | Token Action HUD Tormenta20 ativo — este módulo pode não ser 100% compatível com este sistema custom (foi feito pro sistema T20 oficial). Se ações não aparecerem no HUD, desabilite este módulo específico.");
  }

  // 5. libWrapper / socketlib — wrappers genéricos, sem integração especial.
  // 6. Monk's Little Details / Z Scatter / etc. — funcionam por hooks padrão.

  console.log("T20 | Compatibilidade de módulos verificada.");
});

/* ---------------------------------------- */
/*  Actor Directory — Botão "Importar PDF"  */
/* ---------------------------------------- */
/**
 * Injeta um botão "Importar Ficha PDF" logo abaixo do "Create Actor" no
 * painel lateral de atores. Cria um ator novo e roda o importador em cima.
 */
Hooks.on("renderActorDirectory", (app, html) => {
  // jQuery ou HTMLElement? Normaliza.
  const root = html[0] ?? html;
  if (!root || root.querySelector(".t20-pdf-import-btn")) return;

  // Botão só pra GM + usuários com permissão de criar atores
  if (!game.user.can("ACTOR_CREATE")) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "t20-pdf-import-btn";
  btn.innerHTML = `<i class="fas fa-file-pdf"></i> Importar Ficha PDF`;
  btn.title = "Cria um novo ator a partir de uma ficha PDF preenchida (Jambo)";
  btn.addEventListener("click", async (ev) => {
    ev.preventDefault();
    await createActorFromPdf();
  });

  // Tenta inserir logo antes da lista de atores; fallback: no topo
  const header = root.querySelector(".directory-header") || root.querySelector("header");
  if (header) {
    header.appendChild(btn);
  } else {
    root.prepend(btn);
  }
});

/* ---------------------------------------- */
/*  Chat Message — Botões interativos       */
/*  "Rolar Dano" (magias) e "Ativar" (eng.) */
/* ---------------------------------------- */
Hooks.on("renderChatMessage", (message, html) => {

  // ── Botão Rolar Dano de Magia ──
  html.find(".t20-spell-dmg-btn").click(async (ev) => {
    ev.preventDefault();
    const btn = ev.currentTarget;
    const danoFormula = btn.dataset.dano;
    const danoExtra = btn.dataset.danoExtra || "";
    const tipoDano = btn.dataset.tipoDano || "";
    const spellName = btn.dataset.spell || "Magia";
    const actorId = btn.dataset.actorId;
    const bonusDanoGlobal = parseInt(btn.dataset.bonusDano) || 0;

    if (!danoFormula) {
      ui.notifications.warn("Esta magia não possui fórmula de dano definida.");
      return;
    }

    // Monta fórmula: base + aprimoramentos + bônus global
    let formula = danoFormula;
    if (danoExtra) formula += ` + ${danoExtra}`;
    if (bonusDanoGlobal) formula += ` + ${bonusDanoGlobal}`;

    const roll = new Roll(formula);
    await roll.evaluate();

    let c = `<div class="t20-combat-card">`;
    c += `<div class="t20cc-header">🔥 Dano — ${spellName}</div>`;
    c += `<div class="t20cc-divider"></div>`;
    c += `<div class="t20cc-row">`;
    c += `<span class="t20cc-label">Dano</span>`;
    c += `<span class="t20cc-dmg">${roll.total}</span>`;
    c += `<span class="t20cc-dtype">${tipoDano}</span>`;
    c += `</div>`;
    c += `<div class="t20cc-formula">${formula}</div>`;
    if (danoExtra) {
      c += `<div class="t20cc-detail" style="font-size:11px;color:#c7a16b">↳ Inclui +${danoExtra} de aprimoramentos</div>`;
    }
    c += `</div>`;

    const speaker = actorId
      ? ChatMessage.getSpeaker({ actor: game.actors.get(actorId) })
      : ChatMessage.getSpeaker();
    ChatMessage.create({ speaker, content: c });
  });

  // ── Botão Ativar Engenhoca (Invenção) ──
  html.find(".t20-invencao-ativar-btn").click(async (ev) => {
    ev.preventDefault();
    const btn = ev.currentTarget;
    const actorId = btn.dataset.actorId;
    const itemId = btn.dataset.itemId;
    const cdBase = parseInt(btn.dataset.cd) || 15;

    const actor = game.actors.get(actorId);
    if (!actor) return;
    const item = actor.items.get(itemId);
    if (!item) return;

    const oficioTotal = actor.system.pericias.oficio?.total ?? 0;
    const ativacoes = item.system.ativacoesHoje || 0;
    const cdFinal = cdBase + (ativacoes * 5);

    const roll = new Roll("1d20 + @oficio", { oficio: oficioTotal });
    await roll.evaluate();
    const d20 = roll.dice[0]?.results[0]?.result ?? 0;
    const sucesso = roll.total >= cdFinal;

    await item.update({ "system.ativacoesHoje": ativacoes + 1 });
    if (!sucesso) await item.update({ "system.status": "enguicada" });

    let c = `<div class="t20-combat-card">`;
    c += `<div class="t20cc-header">⚙ ${item.name}</div>`;
    c += `<div class="t20cc-detail"><b>Magia Simulada:</b> ${item.system.magiaSim || "—"}</div>`;
    c += `<div class="t20cc-detail"><b>CD de Ativação:</b> ${cdFinal}${ativacoes > 0 ? ` (base ${cdBase} + ${ativacoes * 5} ativações)` : ""}</div>`;
    c += `<div class="t20cc-divider"></div>`;
    c += `<div class="t20cc-row"><span class="t20cc-label">Ofício</span><span class="t20cc-roll">${d20}</span><span class="t20cc-total">Total: <b>${roll.total}</b></span></div>`;
    if (sucesso) {
      c += `<div class="t20cc-crit" style="background:#1a4a1a;color:#4caf50">ATIVAÇÃO BEM-SUCEDIDA!</div>`;
    } else {
      c += `<div class="t20cc-fumble">ENGENHOCA ENGUIÇOU!</div>`;
      c += `<div class="t20cc-desc" style="color:#ff9800">A engenhoca precisa de 1 hora de conserto.</div>`;
    }
    if (item.system.efeito) c += `<div class="t20cc-desc">${item.system.efeito}</div>`;
    c += `</div>`;

    ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: c });
  });
});
