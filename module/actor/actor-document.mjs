// ========================================================
// T20 Actor Document — T20 Jogo do Ano
// CD calculada pelo atributo-chave escolhido pelo jogador
// PV/PM calculados automaticamente por classe + nível
// Suporta multiclasse (biografia.classes[]) e classes variantes
// ========================================================

export class T20Actor extends Actor {

  // ──────────────────────────────────────────────────────
  // PV/PM por nível de cada classe (T20 Jogo do Ano)
  //
  // Inclui 14 classes básicas (Livro Básico) + 5 suplementares
  // (Treinador, Frade, Miragem, Místico, Samurai).
  //
  // As 14 Classes Variantes de Heróis de Arton (Alquimista, Atleta,
  // Burguês, Duelista, Ermitão, Inovador, Machado de Pedra,
  // Magimarcialista, Necromante, Santo, Seteiro, Usurpador, Vassalo,
  // Ventanista) agora vivem no campo `subclasse` da classe-base
  // correspondente. Quando a subclasse altera PV/PM em relação à base,
  // aplicamos o override via SUBCLASS_STATS_OVERRIDES.
  // ──────────────────────────────────────────────────────
  static CLASS_STATS = {
    // ── 14 classes do Livro Básico ──
    "Arcanista":        { pv: 8,  pm: 6 },
    "Bárbaro":          { pv: 24, pm: 3 },
    "Bardo":            { pv: 12, pm: 4 },
    "Bucaneiro":        { pv: 16, pm: 3 },
    "Caçador":          { pv: 16, pm: 4 },
    "Cavaleiro":        { pv: 20, pm: 3 },
    "Clérigo":          { pv: 16, pm: 5 },
    "Druida":           { pv: 16, pm: 4 },
    "Guerreiro":        { pv: 20, pm: 3 },
    "Inventor":         { pv: 12, pm: 4 },
    "Ladino":           { pv: 12, pm: 4 },
    "Lutador":          { pv: 20, pm: 3 },
    "Nobre":            { pv: 16, pm: 4 },
    "Paladino":         { pv: 20, pm: 3 },

    // ── Suplementos ──
    "Treinador":        { pv: 12, pm: 4 },
    "Frade":            { pv: 12, pm: 6 },
    "Miragem":          { pv: 16, pm: 3 },
    "Místico":          { pv: 16, pm: 4 },
    "Samurai":          { pv: 20, pm: 3 },
  };

  // ──────────────────────────────────────────────────────
  // Overrides de PV/PM quando uma subclasse variante altera os
  // stats em relação à classe-base. 4 variantes fazem isso:
  //   • Burguês (Nobre):         PV 16+4 → 12+4
  //   • Ermitão (Druida):        PV 16+4 → 12+4
  //   • Magimarcialista (Bardo): PV 12+4 → 16+4
  //   • Santo (Paladino):        PM 3/nv → 4/nv
  // As outras 10 variantes usam os mesmos stats da base (não
  // precisam estar aqui).
  // ──────────────────────────────────────────────────────
  static SUBCLASS_STATS_OVERRIDES = {
    "Burguês":         { pv: 12, pm: 4 },
    "Ermitão":         { pv: 12, pm: 4 },
    "Magimarcialista": { pv: 16, pm: 4 },
    "Santo":           { pv: 20, pm: 4 },
  };

  prepareData() { super.prepareData(); }

  prepareDerivedData() {
    const system = this.system;
    if (this.type === "personagem") this._preparePersonagem(system);
    if (this.type === "npc") this._prepareNpc(system);
  }

