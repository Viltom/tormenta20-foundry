// ========================================================
// T20 NPC Sheet — Statblock automatizado
// Baseado na estrutura do T20ActorSheet mas com layout compacto
// ========================================================

import { parseStatblock } from "../statblock-parser.mjs";
import { rollT20Initiative } from "../combat.mjs";

export class T20NpcSheet extends ActorSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["tormenta20", "sheet", "actor", "npc"],
      template: "systems/tormenta20/templates/actor/npc-sheet.hbs",
      width: 620,
      height: 780,
      tabs: [{ navSelector: ".npc-tabs", contentSelector: ".npc-body", initial: "stats" }],
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }],
    });
  }

  static PACK_MAP = {
    arma: "tormenta20.armas", armadura: "tormenta20.armaduras",
    magia: "tormenta20.magias", poder: "tormenta20.poderes",
    equipamento: "tormenta20.itens",
  };

  // Tamanhos e tipos válidos para select
  static SIZES = ["Minúsculo", "Diminuto", "Pequeno", "Médio", "Grande", "Enorme", "Colossal"];
  static TIPOS = [
    "Humanoide", "Animal", "Construto", "Espírito", "Fada", "Monstro",
    "Morto-Vivo", "Extraplanar", "Monstruosidade", "Lefou", "Dragão", "Gigante", "Humano"
  ];
  static NDS = ["1/4", "1/2", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];

  // XP por ND (tabela T20 Jogo do Ano, p.246)
  static XP_BY_ND = {
    "1/4": 100, "1/2": 200, "1": 400, "2": 600, "3": 800, "4": 1200,
    "5": 1600, "6": 2400, "7": 3200, "8": 4800, "9": 6400, "10": 9600,
    "11": 12800, "12": 19200, "13": 25600, "14": 38400, "15": 51200,
    "16": 76800, "17": 102400, "18": 153600, "19": 204800, "20": 307200,
  };

  /** @override */
  getData() {
    const context = super.getData();
    const a = this.actor;
    context.actor = a;
    context.system = a.system;
    context.flags = a.flags;

    // Items embedded
    context.armas = a.items.filter(i => i.type === "arma");
    context.armaduras = a.items.filter(i => i.type === "armadura");
    context.poderes = a.items.filter(i => i.type === "poder");
    context.habilidades = a.items.filter(i => i.type === "habilidade");
    context.magias = a.items.filter(i => i.type === "magia");
    context.equipamentos = a.items.filter(i => i.type === "equipamento");

    // Magias organizadas por círculo (mesmo padrão do personagem)
    context.magiasPorCirculo = [1, 2, 3, 4, 5].map(c => ({
      circulo: c,
      magias: context.magias.filter(m => m.system.circulo === c),
    })).filter(c => c.magias.length > 0);

    // Opções de select
    context.SIZES = T20NpcSheet.SIZES;
    context.TIPOS = T20NpcSheet.TIPOS;
    context.NDS = T20NpcSheet.NDS;

    // Perícias visíveis (apenas as marcadas como 'mostrar' OU treinadas OU com bônus)
    context.periciasVisiveis = Object.entries(a.system.pericias)
      .filter(([_, p]) => p.mostrar || p.treinada || (p.bonus && p.bonus !== 0))
      .map(([key, p]) => ({ key, ...p, label: this._periciaLabel(key) }));

    // Todas as perícias para o toggle de edição
    context.todasPericias = Object.entries(a.system.pericias)
      .map(([key, p]) => ({ key, ...p, label: this._periciaLabel(key) }));

    // Resistências (lista livre)
    context.resistencias = a.system.resistenciasList || [];

    // XP sugerido pelo ND
    context.xpSugerido = T20NpcSheet.XP_BY_ND[String(a.system.nd ?? "1")] ?? 0;

    return context;
  }

  _periciaLabel(key) {
    const L = {
      acrobacia: "Acrobacia", adestramento: "Adestramento", atletismo: "Atletismo",
      atuacao: "Atuação", cavalgar: "Cavalgar", conhecimento: "Conhecimento",
      cura: "Cura", diplomacia: "Diplomacia", enganacao: "Enganação",
      fortitude: "Fortitude", furtividade: "Furtividade", guerra: "Guerra",
      iniciativa: "Iniciativa", intimidacao: "Intimidação", intuicao: "Intuição",
      investigacao: "Investigação", jogatina: "Jogatina", ladinagem: "Ladinagem",
      luta: "Luta", misticismo: "Misticismo", nobreza: "Nobreza",
      oficio: "Ofício", percepcao: "Percepção", pilotagem: "Pilotagem",
      pontaria: "Pontaria", reflexos: "Reflexos", religiao: "Religião",
      sobrevivencia: "Sobrevivência", vontade: "Vontade",
    };
    return L[key] || key;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    html.find(".roll-atributo").click(this._onRollAtributo.bind(this));
    html.find(".roll-pericia").click(this._onRollPericia.bind(this));
    html.find(".roll-iniciativa").click(this._onRollIniciativa.bind(this));
    html.find(".roll-arma").click(this._onRollArma.bind(this));
    html.find(".item-use").click(this._onItemUse.bind(this));
    html.find(".item-equip").click(this._onToggleEquip.bind(this));
    html.find(".item-create").click(this._onItemCreate.bind(this));
    html.find(".natural-attack-create").click(this._onNaturalAttackCreate.bind(this));
    html.find(".item-clone").click(this._onItemClone.bind(this));
    html.find(".statblock-import-btn").click(this._onStatblockImport.bind(this));
    // Preview inline: clicar no nome do item mostra/esconde descrição
    html.find(".item-name-toggle").click(this._onTogglePreview.bind(this));
    html.find(".item-edit").click(ev => {
      const item = this.actor.items.get($(ev.currentTarget).closest(".item").data("itemId"));
      if (item) item.sheet.render(true);
    });
    html.find(".item-delete").click(ev => {
      const li = $(ev.currentTarget).closest(".item");
      const item = this.actor.items.get(li.data("itemId"));
      if (item) { item.delete(); li.slideUp(200, () => this.render(false)); }
    });

    // Pericia mostrar/ocultar
    html.find(".pericia-toggle-btn").click(this._onToggleSkillsEditor.bind(this));
    html.find(".pericia-mostrar").change(this._onToggleSkillVisibility.bind(this));

    // Atalho: aplicar XP sugerido pelo ND
    html.find(".xp-auto-btn").click(this._onApplyXP.bind(this));

    // Resistências
    html.find(".sb-res-add").click(this._onResistanceAdd.bind(this));
    html.find(".res-remove").click(this._onResistanceRemove.bind(this));

    // Auto-preenche ND a partir do PV/atributos (botão auxiliar)
    html.find(".npc-autofill-hp-btn").click(this._onAutofillHP.bind(this));
  }

  // ================================================================
  //  ROLAGENS BÁSICAS
  // ================================================================
  async _onRollAtributo(event) {
    event.preventDefault();
    const key = event.currentTarget.dataset.atributo;
    const mod = this.actor.system.atributos[key]?.total ?? 0;
    const g = this.actor.system.global?.rolagem || 0;
    const roll = new Roll("1d20+@mod+@g", { mod, g });
    await roll.evaluate();
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<strong>Teste de ${key.toUpperCase()}</strong> (${mod + g >= 0 ? "+" : ""}${mod + g})`,
    });
  }

  async _onRollPericia(event) {
    event.preventDefault();
    const key = event.currentTarget.dataset.pericia;
    const p = this.actor.system.pericias[key];
    const t = p?.total ?? 0;
    const roll = new Roll("1d20+@t", { t });
    await roll.evaluate();
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<strong>${this._periciaLabel(key)}${p?.treinada ? " ★" : ""}</strong> (${t >= 0 ? "+" : ""}${t})`,
    });
  }

  async _onRollIniciativa(event) {
    event.preventDefault();
    // Integra com Combat Tracker quando NPC está em combate; senão, vai pro chat.
    return rollT20Initiative(this.actor);
  }

  // ================================================================
  //  ATAQUE + DANO (NPC — modos statblock, natural e múltiplo)
  // ================================================================
  async _onRollArma(event) {
    event.preventDefault();
    const item = this.actor.items.get($(event.currentTarget).closest(".item").data("itemId"));
    if (!item) return;
    const sys = item.system;
    const atr = this.actor.system.atributos;

    // ── MODO STATBLOCK (ataque natural ou toggle explícito) ──
    // Quando `ataqueNatural` é true, o bônus de ataque do item JÁ é o total
    // final do statblock (ex: "+7") — não somamos luta/pontaria/atributo.
    // O dano também costuma vir completo ("1d6+3"), então por padrão não
    // somamos o modificador de Força quando `ignoraAtributoDano` é true.
    const modoStatblock = !!sys.ataqueNatural;

    const isMelee = !sys.alcance || sys.alcance === "";
    const periKey = isMelee ? "luta" : "pontaria";
    const periLabel = isMelee ? "Luta" : "Pontaria";
    const totalPeri = this.actor.system.pericias[periKey]?.total ?? 0;

    // Melhorias de arma
    let mAtk = 0, mDmg = 0, mCritRange = 0, mCritMult = 0;
    const mNotes = [];
    if (sys.mCerteira)  { mAtk += 1; mNotes.push("Certeira +1atk"); }
    if (sys.mPungente)  { mAtk += 2; mNotes.push("Pungente +2atk"); }
    if (sys.mCruel)     { mDmg += 1; mNotes.push("Cruel +1dano"); }
    if (sys.mAtroz)     { mDmg += 2; mNotes.push("Atroz +2dano"); }
    if (sys.mMacica)    { mCritMult += 1; mNotes.push("Maciça +1×crit"); }
    if (sys.mPrecisa)   { mCritRange += 1; mNotes.push("Precisa +1 ameaça"); }

    const bAtkItem = (sys.bonusAtaque || 0) + mAtk;
    const bAtkGlobal = this.actor.system.global?.ataque || 0;

    // Bônus de ataque total:
    //  - Statblock: usa apenas bonusAtaque + globais/melhorias (bônus já é final)
    //  - Normal:    usa perícia + atributo (via perícia) + bonusAtaque
    const totalAtk = modoStatblock
      ? bAtkItem + bAtkGlobal
      : totalPeri + bAtkItem + bAtkGlobal;

    // Crítico
    const critStr = sys.critico || "20/x2";
    const cm = critStr.match(/(\d+)\/?x?(\d+)?/);
    const critRange = (cm ? parseInt(cm[1]) : 20) - mCritRange;
    const critMult = (cm && cm[2] ? parseInt(cm[2]) : 2) + mCritMult;

    // Dano
    const modFor = atr.for?.total ?? 0;
    const bDmgItem = (sys.bonusDano || 0) + mDmg;
    const bDmgGlobal = this.actor.system.global?.dano || 0;
    const danoBase = (sys.dano || "1d4").split("/")[0].trim();
    const somaAtributo = (modoStatblock || sys.ignoraAtributoDano) ? 0 : modFor;

    // ── Quantos ataques rolar? ──
    const numAtk = Math.max(1, parseInt(sys.numAtaques) || 1);
    const penalPorAtk = parseInt(sys.penalidadeMultiplos) || 0;

    // ── Card do chat ──
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

      const danoRoll = new Roll(`${danoBase} + @mod + @bonus`, {
        mod: somaAtributo,
        bonus: bDmgItem + bDmgGlobal,
      });
      await danoRoll.evaluate();
      const danoCrit = isCrit ? danoRoll.total * critMult : 0;

      // Sub-header para múltiplos ataques
      if (numAtk > 1) {
        c += `<div class="t20cc-multi-hdr">Ataque ${i + 1}${penal ? ` (${penal > 0 ? "+" : ""}${penal})` : ""}</div>`;
      }
      const periBadge = modoStatblock ? "Ataque" : periLabel;
      c += `<div class="t20cc-row"><span class="t20cc-label">${periBadge}</span><span class="t20cc-roll">${d20}</span><span class="t20cc-total">Total: <b>${atkRoll.total}</b></span></div>`;
      if (isCrit) c += `<div class="t20cc-crit">CRÍTICO! (×${critMult})</div>`;
      if (isFumble) c += `<div class="t20cc-fumble">FALHA CRÍTICA</div>`;
      c += `<div class="t20cc-row"><span class="t20cc-label">Dano</span><span class="t20cc-dmg">${danoRoll.total}</span><span class="t20cc-dtype">${sys.tipo || ""}</span></div>`;
      const partsFormula = [danoBase];
      if (somaAtributo) partsFormula.push(`${somaAtributo} For`);
      if (bDmgItem + bDmgGlobal) partsFormula.push(`${bDmgItem + bDmgGlobal} bônus`);
      c += `<div class="t20cc-formula">${partsFormula.join(" + ")}</div>`;
      if (isCrit) c += `<div class="t20cc-row t20cc-critrow"><span class="t20cc-label">Dano Crit</span><span class="t20cc-dmg t20cc-critdmg">${danoCrit}</span></div>`;

      // Divisor entre ataques (exceto o último)
      if (i < numAtk - 1) c += `<div class="t20cc-divider t20cc-divider-sub"></div>`;
    }

    if (mNotes.length) c += `<div class="t20cc-formula" style="color:#c7a16b">${mNotes.join(" · ")}</div>`;
    c += `</div>`;

    ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: this.actor }), content: c });
  }

  // ================================================================
  //  USAR PODER / HABILIDADE / MAGIA (posta card no chat)
  // ================================================================
  async _onItemUse(event) {
    event.preventDefault();
    const item = this.actor.items.get($(event.currentTarget).closest(".item").data("itemId"));
    if (!item) return;

    const sys = item.system;
    const isMagia = item.type === "magia";
    const cd = this.actor.system.defesa.cd || 10;

    let c = `<div class="t20-combat-card">`;
    c += `<div class="t20cc-header">${isMagia ? "✦" : "◆"} ${item.name}</div>`;
    if (sys.custoPM) c += `<div class="t20cc-detail"><b>Custo:</b> ${sys.custoPM} PM</div>`;
    if (isMagia) {
      if (sys.circulo) c += `<div class="t20cc-detail"><b>Círculo:</b> ${sys.circulo}° — ${sys.tipo || ""} ${sys.escola ? `(${sys.escola})` : ""}</div>`;
      if (sys.execucao) c += `<div class="t20cc-detail"><b>Execução:</b> ${sys.execucao}</div>`;
      if (sys.alcance) c += `<div class="t20cc-detail"><b>Alcance:</b> ${sys.alcance}</div>`;
      if (sys.duracao) c += `<div class="t20cc-detail"><b>Duração:</b> ${sys.duracao}</div>`;
      if (sys.resistencia) c += `<div class="t20cc-detail"><b>Resistência:</b> ${sys.resistencia} — CD ${cd}</div>`;
    } else {
      if (sys.tipo) c += `<div class="t20cc-detail"><b>Tipo:</b> ${sys.tipo}</div>`;
      if (sys.acao) c += `<div class="t20cc-detail"><b>Ação:</b> ${sys.acao}</div>`;
    }
    if (sys.descricao) {
      const d = sys.descricao.length > 600 ? sys.descricao.substring(0, 600) + "..." : sys.descricao;
      c += `<div class="t20cc-desc">${d}</div>`;
    }

    // Botão de dano para magia (aproveita infra existente do renderChatMessage)
    if (isMagia && sys.dano) {
      const bonusDanoGlobal = this.actor.system.global?.dano || 0;
      c += `<div class="t20cc-divider"></div>`;
      c += `<button class="t20-spell-dmg-btn" data-dano="${sys.dano}" data-tipo-dano="${sys.tipoDano || ""}" data-spell="${item.name}" data-actor-id="${this.actor.id}" data-bonus-dano="${bonusDanoGlobal}">🔥 Rolar Dano (${sys.dano})</button>`;
    }

    c += `</div>`;
    ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: this.actor }), content: c });
  }

  // ================================================================
  //  EQUIPAR ITEM
  // ================================================================
  async _onToggleEquip(event) {
    event.preventDefault(); event.stopPropagation();
    const item = this.actor.items.get($(event.currentTarget).closest(".item").data("itemId"));
    if (item) await item.update({ "system.equipada": !item.system.equipada });
  }

  // ================================================================
  //  CRIAR ITEM (via picker de compêndio, igual ao personagem)
  // ================================================================
  async _onItemCreate(event) {
    event.preventDefault();
    const el = event.currentTarget;
    const type = el.dataset.type;
    const circle = el.dataset.circle ? parseInt(el.dataset.circle) : null;

    const packId = T20NpcSheet.PACK_MAP[type];
    if (!packId) return this._createBlankItem(type);

    const pack = game.packs.get(packId);
    if (!pack) return this._createBlankItem(type);

    let documents = await pack.getDocuments();
    if (!documents.length) return this._createBlankItem(type);
    if (circle) documents = documents.filter(d => d.system.circulo === circle);

    this._renderPicker(type, documents, circle);
  }

  async _createBlankItem(type) {
    const n = { arma: "Novo Ataque", armadura: "Nova Armadura", poder: "Nova Ação", magia: "Nova Magia", equipamento: "Novo Equipamento", habilidade: "Nova Habilidade" };
    const created = await this.actor.createEmbeddedDocuments("Item", [{ name: n[type] || "Novo Item", type, system: {} }]);
    if (created?.[0]) created[0].sheet.render(true);
  }

  // ================================================================
  //  ATAQUE NATURAL — Dialog rápido para criar garra/mordida/cauda/etc.
  //  Cria um item tipo `arma` já configurado em modo statblock
  // ================================================================
  async _onNaturalAttackCreate(event) {
    event.preventDefault();
    const actor = this.actor;

    // Presets T20 mais comuns (tamanho Médio de referência)
    const PRESETS = [
      { nome: "Mordida",        dano: "1d6", critico: "20/x2", tipo: "perfuração" },
      { nome: "Garra",          dano: "1d4", critico: "20/x2", tipo: "corte" },
      { nome: "Cauda",          dano: "1d6", critico: "20/x2", tipo: "impacto" },
      { nome: "Chifre",         dano: "1d6", critico: "20/x2", tipo: "perfuração" },
      { nome: "Marrada",        dano: "1d8", critico: "20/x2", tipo: "impacto" },
      { nome: "Casco/Coice",    dano: "1d4", critico: "20/x2", tipo: "impacto" },
      { nome: "Tentáculo",      dano: "1d4", critico: "20/x2", tipo: "impacto" },
      { nome: "Pata/Golpe",     dano: "1d6", critico: "20/x2", tipo: "impacto" },
      { nome: "Ferrão",         dano: "1d4", critico: "19/x2", tipo: "perfuração" },
      { nome: "Sopro",          dano: "2d6", critico: "20/x2", tipo: "fogo" },
    ];

    const presetOptions = PRESETS.map((p, i) =>
      `<option value="${i}">${p.nome} (${p.dano}, ${p.tipo})</option>`
    ).join("");

    const html = `
      <div class="t20-natural-dialog">
        <div class="nad-preset-row">
          <label>Preset</label>
          <select class="nad-preset">
            <option value="">— personalizado —</option>
            ${presetOptions}
          </select>
        </div>
        <div class="nad-grid">
          <label>Nome</label>
          <input type="text" class="nad-nome" placeholder="Ex: Mordida, Garra..." autofocus />

          <label>Bônus de Ataque</label>
          <input type="number" class="nad-bonus-atk" value="0" title="Número final já calculado do statblock" />

          <label>Dano</label>
          <input type="text" class="nad-dano" value="1d6" placeholder="Ex: 1d6, 2d8+3" />

          <label>Bônus de Dano</label>
          <input type="number" class="nad-bonus-dano" value="0" title="Soma fixa ao dano (além do que está na fórmula)" />

          <label>Tipo de Dano</label>
          <input type="text" class="nad-tipo" value="impacto" placeholder="corte, impacto, perfuração, fogo..." />

          <label>Crítico</label>
          <input type="text" class="nad-critico" value="20/x2" placeholder="Ex: 20/x2, 19/x3" />

          <label>Alcance</label>
          <select class="nad-alcance">
            <option value="">Corpo-a-corpo (Luta)</option>
            <option value="curto">Curto (Pontaria)</option>
            <option value="médio">Médio (Pontaria)</option>
            <option value="longo">Longo (Pontaria)</option>
          </select>

          <label>Nº de Ataques</label>
          <input type="number" class="nad-num" value="1" min="1" max="10" title="Quantos desta arma por uso (ex: 2 garras)" />

          <label>Penalidade por Ataque Extra</label>
          <input type="number" class="nad-penal" value="0" title="T20 padrão: 0 (ataques naturais); -2 ou -5 para múltiplos com arma" />
        </div>
        <div class="nad-hint">
          <i class="fas fa-info-circle"></i>
          Ataques naturais usam o <b>bônus de ataque direto</b> do statblock (não calculam Luta/Pontaria + atributo).
          O dano da fórmula é usado tal como está — adicione o mod de Força direto na fórmula se quiser
          (ex: <code>1d6+3</code>) ou use o campo Bônus de Dano.
        </div>
      </div>
    `;

    new Dialog({
      title: "Novo Ataque Natural",
      content: html,
      buttons: {
        criar: {
          icon: '<i class="fas fa-check"></i>',
          label: "Criar",
          callback: async (jq) => {
            const el = jq[0] || jq;
            const nome = el.querySelector(".nad-nome").value.trim() || "Ataque Natural";
            const bonusAtaque = parseInt(el.querySelector(".nad-bonus-atk").value) || 0;
            const dano = el.querySelector(".nad-dano").value.trim() || "1d4";
            const bonusDano = parseInt(el.querySelector(".nad-bonus-dano").value) || 0;
            const tipoDano = el.querySelector(".nad-tipo").value.trim();
            const critico = el.querySelector(".nad-critico").value.trim() || "20/x2";
            const alcance = el.querySelector(".nad-alcance").value;
            const numAtaques = Math.max(1, parseInt(el.querySelector(".nad-num").value) || 1);
            const penalidade = parseInt(el.querySelector(".nad-penal").value) || 0;

            await actor.createEmbeddedDocuments("Item", [{
              name: nome,
              type: "arma",
              img: "icons/svg/claws.svg",
              system: {
                dano, critico, alcance,
                tipo: tipoDano,
                grupo: "Natural",
                bonusAtaque, bonusDano,
                ataqueNatural: true,
                ignoraAtributoDano: true,  // dano do statblock já contém For
                numAtaques,
                penalidadeMultiplos: penalidade,
                equipada: true,
              },
            }]);
            ui.notifications.info(`${nome} criado${numAtaques > 1 ? ` (×${numAtaques})` : ""}.`);
          },
        },
        cancelar: { icon: '<i class="fas fa-xmark"></i>', label: "Cancelar" },
      },
      default: "criar",
      render: (jq) => {
        const el = jq[0] || jq;
        // Preset fill
        el.querySelector(".nad-preset")?.addEventListener("change", (ev) => {
          const idx = ev.target.value;
          if (idx === "") return;
          const p = PRESETS[parseInt(idx)];
          if (!p) return;
          el.querySelector(".nad-nome").value = p.nome;
          el.querySelector(".nad-dano").value = p.dano;
          el.querySelector(".nad-tipo").value = p.tipo;
          el.querySelector(".nad-critico").value = p.critico;
        });
      },
    }, { width: 460, height: "auto", classes: ["t20-picker-dialog"] }).render(true);
  }

  // ================================================================
  //  CLONAR item (útil para "Mordida ×2, Garras ×2, Cauda ×1")
  // ================================================================
  async _onItemClone(event) {
    event.preventDefault();
    event.stopPropagation();
    const item = this.actor.items.get($(event.currentTarget).closest(".item").data("itemId"));
    if (!item) return;
    const data = item.toObject();
    delete data._id;
    data.name = `${data.name} (cópia)`;
    await this.actor.createEmbeddedDocuments("Item", [data]);
    ui.notifications.info(`${item.name} clonado.`);
  }

  _renderPicker(type, documents, circle) {
    const actor = this.actor;
    const labels = { arma: "Ataque", armadura: "Armadura", magia: "Magia", poder: "Ação", equipamento: "Equipamento", habilidade: "Habilidade" };
    const label = labels[type] + (circle ? ` ${circle}°` : "");

    const sorted = [...documents].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    const infoFn = {
      arma: d => `<span class="cp-tag">${d.system.dano || "—"}</span><span class="cp-tag">${d.system.tipo || ""}</span>`,
      armadura: d => `<span class="cp-tag">+${d.system.defesa}</span><span class="cp-tag">${d.system.tipo || ""}</span>`,
      magia: d => {
        const tc = { "arcana": "cp-arc", "divina": "cp-div", "universal": "cp-uni" }[d.system.tipo] || "";
        return `<span class="cp-tag cp-circ">${d.system.circulo}°</span><span class="cp-tag ${tc}">${d.system.tipo || ""}</span>`;
      },
      poder: d => `<span class="cp-tag">${d.system.tipo || ""}</span>`,
      equipamento: d => `<span class="cp-tag">${d.system.categoria || ""}</span>`,
    };
    const getInfo = infoFn[type] || (() => "");

    const itemsHtml = sorted.map(d => `
      <div class="cp-item" data-id="${d.id}" data-name="${d.name}" title="${(d.system.descricao || "").replace(/"/g, "&quot;").substring(0, 500)}">
        <img src="${d.img || 'icons/svg/mystery-man.svg'}" width="24" height="24"/>
        <span class="cp-name">${d.name}</span>
        <span class="cp-info">${getInfo(d)}</span>
      </div>`).join("");

    const html = `<div class="t20-compendium-picker">
      <div class="cp-search-row"><input type="text" class="cp-search" placeholder="Buscar ${label.toLowerCase()}..." autofocus/></div>
      <div class="cp-list">${itemsHtml}</div>
      <button class="cp-blank-btn" type="button">+ Criar em branco</button>
    </div>`;

    const dlg = new Dialog({
      title: `Escolher ${label}`, content: html, buttons: {},
      render: (jq) => {
        const el = jq[0] || jq;
        el.querySelector(".cp-search")?.addEventListener("input", (e) => {
          const q = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          el.querySelectorAll(".cp-item").forEach(row => {
            row.style.display = row.dataset.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q) ? "" : "none";
          });
        });

        el.querySelectorAll(".cp-item").forEach(row => {
          row.addEventListener("click", async () => {
            const doc = sorted.find(d => d.id === row.dataset.id);
            if (!doc) return;
            await actor.createEmbeddedDocuments("Item", [{
              name: doc.name, type: doc.type, img: doc.img,
              system: foundry.utils.deepClone(doc.system),
            }]);
            ui.notifications.info(`${doc.name} adicionado!`);
            row.style.opacity = "0.35";
            row.style.pointerEvents = "none";
          });
        });

        el.querySelector(".cp-blank-btn")?.addEventListener("click", () => {
          dlg.close(); this._createBlankItem(type);
        });
      },
      close: () => {},
    }, { width: 560, height: 620, resizable: true, classes: ["t20-picker-dialog"] });
    dlg.render(true);
  }

  // ================================================================
  //  PERÍCIAS — Toggle editor de visibilidade
  // ================================================================
  _onToggleSkillsEditor(event) {
    event.preventDefault();
    const panel = this.element.find(".pericia-editor");
    panel.toggleClass("open");
  }

  async _onToggleSkillVisibility(event) {
    const key = event.currentTarget.dataset.pericia;
    const checked = event.currentTarget.checked;
    await this.actor.update({ [`system.pericias.${key}.mostrar`]: checked });
  }

  // ================================================================
  //  XP — Aplica automaticamente pelo ND
  // ================================================================
  async _onApplyXP(event) {
    event.preventDefault();
    const nd = String(this.actor.system.nd ?? "1");
    const xp = T20NpcSheet.XP_BY_ND[nd];
    if (xp === undefined) {
      ui.notifications.warn(`ND inválido: ${nd}`);
      return;
    }
    await this.actor.update({ "system.xp": xp });
    ui.notifications.info(`XP definido para ${xp} (ND ${nd}).`);
  }

  // ================================================================
  //  AUTO-PV pelo PV máx atual (ajusta "current" = "max")
  // ================================================================
  async _onAutofillHP(event) {
    event.preventDefault();
    const max = this.actor.system.pv.max;
    if (!max) {
      ui.notifications.warn("Preencha o PV máximo primeiro.");
      return;
    }
    await this.actor.update({ "system.pv.value": max, "system.pm.value": this.actor.system.pm.max || 0 });
    ui.notifications.info("PV/PM restaurados ao máximo.");
  }

  // ================================================================
  //  RESISTÊNCIAS (reaproveita o picker do personagem)
  // ================================================================
  static RESISTANCE_OPTIONS = [
    { cat: "Resistência Elemental", items: [
      "Resistência a ácido 5", "Resistência a ácido 10", "Resistência a eletricidade 5", "Resistência a eletricidade 10",
      "Resistência a fogo 5", "Resistência a fogo 10", "Resistência a frio 5", "Resistência a frio 10",
      "Resistência a luz 5", "Resistência a luz 10", "Resistência a trevas 5", "Resistência a trevas 10",
      "Resistência a sônico 5", "Resistência a essência 5",
    ]},
    { cat: "Redução de Dano", items: [
      "RD 2", "RD 5", "RD 10", "RD 2 (exceto magia)", "RD 5 (exceto magia)",
      "RD 2 (exceto adamante)", "RD 5 (exceto prata alquímica)",
    ]},
    { cat: "Imunidade", items: [
      "Imune a veneno", "Imune a doença", "Imune a medo", "Imune a encantamento",
      "Imune a fadiga", "Imune a sono", "Imune a atordoamento", "Imune a paralisia",
      "Imune a fogo", "Imune a frio", "Imune a eletricidade", "Imune a ácido",
      "Imune a dano não-letal", "Imune a críticos",
    ]},
    { cat: "Sentidos", items: [
      "Visão no escuro", "Visão na penumbra", "Faro", "Percepção às cegas (curto)",
      "Percepção às cegas (médio)", "Percepção por vibração",
    ]},
    { cat: "Outros", items: [
      "Cura acelerada 2", "Cura acelerada 5", "Regeneração 5",
      "Resistência a magia +2", "Resistência a magia +5",
      "Voo 9m", "Voo 12m", "Voo 18m", "Natação 9m",
      "Telepatia (curto)", "Telepatia (médio)",
    ]},
  ];

  async _onResistanceAdd(event) {
    event.preventDefault();
    const actor = this.actor;
    const current = actor.system.resistenciasList || [];

    let html = `<div class="t20-res-picker">`;
    html += `<div class="rp-search-row"><input type="text" class="rp-search" placeholder="Buscar ou digitar..." autofocus/></div>`;
    for (const cat of T20NpcSheet.RESISTANCE_OPTIONS) {
      html += `<div class="rp-cat">${cat.cat}</div>`;
      for (const item of cat.items) {
        const has = current.includes(item);
        html += `<div class="rp-item ${has ? 'rp-has' : ''}" data-name="${item}"><span>${item}</span>${has ? '<i class="fas fa-check"></i>' : ''}</div>`;
      }
    }
    html += `</div>`;

    const dlg = new Dialog({
      title: "Adicionar Resistência", content: html, buttons: {},
      render: (jq) => {
        const el = jq[0] || jq;
        el.querySelector(".rp-search")?.addEventListener("input", (e) => {
          const q = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          el.querySelectorAll(".rp-item").forEach(row => {
            row.style.display = row.dataset.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q) ? "" : "none";
          });
        });
        el.querySelectorAll(".rp-item:not(.rp-has)").forEach(row => {
          row.addEventListener("click", async () => {
            const name = row.dataset.name;
            const list = [...(actor.system.resistenciasList || []), name];
            await actor.update({ "system.resistenciasList": list });
            ui.notifications.info(`Adicionado: ${name}`);
            dlg.close();
          });
        });
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
  //  PREVIEW INLINE — mostra/esconde descrição do item sem abrir sheet
  // ================================================================
  _onTogglePreview(event) {
    event.preventDefault();
    event.stopPropagation();
    const itemEl = $(event.currentTarget).closest(".item");
    const itemId = itemEl.data("itemId");
    const item = this.actor.items.get(itemId);
    if (!item) return;
    const preview = itemEl.next(".item-preview");
    if (preview.length) {
      preview.slideToggle(160);
      return;
    }
    // Lazy-render o preview na primeira vez
    const sys = item.system;
    let html = `<div class="item-preview" data-for="${itemId}">`;
    html += `<div class="ip-header">`;
    html += `<img src="${item.img}" class="ip-img"/>`;
    html += `<div class="ip-title">${item.name}</div>`;
    html += `<a class="ip-close" title="Fechar"><i class="fas fa-xmark"></i></a>`;
    html += `</div>`;

    // Metadados por tipo
    html += `<div class="ip-meta">`;
    if (item.type === "arma") {
      if (sys.dano) html += `<span class="ip-tag"><b>Dano:</b> ${sys.dano}</span>`;
      if (sys.critico && sys.critico !== "20/x2") html += `<span class="ip-tag"><b>Crítico:</b> ${sys.critico}</span>`;
      if (sys.tipo) html += `<span class="ip-tag"><b>Tipo:</b> ${sys.tipo}</span>`;
      if (sys.alcance) html += `<span class="ip-tag"><b>Alcance:</b> ${sys.alcance}</span>`;
      if (sys.grupo) html += `<span class="ip-tag"><b>Grupo:</b> ${sys.grupo}</span>`;
      if (sys.ataqueNatural) html += `<span class="ip-tag ip-tag--red">Ataque Natural</span>`;
      if (sys.numAtaques > 1) html += `<span class="ip-tag ip-tag--red">×${sys.numAtaques}</span>`;
      if (sys.bonusAtaque) html += `<span class="ip-tag"><b>Bônus Atk:</b> ${sys.bonusAtaque >= 0 ? "+" : ""}${sys.bonusAtaque}</span>`;
      if (sys.bonusDano) html += `<span class="ip-tag"><b>Bônus Dano:</b> ${sys.bonusDano >= 0 ? "+" : ""}${sys.bonusDano}</span>`;
    } else if (item.type === "armadura") {
      if (sys.defesa) html += `<span class="ip-tag"><b>Defesa:</b> +${sys.defesa}</span>`;
      if (sys.penalidade) html += `<span class="ip-tag"><b>Penalidade:</b> ${sys.penalidade}</span>`;
      if (sys.tipo) html += `<span class="ip-tag"><b>Tipo:</b> ${sys.tipo}</span>`;
    } else if (item.type === "magia") {
      if (sys.circulo) html += `<span class="ip-tag ip-tag--circ">${sys.circulo}° círculo</span>`;
      if (sys.tipo) html += `<span class="ip-tag"><b>Tipo:</b> ${sys.tipo}</span>`;
      if (sys.escola) html += `<span class="ip-tag"><b>Escola:</b> ${sys.escola}</span>`;
      if (sys.execucao) html += `<span class="ip-tag"><b>Execução:</b> ${sys.execucao}</span>`;
      if (sys.alcance) html += `<span class="ip-tag"><b>Alcance:</b> ${sys.alcance}</span>`;
      if (sys.alvo) html += `<span class="ip-tag"><b>Alvo:</b> ${sys.alvo}</span>`;
      if (sys.area) html += `<span class="ip-tag"><b>Área:</b> ${sys.area}</span>`;
      if (sys.duracao) html += `<span class="ip-tag"><b>Duração:</b> ${sys.duracao}</span>`;
      if (sys.resistencia) html += `<span class="ip-tag"><b>Resist.:</b> ${sys.resistencia}</span>`;
      if (sys.custoPM) html += `<span class="ip-tag ip-tag--red"><b>${sys.custoPM} PM</b></span>`;
      if (sys.dano) html += `<span class="ip-tag"><b>Dano:</b> ${sys.dano}${sys.tipoDano ? ` (${sys.tipoDano})` : ""}</span>`;
    } else if (item.type === "poder") {
      if (sys.tipo) html += `<span class="ip-tag"><b>Tipo:</b> ${sys.tipo}</span>`;
      if (sys.requisitos) html += `<span class="ip-tag"><b>Requisitos:</b> ${sys.requisitos}</span>`;
      if (sys.acao) html += `<span class="ip-tag"><b>Ação:</b> ${sys.acao}</span>`;
      if (sys.custoPM) html += `<span class="ip-tag ip-tag--red"><b>${sys.custoPM} PM</b></span>`;
    } else if (item.type === "habilidade") {
      if (sys.tipo) html += `<span class="ip-tag"><b>Tipo:</b> ${sys.tipo}</span>`;
      if (sys.fonte) html += `<span class="ip-tag"><b>Fonte:</b> ${sys.fonte}</span>`;
    } else if (item.type === "equipamento") {
      if (sys.categoria) html += `<span class="ip-tag"><b>Cat.:</b> ${sys.categoria}</span>`;
      if (sys.quantidade > 1) html += `<span class="ip-tag"><b>Qtd.:</b> ${sys.quantidade}</span>`;
    }
    html += `</div>`;

    // Descrição
    const desc = sys.descricao || "<em>Sem descrição.</em>";
    html += `<div class="ip-desc">${desc}</div>`;

    // Ações rápidas
    html += `<div class="ip-actions">`;
    if (item.type === "arma") {
      html += `<button type="button" class="ip-roll-arma"><i class="fas fa-dice-d20"></i> Rolar Ataque</button>`;
    } else if (item.type === "magia" || item.type === "poder" || item.type === "habilidade") {
      html += `<button type="button" class="ip-item-use"><i class="fas fa-play"></i> Usar no Chat</button>`;
    }
    html += `<button type="button" class="ip-edit"><i class="fas fa-pen"></i> Editar</button>`;
    html += `</div>`;
    html += `</div>`;

    itemEl.after(html);
    const newPreview = itemEl.next(".item-preview");
    newPreview.hide().slideDown(160);

    // Handlers do preview
    newPreview.find(".ip-close").click((ev) => {
      ev.preventDefault(); ev.stopPropagation();
      newPreview.slideUp(160, () => newPreview.remove());
    });
    newPreview.find(".ip-roll-arma").click((ev) => {
      ev.preventDefault(); ev.stopPropagation();
      itemEl.find(".roll-arma").trigger("click");
    });
    newPreview.find(".ip-item-use").click((ev) => {
      ev.preventDefault(); ev.stopPropagation();
      itemEl.find(".item-use").trigger("click");
    });
    newPreview.find(".ip-edit").click((ev) => {
      ev.preventDefault(); ev.stopPropagation();
      item.sheet.render(true);
    });
  }

  // ================================================================
  //  IMPORTAÇÃO DE STATBLOCK (MÓDULO 3)
  // ================================================================
  async _onStatblockImport(event) {
    event.preventDefault();
    const actor = this.actor;

    const html = `
      <div class="t20-statblock-import">
        <div class="sbi-hint">
          <i class="fas fa-info-circle"></i> Cole um statblock do Livro Básico T20 abaixo. O parser identificará nome, ND, atributos, PV/PM, defesa, ataques, habilidades e magias automaticamente.
          <div class="sbi-example-toggle"><a class="sbi-show-example">Ver exemplo de formato</a></div>
          <pre class="sbi-example" style="display:none">Orc Combatente ND 1/2
Humanoide (orc) Médio
Iniciativa +4, Percepção +1, visão no escuro
Defesa 14, Fort +5, Ref +3, Von +0
Pontos de Vida 8
Deslocamento 9m (6q)
Corpo a Corpo Maça +9 (1d8+7).
Sensibilidade a Luz Quando exposto a luz do sol ou similar, o orc fica ofuscado.
For 4, Des 1, Con 2, Int -1, Sab -1, Car -1
Equipamento Couro batido, maça. Tesouro Metade.</pre>
        </div>
        <textarea class="sbi-textarea" placeholder="Cole aqui o statblock..." rows="14" autofocus></textarea>
        <div class="sbi-options">
          <label><input type="checkbox" class="sbi-overwrite" /> Sobrescrever dados do NPC atual (senão apenas adiciona)</label>
          <label><input type="checkbox" class="sbi-link-magias" checked /> Vincular magias ao compêndio quando possível</label>
        </div>
      </div>
    `;

    const sheet = this;
    new Dialog({
      title: `📋 Importar Statblock — ${actor.name}`,
      content: html,
      buttons: {
        importar: {
          icon: '<i class="fas fa-file-import"></i>',
          label: "Importar",
          callback: async (jq) => {
            const el = jq[0] || jq;
            const text = el.querySelector(".sbi-textarea").value.trim();
            const overwrite = el.querySelector(".sbi-overwrite").checked;
            const linkMagias = el.querySelector(".sbi-link-magias").checked;
            if (!text) { ui.notifications.warn("Cole um statblock primeiro."); return; }
            try {
              const parsed = parseStatblock(text);
              await sheet._applyParsedStatblock(parsed, { overwrite, linkMagias });
            } catch (err) {
              console.error("T20 | Erro no parser:", err);
              ui.notifications.error(`Erro ao parsear: ${err.message}`);
            }
          },
        },
        cancelar: { icon: '<i class="fas fa-xmark"></i>', label: "Cancelar" },
      },
      default: "importar",
      render: (jq) => {
        const el = jq[0] || jq;
        el.querySelector(".sbi-show-example")?.addEventListener("click", (ev) => {
          ev.preventDefault();
          const ex = el.querySelector(".sbi-example");
          ex.style.display = ex.style.display === "none" ? "block" : "none";
        });
      },
    }, { width: 640, height: 620, resizable: true, classes: ["t20-picker-dialog", "t20-statblock-dialog"] }).render(true);
  }

  /**
   * Aplica os dados parseados ao Actor atual:
   * - Atualiza campos de system (biografia, atributos, pv, pm, defesa, perícias, resistências)
   * - Cria items tipo `arma` para cada ataque (com flags do Módulo 2)
   * - Cria items tipo `habilidade` para cada habilidade
   * - Cria items tipo `magia` (busca no compêndio se linkMagias=true)
   */
  async _applyParsedStatblock(parsed, opts = {}) {
    const { overwrite = false, linkMagias = true } = opts;
    const actor = this.actor;

    // ── 1. Campos do actor ──
    const upd = {};
    if (overwrite || !actor.name || actor.name === "NPC") upd["name"] = parsed.name;
    upd["system.nd"] = parsed.nd;
    upd["system.biografia.nome"] = parsed.name;
    upd["system.biografia.tipo"] = parsed.tipo;
    upd["system.biografia.tamanho"] = parsed.tamanho;
    upd["system.biografia.deslocamento"] = parsed.deslocamento;
    upd["system.biografia.descricao"] = (parsed.descricao || "") +
      (parsed.deslocamentoExtra ? `\n\nDeslocamentos: ${parsed.deslocamentoExtra}` : "");
    upd["system.pv.max"] = parsed.pv;
    upd["system.pv.value"] = parsed.pv;
    upd["system.pm.max"] = parsed.pm;
    upd["system.pm.value"] = parsed.pm;
    upd["system.defesa.base"] = parsed.defesa - (parsed.atributos.des || 0); // base = total - Des
    upd["system.sentidos"] = parsed.sentidos || "";
    upd["system.tesouro"] = parsed.tesouro || "";

    for (const atr of ["for","des","con","int","sab","car"]) {
      upd[`system.atributos.${atr}.value`] = parsed.atributos[atr];
    }

    // Perícias defensivas (Fort/Ref/Von) e Iniciativa/Percepção vêm como bônus brutos no statblock
    // T20 de NPC: esses valores já são o TOTAL final esperado. Vamos setar como bônus
    // para que, somado ao atributo+treino, chegue no valor do livro.
    // Fórmula: bonus = total_livro - atributo_esperado - treino_se_treinada
    // Como não sabemos o que é "treinada", vamos colocar tudo em `bonus` e deixar treinada = false.
    const setSkill = (key, total, atributo) => {
      const mod = parsed.atributos[atributo] || 0;
      upd[`system.pericias.${key}.bonus`] = total - mod;
      upd[`system.pericias.${key}.treinada`] = false;
      upd[`system.pericias.${key}.mostrar`] = true;
    };
    setSkill("iniciativa", parsed.iniciativa, "des");
    setSkill("percepcao", parsed.percepcao, "sab");
    setSkill("fortitude", parsed.fortitude, "con");
    setSkill("reflexos", parsed.reflexos, "des");
    setSkill("vontade", parsed.vontade, "sab");

    // Perícias extras (Furtividade, Intimidação, etc.) — marca treinada e ajusta bônus
    const periciaToAtributo = {
      acrobacia: "des", adestramento: "car", atletismo: "for", atuacao: "car",
      cavalgar: "des", conhecimento: "int", cura: "sab", diplomacia: "car",
      enganacao: "car", furtividade: "des", guerra: "int", intimidacao: "car",
      intuicao: "sab", investigacao: "int", jogatina: "car", ladinagem: "des",
      luta: "for", misticismo: "int", nobreza: "int", oficio: "int",
      pilotagem: "des", pontaria: "des", religiao: "sab", sobrevivencia: "sab",
    };
    for (const [key, total] of Object.entries(parsed.pericias)) {
      const atr = periciaToAtributo[key] || "for";
      const mod = parsed.atributos[atr] || 0;
      upd[`system.pericias.${key}.bonus`] = total - mod;
      upd[`system.pericias.${key}.treinada`] = false;
      upd[`system.pericias.${key}.mostrar`] = true;
    }

    // Resistências
    if (parsed.resistencias.length > 0) {
      const currentRes = overwrite ? [] : (actor.system.resistenciasList || []);
      upd["system.resistenciasList"] = [...currentRes, ...parsed.resistencias];
    }

    await actor.update(upd);

    // ── 2. Remover items antigos se overwrite ──
    if (overwrite) {
      const oldIds = actor.items.map(i => i.id);
      if (oldIds.length) await actor.deleteEmbeddedDocuments("Item", oldIds);
    }

    // ── 3. Criar ataques como items tipo `arma` com flags do Módulo 2 ──
    const newItems = [];
    for (const atk of parsed.ataques) {
      newItems.push({
        name: atk.nome,
        type: "arma",
        img: "icons/svg/claws.svg",
        system: {
          dano: atk.dano,
          critico: atk.critico,
          tipo: atk.tipoDano,
          alcance: atk.alcance || "",
          grupo: "Natural",
          bonusAtaque: atk.bonusAtaque,
          bonusDano: 0,
          ataqueNatural: true,
          ignoraAtributoDano: true,
          numAtaques: atk.numAtaques,
          penalidadeMultiplos: 0, // T20 padrão: sem penalidade em ataques naturais
          equipada: true,
          descricao: atk.efeitos ? `Efeito: ${atk.efeitos}` : "",
        },
      });
    }

    // ── 4. Criar habilidades como items tipo `habilidade` ──
    for (const hab of parsed.habilidades) {
      const displayName = hab.acao && hab.acao !== "Passiva"
        ? `${hab.nome} (${hab.acao}${hab.custoPM ? `, ${hab.custoPM} PM` : ""})`
        : hab.nome;
      newItems.push({
        name: displayName,
        type: "habilidade",
        img: "icons/svg/book.svg",
        system: {
          descricao: hab.descricao,
          tipo: hab.acao === "Passiva" ? "passiva" : "ativa",
          fonte: "Statblock",
        },
      });
    }

    // ── 5. Criar magias — busca no compêndio se linkMagias ──
    let magiasPackDocs = null;
    if (linkMagias && parsed.magias.length > 0) {
      const magiasPack = game.packs.get("tormenta20.magias");
      if (magiasPack) magiasPackDocs = await magiasPack.getDocuments();
    }
    for (const mg of parsed.magias) {
      let linkedData = null;
      if (magiasPackDocs) {
        const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const needle = norm(mg.nome);
        const found = magiasPackDocs.find(d => norm(d.name) === needle);
        if (found) {
          linkedData = {
            name: found.name,
            type: "magia",
            img: found.img,
            system: foundry.utils.deepClone(found.system),
          };
          // Override custo PM com o do statblock (pode diferir do livro por aprimoramento)
          if (mg.custoPM) linkedData.system.custoPM = mg.custoPM;
        }
      }
      if (linkedData) {
        newItems.push(linkedData);
      } else {
        // Fallback: cria magia em branco só com os dados do statblock
        newItems.push({
          name: mg.nome,
          type: "magia",
          img: "icons/svg/daze.svg",
          system: {
            descricao: mg.descricao,
            custoPM: mg.custoPM,
            execucao: mg.acao,
            circulo: Math.max(1, Math.ceil(mg.custoPM / 2)), // heurística
            tipo: "arcana",
          },
        });
      }
    }

    if (newItems.length) {
      await actor.createEmbeddedDocuments("Item", newItems);
    }

    // ── 6. Feedback ao usuário ──
    const msgs = [
      `✔ ${parsed.name} importado.`,
      `${parsed.ataques.length} ataques, ${parsed.habilidades.length} habilidades, ${parsed.magias.length} magias.`,
    ];
    if (parsed.warnings.length) msgs.push(`⚠ ${parsed.warnings.length} avisos (veja console).`);
    ui.notifications.info(msgs.join(" "));
    if (parsed.warnings.length) console.warn("T20 | Avisos na importação:", parsed.warnings);

    this.render(true);
  }
}
