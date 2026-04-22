// ========================================================
// T20 Item Sheet
// + Picker de magia do compêndio para Invenções (engenhocas)
// ========================================================

export class T20ItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["tormenta20", "sheet", "item"],
      template: "systems/tormenta20/templates/item/item-sheet.hbs",
      width: 520,
      height: 560,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "descricao",
        },
      ],
    });
  }

  /** @override */
  getData() {
    const context = super.getData();
    if (!context.item || !context.item.name) {
      context.item = {
        _id: this.item.id,
        name: this.item.name,
        img: this.item.img,
        type: this.item.type,
      };
    }
    context.system = this.item.system;
    context.flags = this.item.flags;
    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;
    html.find(".inv-pick-magia").click(this._onPickMagiaSim.bind(this));
  }

  // ================================================================
  //  PICKER: Selecionar magia do compêndio para Engenhoca
  //  Auto-preenche: nome, círculo, custo PM, CD ativação, custo fab
  // ================================================================
  async _onPickMagiaSim(event) {
    event.preventDefault();
    const item = this.item;
    const pack = game.packs.get("tormenta20.magias");
    if (!pack) {
      ui.notifications.warn("Compêndio tormenta20.magias não encontrado.");
      return;
    }

    const docs = await pack.getDocuments();
    if (!docs.length) {
      ui.notifications.warn("Compêndio de magias está vazio.");
      return;
    }

    const sorted = [...docs].sort((a, b) => {
      const dc = (a.system.circulo || 0) - (b.system.circulo || 0);
      if (dc) return dc;
      return a.name.localeCompare(b.name, "pt-BR");
    });

    const arcCount = sorted.filter(d => d.system.tipo === "arcana").length;
    const divCount = sorted.filter(d => d.system.tipo === "divina").length;
    const uniCount = sorted.filter(d => d.system.tipo === "universal").length;

    const itemsHtml = sorted.map(d => {
      const tc = { arcana: "cp-arc", divina: "cp-div", universal: "cp-uni" }[d.system.tipo] || "";
      return `<div class="cp-item" data-id="${d.id}" data-tipo="${d.system.tipo || ""}" data-name="${d.name}" title="${(d.system.descricao || "").replace(/"/g, '&quot;').substring(0, 300)}">
        <img src="${d.img || 'icons/svg/item-bag.svg'}" width="24" height="24"/>
        <span class="cp-name">${d.name}</span>
        <div class="cp-info">
          <span class="cp-tag cp-circ">${d.system.circulo}°</span>
          <span class="cp-tag ${tc}">${d.system.tipo || ""}</span>
          <span class="cp-tag">${d.system.escola || ""}</span>
          <span class="cp-tag" style="color:#c7a16b">${d.system.custoPM || 0} PM</span>
        </div>
      </div>`;
    }).join("");

    const html = `<div class="t20-compendium-picker">
      <div class="cp-search-row"><i class="fas fa-search"></i><input type="text" class="cp-search" placeholder="Buscar magia..." autofocus /></div>
      <div class="cp-filters">
        <button type="button" class="cp-filter active" data-filter="todas">Todas (${sorted.length})</button>
        <button type="button" class="cp-filter cp-f-arc" data-filter="arcana">Arcanas (${arcCount})</button>
        <button type="button" class="cp-filter cp-f-div" data-filter="divina">Divinas (${divCount})</button>
        <button type="button" class="cp-filter cp-f-uni" data-filter="universal">Universais (${uniCount})</button>
      </div>
      <div class="cp-list">${itemsHtml}</div>
    </div>`;

    const dlg = new Dialog({
      title: "Selecionar Magia Simulada",
      content: html,
      buttons: {},
      render: (jq) => {
        const el = jq[0] || jq;

        el.querySelector(".cp-search")?.addEventListener("input", (e) => {
          const q = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          el.querySelectorAll(".cp-item").forEach(row => {
            const name = row.dataset.name?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
            row.style.display = name.includes(q) ? "" : "none";
          });
        });

        el.querySelectorAll(".cp-filter").forEach(btn => {
          btn.addEventListener("click", () => {
            el.querySelectorAll(".cp-filter").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const f = btn.dataset.filter;
            el.querySelectorAll(".cp-item").forEach(row => {
              row.style.display = (f === "todas" || row.dataset.tipo === f) ? "" : "none";
            });
          });
        });

        el.querySelectorAll(".cp-item").forEach(row => {
          row.addEventListener("click", async () => {
            const doc = sorted.find(d => d.id === row.dataset.id);
            if (!doc) return;

            const circulo = doc.system.circulo || 1;
            const custoPM = doc.system.custoPM || 0;
            // T20 pág 70: CD = 15 + custo em PM da magia
            const cdAtivacao = 15 + custoPM;
            // T20 pág 70: Custo = T$ 100 × custo em PM
            const custoFab = custoPM * 100;

            await item.update({
              "system.magiaSim": doc.name,
              "system.circuloMagia": circulo,
              "system.custoPMmagia": custoPM,
              "system.cdAtivacao": cdAtivacao,
              "system.custoFab": custoFab,
            });

            ui.notifications.info(`Engenhoca simulará: ${doc.name} (${circulo}° círculo, CD ${cdAtivacao}, T$ ${custoFab})`);
            dlg.close();
          });
        });
      },
      close: () => {},
    }, { width: 520, height: 600, resizable: true, classes: ["t20-picker-dialog"] });
    dlg.render(true);
  }
}
