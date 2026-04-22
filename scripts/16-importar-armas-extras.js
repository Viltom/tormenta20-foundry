// TORMENTA 20 — Importar Armas Extras (1 item)
// Fonte: Classes Novas (Samurai)
// Pack: tormenta20.armas

const PACK_NAME = "tormenta20.armas";
const DATA = [
  {
    "name": "Wakizashi",
    "type": "arma",
    "img": "icons/svg/sword.svg",
    "system": {
      "descricao": "Versão mais curta da katana. Juntas, katana e wakizashi formam o daisho, símbolo da nobreza imperial em Tamu-ra. Um personagem que esteja empunhando uma katana e uma wakizashi não sofre a penalidade de –2 por usar os poderes Ambidestria, Dois Céus ou Estilo de Duas Armas com essas armas.",
      "dano": "1d6",
      "critico": "19/x2",
      "tipo": "corte",
      "alcance": "",
      "grupo": "exotica",
      "empunhadura": "umaMao",
      "propriedades": "Sem penalidade de Duas Armas com katana",
      "preco": 75,
      "espacos": 1,
      "bonus": 0,
      "equipada": false,
      "mCerteira": false, "mPungente": false, "mCruel": false, "mAtroz": false,
      "mEquilibrada": false, "mHarmonizada": false, "mInjecao": false, "mMacica": false,
      "mPrecisa": false, "mMira": false, "mMacabro": false, "mBanhado": false,
      "mCravejado": false, "mDiscreto": false
    }
  }
];

async function importAll() {
  const pack = game.packs.get(PACK_NAME);
  if (!pack) return ui.notifications.error("Pack não encontrado: " + PACK_NAME);
  await pack.configure({locked: false});
  let created = 0;
  for (const d of DATA) {
    const existing = pack.index.find(e => e.name === d.name);
    if (existing) {
      await pack.getDocument(existing._id).then(doc => doc.update({system: d.system}));
    } else {
      await Item.create(d, {pack: PACK_NAME});
    }
    created++;
  }
  await pack.configure({locked: true});
  ui.notifications.info(`Armas extras: ${created} itens importados`);
}
importAll();
