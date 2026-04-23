// ========================================================
// T20 Actor Sheet — v3
// ========================================================

import { importT20CharacterPdf } from "../pdf-importer.mjs";
import { rollT20Initiative } from "../combat.mjs";

export class T20ActorSheet extends ActorSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["tormenta20", "sheet", "actor"],
      template: "systems/tormenta20/templates/actor/actor-sheet.hbs",
      width: 750, height: 820,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "atributos" }],
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }],
    });
  }

  static PACK_MAP = {
    arma: "tormenta20.armas", armadura: "tormenta20.armaduras",
    magia: "tormenta20.magias", poder: "tormenta20.poderes",
    equipamento: "tormenta20.itens",
    classe: "tormenta20.classes", raca: "tormenta20.racas",
    origem: "tormenta20.origens", distincao: "tormenta20.distincoes",
  };
  static TYPE_LABELS = {
    arma: "Arma", armadura: "Armadura", magia: "Magia",
    poder: "Poder", equipamento: "Equipamento", habilidade: "Habilidade",
    invencao: "Invenção",
  };

  getData() {
    const context = super.getData();
    const a = this.actor;
    context.actor = a;
    context.system = a.system;
    context.flags = a.flags;
    context.armas = a.items.filter(i => i.type === "arma");
    context.poderes = a.items.filter(i => i.type === "poder");
    context.magias = a.items.filter(i => i.type === "magia");
    context.magias1 = a.items.filter(i => i.type === "magia" && i.system.circulo === 1);
    context.magias2 = a.items.filter(i => i.type === "magia" && i.system.circulo === 2);
    context.magias3 = a.items.filter(i => i.type === "magia" && i.system.circulo === 3);
    context.magias4 = a.items.filter(i => i.type === "magia" && i.system.circulo === 4);
    context.magias5 = a.items.filter(i => i.type === "magia" && i.system.circulo === 5);
    context.equipamentos = a.items.filter(i => i.type === "equipamento");
    context.armaduras = a.items.filter(i => i.type === "armadura");
    context.habilidades = a.items.filter(i => i.type === "habilidade");
    context.invencoes = a.items.filter(i => i.type === "invencao");
    context.isInventor = (a.system.biografia?.classe || "").toLowerCase() === "inventor";
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;
    html.find(".roll-atributo").click(this._onRollAtributo.bind(this));
    html.find(".roll-pericia").click(this._onRollPericia.bind(this));
    html.find(".roll-iniciativa").click(this._onRollIniciativa.bind(this));
    html.find(".item-create").click(this._onItemCreate.bind(this));
    html.find(".hdr-pick").click(this._onHeaderPick.bind(this));
    html.find(".roll-arma").click(this._onRollArma.bind(this));
    html.find(".item-equip").click(this._onToggleEquip.bind(this));
    html.find(".item-use").click(this._onItemUse.bind(this));
    html.find(".sb-res-add").click(this._onResistanceAdd.bind(this));
    html.find(".res-remove").click(this._onResistanceRemove.bind(this));
    html.find(".invencao-reset").click(this._onInvencaoReset.bind(this));
    html.find(".invencao-repair").click(this._onInvencaoRepair.bind(this));
    html.find(".invencao-activate").click(this._onInvencaoActivate.bind(this));
    html.find(".invencao-details").click(this._onInvencaoDetails.bind(this));
    html.find(".invencao-pv").change(this._onInvencaoPvChange.bind(this));
    html.find(".item-edit").click(ev => {
      const item = this.actor.items.get($(ev.currentTarget).closest(".item").data("itemId"));
      if (item) item.sheet.render(true);
    });
    html.find(".item-delete").click(ev => {
      const li = $(ev.currentTarget).closest(".item");
      const item = this.actor.items.get(li.data("itemId"));
      if (item) { item.delete(); li.slideUp(200, () => this.render(false)); }
    });

    // Botão: Importar ficha de PDF (formulário do Jambo)
    html.find(".hdr-pdf-import").click(async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      await importT20CharacterPdf(this.actor);
      // Re-renderiza a ficha pra mostrar dados atualizados
      this.render(false);
    });
  }

  // ================================================================
  //  ATAQUE + DANO (única rolagem, crít automático)
  //  Suporta flags de Módulo 2: ataqueNatural, numAtaques, ignoraAtributoDano
  // ================================================================
  async _onRollArma(event) {
    event.preventDefault();
    const item = this.actor.items.get($(event.currentTarget).closest(".item").data("itemId"));
    if (!item) return;
    const sys = item.system;
    const atr = this.actor.system.atributos;

    const modoStatblock = !!sys.ataqueNatural;
    const isMelee = !sys.alcance || sys.alcance === "";
    const periKey = isMelee ? "luta" : "pontaria";
    const periLabel = isMelee ? "Luta" : "Pontaria";
    const totalPeri = this.actor.system.pericias[periKey]?.total ?? 0;

    // ── Bônus de Melhorias ──
    let mAtk = 0, mDmg = 0, mCritRange = 0, mCritMult = 0;
    const mNotes = [];
    if (sys.mCerteira)    { mAtk += 1; mNotes.push("Certeira +1atk"); }
    if (sys.mPungente)    { mAtk += 2; mNotes.push("Pungente +2atk"); }
    if (sys.mCruel)       { mDmg += 1; mNotes.push("Cruel +1dano"); }
    if (sys.mAtroz)       { mDmg += 2; mNotes.push("Atroz +2dano"); }
    if (sys.mMacica)      { mCritMult += 1; mNotes.push("Maciça +1×crit"); }
    if (sys.mPrecisa)     { mCritRange += 1; mNotes.push("Precisa +1 ameaça"); }

    const bAtk = (sys.bonusAtaque || 0) + mAtk;
    const totalAtk = modoStatblock ? bAtk : totalPeri + bAtk;

    const critStr = sys.critico || "20/x2";
    const cm = critStr.match(/(\d+)\/?x?(\d+)?/);
    const critRange = (cm ? parseInt(cm[1]) : 20) - mCritRange;
    const critMult = (cm && cm[2] ? parseInt(cm[2]) : 2) + mCritMult;

    const modFor = atr.for?.total ?? 0;
    const bDmg = (sys.bonusDano || 0) + mDmg;
    const danoBase = (sys.dano || "1d4").split("/")[0].trim();
    const somaAtributo = (modoStatblock || sys.ignoraAtributoDano) ? 0 : modFor;

    const numAtk = Math.max(1, parseInt(sys.numAtaques) || 1);
    const penalPorAtk = parseInt(sys.penalidadeMultiplos) || 0;

    let c = `<div class="t20-combat-card">`;
    c += `<div class="t20cc-header">${modoStatblock ? "🐾" : "⚔"} ${item.name}${numAtk > 1 ? ` <span style="opacity:0.7;font-size:0.85em">×${numAtk}</span>` : ""}</div>`;

    for (let i = 0; i < numAtk; i++) {
      const penal = penalPorAtk * i;
      const atkFinal = totalAtk + penal;
      const atkRoll = new Roll("1d20 + @atk", { atk: atkFinal });
      await atkRoll.evaluate();
      const d20 = atkRoll.dice[0]?.results[0]?.result ?? 0;
      const isCrit = d20 >= critRange && d20 !== 1;
      const isFumble = d20 === 1;

      const danoRoll = new Roll(`${danoBase} + @mod + @bonus`, { mod: somaAtributo, bonus: bDmg });
      await danoRoll.evaluate();
      const danoCrit = isCrit ? danoRoll.total * critMult : 0;

      if (numAtk > 1) {
        c += `<div class="t20cc-multi-hdr">Ataque ${i + 1}${penal ? ` (${penal > 0 ? "+" : ""}${penal})` : ""}</div>`;
      }
      const periBadge = modoStatblock ? "Ataque" : periLabel;
      c += `<div class="t20cc-row"><span class="t20cc-label">${periBadge}</span><span class="t20cc-roll">${d20}</span><span class="t20cc-total">Total: <b>${atkRoll.total}</b></span></div>`;
      if (isCrit) c += `<div class="t20cc-crit">CRÍTICO! (×${critMult})</div>`;
      if (isFumble) c += `<div class="t20cc-fumble">FALHA CRÍTICA</div>`;
      if (i === 0 && numAtk === 1) c += `<div class="t20cc-divider"></div>`;
      c += `<div class="t20cc-row"><span class="t20cc-label">Dano</span><span class="t20cc-dmg">${danoRoll.total}</span><span class="t20cc-dtype">${sys.tipo || ""}</span></div>`;
      const partsFormula = [danoBase];
      if (somaAtributo) partsFormula.push(`${somaAtributo} For`);
      if (bDmg) partsFormula.push(`${bDmg} bônus`);
      c += `<div class="t20cc-formula">${partsFormula.join(" + ")}</div>`;
      if (isCrit) c += `<div class="t20cc-row t20cc-critrow"><span class="t20cc-label">Dano Crit</span><span class="t20cc-dmg t20cc-critdmg">${danoCrit}</span></div>`;

      if (i < numAtk - 1) c += `<div class="t20cc-divider t20cc-divider-sub"></div>`;
    }

    if (mNotes.length) c += `<div class="t20cc-formula" style="color:#c7a16b">${mNotes.join(" · ")}</div>`;
    c += `</div>`;

    ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: this.actor }), content: c });
  }

  // ================================================================
  //  EQUIPAR ARMADURA
  // ================================================================
  async _onToggleEquip(event) {
    event.preventDefault(); event.stopPropagation();
    const item = this.actor.items.get($(event.currentTarget).closest(".item").data("itemId"));
    if (item) await item.update({ "system.equipada": !item.system.equipada });
  }

  // ================================================================
  //  RESISTÊNCIAS — Picker com tipos do livro
  // ================================================================
  static RESISTANCE_OPTIONS = [
    { cat: "Resistência Elemental", items: [
      "Resistência a ácido 5","Resistência a ácido 10","Resistência a eletricidade 5","Resistência a eletricidade 10",
      "Resistência a fogo 5","Resistência a fogo 10","Resistência a frio 5","Resistência a frio 10",
      "Resistência a luz 5","Resistência a luz 10","Resistência a trevas 5","Resistência a trevas 10",
      "Resistência a sônico 5","Resistência a essência 5",
    ]},
    { cat: "Redução de Dano", items: [
      "RD 2","RD 5","RD 10","RD 2 (exceto magia)","RD 5 (exceto magia)",
      "RD 2 (exceto adamante)","RD 5 (exceto prata alquímica)",
    ]},
    { cat: "Imunidade", items: [
      "Imune a veneno","Imune a doença","Imune a medo","Imune a encantamento",
      "Imune a fadiga","Imune a sono","Imune a atordoamento","Imune a paralisia",
      "Imune a fogo","Imune a frio","Imune a eletricidade","Imune a ácido",
      "Imune a dano não-letal","Imune a críticos",
    ]},
    { cat: "Sentidos", items: [
      "Visão no escuro","Visão na penumbra","Faro","Percepção às cegas (curto)",
      "Percepção às cegas (médio)","Percepção por vibração",
    ]},
    { cat: "Outros", items: [
      "Cura acelerada 2","Cura acelerada 5","Regeneração 5",
      "Resistência a magia +2","Resistência a magia +5",
      "Voo 9m","Voo 12m","Voo 18m","Natação 9m",
      "Telepatia (curto)","Telepatia (médio)",
    ]},
  ];

  async _onResistanceAdd(event) {
    event.preventDefault();
    const actor = this.actor;
    const current = actor.system.resistenciasList || [];

    let html = `<div class="t20-res-picker">`;
    html += `<div class="rp-search-row"><input type="text" class="rp-search" placeholder="Buscar ou digitar..." autofocus/></div>`;

    for (const cat of T20ActorSheet.RESISTANCE_OPTIONS) {
      html += `<div class="rp-cat">${cat.cat}</div>`;
      for (const item of cat.items) {
        const has = current.includes(item);
        html += `<div class="rp-item ${has ? 'rp-has' : ''}" data-name="${item}"><span>${item}</span>${has ? '<i class="fas fa-check"></i>' : ''}</div>`;
      }
    }
    html += `</div>`;

    const dlg = new Dialog({
      title: "Adicionar Resistência",
      content: html,
      buttons: {},
      render: (jq) => {
        const el = jq[0] || jq;
        // Search filter
        el.querySelector(".rp-search")?.addEventListener("input", (e) => {
          const q = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          el.querySelectorAll(".rp-item").forEach(row => {
            row.style.display = row.dataset.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q) ? "" : "none";
          });
        });
        // Click to add
        el.querySelectorAll(".rp-item:not(.rp-has)").forEach(row => {
          row.addEventListener("click", async () => {
            const name = row.dataset.name;
            const list = [...(actor.system.resistenciasList || []), name];
            await actor.update({ "system.resistenciasList": list });
            ui.notifications.info(`Adicionado: ${name}`);
            dlg.close();
          });
        });
        // Allow custom entry with Enter
        el.querySelector(".rp-search")?.addEventListener("keydown", async (e) => {
          if (e.key === "Enter" && e.target.value.trim()) {
            const name = e.target.value.trim();
            const list = [...(actor.system.resistenciasList || []), name];
            await actor.update({ "system.resistenciasList": list });
            ui.notifications.info(`Adicionado: ${name}`);
            dlg.close();
          }
        });
      },
      close: () => {},
    }, { width: 420, height: 520, resizable: true, classes: ["t20-picker-dialog", "t20-res-dlg"] });
    dlg.render(true);
  }

  async _onResistanceRemove(event) {
    event.preventDefault();
    const idx = parseInt(event.currentTarget.dataset.idx);
    const list = [...(this.actor.system.resistenciasList || [])];
    if (idx >= 0 && idx < list.length) {
      const removed = list.splice(idx, 1);
      await this.actor.update({ "system.resistenciasList": list });
      ui.notifications.info(`Removido: ${removed}`);
    }
  }

  // ================================================================
  //  USAR MAGIA — Dialog com preview, aprimoramentos e ataque
  // ================================================================
  async _onItemUse(event) {
    event.preventDefault();
    const item = this.actor.items.get($(event.currentTarget).closest(".item").data("itemId"));
    if (!item) return;

    if (item.type === "magia") return this._onSpellDialog(item);
    // Poderes — postam direto no chat
    this._postPowerToChat(item);
  }

  _postPowerToChat(item) {
    const sys = item.system;
    let c = `<div class="t20-combat-card"><div class="t20cc-header">${item.name}</div>`;
    if (sys.custoPM) c += `<div class="t20cc-detail"><b>Custo:</b> ${sys.custoPM} PM</div>`;
    if (sys.tipo) c += `<div class="t20cc-detail"><b>Tipo:</b> ${sys.tipo}</div>`;
    if (sys.requisitos) c += `<div class="t20cc-detail"><b>Requisitos:</b> ${sys.requisitos}</div>`;
    if (sys.descricao) {
      const d = sys.descricao.length > 500 ? sys.descricao.substring(0,500)+"..." : sys.descricao;
      c += `<div class="t20cc-desc">${d}</div>`;
    }
    c += `</div>`;
    ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: this.actor }), content: c });
  }

  async _onSpellDialog(item) {
    const sys = item.system;
    const actorSys = this.actor.system;
    const cd = actorSys._cdMagia || 10;
    const atrLabel = actorSys._atributoChaveLabel || "Int";
    const basePM = sys.custoPM || 0;

    // ── Helpers: escape + markdown inline → HTML ──
    const esc = s => String(s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const mdInline = s => esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<i>$1</i>");

    // ── Smart-split da Resistência ──
    // Se o corpo do texto vazou para `resistencia` (importação antiga),
    // separa a cláusula curta do corpo para corrigir visualmente on-the-fly.
    const splitResist = (raw) => {
      const r = String(raw || "").trim();
      if (!r) return { resist: "", body: "" };
      if (r.length < 60) return { resist: r, body: "" };
      const m = r.match(
        /^((?:Fortitude|Reflexos|Vontade)\s+(?:anula|parcial|meia|reduz[^.(]*?)(?:\s*\([^)]*\))?)\s*\.\s+(.+)$/is
      );
      if (m) return { resist: m[1].trim(), body: m[2].trim() };
      return { resist: r, body: "" };
    };

    // ── Parser HÍBRIDO ──
    // Suporta três formatos de descrição:
    //   1. HTML limpo (novo formato gerado pelo importador corrigido):
    //      "<p>corpo</p><p><strong>Aprimoramentos:</strong></p><ul><li>+N PM (qual): texto</li>...</ul>"
    //   2. Markdown legado: corpo em texto + "**Aprimoramentos:**" + linhas "- +N PM: ..."
    //   3. Misturado/corrido (quando texto vazou entre campos)
    //
    // Saída: { bodyHtml: string, aprims: [{pm, qual, text}] }
    const parseDesc = (raw) => {
      const src = String(raw || "");
      const aprimRe = /^\s*\+(\d+)\s*PM\s*(?:\(([^)]+)\))?\s*:\s*(.*)$/i;

      // FORMATO 1: HTML com <li>+N PM...</li>
      if (/<li\b/i.test(src) && /\+\d+\s*PM/.test(src)) {
        const aprims = [];
        // Extrai cada <li> e tenta casar como aprimoramento
        const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
        let lm;
        while ((lm = liRe.exec(src)) !== null) {
          // Limpa tags internas preservando texto
          const plain = lm[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
          const am = plain.match(aprimRe);
          if (am) aprims.push({
            pm: parseInt(am[1]) || 0,
            qual: am[2] ? am[2].trim() : "",
            text: am[3].trim()
          });
        }
        // Corpo = HTML até o primeiro header/lista de aprimoramentos
        let bodyHtml = src;
        bodyHtml = bodyHtml.replace(
          /<p[^>]*>\s*<strong>\s*Aprimoramentos?\s*:?\s*<\/strong>\s*<\/p>\s*<ul[\s\S]*?<\/ul>/gi,
          ""
        );
        // fallback: se ainda sobrou alguma <ul> com aprims, remove também
        bodyHtml = bodyHtml.replace(
          /<ul>(?:\s*<li[^>]*>\s*(?:<strong>\s*)?\+\d+[\s\S]*?<\/li>\s*)+<\/ul>/gi,
          ""
        );
        return { bodyHtml: bodyHtml.trim(), aprims };
      }

      // FORMATO 2/3: texto/markdown — parsing linha-a-linha
      const lines = src.split(/\r?\n/);
      const body = [];
      const aprims = [];
      let inAprims = false;
      const headerRe = /^\s*\*{0,2}\s*Aprimoramentos?\s*:?\s*\*{0,2}\s*$/i;
      const aprimLineRe = /^[-–•]?\s*\+(\d+)\s*PM\s*(?:\(([^)]+)\))?\s*:\s*(.*)$/i;
      for (const ln of lines) {
        const t = ln.trim();
        if (!t) { if (!inAprims) body.push(""); continue; }
        if (headerRe.test(t)) { inAprims = true; continue; }
        const m = t.match(aprimLineRe);
        if (m) {
          inAprims = true;
          aprims.push({
            pm: parseInt(m[1]) || 0,
            qual: m[2] ? m[2].trim() : "",
            text: m[3].trim()
          });
        } else if (!inAprims) {
          body.push(ln);
        } else if (aprims.length) {
          aprims[aprims.length - 1].text += " " + t;
        }
      }
      // Renderiza o corpo em HTML simples (escape + markdown inline + p/br)
      const bodyText = body.join("\n").trim();
      const bodyHtml = bodyText
        ? "<p>" + mdInline(bodyText).replace(/\n\s*\n/g, "</p><p>").replace(/\n/g, "<br>") + "</p>"
        : "";
      return { bodyHtml, aprims };
    };

    const { resist: resClean, body: resBody } = splitResist(sys.resistencia);
    const { bodyHtml: descBodyHtml, aprims }   = parseDesc(sys.descricao);
    // Se resistência tinha corpo vazado, prepend ao corpo principal
    const resBodyHtml = resBody
      ? "<p>" + mdInline(resBody).replace(/\n\s*\n/g, "</p><p>").replace(/\n/g, "<br>") + "</p>"
      : "";
    const descBaseHtml = resBodyHtml + descBodyHtml;
    // Versão plain-text para o chat card (sem HTML)
    const descBasePlain = descBaseHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    // ── A magia possui dano definido? ──
    const hasDano = !!(sys.dano && sys.dano.trim());

    // ── HTML do dialog ──
    let html = `<div class="t20-spell-dialog">`;

    // Info tags
    html += `<div class="tsd-tags">`;
    html += `<span class="tsd-tag tsd-circ">${sys.circulo}° Círculo</span>`;
    html += `<span class="tsd-tag">${sys.tipo || ""}</span>`;
    html += `<span class="tsd-tag">${sys.escola || ""}</span>`;
    html += `<span class="tsd-tag tsd-cd">CD ${cd}</span>`;
    html += `</div>`;

    // Details
    const details = [
      ["Execução", sys.execucao], ["Alcance", sys.alcance], ["Alvo", sys.alvo],
      ["Área", sys.area], ["Duração", sys.duracao], ["Resistência", resClean]
    ].filter(d => d[1]);
    if (details.length) {
      html += `<div class="tsd-details">`;
      for (const [lbl, val] of details) html += `<div class="tsd-det"><b>${lbl}:</b> ${esc(val)}</div>`;
      html += `</div>`;
    }

    // Description (HTML já vem pronto do parser híbrido)
    if (descBaseHtml) {
      html += `<div class="tsd-desc">${descBaseHtml}</div>`;
    }

    // Dano info (se existir)
    if (hasDano) {
      html += `<div class="tsd-dano-info"><b>Dano:</b> <span class="tsd-dano-val">${sys.dano}</span>`;
      if (sys.tipoDano) html += ` <span class="tsd-dano-tipo">(${sys.tipoDano})</span>`;
      html += `</div>`;
    }

    // PM cost
    html += `<div class="tsd-pm-block"><span class="tsd-pm-label">Custo Base:</span><span class="tsd-pm-val">${basePM} PM</span></div>`;

    // Aprimoramentos — com quantidade (permite usar múltiplas vezes)
    // Detecta dado de dano no texto (ex: "1d6", "2d4") para mostrar badge de dano extra
    const damageRe = /(\d+)d(\d+)/i;
    const oneShotRe = /uma vez|não pode.*múltipl|não.*pode.*mais de uma|apenas uma/i;

    if (aprims.length) {
      html += `<div class="tsd-aprim-title">Aprimoramentos <span class="tsd-aprim-hint">(dano: quantidade · outros: marcar)</span></div>`;
      html += `<div class="tsd-aprims">`;
      aprims.forEach((a, i) => {
        const qualTag = a.qual ? `<span class="tsd-aprim-qual">${esc(a.qual)}</span>` : "";
        // Detecta fórmula de dano no texto
        const dmgMatch = a.text.match(damageRe);
        const dmgFormula = dmgMatch ? `${dmgMatch[1]}d${dmgMatch[2]}` : "";
        const hasDmg = !!dmgFormula;
        // Detecta se é de uso único (mesmo tendo dano)
        const isOneShot = oneShotRe.test(a.text);
        const dmgBadge = dmgFormula
          ? `<span class="tsd-aprim-dmg" title="Este aprimoramento adiciona ${dmgFormula} por uso">+${dmgFormula}</span>` : "";
        const oneShotBadge = isOneShot
          ? `<span class="tsd-aprim-oneshot" title="Uso único">1×</span>` : "";

        if (hasDmg && !isOneShot) {
          // ★ Aprimoramento DE DANO escalável → input numérico (quantas vezes aplicar)
          const maxQty = 10;
          html += `<div class="tsd-aprim tsd-aprim-dmg-type">`
            + `<input type="number" class="tsd-aprim-qty" min="0" max="${maxQty}" value="0" step="1" `
            + `data-pm="${a.pm}" data-idx="${i}" data-dmg="${dmgFormula}" `
            + `title="Quantas vezes aplicar (máx ${maxQty})" />`
            + `<span class="tsd-aprim-pm">+${a.pm} PM</span>`
            + qualTag
            + dmgBadge
            + `<span class="tsd-aprim-text">${mdInline(a.text)}</span>`
            + `</div>`;
        } else {
          // ★ Aprimoramento BOOLEAN (sem dano ou uso único) → checkbox
          html += `<label class="tsd-aprim tsd-aprim-bool-type">`
            + `<input type="checkbox" class="tsd-aprim-chk" `
            + `data-pm="${a.pm}" data-idx="${i}" data-dmg="${dmgFormula}" />`
            + `<span class="tsd-aprim-pm">+${a.pm} PM</span>`
            + qualTag
            + dmgBadge
            + oneShotBadge
            + `<span class="tsd-aprim-text">${mdInline(a.text)}</span>`
            + `</label>`;
        }
      });
      html += `</div>`;
    }

    // Total
    html += `<div class="tsd-total"><span>PM Total:</span><span class="tsd-total-val">${basePM}</span></div>`;

    // Attack option
    html += `<div class="tsd-attack-row">
      <label class="tsd-atk-check"><input type="checkbox" class="tsd-atk-toggle" /> Incluir Ataque</label>
      <select class="tsd-atk-skill">
        <option value="misticismo">Misticismo</option>
        <option value="luta">Luta (toque)</option>
        <option value="pontaria">Pontaria (distância)</option>
      </select>
    </div>`;

    html += `</div>`;

    const actor = this.actor;
    const dlg = new Dialog({
      title: `🔮 ${item.name}`,
      content: html,
      buttons: {
        cast: {
          icon: '<i class="fas fa-hat-wizard"></i>',
          label: "Conjurar",
          callback: async (jq) => {
            const el = jq[0] || jq;
            let totalPM = basePM;
            const selectedAprims = [];
            const danoExtraParts = [];

            // ── LÊ APRIMORAMENTOS COM QUANTIDADE (input numérico, com dano) ──
            el.querySelectorAll(".tsd-aprim-qty").forEach(inp => {
              const qty = Math.max(0, parseInt(inp.value) || 0);
              if (qty <= 0) return;
              const pm = parseInt(inp.dataset.pm) || 0;
              const idx = parseInt(inp.dataset.idx);
              const dmg = inp.dataset.dmg || "";
              totalPM += pm * qty;
              if (aprims[idx]) {
                selectedAprims.push({ ...aprims[idx], qty, dmg });
                if (dmg) {
                  const m = dmg.match(/(\d+)d(\d+)/);
                  if (m) {
                    const totalDice = parseInt(m[1]) * qty;
                    danoExtraParts.push(`${totalDice}d${m[2]}`);
                  }
                }
              }
            });

            // ── LÊ APRIMORAMENTOS BOOLEAN (checkbox, sem dano OU uso único) ──
            el.querySelectorAll(".tsd-aprim-chk").forEach(chk => {
              if (!chk.checked) return;
              const pm = parseInt(chk.dataset.pm) || 0;
              const idx = parseInt(chk.dataset.idx);
              const dmg = chk.dataset.dmg || "";
              totalPM += pm;
              if (aprims[idx]) {
                selectedAprims.push({ ...aprims[idx], qty: 1, dmg });
                // Uso único com dano: inclui dano no extra também
                if (dmg) {
                  const m = dmg.match(/(\d+)d(\d+)/);
                  if (m) danoExtraParts.push(`${m[1]}d${m[2]}`);
                }
              }
            });

            const danoExtraFormula = danoExtraParts.join(" + ");

            // ── Deduzir PM ──
            const pmAtual = actor.system.pm.value;
            if (pmAtual < totalPM) {
              ui.notifications.warn(`PM insuficiente! Tem ${pmAtual}, precisa ${totalPM}.`);
              return;
            }
            await actor.update({ "system.pm.value": pmAtual - totalPM });

            // ── Build chat card ──
            let c = `<div class="t20-combat-card"><div class="t20cc-header">🔮 ${item.name}</div>`;
            c += `<div class="t20cc-spell-info">`;
            c += `<span class="t20cc-tag t20cc-circ">${sys.circulo}° Círculo</span>`;
            c += `<span class="t20cc-tag">${sys.tipo||""}</span>`;
            c += `<span class="t20cc-tag">${sys.escola||""}</span></div>`;
            c += `<div class="t20cc-cd">CD ${cd}</div>`;
            c += `<div class="t20cc-formula">${actorSys._cdFormula || ""}</div>`;
            c += `<div class="t20cc-detail"><b>Custo:</b> ${totalPM} PM${totalPM > basePM ? ` (${basePM} + ${totalPM - basePM} aprims)` : ""}</div>`;

            if (selectedAprims.length) {
              c += `<div class="t20cc-detail" style="color:#c7a16b"><b>Aprimoramentos:</b></div>`;
              for (const a of selectedAprims) {
                const q = a.qual ? ` <i style="color:#888">(${a.qual})</i>` : "";
                const vezes = a.qty > 1 ? ` <b style="color:#d72f2f">×${a.qty}</b>` : "";
                const pmTotal = a.pm * a.qty;
                c += `<div class="t20cc-detail" style="font-size:11px;color:#aaa">+${pmTotal} PM${q}${vezes}: ${a.text}</div>`;
              }
            }

            for (const [lbl, val] of details) c += `<div class="t20cc-detail"><b>${lbl}:</b> ${val}</div>`;

            // Attack roll if selected
            const doAtk = el.querySelector(".tsd-atk-toggle")?.checked;
            if (doAtk) {
              const skill = el.querySelector(".tsd-atk-skill")?.value || "misticismo";
              const skillTotal = actor.system.pericias[skill]?.total ?? 0;
              const atkRoll = new Roll("1d20 + @t", { t: skillTotal });
              await atkRoll.evaluate();
              const d20 = atkRoll.dice[0]?.results[0]?.result ?? 0;
              const skillName = { misticismo:"Misticismo", luta:"Luta", pontaria:"Pontaria" }[skill];
              c += `<div class="t20cc-divider"></div>`;
              c += `<div class="t20cc-row"><span class="t20cc-label">${skillName}</span><span class="t20cc-roll">${d20}</span><span class="t20cc-total">Total: <b>${atkRoll.total}</b></span></div>`;
              if (d20 === 20) c += `<div class="t20cc-crit">ACERTO NATURAL!</div>`;
              if (d20 === 1) c += `<div class="t20cc-fumble">FALHA CRÍTICA</div>`;
            }

            // ★ Botão Rolar Dano (se magia tem dano configurado)
            if (hasDano) {
              const bonusDano = actor.system.global?.dano || 0;
              c += `<div class="t20cc-divider"></div>`;
              c += `<div class="t20cc-spell-dmg-section">`;
              const danoDisplay = danoExtraFormula
                ? `${sys.dano} + ${danoExtraFormula}` : sys.dano;
              c += `<div class="t20cc-detail"><b>Dano:</b> ${danoDisplay} ${sys.tipoDano ? `(${sys.tipoDano})` : ""}</div>`;
              if (danoExtraFormula) {
                c += `<div class="t20cc-detail" style="font-size:11px;color:#c7a16b">↳ +${danoExtraFormula} dos aprimoramentos</div>`;
              }
              c += `<button type="button" class="t20-spell-dmg-btn" `
                + `data-dano="${sys.dano}" `
                + `data-dano-extra="${danoExtraFormula}" `
                + `data-tipo-dano="${sys.tipoDano || ""}" `
                + `data-spell="${item.name}" `
                + `data-actor-id="${actor.id}" `
                + `data-bonus-dano="${bonusDano}">`
                + `<i class="fas fa-dice-d6"></i> Rolar Dano</button>`;
              c += `</div>`;
            }

            if (descBasePlain.length > 200) {
              c += `<div class="t20cc-desc">${descBasePlain.substring(0,200)}...</div>`;
            } else if (descBasePlain) {
              c += `<div class="t20cc-desc">${descBasePlain}</div>`;
            }
            c += `</div>`;
            ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: c });
          }
        }
      },
      render: (jq) => {
        const el = jq[0] || jq;
        const damageRe = /(\d+)d(\d+)/;
        // Recalcula PM total e preview de dano extra ao mudar qualquer input/checkbox
        const updateTotal = () => {
          let t = basePM;
          const dmgParts = [];

          // Inputs numéricos (aprims com dano escalável)
          el.querySelectorAll(".tsd-aprim-qty").forEach(inp => {
            const qty = Math.max(0, parseInt(inp.value) || 0);
            const wrap = inp.closest(".tsd-aprim");
            if (qty <= 0) {
              wrap?.classList.remove("tsd-aprim-active");
              return;
            }
            const pm = parseInt(inp.dataset.pm) || 0;
            t += pm * qty;
            const dmg = inp.dataset.dmg || "";
            if (dmg) {
              const m = dmg.match(damageRe);
              if (m) dmgParts.push(`${parseInt(m[1]) * qty}d${m[2]}`);
            }
            wrap?.classList.add("tsd-aprim-active");
          });

          // Checkboxes (aprims boolean - sem dano ou uso único)
          el.querySelectorAll(".tsd-aprim-chk").forEach(chk => {
            const wrap = chk.closest(".tsd-aprim");
            if (!chk.checked) {
              wrap?.classList.remove("tsd-aprim-active");
              return;
            }
            const pm = parseInt(chk.dataset.pm) || 0;
            t += pm;
            const dmg = chk.dataset.dmg || "";
            if (dmg) {
              const m = dmg.match(damageRe);
              if (m) dmgParts.push(`${m[1]}d${m[2]}`);
            }
            wrap?.classList.add("tsd-aprim-active");
          });

          const totalEl = el.querySelector(".tsd-total-val");
          if (totalEl) totalEl.textContent = t;
          const preview = el.querySelector(".tsd-dmg-preview");
          if (preview) preview.textContent = dmgParts.length ? `+${dmgParts.join(" + ")}` : "";
        };

        // Listeners para os dois tipos de input
        el.querySelectorAll(".tsd-aprim-qty").forEach(inp => {
          inp.addEventListener("input", updateTotal);
          inp.addEventListener("change", updateTotal);
        });
        el.querySelectorAll(".tsd-aprim-chk").forEach(chk => {
          chk.addEventListener("change", updateTotal);
        });
      },
      default: "cast",
    }, { width: 520, height: "auto", resizable: true, classes: ["t20-picker-dialog", "t20-spell-dlg"] });
    dlg.render(true);
  }

  // ================================================================
  //  COMPENDIUM PICKER (com dedução de T$)
  // ================================================================
  async _onItemCreate(event) {
    event.preventDefault();
    const el = event.currentTarget;
    const type = el.dataset.type;
    const circle = el.dataset.circle ? parseInt(el.dataset.circle) : null;
    if (type === "invencao") return this._createBlankItem(type);
    const packId = T20ActorSheet.PACK_MAP[type];
    const label = T20ActorSheet.TYPE_LABELS[type] || type;
    if (!packId) return this._createBlankItem(type);
    const pack = game.packs.get(packId);
    if (!pack) return this._createBlankItem(type);
    let documents = await pack.getDocuments();
    if (!documents.length) return this._createBlankItem(type);
    // Filter by circle if specified
    if (circle) documents = documents.filter(d => d.system.circulo === circle);
    this._renderPicker(type, label + (circle ? ` ${circle}° Círculo` : ""), documents, circle);
  }

  _renderPicker(type, label, documents, circle) {
    const actor = this.actor;
    const infoFn = {
      arma: d => `<span class="cp-tag">${d.system.dano||"—"}</span><span class="cp-tag">${d.system.tipo||""}</span><span class="cp-tag">${d.system.grupo||""}</span>${d.system.preco?`<span class="cp-tag cp-price">T$${d.system.preco}</span>`:""}`,
      armadura: d => `<span class="cp-tag">+${d.system.defesa}</span><span class="cp-tag">${d.system.tipo||""}</span>${d.system.preco?`<span class="cp-tag cp-price">T$${d.system.preco}</span>`:""}`,
      magia: d => {
        const tc={"arcana":"cp-arc","divina":"cp-div","universal":"cp-uni"}[d.system.tipo]||"";
        return `<span class="cp-tag cp-circ">${d.system.circulo}°</span><span class="cp-tag ${tc}">${d.system.tipo||""}</span><span class="cp-tag">${d.system.escola||""}</span>`;
      },
      poder: d => `<span class="cp-tag">${d.system.tipo||""}</span>${d.system.requisitos?`<span class="cp-tag cp-req">${d.system.requisitos}</span>`:""}`,
      equipamento: d => `<span class="cp-tag">${d.system.categoria||""}</span>${d.system.preco?`<span class="cp-tag cp-price">${d.system.preco}</span>`:""}`,
    };
    const getInfo = infoFn[type] || (() => "");

    const sorted = [...documents].sort((a,b) => {
      if (type==="magia") { const d=(a.system.circulo||0)-(b.system.circulo||0); if(d) return d; }
      return a.name.localeCompare(b.name,"pt-BR");
    });

    // Filters
    let fHtml = "";
    if (type === "magia") {
      const ac=sorted.filter(d=>d.system.tipo==="arcana").length;
      const dc=sorted.filter(d=>d.system.tipo==="divina").length;
      const uc=sorted.filter(d=>d.system.tipo==="universal").length;
      fHtml = `<div class="cp-filters">
        <button type="button" class="cp-filter active" data-filter="todas">Todas (${sorted.length})</button>
        <button type="button" class="cp-filter cp-f-arc" data-filter="arcana">Arcanas (${ac})</button>
        <button type="button" class="cp-filter cp-f-div" data-filter="divina">Divinas (${dc})</button>
        <button type="button" class="cp-filter cp-f-uni" data-filter="universal">Universais (${uc})</button>
      </div>`;
    }
    if (type === "poder") {
      const cats={};
      sorted.forEach(d=>{cats[d.system.tipo]=(cats[d.system.tipo]||0)+1;});
      fHtml = `<div class="cp-filters">
        <button type="button" class="cp-filter active" data-filter="todas">Todos (${sorted.length})</button>
        ${Object.entries(cats).map(([k,v])=>`<button type="button" class="cp-filter" data-filter="${k}">${k.charAt(0).toUpperCase()+k.slice(1)} (${v})</button>`).join("")}
      </div>`;
    }

    const hasPrice = ["arma","armadura","equipamento"].includes(type);
    const itemsHtml = sorted.map(d => {
      const ta = d.system.tipo ? `data-tipo="${d.system.tipo}"` : "";
      const pr = d.system.preco || 0;
      return `<div class="cp-item" data-id="${d.id}" ${ta} data-preco="${pr}" title="${(d.system.descricao||"").replace(/"/g,'&quot;').substring(0,300)}">
        <img src="${d.img||'icons/svg/item-bag.svg'}" width="24" height="24"/>
        <span class="cp-name">${d.name}</span>
        <div class="cp-info">${getInfo(d)}</div>
      </div>`;
    }).join("");

    const html = `<div class="t20-compendium-picker">
      <div class="cp-search-row">
        <input type="text" class="cp-search" placeholder="Buscar ${label.toLowerCase()}..." autofocus/>
        <button type="button" class="cp-blank-btn" title="Criar em branco">+</button>
      </div>
      ${fHtml}
      ${hasPrice ? `<label class="cp-deduct-row"><input type="checkbox" class="cp-deduct-check" checked /> Deduzir T$ automaticamente</label>` : ""}
      <div class="cp-list">${itemsHtml}</div>
      <div class="cp-footer">${sorted.length} itens</div>
    </div>`;

    const dlg = new Dialog({
      title: `Adicionar ${label}`, content: html, buttons: {},
      render: (jq) => {
        const el = jq[0]||jq;
        let activeFilter = "todas";

        const applyFilters = () => {
          const q = (el.querySelector(".cp-search")?.value||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
          let vis=0;
          el.querySelectorAll(".cp-item").forEach(row => {
            const nm = row.querySelector(".cp-name").textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
            const inf = row.querySelector(".cp-info").textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
            const tipo = row.dataset.tipo||"";
            const ok = (!q||nm.includes(q)||inf.includes(q)) && (activeFilter==="todas"||tipo===activeFilter);
            row.style.display = ok?"":"none";
            if(ok) vis++;
          });
          el.querySelector(".cp-footer").textContent = `${vis} itens`;
        };

        el.querySelector(".cp-search")?.addEventListener("input", applyFilters);
        el.querySelectorAll(".cp-filter").forEach(btn => {
          btn.addEventListener("click", () => {
            el.querySelectorAll(".cp-filter").forEach(b=>b.classList.remove("active"));
            btn.classList.add("active");
            activeFilter = btn.dataset.filter;
            applyFilters();
          });
        });

        el.querySelectorAll(".cp-item").forEach(row => {
          row.addEventListener("click", async () => {
            const doc = sorted.find(d=>d.id===row.dataset.id);
            if (!doc) return;

            // Deduzir T$ se checkbox marcado
            const deductCheck = el.querySelector(".cp-deduct-check");
            const shouldDeduct = deductCheck?.checked ?? false;
            if (shouldDeduct && hasPrice) {
              let preco = parseFloat(String(doc.system.preco||"0").replace(/[^\d.,]/g,"").replace(",",".")) || 0;
              if (preco > 0) {
                const dinheiro = actor.system.detalhes?.dinheiro || {};
                const tb = dinheiro.tb || 0;
                const to = dinheiro.to || 0;
                const totalTB = tb + (to * 100);

                if (totalTB < preco) {
                  ui.notifications.warn(`T$ insuficiente! Tem T$${tb} + ${to} TO (=${totalTB} T$), precisa T$${preco}.`);
                  return;
                }

                // Perguntar: pagar com T$ ou TO?
                const usarTO = to > 0 && preco >= 100;
                if (tb >= preco) {
                  // Pagar direto com T$
                  await actor.update({"system.detalhes.dinheiro.tb": tb - preco});
                  ui.notifications.info(`T$${preco} pagos em Tibares.`);
                } else if (usarTO) {
                  // Usar TO + troco em T$
                  const toUsados = Math.ceil((preco - tb) / 100);
                  const trocoTB = tb + (toUsados * 100) - preco;
                  await actor.update({
                    "system.detalhes.dinheiro.tb": trocoTB,
                    "system.detalhes.dinheiro.to": to - toUsados
                  });
                  ui.notifications.info(`Pago: ${toUsados} TO + troco T$${trocoTB}.`);
                } else {
                  await actor.update({"system.detalhes.dinheiro.tb": tb - preco});
                  ui.notifications.info(`T$${preco} pagos.`);
                }
              }
            }

            await actor.createEmbeddedDocuments("Item", [{
              name: doc.name, type: doc.type, img: doc.img,
              system: foundry.utils.deepClone(doc.system),
            }]);
            ui.notifications.info(`${doc.name} adicionado!`);
            row.style.opacity = "0.35";
            row.style.pointerEvents = "none";
          });
        });

        el.querySelector(".cp-blank-btn")?.addEventListener("click", async () => {
          dlg.close(); this._createBlankItem(type);
        });
      },
      close: () => {},
    }, { width: 560, height: 620, resizable: true, classes: ["t20-picker-dialog"] });
    dlg.render(true);
  }

  async _createBlankItem(type) {
    const n = {arma:"Nova Arma",armadura:"Nova Armadura",poder:"Novo Poder",magia:"Nova Magia",equipamento:"Novo Equipamento",habilidade:"Nova Habilidade"};
    const created = await this.actor.createEmbeddedDocuments("Item",[{name:n[type]||"Novo Item",type,system:{}}]);
    if(created?.[0]) created[0].sheet.render(true);
  }

  // ================================================================
  //  HEADER PICK — Auto-aplica benefícios de Raça/Classe/Origem
  // ================================================================

  // Dados de raça para auto-aplicação
  static RACE_BONUSES = {
    "Anão":{"con":2,"sab":1,"des":-1},"Dahllan":{"sab":2,"des":1,"int":-1},
    "Elfo":{"int":2,"des":1,"con":-1},"Goblin":{"des":2,"int":1,"car":-1},
    "Minotauro":{"for":2,"con":1,"sab":-1},"Qareen":{"car":2,"int":1,"sab":-1},
    "Golem":{"for":2,"con":1,"car":-1},"Hynne":{"des":2,"car":1,"for":-1},
    "Kliren":{"int":2,"car":1,"for":-1},"Medusa":{"des":2,"car":1},
    "Sílfide":{"car":2,"des":1,"for":-2},"Suraggel (Aggelus)":{"sab":2,"car":1},
    "Suraggel (Sulfure)":{"des":2,"int":1},"Trog":{"con":2,"for":1,"int":-1},
    // Heróis de Arton
    "Eiradaan":{"sab":2,"car":1,"for":-1},"Galokk":{"for":1,"con":1,"car":-1},
    "Sátiro":{"car":2,"des":1,"sab":-1},
    // Livro das Raças
    "Orc":{"for":2,"con":1,"int":-1},"Meio-Orc":{"for":2},
    "Tabrachi":{"con":2,"for":1,"car":-1},"Trog Anão":{"con":2,"for":1,"int":-1,"des":-1},
    "Ogro":{"for":3,"con":2,"int":-1,"car":-1},"Bugbear":{"for":2,"des":1,"car":-1},
    "Hobgoblin":{"con":2,"des":1,"car":-1},"Gnoll":{"con":2,"sab":1,"int":-1},
    "Tengu":{"des":2,"int":1},"Kaijin":{"for":2,"con":1,"car":-2},
    "Nezumi":{"con":2,"des":1,"int":-1},"Kappa":{"des":2,"con":1,"car":-1},
    "Centauro":{"sab":2,"for":1,"int":-1},"Minauro":{"for":1},
    "Harpia":{"des":2,"car":1,"int":-1},"Ceratops":{"con":2,"for":1,"des":-1,"int":-1},
    "Pteros":{"sab":2,"des":1,"int":-1},"Velocis":{"des":2,"sab":1,"int":-1},
    "Voracis":{"des":2,"con":1,"int":-1},"Elfo-do-Mar":{"des":2,"con":1,"int":-1},
    "Fintroll":{"int":2,"con":1,"for":-1},"Yidishan":{"car":-2},
    "Moreau (Coruja)":{"sab":1},"Moreau (Lobo)":{"car":1},
    "Moreau (Raposa)":{"int":1},"Moreau (Urso)":{"con":1},
  };
  static RACE_SPEED = {
    "Anão":6,"Golem":6,"Hynne":6,"Kliren":6,
    "Trog Anão":6,"Sátiro":12,"Centauro":12,"Velocis":12,
    "Moreau (Raposa)":12,
  };
  // Stats de PV/PM por classe. Mantido em sincronia com T20Actor.CLASS_STATS.
  // 14 classes básicas + 5 suplementares. As 14 variantes de Heróis de Arton
  // agora vivem no campo `subclasse` via CLASS_SUBTYPES — não são classes
  // independentes. O override de PV/PM para variantes com stats diferentes
  // (Burguês, Ermitão, Magimarcialista, Santo) está em
  // T20Actor.SUBCLASS_STATS_OVERRIDES.
  static CLASS_STATS = {
    "Arcanista":{pv:8,pm:6},"Bárbaro":{pv:24,pm:3},"Bardo":{pv:12,pm:4},
    "Bucaneiro":{pv:16,pm:3},"Caçador":{pv:16,pm:4},"Cavaleiro":{pv:20,pm:3},
    "Clérigo":{pv:16,pm:5},"Druida":{pv:16,pm:4},"Guerreiro":{pv:20,pm:3},
    "Inventor":{pv:12,pm:4},"Ladino":{pv:12,pm:4},"Lutador":{pv:20,pm:3},
    "Nobre":{pv:16,pm:4},"Paladino":{pv:20,pm:3},
    "Treinador":{pv:12,pm:4},"Frade":{pv:12,pm:6},
    "Miragem":{pv:16,pm:3},"Místico":{pv:16,pm:4},"Samurai":{pv:20,pm:3},
  };

  // Nomes de variantes que NÃO devem aparecer no picker de classe
  // (elas são subclasses, não classes). Usado pra filtrar o compêndio.
  static VARIANT_NAMES = [
    "Alquimista","Atleta","Burguês","Duelista","Ermitão","Inovador",
    "Machado de Pedra","Magimarcialista","Necromante","Santo","Seteiro",
    "Usurpador","Vassalo","Ventanista"
  ];

  // Subtipos de classe
  static CLASS_SUBTYPES = {
    // ═════════════════════════════════════════════════════════
    // Estrutura: cada subtipo pode ter os campos:
    //   nome       — nome exibido
    //   desc       — tooltip / card description
    //   atrChave   — atributo-chave de magia (int/sab/car) se fixo
    //   icon       — classe FontAwesome
    //   variante   — true se for Classe Variante de Heróis de Arton
    // As variantes marcadas podem ter override de PV/PM (ver
    // T20Actor.SUBCLASS_STATS_OVERRIDES no actor-document).
    // ═════════════════════════════════════════════════════════
    "Arcanista": [
      {nome:"Bruxo", desc:"Magias via foco (varinha/cajado). Atributo-chave: Inteligência.", atrChave:"int", icon:"fas fa-wand-sparkles"},
      {nome:"Feiticeiro", desc:"Magias via poder inato (linhagem). Atributo-chave: Carisma. Aprende magias em níveis ímpares.", atrChave:"car", icon:"fas fa-fire"},
      {nome:"Mago", desc:"Magias via estudo (grimório). Atributo-chave: Inteligência. Memoriza metade das magias.", atrChave:"int", icon:"fas fa-book-sparkles"},
      {nome:"Necromante", desc:"VARIANTE (Heróis de Arton). Estuda vida, morte e estados intermediários. Animar cadáveres. Atr-chave Int/Car conforme linhagem mental.", atrChave:"int", icon:"fas fa-skull", variante:true},
    ],
    "Bárbaro": [
      {nome:"Machado de Pedra", desc:"VARIANTE (Heróis de Arton). Primitivo, só usa armas simples rústicas. Ganha +1 Def/3 níveis sem armadura, RD crescente. Grunhidos no lugar de idioma.", icon:"fas fa-khanda", variante:true},
    ],
    "Bardo": [
      {nome:"Magimarcialista", desc:"VARIANTE (Heróis de Arton). ⚠ PV 16+4 (aumentado). Foco em combate corpo a corpo + magia destrutiva. Armaduras leves, escudos, armas marciais.", icon:"fas fa-guitar", variante:true},
    ],
    "Bucaneiro": [
      {nome:"Audácia (Luta)", desc:"Perícia fixa: Luta. Combate corpo a corpo.", icon:"fas fa-swords"},
      {nome:"Audácia (Pontaria)", desc:"Perícia fixa: Pontaria. Combate à distância.", icon:"fas fa-crosshairs"},
      {nome:"Duelista", desc:"VARIANTE (Heróis de Arton). Esgrimista orgulhoso e honrado. Duelo +2/+5, Esquiva Sagaz, Escola de Duelo, Truques de Capa.", icon:"fas fa-khanda", variante:true},
    ],
    "Caçador": [
      {nome:"Marca (Luta)", desc:"Perícia fixa: Luta. Foco corpo a corpo.", icon:"fas fa-swords"},
      {nome:"Marca (Pontaria)", desc:"Perícia fixa: Pontaria. Foco à distância.", icon:"fas fa-crosshairs"},
      {nome:"Seteiro", desc:"VARIANTE (Heróis de Arton). Caminho do Atirador — foco total em arco. Marca da Presa +1d4→2d10, Tiro de Supressão, Disparo Constritor.", icon:"fas fa-bullseye", variante:true},
    ],
    "Cavaleiro": [
      {nome:"Bastião", desc:"Armadura pesada concede RD 5 no 5° nível.", icon:"fas fa-shield-halved"},
      {nome:"Montaria", desc:"Cavalo de guerra como parceiro veterano no 5° nível.", icon:"fas fa-horse"},
      {nome:"Vassalo", desc:"VARIANTE (Heróis de Arton). Servo feudal de um nobre. Jovem Pajem (Adest/Ofício), Suserano (+5 Dipl/Intim vs vassalos de menor nível, hospedagem grátis).", icon:"fas fa-chess-rook", variante:true},
    ],
    "Clérigo": [
      {nome:"Usurpador", desc:"VARIANTE (Heróis de Arton). Roubou o poder divino sem devoção. Canalização Falsa, Discrição Divina, Poder Capturado, Roubo Divino (20°).", icon:"fas fa-mask", variante:true},
    ],
    "Druida": [
      {nome:"Ermitão", desc:"VARIANTE (Heróis de Arton). ⚠ PV 12+3 (reduzido). Recluso extremo, ligado a um local sagrado específico. Aparência selvagem, hábitos reclusos.", icon:"fas fa-tree", variante:true},
    ],
    "Guerreiro": [
      {nome:"Ataque Especial (Luta)", desc:"Perícia fixa: Luta.", icon:"fas fa-swords"},
      {nome:"Ataque Especial (Pontaria)", desc:"Perícia fixa: Pontaria.", icon:"fas fa-crosshairs"},
      {nome:"Inovador", desc:"VARIANTE (Heróis de Arton). Técnicas inéditas, imprevisível. Do Bom e do Melhor (arma/arm. sup.), Técnica Revolucionária (armas ganham habilidades temp.), Estilo Único.", icon:"fas fa-bolt", variante:true},
    ],
    "Inventor": [
      {nome:"Alquimista", desc:"VARIANTE (Heróis de Arton). Foco em itens alquímicos. Laboratório Pessoal, Alquimista Iniciado, Mistura Básica, Fabricar Emulsão, Pedra Filosofal (20°).", icon:"fas fa-flask", variante:true},
    ],
    "Ladino": [
      {nome:"Ventanista", desc:"VARIANTE (Heróis de Arton). Ladrão refinado de janela, sem violência. Charme (+Car em PM). Assinatura: trocar objetos deixando marca.", icon:"fas fa-mask", variante:true},
    ],
    "Lutador": [
      {nome:"Atleta", desc:"VARIANTE (Heróis de Arton). Corpo como templo. Façanha Atlética (PM em perícias), Arremesso Atlético, Poderio Muscular, Mais Alto e Mais Rápido, Corpo Ideal (20°).", icon:"fas fa-person-running", variante:true},
    ],
    "Nobre": [
      {nome:"Liderança (Diplomacia)", desc:"Perícia fixa: Diplomacia.", icon:"fas fa-handshake"},
      {nome:"Liderança (Intimidação)", desc:"Perícia fixa: Intimidação.", icon:"fas fa-hand-fist"},
      {nome:"Burguês", desc:"VARIANTE (Heróis de Arton). ⚠ PV 12+3 (reduzido). Comerciante rico. Meios de Produção (T$/aventura), Poder Monetário (TO vira PM), Desmoralizar, Ostentação.", icon:"fas fa-coins", variante:true},
    ],
    "Paladino": [
      {nome:"Santo", desc:"VARIANTE (Heróis de Arton). ⚠ PM 4/nv (aumentado). Veículo da vontade divina, Código do Herói mais rígido, Ladainha de Combate Sacra, Vaso Sagrado.", icon:"fas fa-dove", variante:true},
    ],
    "Treinador": [
      {nome:"Conquistar pelos Números", desc:"Segundo melhor amigo. Ação padrão extra entre amigos (3 PM).", icon:"fas fa-users"},
      {nome:"Treino Intensivo", desc:"+4 PV/nível, RD 5, +1 truque para melhor amigo.", icon:"fas fa-shield-halved"},
    ],
    "Místico": [
      {nome:"Afinidade (Água)", desc:"RD frio. Escola: Encantamento. Perícia: Diplomacia.", icon:"fas fa-water"},
      {nome:"Afinidade (Ar)", desc:"RD eletricidade. Escola: Ilusão. Perícia: Enganação.", icon:"fas fa-wind"},
      {nome:"Afinidade (Fogo)", desc:"RD fogo. Escola: Transmutação. Perícia: Acrobacia.", icon:"fas fa-fire"},
      {nome:"Afinidade (Luz)", desc:"RD luz. Escola: Abjuração. Perícia: Cura.", icon:"fas fa-sun"},
      {nome:"Afinidade (Terra)", desc:"RD ácido. Escola: Convocação. Perícia: Investigação.", icon:"fas fa-mountain"},
      {nome:"Afinidade (Trevas)", desc:"RD trevas. Escola: Necromancia. Perícia: Intimidação.", icon:"fas fa-moon"},
    ],
    "Samurai": [
      {nome:"Código do Samurai", desc:"Manter palavra, nunca recusar ajuda inocente, nunca mentir/trapacear/roubar.", icon:"fas fa-torii-gate"},
      {nome:"Ronin", desc:"Livre do código. Pode usar qualquer tipo de arma ancestral.", icon:"fas fa-person-walking"},
    ],
  };

  async _onHeaderPick(event) {
    event.preventDefault();
    const pickType = event.currentTarget.dataset.pick;

    // CLASSE: abre o gerenciador MULTICLASSE unificado
    if (pickType === "classe") {
      return this._openMulticlassManager();
    }

    // SUBCLASSE: picker com cards estilizados (usa o helper compartilhado)
    if (pickType === "subclasse") {
      const classe = this.actor.system.biografia?.classe || "";
      if (!classe) {
        ui.notifications.info("Escolha uma classe primeiro.");
        return;
      }
      const subs = T20ActorSheet.CLASS_SUBTYPES[classe];
      if (!subs || !subs.length) {
        ui.notifications.info(`${classe} não possui subtipos.`);
        return;
      }
      const sheet = this;
      this._openSubtypePicker(classe, async (name, atr) => {
        // Atualiza campos legados
        const upd = { "system.biografia.subclasse": name };
        if (atr) upd["system.magia.atributoChave"] = atr;
        await sheet.actor.update(upd);
        // Também sincroniza no array de classes (principal)
        const arr = sheet._getClassesArray();
        const principalIdx = Math.max(0, arr.findIndex(c => c.nome === classe));
        if (arr[principalIdx]) {
          arr[principalIdx].subclasse = name;
          await sheet._saveClassesArray(arr, principalIdx);
        }
        const atrLabels = { int:"Inteligência", sab:"Sabedoria", car:"Carisma" };
        ui.notifications.info(atr ? `${name} — Atributo-chave: ${atrLabels[atr]}` : `Subtipo: ${name}`);
      });
      return;
    }
    const packId = T20ActorSheet.PACK_MAP[pickType];
    const labels = { classe:"Classe", raca:"Raça", origem:"Origem", distincao:"Distinção" };
    const fields = {
      classe:"system.biografia.classe", raca:"system.biografia.raca",
      origem:"system.biografia.origem", distincao:"system.biografia.distincao"
    };
    const label = labels[pickType] || pickType;
    const field = fields[pickType];
    const actor = this.actor;

    if (!packId) return;
    const pack = game.packs.get(packId);
    if (!pack) { ui.notifications.warn(`Compêndio ${packId} não encontrado.`); return; }
    const docs = await pack.getDocuments();
    if (!docs.length) { ui.notifications.warn(`Compêndio ${packId} vazio.`); return; }

    const sorted = [...docs].sort((a,b) => a.name.localeCompare(b.name,"pt-BR"));

    const itemsHtml = sorted.map(d => {
      const info = d.system.acao || d.system.requisitos || "";
      return `<div class="cp-item" data-name="${d.name}" data-id="${d.id}" title="${(d.system.descricao||"").replace(/"/g,'&quot;').substring(0,500)}">
        <img src="${d.img||'icons/svg/mystery-man.svg'}" width="24" height="24"/>
        <span class="cp-name">${d.name}</span>
        <span class="cp-info"><span class="cp-tag">${info.substring(0,80)}</span></span>
      </div>`;
    }).join("");

    const html = `<div class="t20-compendium-picker">
      <div class="cp-search-row"><input type="text" class="cp-search" placeholder="Buscar ${label.toLowerCase()}..." autofocus/></div>
      <label class="cp-deduct-row"><input type="checkbox" class="cp-auto-apply" checked /> Aplicar benefícios automaticamente</label>
      <div class="cp-list">${itemsHtml}</div>
    </div>`;

    const sheet = this;
    const dlg = new Dialog({
      title: `Escolher ${label}`, content: html, buttons: {},
      render: (jq) => {
        const el = jq[0]||jq;
        el.querySelector(".cp-search")?.addEventListener("input", (e) => {
          const q = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
          el.querySelectorAll(".cp-item").forEach(row => {
            row.style.display = row.dataset.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").includes(q)?"":"none";
          });
        });

        el.querySelectorAll(".cp-item").forEach(row => {
          row.addEventListener("click", async () => {
            const name = row.dataset.name;
            const doc = sorted.find(d=>d.id===row.dataset.id);
            const autoApply = el.querySelector(".cp-auto-apply")?.checked ?? false;

            // 1. Atualizar campo de biografia
            await actor.update({ [field]: name });

            // 2. Adicionar como item habilidade
            if (doc) {
              await actor.createEmbeddedDocuments("Item", [{
                name: `${label}: ${doc.name}`, type:"habilidade", img:doc.img,
                system: foundry.utils.deepClone(doc.system),
              }]);
            }

            // 3. Auto-aplicar benefícios
            if (autoApply) {
              await sheet._autoApply(pickType, name, actor);
            }

            ui.notifications.info(`${label}: ${name} aplicado!`);
            dlg.close();
          });
        });
      },
      close:()=>{},
    }, { width:520, height:560, resizable:true, classes:["t20-picker-dialog"] });
    dlg.render(true);
  }

  // Auto-aplica benefícios de raça, classe ou origem
  async _autoApply(pickType, name, actor) {
    const updates = {};
    const nivel = actor.system.biografia?.nivel ?? 1;

    if (pickType === "raca") {
      // RESETAR atributos antes de aplicar nova raça
      for (const atr of ["for","des","con","int","sab","car"]) {
        updates[`system.atributos.${atr}.value`] = 0;
      }
      updates["system.biografia.deslocamento"] = 9; // reset deslocamento

      // Aplicar bônus de atributo
      const bonuses = T20ActorSheet.RACE_BONUSES[name];
      if (bonuses) {
        for (const [atr, val] of Object.entries(bonuses)) {
          updates[`system.atributos.${atr}.value`] = val;
        }
        ui.notifications.info(`Atributos: ${Object.entries(bonuses).map(([k,v])=>`${k.toUpperCase()} ${v>=0?"+":""}${v}`).join(", ")}`);
      } else {
        ui.notifications.info(`${name}: distribua os bônus manualmente.`);
      }
      const speed = T20ActorSheet.RACE_SPEED[name];
      if (speed) updates["system.biografia.deslocamento"] = speed;

      // Adicionar MAGIAS raciais (buscando no compêndio de magias)
      const RACE_SPELLS = {
        "Suraggel (Aggelus)": ["Luz"],
        "Suraggel (Sulfure)": ["Escuridão"],
        "Dahllan": ["Controlar Plantas"],
        "Qareen": [],
        "Sílfide": [],
      };
      const raceSpells = RACE_SPELLS[name];
      if (raceSpells && raceSpells.length) {
        const magiasPack = game.packs.get("tormenta20.magias");
        if (magiasPack) {
          const allMagias = await magiasPack.getDocuments();
          for (const spName of raceSpells) {
            const found = allMagias.find(m => m.name === spName);
            if (found) {
              await actor.createEmbeddedDocuments("Item", [{
                name: found.name, type: "magia", img: found.img,
                system: foundry.utils.deepClone(found.system),
              }]);
              ui.notifications.info(`Magia racial adicionada: ${spName}`);
            }
          }
        }
      }
    }

    if (pickType === "classe") {
      const stats = T20ActorSheet.CLASS_STATS[name];
      if (stats) {
        const con = actor.system.atributos.con?.total ?? 0;
        const atributoChave = actor.system.magia?.atributoChave || "int";
        const modChave = actor.system.atributos[atributoChave]?.total ?? 0;
        const pvMax = nivel * (stats.pv + con) + (actor.system.pv?.bonus || 0);
        const pmMax = (stats.pm * nivel) + modChave + (actor.system.pm?.bonus || 0);
        updates["system.pv.value"] = pvMax;
        updates["system.pm.value"] = pmMax;
        updates["system.biografia.subclasse"] = "";

        // Sincroniza o array de multiclasse: se for a primeira classe
        // (ou se o array estiver vazio), cria entrada única. Caso contrário,
        // o gerenciador multiclasse já cuidou disso antes de chamar _autoApply.
        const existing = Array.isArray(actor.system.biografia?.classes) ? actor.system.biografia.classes : [];
        if (existing.length === 0 || !existing.find(c => c?.nome === name)) {
          // Preserva outras classes caso existam
          const novo = existing.length ? [...existing] : [];
          if (!novo.find(c => c?.nome === name)) {
            novo.push({ nome: name, nivel, subclasse: "" });
          }
          updates["system.biografia.classes"] = novo;
        }

        ui.notifications.info(`PV: ${pvMax} (${stats.pv}+Con ×nível), PM: ${pmMax} (${stats.pm}/nível + Atr.Chave)`);

        // Atributo-chave fixo para classes conjuradoras (base apenas).
        // Variantes conjuradoras (Necromante, Alquimista, Magimarcialista,
        // Santo, Usurpador) vêm pela subclasse que já atualiza atrChave.
        const classAtr = {
          "Bardo":"car", "Clérigo":"sab", "Druida":"sab", "Paladino":"sab",
          "Inventor":"int", "Arcanista":"int",
          "Treinador":"car", "Frade":"sab", "Místico":"sab", "Samurai":"sab",
        };
        if (classAtr[name]) {
          updates["system.magia.atributoChave"] = classAtr[name];
          const labels = { int:"Inteligência", sab:"Sabedoria", car:"Carisma" };
          ui.notifications.info(`Atributo-chave de magia: ${labels[classAtr[name]]}`);
        }
      }
    }

    if (pickType === "origem") {
      // Mapa de perícias por origem
      const ORIGIN_SKILLS = {
        "Acólito":["cura","religiao","vontade"],"Amigo dos Animais":["adestramento","cavalgar"],
        "Aristocrata":["diplomacia","enganacao","nobreza"],"Artesão":["oficio","vontade"],
        "Artista":["atuacao","enganacao"],"Assistente de Laboratório":["oficio","misticismo"],
        "Batedor":["furtividade","percepcao","sobrevivencia"],"Capanga":["luta","intimidacao"],
        "Charlatão":["enganacao","jogatina"],"Circense":["acrobacia","atuacao","reflexos"],
        "Criminoso":["enganacao","furtividade","ladinagem"],"Curandeiro":["cura","vontade"],
        "Eremita":["misticismo","religiao","sobrevivencia"],"Escravo":["atletismo","fortitude","furtividade"],
        "Estudioso":["conhecimento","guerra","misticismo"],"Fazendeiro":["adestramento","cavalgar","oficio","sobrevivencia"],
        "Forasteiro":["cavalgar","pilotagem","sobrevivencia"],"Gladiador":["atuacao","luta"],
        "Guarda":["investigacao","luta","percepcao"],"Herdeiro":["misticismo","nobreza","oficio"],
        "Herói Camponês":["adestramento","oficio"],"Marujo":["atletismo","jogatina","pilotagem"],
        "Mateiro":["atletismo","furtividade","sobrevivencia"],"Membro de Guilda":["diplomacia","enganacao","misticismo","oficio"],
        "Mercador":["diplomacia","intuicao","oficio"],"Minerador":["atletismo","fortitude","oficio"],
        "Nômade":["cavalgar","pilotagem","sobrevivencia"],"Pivete":["furtividade","iniciativa","ladinagem"],
        "Refugiado":["fortitude","reflexos","vontade"],"Seguidor":["adestramento","oficio"],
        "Selvagem":["percepcao","reflexos","sobrevivencia"],"Soldado":["fortitude","guerra","luta","pontaria"],
        "Taverneiro":["diplomacia","jogatina","oficio"],"Trabalhador Braçal":["atletismo","fortitude"],
        // Heróis de Arton
        "Bacharel":["conhecimento","diplomacia","nobreza"],"Boticário":["cura","oficio"],
        "Caçador de Recompensas":["furtividade","investigacao","sobrevivencia"],"Cão de Briga":["fortitude","luta"],
        "Carcereiro":["intimidacao","investigacao"],"Carpinteiro de Guilda":["oficio"],
        "Catador da Catástrofe":["fortitude","percepcao"],"Chef Hynne":["oficio"],
        "Cirurgião-Barbeiro":["cura","oficio"],"Citadino Abastado":["nobreza","oficio"],
        "Cocheiro":["adestramento","pilotagem"],"Construtor":["fortitude","oficio"],
        "Contrabandista":["enganacao","ladinagem"],"Coureiro":["fortitude","oficio"],
        "Escriba":["conhecimento","oficio"],"Espião":["enganacao","ladinagem"],
        "Freira":["cura"],"Goradista":["oficio"],"Insciente":["sobrevivencia"],
        "Interrogador":["intimidacao","intuicao"],"Ladrão de Túmulos":["ladinagem","religiao"],
        "Menestrel":["atuacao"],"Mensageiro":["atletismo","iniciativa"],
        "Náufrago":["atletismo","sobrevivencia"],"Padeiro":["oficio"],
        "Pedinte":["furtividade","enganacao"],"Pescador":["oficio","sobrevivencia"],
        "Servo":["diplomacia","intuicao"],"Suporte de Tropas":["cura","guerra"],
      };

      const skills = ORIGIN_SKILLS[name];
      if (skills) {
        const skillUpdates = {};
        for (const sk of skills) {
          skillUpdates[`system.pericias.${sk}.treinada`] = true;
        }
        await actor.update(skillUpdates);
        ui.notifications.info(`Perícias treinadas: ${skills.join(", ")}`);
      }

      // Tentar adicionar poderes da origem como items do compêndio de poderes
      const ORIGIN_POWERS = {
        "Acólito":["Medicina","Vontade de Ferro"],"Aristocrata":["Comandar"],
        "Artesão":["Sortudo"],"Artista":["Atraente","Sortudo"],
        "Batedor":["Sentidos Aguçados"],"Charlatão":["Aparência Inofensiva","Sortudo"],
        "Circense":["Acrobático"],"Curandeiro":["Medicina"],
        "Eremita":["Lobo Solitário"],"Escravo":["Vitalidade"],
        "Forasteiro":["Lobo Solitário"],"Herdeiro":["Comandar"],
        "Herói Camponês":["Sortudo","Surto Heroico"],"Marujo":["Acrobático"],
        "Mateiro":["Lobo Solitário","Sentidos Aguçados"],"Mercador":["Sortudo"],
        "Minerador":["Ataque Poderoso","Sentidos Aguçados"],"Nômade":["Lobo Solitário","Sentidos Aguçados"],
        "Pivete":["Acrobático","Aparência Inofensiva"],"Refugiado":["Vontade de Ferro"],
        "Selvagem":["Lobo Solitário","Vitalidade"],"Soldado":["Influência Militar"],
        "Taverneiro":["Vitalidade"],"Trabalhador Braçal":["Atlético"],
      };

      const powerNames = ORIGIN_POWERS[name];
      if (powerNames && powerNames.length) {
        const poderespack = game.packs.get("tormenta20.poderes");
        if (poderespack) {
          const allPowers = await poderespack.getDocuments();
          for (const pName of powerNames) {
            const found = allPowers.find(p => p.name === pName);
            if (found) {
              await actor.createEmbeddedDocuments("Item", [{
                name: found.name, type: "poder", img: found.img,
                system: foundry.utils.deepClone(found.system),
              }]);
            }
          }
          ui.notifications.info(`Poderes adicionados: ${powerNames.join(", ")}`);
        }
      }
    }

    if (pickType === "distincao") {
      // Distinções têm efeitos variados demais para automatizar.
      // O item "Distinção: <nome>" já foi adicionado na ficha pelo picker;
      // o usuário deve ler a descrição e aplicar os bônus manualmente.
      ui.notifications.info(`Distinção "${name}" adicionada. Efeitos (marca, poderes, bônus) devem ser aplicados manualmente.`);
    }

    if (Object.keys(updates).length) {
      await actor.update(updates);
    }
  }

  // ================================================================
  //  INVENÇÕES (ENGENHOCAS) — Ativar, Consertar, Resetar
  // ================================================================
  async _onInvencaoActivate(event) {
    event.preventDefault();
    const item = this.actor.items.get($(event.currentTarget).closest(".item").data("itemId"));
    if (!item) return;
    if (item.system.status === "enguicada") {
      ui.notifications.warn(`${item.name} está enguiçada! Conserte antes de ativar.`);
      return;
    }
    const sys = item.system;
    const cdBase = sys.cdAtivacao || 15;
    const ativacoes = sys.ativacoesHoje || 0;
    let c = `<div class="t20-combat-card">`;
    c += `<div class="t20cc-header">⚙ ${item.name}</div>`;
    c += `<div class="t20cc-detail"><b>Magia Simulada:</b> ${sys.magiaSim || "—"}</div>`;
    c += `<div class="t20cc-detail"><b>Círculo:</b> ${sys.circuloMagia}°</div>`;
    c += `<div class="t20cc-detail"><b>CD Ativação:</b> ${cdBase}${ativacoes > 0 ? ` + ${ativacoes * 5} (ativações)` : ""} = ${cdBase + (ativacoes * 5)}</div>`;
    c += `<div class="t20cc-divider"></div>`;
    c += `<button type="button" class="t20-invencao-ativar-btn" `
      + `data-actor-id="${this.actor.id}" `
      + `data-item-id="${item.id}" `
      + `data-cd="${cdBase}">`
      + `<i class="fas fa-cog"></i> Testar Ativação (Ofício)</button>`;
    c += `</div>`;
    ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: this.actor }), content: c });
  }

  async _onInvencaoRepair(event) {
    event.preventDefault();
    const item = this.actor.items.get($(event.currentTarget).closest(".item").data("itemId"));
    if (!item) return;
    if (item.system.status !== "enguicada") {
      ui.notifications.info(`${item.name} já está funcional.`);
      return;
    }
    await item.update({ "system.status": "funcional" });
    ui.notifications.info(`${item.name} foi consertada e está funcional novamente.`);
  }

  async _onInvencaoReset(event) {
    event.preventDefault();
    const invencoes = this.actor.items.filter(i => i.type === "invencao");
    for (const inv of invencoes) {
      await inv.update({ "system.ativacoesHoje": 0 });
    }
    ui.notifications.info(`Ativações do dia resetadas para ${invencoes.length} engenhoca(s).`);
  }

  /**
   * Clique no nome da engenhoca — abre dialog com detalhes completos
   * Botões: "Ativar" e "Enviar ao Chat"
   */
  async _onInvencaoDetails(event) {
    event.preventDefault();
    const item = this.actor.items.get($(event.currentTarget).closest(".item").data("itemId"));
    if (!item) return;
    const s = item.system;
    const actor = this.actor;
    const pvPct = s.pvMax > 0 ? Math.round((s.pvAtual / s.pvMax) * 100) : 0;
    const pvColor = pvPct > 50 ? "#4caf50" : pvPct > 25 ? "#ff9800" : "#f44336";
    const statusLabel = s.status === "funcional"
      ? `<span style="color:#4caf50">✓ Funcional</span>`
      : `<span style="color:#f44336">✗ Enguiçada</span>`;
    const ativacoes = s.ativacoesHoje || 0;
    const cdFinal = (s.cdAtivacao || 15) + (ativacoes * 5);

    let html = `<div class="t20-inv-detail">`;

    // Header tags
    html += `<div class="tsd-tags">`;
    html += `<span class="tsd-tag">${s.tipoPorte === "vestida" ? "Vestida" : "Empunhada"}</span>`;
    html += `<span class="tsd-tag">${statusLabel}</span>`;
    html += `<span class="tsd-tag tsd-circ">${s.circuloMagia}° Círculo</span>`;
    html += `</div>`;

    // Magia simulada
    html += `<div class="tsd-details">`;
    html += `<div class="tsd-det"><b>Magia Simulada:</b> ${s.magiaSim || "—"}</div>`;
    html += `<div class="tsd-det"><b>Custo PM:</b> ${s.custoPMmagia} · <b>Custo Fabricação:</b> T$ ${s.custoFab}</div>`;
    html += `<div class="tsd-det"><b>CD de Ativação:</b> ${cdFinal}${ativacoes > 0 ? ` (base ${s.cdAtivacao} + ${ativacoes * 5} ativações hoje)` : ""}</div>`;
    html += `</div>`;

    // PV bar
    html += `<div style="margin:8px 0">`;
    html += `<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:3px">`;
    html += `<span><b>PV:</b> <span style="color:${pvColor};font-weight:bold">${s.pvAtual}</span> / ${s.pvMax}</span>`;
    html += `<span><b>Defesa:</b> ${s.defesa} · <b>RD:</b> ${s.rd}</span>`;
    html += `</div>`;
    html += `<div style="background:#333;border-radius:4px;height:8px;overflow:hidden"><div style="background:${pvColor};height:100%;width:${pvPct}%;border-radius:4px;transition:width 0.3s"></div></div>`;
    html += `</div>`;

    // Efeito
    if (s.efeito) {
      html += `<div style="margin:8px 0;padding:6px 8px;background:rgba(199,161,107,0.1);border-left:3px solid #c7a16b;border-radius:3px;font-size:12px;color:#ddd"><b>Efeito:</b> ${s.efeito}</div>`;
    }

    // Notas
    if (s.notas) {
      html += `<div style="font-size:11px;color:#aaa;margin-top:4px"><b>Notas:</b> ${s.notas}</div>`;
    }

    // Descrição
    if (s.descricao) {
      const desc = s.descricao.length > 600 ? s.descricao.substring(0, 600) + "..." : s.descricao;
      html += `<div class="tsd-desc" style="margin-top:6px">${desc}</div>`;
    }

    html += `</div>`;

    new Dialog({
      title: `⚙ ${item.name}`,
      content: html,
      buttons: {
        chat: {
          icon: '<i class="fas fa-comment"></i>',
          label: "Enviar ao Chat",
          callback: () => {
            let c = `<div class="t20-combat-card">`;
            c += `<div class="t20cc-header">⚙ ${item.name}</div>`;
            c += `<div class="t20cc-spell-info">`;
            c += `<span class="t20cc-tag">${s.tipoPorte === "vestida" ? "Vestida" : "Empunhada"}</span>`;
            c += `<span class="t20cc-tag">${s.status === "funcional" ? "✓ Funcional" : "✗ Enguiçada"}</span>`;
            c += `</div>`;
            c += `<div class="t20cc-detail"><b>Magia Simulada:</b> ${s.magiaSim || "—"}</div>`;
            c += `<div class="t20cc-detail"><b>Círculo:</b> ${s.circuloMagia}° · <b>PM:</b> ${s.custoPMmagia}</div>`;
            c += `<div class="t20cc-detail"><b>CD Ativação:</b> ${cdFinal}</div>`;
            c += `<div class="t20cc-divider"></div>`;
            c += `<div class="t20cc-detail"><b>PV:</b> <span style="color:${pvColor}">${s.pvAtual}</span>/${s.pvMax} · <b>Def:</b> ${s.defesa} · <b>RD:</b> ${s.rd}</div>`;
            c += `<div style="background:#333;border-radius:3px;height:6px;margin:4px 0;overflow:hidden"><div style="background:${pvColor};height:100%;width:${pvPct}%"></div></div>`;
            if (s.efeito) c += `<div class="t20cc-desc">${s.efeito}</div>`;
            c += `</div>`;
            ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: c });
          }
        },
        edit: {
          icon: '<i class="fas fa-pen"></i>',
          label: "Editar",
          callback: () => { item.sheet.render(true); }
        },
      },
      default: "chat",
    }, { width: 480, height: "auto", resizable: true, classes: ["t20-picker-dialog", "t20-spell-dlg"] }).render(true);
  }

  /**
   * Edição inline do PV da engenhoca direto na lista
   */
  async _onInvencaoPvChange(event) {
    event.preventDefault();
    const input = event.currentTarget;
    const item = this.actor.items.get($(input).closest(".item").data("itemId"));
    if (!item) return;
    const newVal = Math.max(0, parseInt(input.value) || 0);
    await item.update({ "system.pvAtual": newVal });
  }

  // ================================================================
  //  ROLAGENS
  // ================================================================
  async _onRollAtributo(event) {
    event.preventDefault();
    const key = event.currentTarget.dataset.atributo;
    const mod = this.actor.system.atributos[key]?.total??0;
    const roll = new Roll("1d20+@mod",{mod}); await roll.evaluate();
    roll.toMessage({speaker:ChatMessage.getSpeaker({actor:this.actor}),flavor:`<strong>Teste de ${key.toUpperCase()}</strong> (${mod>=0?"+":""}${mod})`});
  }
  async _onRollPericia(event) {
    event.preventDefault();
    const key = event.currentTarget.dataset.pericia;
    const p = this.actor.system.pericias[key]; const t = p?.total??0;
    const roll = new Roll("1d20+@t",{t}); await roll.evaluate();
    roll.toMessage({speaker:ChatMessage.getSpeaker({actor:this.actor}),flavor:`<strong>${key.charAt(0).toUpperCase()+key.slice(1)}${p?.treinada?" ★":""}</strong> (${t>=0?"+":""}${t})`});
  }
  async _onRollIniciativa(event) {
    event.preventDefault();
    // Integra com Combat Tracker quando ator está em combate; senão, vai pro chat.
    return rollT20Initiative(this.actor);
  }

  // ================================================================
  //  MULTICLASSE — Gerenciador unificado (aberto pelo campo CLASSE)
  // ================================================================

  /**
   * Retorna array clonado de classes. Se estiver vazio mas houver
   * `biografia.classe` legado, projeta entrada virtual.
   */
  _getClassesArray() {
    const bio = this.actor.system.biografia || {};
    const arr = Array.isArray(bio.classes) ? foundry.utils.deepClone(bio.classes) : [];
    if (!arr.length && (bio.classe || "").trim()) {
      arr.push({
        nome: bio.classe.trim(),
        nivel: Math.max(1, parseInt(bio.nivel) || 1),
        subclasse: bio.subclasse || "",
      });
    }
    return arr;
  }

  /**
   * Grava o array de classes + sincroniza campos legados
   * (biografia.classe = principal, subclasse = da principal, nivel = soma).
   */
  async _saveClassesArray(classes, principalIdx = 0) {
    const sanitized = classes
      .filter(c => c && c.nome)
      .map(c => ({
        nome: String(c.nome).trim(),
        nivel: Math.max(1, parseInt(c.nivel) || 1),
        subclasse: c.subclasse || "",
      }));

    const principal = sanitized[principalIdx] || sanitized[0] || null;
    const totalNivel = sanitized.reduce((s, c) => s + c.nivel, 0);

    await this.actor.update({
      "system.biografia.classes": sanitized,
      "system.biografia.classe": principal?.nome || "",
      "system.biografia.subclasse": principal?.subclasse || "",
      "system.biografia.nivel": totalNivel || 1,
    });
  }

  /**
   * Abre o gerenciador MULTICLASSE unificado. Acionado pelo clique no
   * campo "CLASSE" do cabeçalho (data-pick="classe"). Substitui o picker
   * simples antigo — agora suporta 1 ou múltiplas classes com níveis
   * independentes, subclasse por classe, e seleção de "principal".
   */
  async _openMulticlassManager() {
    const sheet = this;
    const actor = this.actor;

    const renderDlg = () => {
      const classes = sheet._getClassesArray();
      const principalNome = actor.system.biografia?.classe || "";
      const nivelTotal = classes.reduce((s,c) => s + c.nivel, 0) || 0;

      const rows = classes.map((c, i) => {
        const isPrincipal = c.nome === principalNome && i === classes.findIndex(x => x.nome === principalNome);
        const subInfo = c.subclasse
          ? `<span class="mcm-sub">${c.subclasse}</span>`
          : `<a class="mcm-sub-pick" data-idx="${i}" title="Escolher subtipo">subtipo…</a>`;
        return `<div class="mcm-row ${isPrincipal ? 'mcm-row-principal' : ''}" data-idx="${i}">
          <a class="mcm-star" data-idx="${i}" title="${isPrincipal ? 'Classe principal' : 'Tornar principal'}">
            <i class="fas fa-star" style="color:${isPrincipal ? 'var(--Gb,#ffdd99)' : 'var(--T5,#5c5c5c)'}"></i>
          </a>
          <span class="mcm-nome">${c.nome}</span>
          ${subInfo}
          <label class="mcm-nivel" title="Nível nesta classe">
            <span>Nv</span>
            <input type="number" class="mcm-nivel-input" data-idx="${i}" value="${c.nivel}" min="1" max="20" />
          </label>
          <a class="mcm-del" data-idx="${i}" title="Remover esta classe"><i class="fas fa-times"></i></a>
        </div>`;
      }).join("");

      const emptyMsg = classes.length === 0
        ? `<div class="mcm-empty">Nenhuma classe. Clique em <b>+ Adicionar Classe</b> abaixo.</div>` : "";

      return `<div class="t20-mcm">
        <div class="mcm-header">
          <span class="mcm-total">Total: <b>${nivelTotal}</b></span>
          <span class="mcm-hint">★ marca a classe principal (define proficiências/atr-chave)</span>
        </div>
        <div class="mcm-list">${rows}${emptyMsg}</div>
        <div class="mcm-actions">
          <button type="button" class="mcm-add">
            <i class="fas fa-plus"></i> Adicionar Classe
          </button>
        </div>
      </div>`;
    };

    const dlg = new Dialog({
      title: "Gerenciar Classes",
      content: renderDlg(),
      buttons: {
        close: { label: "Fechar", callback: () => {} }
      },
      default: "close",
      render: (jq) => { bindHandlers(jq[0] || jq); },
      close: () => {},
    }, { width: 540, height: "auto", resizable: true, classes:["t20-picker-dialog","t20-mcm-dialog"] });

    const refresh = () => {
      const contentEl = dlg.element?.find(".dialog-content")[0] || dlg.element?.[0]?.querySelector(".dialog-content");
      if (!contentEl) return dlg.close();
      contentEl.innerHTML = renderDlg();
      bindHandlers(contentEl);
    };

    function bindHandlers(root) {
      if (!root) return;
      // Alterar nível
      root.querySelectorAll(".mcm-nivel-input").forEach(inp => {
        inp.addEventListener("change", async (ev) => {
          const idx = parseInt(ev.target.dataset.idx);
          const novo = Math.max(1, Math.min(20, parseInt(ev.target.value) || 1));
          const arr = sheet._getClassesArray();
          if (idx < 0 || idx >= arr.length) return;
          arr[idx].nivel = novo;
          const pIdx = arr.findIndex(c => c.nome === (actor.system.biografia?.classe || ""));
          await sheet._saveClassesArray(arr, Math.max(0, pIdx));
          refresh();
        });
      });
      // Remover classe
      root.querySelectorAll(".mcm-del").forEach(btn => {
        btn.addEventListener("click", async (ev) => {
          const idx = parseInt(ev.currentTarget.dataset.idx);
          const arr = sheet._getClassesArray();
          if (arr.length <= 1) {
            ui.notifications.warn("Um personagem precisa ter ao menos 1 classe. Remova só se for substituir.");
            return;
          }
          const removed = arr.splice(idx, 1)[0];
          await sheet._saveClassesArray(arr, 0);
          ui.notifications.info(`${removed.nome} removida.`);
          refresh();
        });
      });
      // Tornar principal
      root.querySelectorAll(".mcm-star").forEach(btn => {
        btn.addEventListener("click", async (ev) => {
          const idx = parseInt(ev.currentTarget.dataset.idx);
          const arr = sheet._getClassesArray();
          if (idx < 0 || idx >= arr.length) return;
          await sheet._saveClassesArray(arr, idx);
          ui.notifications.info(`${arr[idx].nome} definida como principal.`);
          refresh();
        });
      });
      // Escolher subtipo
      root.querySelectorAll(".mcm-sub-pick").forEach(btn => {
        btn.addEventListener("click", async (ev) => {
          const idx = parseInt(ev.currentTarget.dataset.idx);
          const arr = sheet._getClassesArray();
          if (idx < 0 || idx >= arr.length) return;
          const classeNome = arr[idx].nome;
          const subs = T20ActorSheet.CLASS_SUBTYPES[classeNome];
          if (!subs || !subs.length) {
            ui.notifications.info(`${classeNome} não possui subtipos.`);
            return;
          }
          // Abre o picker de subclasse inline
          sheet._openSubtypePicker(classeNome, async (subName, atrChave) => {
            const arr2 = sheet._getClassesArray();
            arr2[idx].subclasse = subName;
            const pIdx = arr2.findIndex(c => c.nome === (actor.system.biografia?.classe || ""));
            await sheet._saveClassesArray(arr2, Math.max(0, pIdx));
            if (atrChave) {
              await actor.update({ "system.magia.atributoChave": atrChave });
            }
            refresh();
          });
        });
      });
      // Adicionar nova classe
      root.querySelector(".mcm-add")?.addEventListener("click", () => {
        sheet._openClassePicker(async (pickedName, doc, autoApply) => {
          const arr = sheet._getClassesArray();
          const existing = arr.find(c => c.nome === pickedName);
          if (existing) {
            existing.nivel = Math.min(20, existing.nivel + 1);
            ui.notifications.info(`${pickedName}: nível aumentado para ${existing.nivel}`);
          } else {
            arr.push({ nome: pickedName, nivel: 1, subclasse: "" });
            // Se for a primeira classe, aplica benefícios
            if (arr.length === 1 && doc) {
              await actor.createEmbeddedDocuments("Item", [{
                name: `Classe: ${doc.name}`, type: "habilidade", img: doc.img,
                system: foundry.utils.deepClone(doc.system),
              }]);
              if (autoApply) {
                await sheet._saveClassesArray(arr, 0);
                await sheet._autoApply("classe", pickedName, actor);
                refresh();
                return;
              }
            }
          }
          await sheet._saveClassesArray(arr, 0);
          refresh();
        });
      });
    }

    dlg.render(true);
  }

  /**
   * Abre picker de classes do compêndio. Filtra variantes de Heróis de
   * Arton (que agora são subclasses, não classes). Chama callback com
   * (nome, doc, autoApplyBool) quando selecionado.
   */
  async _openClassePicker(callback) {
    const packId = T20ActorSheet.PACK_MAP.classe;
    const pack = game.packs.get(packId);
    if (!pack) { ui.notifications.warn(`Compêndio ${packId} não encontrado.`); return; }
    const allDocs = await pack.getDocuments();
    if (!allDocs.length) { ui.notifications.warn(`Compêndio ${packId} vazio.`); return; }
    // Filtra variantes
    const docs = allDocs.filter(d => !T20ActorSheet.VARIANT_NAMES.includes(d.name));
    const sorted = [...docs].sort((a,b) => a.name.localeCompare(b.name,"pt-BR"));

    const itemsHtml = sorted.map(d => {
      const info = d.system?.acao || d.system?.requisitos || "";
      return `<div class="cp-item" data-name="${d.name}" data-id="${d.id}" title="${(d.system?.descricao||"").replace(/"/g,'&quot;').substring(0,500)}">
        <img src="${d.img||'icons/svg/combat.svg'}" width="24" height="24"/>
        <span class="cp-name">${d.name}</span>
        <span class="cp-info"><span class="cp-tag">${info.substring(0,80)}</span></span>
      </div>`;
    }).join("");

    const html = `<div class="t20-compendium-picker">
      <div class="cp-search-row"><input type="text" class="cp-search" placeholder="Buscar classe..." autofocus/></div>
      <label class="cp-deduct-row"><input type="checkbox" class="cp-auto-apply" checked /> Aplicar benefícios automaticamente (só na 1ª classe)</label>
      <div class="cp-hint">Variantes (Alquimista, Atleta, Burguês…) estão no campo <b>SUB</b> das respectivas classes-base.</div>
      <div class="cp-list">${itemsHtml}</div>
    </div>`;

    const dlg = new Dialog({
      title: "Escolher Classe", content: html, buttons: {},
      render: (jq) => {
        const el = jq[0]||jq;
        el.querySelector(".cp-search")?.addEventListener("input", (e) => {
          const q = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
          el.querySelectorAll(".cp-item").forEach(row => {
            row.style.display = row.dataset.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").includes(q)?"":"none";
          });
        });
        el.querySelectorAll(".cp-item").forEach(row => {
          row.addEventListener("click", async () => {
            const name = row.dataset.name;
            const doc = sorted.find(d=>d.id===row.dataset.id);
            const autoApply = el.querySelector(".cp-auto-apply")?.checked ?? false;
            dlg.close();
            callback(name, doc, autoApply);
          });
        });
      },
      close:()=>{},
    }, { width:520, height:560, resizable:true, classes:["t20-picker-dialog"] });
    dlg.render(true);
  }

  /**
   * Abre picker de subtipo pra uma classe específica. Chama callback
   * com (subName, atrChave) quando selecionado.
   */
  _openSubtypePicker(classeNome, callback) {
    const subs = T20ActorSheet.CLASS_SUBTYPES[classeNome];
    if (!subs || !subs.length) {
      ui.notifications.info(`${classeNome} não possui subtipos.`);
      return;
    }
    const cardsHtml = subs.map(s => `
      <div class="sub-card ${s.variante ? 'sub-card-variante' : ''}" data-name="${s.nome}" data-atr="${s.atrChave || ""}">
        <div class="sub-card-icon"><i class="${s.icon || 'fas fa-star'}"></i></div>
        <div class="sub-card-body">
          <div class="sub-card-name">${s.nome}${s.variante ? ' <span class="sub-variante-badge">VARIANTE</span>' : ''}</div>
          <div class="sub-card-desc">${s.desc}</div>
        </div>
      </div>`).join("");

    const dlg = new Dialog({
      title: `Subtipo de ${classeNome}`,
      content: `<div class="t20-subclass-picker"><div class="sub-title">Escolha o caminho de ${classeNome}</div>${cardsHtml}</div>`,
      buttons: {},
      render: (jq) => {
        const el = jq[0]||jq;
        el.querySelectorAll(".sub-card").forEach(card => {
          card.addEventListener("click", async () => {
            const name = card.dataset.name;
            const atr = card.dataset.atr;
            dlg.close();
            callback(name, atr || null);
          });
        });
      },
      close:()=>{},
    }, {width:480, height:"auto", classes:["t20-picker-dialog","t20-subclass-dialog"]});
    dlg.render(true);
  }
}