  /**
   * Normaliza o array `biografia.classes[]` (multiclasse).
   * Se estiver vazio, constrói uma entrada virtual a partir de
   * `biografia.classe` + `biografia.nivel` para retrocompatibilidade.
   *
   * @returns {Array<{nome:string,nivel:number,subclasse:string}>}
   */
  _getClassList(system) {
    const arr = Array.isArray(system.biografia?.classes) ? system.biografia.classes : [];
    const clean = arr
      .filter(c => c && c.nome && String(c.nome).trim())
      .map(c => ({
        nome: String(c.nome).trim(),
        nivel: Math.max(1, parseInt(c.nivel) || 1),
        subclasse: c.subclasse || "",
      }));
    if (clean.length) return clean;
    // Fallback: usa classe principal legada
    const nomeLegado = (system.biografia?.classe || "").trim();
    if (nomeLegado) {
      return [{
        nome: nomeLegado,
        nivel: Math.max(1, parseInt(system.biografia?.nivel) || 1),
        subclasse: system.biografia?.subclasse || "",
      }];
    }
    return [];
  }

  _preparePersonagem(system) {
    // ── Multiclasse: classes ativas + nível total ──
    const classList = this._getClassList(system);
    const nivelTotal = classList.reduce((s, c) => s + c.nivel, 0) ||
      Math.max(1, parseInt(system.biografia?.nivel) || 1);

    // Nível efetivo = soma dos níveis das classes (ou legado). Caches.
    system._nivelTotal = nivelTotal;
    system._classList = classList;

    // Display textual da(s) classe(s) pro campo do cabeçalho.
    // 0 classes: vazio. 1 classe: "Inventor 5". 2+: "Inventor 5 / Ladino 3".
    if (classList.length === 0) {
      system._classeDisplay = "";
    } else if (classList.length === 1) {
      system._classeDisplay = `${classList[0].nome} ${classList[0].nivel}`;
    } else {
      system._classeDisplay = classList.map(c => `${c.nome} ${c.nivel}`).join(" / ");
    }

    // Atualiza campo legado `nivel` se estiver defasado (visual)
    if (classList.length && system.biografia && system.biografia.nivel !== nivelTotal) {
      system.biografia.nivel = nivelTotal;
    }

    const bonusTreino = Math.max(Math.floor(nivelTotal / 2), 2);

    // ── Atributos: total = valor + bônus ──
    for (const atr of Object.values(system.atributos)) {
      atr.total = (atr.value || 0) + (atr.bonus || 0);
    }

    // ── Perícias ──
    for (const pericia of Object.values(system.pericias)) {
      const modAtributo = system.atributos[pericia.atributo]?.total ?? 0;
      const treino = pericia.treinada ? bonusTreino : 0;
      pericia.total = modAtributo + treino + (pericia.bonus || 0);
    }

    // ── Armaduras e Escudos equipados ──
    let bonusArmadura = 0, bonusEscudo = 0, penArmadura = 0, bonusCDItens = 0;

    for (const item of this.items) {
      if (item.type === "armadura" && item.system.equipada) {
        const tipo = (item.system.tipo || "").toLowerCase();
        if (tipo === "escudo") bonusEscudo += (item.system.defesa || 0);
        else bonusArmadura += (item.system.defesa || 0);
        penArmadura += (item.system.penalidade || 0);
      }
      if (item.system.equipada && item.system.bonusCD) bonusCDItens += item.system.bonusCD;
      if (item.type === "equipamento" && item.system.bonusCD) bonusCDItens += item.system.bonusCD;
    }

    // ── Defesa ──
    const def = system.defesa;
    def.armadura = bonusArmadura;
    def.escudo = bonusEscudo;
    def.penalidade = penArmadura;
    def.total = (def.base || 10) + (system.atributos.des?.total ?? 0)
      + bonusArmadura + bonusEscudo + (def.outros || 0);

    // ── CD de Magias ──
    // Fórmula T20: CD = 10 + metade do nível + mod atributo-chave + bônus
    const atributoChave = system.magia?.atributoChave || "int";
    const modChave = system.atributos[atributoChave]?.total ?? 0;
    const cdBase = 10 + Math.floor(nivelTotal / 2);
    const bonusCDManual = system.bonusCD || 0;
    system._cdMagia = cdBase + modChave + bonusCDManual + bonusCDItens;
    system._bonusCDItens = bonusCDItens;
    system._atributoChaveLabel = { int: "Int", sab: "Sab", car: "Car" }[atributoChave] || "Int";
    let formula = `10 + ${Math.floor(nivelTotal / 2)} nv + ${system._atributoChaveLabel}`;
    if (bonusCDManual) formula += ` + ${bonusCDManual}`;
    if (bonusCDItens) formula += ` + ${bonusCDItens} itens`;
    system._cdFormula = formula;

    // ── PV e PM automáticos (multiclasse) ──
    // T20 RAW (pág. 90-91): cada classe contribui com seu (PV + modCon) × nivel da classe
    //                       e seu (PM × nivel da classe). modChave soma só UMA vez ao total.
    // Subclasses variantes (Heróis de Arton) que alteram PV/PM têm override em
    // SUBCLASS_STATS_OVERRIDES — aplicamos se a subclasse da entrada bater.
    const modCon = system.atributos.con?.total ?? 0;
    let pvMax = 0, pmMax = 0;
    const breakdown = [];
    for (const c of classList) {
      const baseSt = T20Actor.CLASS_STATS[c.nome];
      if (!baseSt) {
        breakdown.push({ nome: c.nome, nivel: c.nivel, pv: 0, pm: 0, desconhecida: true });
        continue;
      }
      // Se a subclasse tiver override de stats, usa ele. Senão, usa a base.
      const subOverride = c.subclasse ? T20Actor.SUBCLASS_STATS_OVERRIDES[c.subclasse] : null;
      const st = subOverride || baseSt;
      const pvC = c.nivel * (st.pv + modCon);
      const pmC = c.nivel * st.pm;
      pvMax += pvC;
      pmMax += pmC;
      breakdown.push({
        nome: c.nome, nivel: c.nivel, pv: pvC, pm: pmC,
        subclasse: c.subclasse || null,
        variante: !!subOverride,
      });
    }
    if (pvMax > 0 || pmMax > 0) {
      pvMax += (system.pv.bonus || 0);
      pmMax += modChave + (system.pm.bonus || 0);
      system.pv.max = pvMax;
      system.pm.max = pmMax;
    }
    system._pvPmBreakdown = breakdown;
    if (system.pv.max > 0 && system.pv.value > system.pv.max) system.pv.value = system.pv.max;
    if (system.pm.max > 0 && system.pm.value > system.pm.max) system.pm.value = system.pm.max;

    // ── Resistências automáticas (raça + itens) ──
    const RACE_RES = {
      "Anão": "Resistência a veneno (+2 Fort contra venenos)",
      "Golem": "Imune a veneno, doença e fadiga. Não precisa comer, beber ou dormir",
      "Dahllan": "Comunicar-se com plantas. Camuflagem em florestas",
      "Minotauro": "Faro. Visão no escuro",
      "Medusa": "Visão no escuro. Cria 1d4+1 serpentes/cena",
      "Trog": "Visão no escuro. Regeneração",
      "Suraggel (Aggelus)": "Resistência a luz/trevas 5",
      "Suraggel (Sulfure)": "Resistência a fogo/trevas 5",
      "Sílfide": "Tamanho Pequeno. Voo 9m",
      "Hynne": "Tamanho Pequeno. Medo de gatos",
      "Qareen": "Resistência a fogo 5. Desejo (1×/dia)",
      // Heróis de Arton
      "Eiradaan": "Tipo espírito. Visão na penumbra. Magia Instintiva (Sab). Sentidos Místicos",
      "Galokk": "Tipo humanoide (gigante). Tamanho Grande. Força dos Titãs",
      "Meio-Elfo": "Visão na penumbra. +1 PM/nível ímpar. Conta como elfo",
      "Sátiro": "Tipo espírito. Visão na penumbra. Marrada (1d6). Desloc 12m",
      "Duende": "Tipo espírito. Aversão a Ferro e Sinos. Tabu",
      // Livro das Raças
      "Orc": "Visão no escuro. Sensibilidade a luz. +For nos PV",
      "Meio-Orc": "Visão no escuro. +1 dano corpo a corpo. Conta como orc",
      "Ogro": "Tamanho Grande. Visão na penumbra. –5 Intuição/Vontade",
      "Bugbear": "Faro. Visão no escuro. Empunhadura Poderosa",
      "Hobgoblin": "Visão no escuro. +2 Furtividade. Prof. marciais",
      "Tengu": "Tipo espírito. Visão no escuro. Voo 12m (1 PM/rodada)",
      "Kaijin": "Tipo monstro. RD 2. +5 resist. Tormenta",
      "Centauro": "Tamanho Grande. Desloc 12m. Medo de altura",
      "Harpia": "Tipo monstro. Visão no escuro. Voo 12m",
      "Kappa": "Tipo espírito. Natação. +Con na Defesa",
      "Fintroll": "Tipo monstro. Visão no escuro. Regeneração 5 PV/PM. Sensibilidade a luz",
    };
    const raca = system.biografia?.raca || "";
    const autoRes = [];
    if (RACE_RES[raca]) autoRes.push(RACE_RES[raca]);
    for (const item of this.items) {
      if (item.type === "habilidade" && item.system.tipo === "resistencia") {
        autoRes.push(item.name);
      }
    }
    system._resistAuto = autoRes.join(". ");

    // ── Modificadores Globais ──
    const g = system.global || {};
    if (g.pericias) for (const p of Object.values(system.pericias)) p.total += g.pericias;
    if (g.resistencias) {
      system.pericias.fortitude.total += g.resistencias;
      system.pericias.reflexos.total += g.resistencias;
      system.pericias.vontade.total += g.resistencias;
    }

    // ── Condições ──
    const c = system.condicoes || {};
    if (c.abalado) for (const p of Object.values(system.pericias)) p.total -= 2;
    if (c.apavorado) for (const p of Object.values(system.pericias)) p.total -= 5;
    if (c.debilitado) { system.atributos.for.total -= 5; system.atributos.des.total -= 5; system.atributos.con.total -= 5; }
    if (c.esmorecido) { system.atributos.int.total -= 5; system.atributos.sab.total -= 5; system.atributos.car.total -= 5; }
    if (c.fraco) { system.atributos.for.total -= 2; system.atributos.des.total -= 2; system.atributos.con.total -= 2; }
    if (c.frustrado) { system.atributos.int.total -= 2; system.atributos.sab.total -= 2; system.atributos.car.total -= 2; }
    if (c.desprevenido) { def.total -= 5; system.pericias.reflexos.total -= 5; }
    if (c.ofuscado) system.pericias.percepcao.total -= 2;
    if (c.enredado) system.pericias.luta.total -= 2;
    if (c.vulneravel) def.total -= 2;
    if (c.caido) def.total -= 5;
    if (c.indefeso) def.total -= 10;
  }

