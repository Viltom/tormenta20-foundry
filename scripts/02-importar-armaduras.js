// ============================================================
// TORMENTA 20 - Importar Armaduras
// Total: 12 itens | Pack: tormenta20.armaduras
// ============================================================

const PACK_NAME = "tormenta20.armaduras";
const ITEM_TYPE = "armadura";
const ICON = "icons/svg/shield.svg";

const DATA = [
  {
    "name": "Armadura Acolchoada",
    "system": {
      "descricao": "",
      "defesa": 1,
      "penalidade": 0,
      "tipo": "leve",
      "preco": 5,
      "espacos": 2,
      "equipada": false
    }
  },
  {
    "name": "Armadura de Couro",
    "system": {
      "descricao": "",
      "defesa": 2,
      "penalidade": 0,
      "tipo": "leve",
      "preco": 20,
      "espacos": 2,
      "equipada": false
    }
  },
  {
    "name": "Couro Batido",
    "system": {
      "descricao": "",
      "defesa": 3,
      "penalidade": -1,
      "tipo": "leve",
      "preco": 35,
      "espacos": 2,
      "equipada": false
    }
  },
  {
    "name": "Gibão de Peles",
    "system": {
      "descricao": "",
      "defesa": 4,
      "penalidade": -3,
      "tipo": "leve",
      "preco": 25,
      "espacos": 2,
      "equipada": false
    }
  },
  {
    "name": "Couraça",
    "system": {
      "descricao": "",
      "defesa": 5,
      "penalidade": -4,
      "tipo": "leve",
      "preco": 500,
      "espacos": 2,
      "equipada": false
    }
  },
  {
    "name": "Brunea",
    "system": {
      "descricao": "",
      "defesa": 5,
      "penalidade": -2,
      "tipo": "pesada",
      "preco": 50,
      "espacos": 5,
      "equipada": false
    }
  },
  {
    "name": "Cota de Malha",
    "system": {
      "descricao": "",
      "defesa": 6,
      "penalidade": -2,
      "tipo": "pesada",
      "preco": 150,
      "espacos": 5,
      "equipada": false
    }
  },
  {
    "name": "Loriga Segmentada",
    "system": {
      "descricao": "",
      "defesa": 7,
      "penalidade": -3,
      "tipo": "pesada",
      "preco": 250,
      "espacos": 5,
      "equipada": false
    }
  },
  {
    "name": "Meia Armadura",
    "system": {
      "descricao": "",
      "defesa": 8,
      "penalidade": -4,
      "tipo": "pesada",
      "preco": 600,
      "espacos": 5,
      "equipada": false
    }
  },
  {
    "name": "Armadura Completa",
    "system": {
      "descricao": "",
      "defesa": 10,
      "penalidade": -5,
      "tipo": "pesada",
      "preco": 3000,
      "espacos": 5,
      "equipada": false
    }
  },
  {
    "name": "Escudo Leve",
    "system": {
      "descricao": "Dano 1d4 impacto",
      "defesa": 1,
      "penalidade": -1,
      "tipo": "escudo",
      "preco": 5,
      "espacos": 1,
      "equipada": false
    }
  },
  {
    "name": "Escudo Pesado",
    "system": {
      "descricao": "Dano 1d6 impacto",
      "defesa": 2,
      "penalidade": -2,
      "tipo": "escudo",
      "preco": 15,
      "espacos": 2,
      "equipada": false
    }
  }
];

async function importar() {
  const pack = game.packs.get(PACK_NAME);
  if (!pack) {
    ui.notifications.error("Pack " + PACK_NAME + " não encontrado!");
    return;
  }

  await pack.configure({locked: false});
  ui.notifications.info("Importando 12 armaduras...");
  let count = 0;

  for (const entry of DATA) {
    try {
      await Item.create({ name: entry.name, type: ITEM_TYPE, img: ICON, system: entry.system }, { pack: PACK_NAME });
      count++;
    } catch (e) {
      console.error("Erro:", entry.name, e);
    }
  }

  await pack.configure({locked: true});
  ui.notifications.info(count + " armaduras importados!");
}

importar();