  _prepareNpc(system) {
    for (const atr of Object.values(system.atributos)) {
      atr.total = (atr.value || 0) + (atr.bonus || 0);
    }

    const ndNum = this._parseND(system.nd);
    const bonusTreino = Math.max(Math.floor(ndNum / 2), 2);

    for (const pericia of Object.values(system.pericias)) {
      const modAtributo = system.atributos[pericia.atributo]?.total ?? 0;
      const treino = pericia.treinada ? bonusTreino : 0;
      pericia.total = modAtributo + treino + (pericia.bonus || 0);
    }

    let bonusArmadura = 0;
    for (const item of this.items) {
      if (item.type === "armadura" && item.system.equipada) {
        bonusArmadura += (item.system.defesa || 0);
      }
    }

    const def = system.defesa;
    def.armadura = bonusArmadura;
    def.total = (def.base || 10) + (system.atributos.des?.total ?? 0)
      + bonusArmadura + (def.outros || 0);

    const atributoChave = system.magia?.atributoChave || "int";
    const modChave = system.atributos[atributoChave]?.total ?? 0;
    def.cd = 10 + Math.floor(ndNum / 2) + modChave + (system.bonusCD || 0);

    const g = system.global || {};
    if (g.pericias) for (const p of Object.values(system.pericias)) p.total += g.pericias;
    if (g.resistencias) {
      system.pericias.fortitude.total += g.resistencias;
      system.pericias.reflexos.total += g.resistencias;
      system.pericias.vontade.total += g.resistencias;
    }

    const c = system.condicoes || {};
    if (c.abalado) for (const p of Object.values(system.pericias)) p.total -= 2;
    if (c.apavorado) for (const p of Object.values(system.pericias)) p.total -= 5;
    if (c.debilitado) { system.atributos.for.total -= 5; system.atributos.des.total -= 5; system.atributos.con.total -= 5; }
    if (c.esmorecido) { system.atributos.int.total -= 5; system.atributos.sab.total -= 5; system.atributos.car.total -= 5; }
    if (c.fraco) { system.atributos.for.total -= 2; system.atributos.des.total -= 2; system.atributos.con.total -= 2; }
    if (c.frustrado) { system.atributos.int.total -= 2; system.atributos.sab.total -= 2; system.atributos.car.total -= 2; }
    if (c.desprevenido) { def.total -= 5; system.pericias.reflexos.total -= 5; }
    if (c.ofuscado) system.pericias.percepcao.total -= 2;
    if (c.enredado) system.pericias.luta.total -= 2;
    if (c.vulneravel) def.total -= 2;
    if (c.caido) def.total -= 5;
    if (c.indefeso) def.total -= 10;

    if (system.pv.max > 0 && system.pv.value > system.pv.max) system.pv.value = system.pv.max;
    if (system.pm.max > 0 && system.pm.value > system.pm.max) system.pm.value = system.pm.max;

    system._ndNum = ndNum;
    system._cdMagia = def.cd;
    system._atributoChaveLabel = { int: "Int", sab: "Sab", car: "Car" }[atributoChave] || "Int";
  }

  _parseND(nd) {
    if (typeof nd === "number") return nd;
    const s = String(nd ?? "1").trim();
    if (s.includes("/")) {
      const [num, den] = s.split("/").map(n => parseFloat(n));
      return den ? num / den : 1;
    }
    const n = parseFloat(s);
    return isNaN(n) ? 1 : n;
  }

  // ═══════════════════════════════════════════════════════════════
  // getRollData() — API padrão do Foundry usada por módulos externos
  // e por fórmulas inline de rolagem (ex: @pericias.luta.total).
  //
  // Expõe o system.data em um formato plano E com aliases pra que
  // Dice Tray, Token Action HUD e outros módulos consigam resolver
  // fórmulas padrão sem precisar conhecer a estrutura T20.
  // ═══════════════════════════════════════════════════════════════
  getRollData() {
    const data = foundry.utils.deepClone(this.system || {});

    // Aliases curtos para atributos — permite @for ao invés de
    // @atributos.for.total nas fórmulas inline.
    if (data.atributos) {
      for (const [key, atr] of Object.entries(data.atributos)) {
        data[key] = atr?.total ?? 0;
      }
    }

    // Aliases para perícias — @luta ao invés de @pericias.luta.total
    if (data.pericias) {
      for (const [key, p] of Object.entries(data.pericias)) {
        // Não sobrescreve caso já exista (ex: atributo "luta" não existe, então ok)
        if (data[key] === undefined) data[key] = p?.total ?? 0;
      }
    }

    // Atalhos comuns esperados por módulos genéricos
    data.level = data._nivelTotal || data.biografia?.nivel || 1;
    data.nivel = data.level;
    if (data.pv) { data.hp = { value: data.pv.value, max: data.pv.max }; }
    if (data.pm) { data.mp = { value: data.pm.value, max: data.pm.max }; }

    return data;
  }

  // ═══════════════════════════════════════════════════════════════
  // applyActiveEffects() — hook padrão que módulos como
  // DFreds Effects Panel esperam. Foundry já chama isto da base
  // Actor.prepareBaseData, mas ao usar prepareDerivedData customizado
  // podemos precisar garantir que os efeitos ativos sejam aplicados
  // ANTES dos cálculos derivados. O padrão da base já faz isso.
  //
  // Mantemos esta nota aqui pra lembrar que Active Effects funcionam
  // pelo fluxo padrão — não sobrescrever a menos que dê problema.
  // ═══════════════════════════════════════════════════════════════
}
