// ============================================================
// TORMENTA 20 - Importar Armas
// Total: 40 itens | Pack: tormenta20.armas
// ============================================================

const PACK_NAME = "tormenta20.armas";
const ITEM_TYPE = "arma";
const ICON = "icons/svg/sword.svg";

const DATA = [
  {
    "name": "Adaga",
    "system": {
      "descricao": "Arremessável, +5 Ladinagem para ocultar, pode usar Des em vez de For no ataque",
      "dano": "1d4",
      "critico": "19/x2",
      "tipo": "perfuração",
      "alcance": "curto",
      "grupo": "simples",
      "empunhadura": "leve",
      "propriedades": "Arremessável, +5 Ladinagem para ocultar, pode usar Des em vez de For no ataque",
      "preco": 2,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Espada Curta",
    "system": {
      "descricao": "",
      "dano": "1d6",
      "critico": "19/x2",
      "tipo": "perfuração",
      "alcance": "",
      "grupo": "simples",
      "empunhadura": "leve",
      "propriedades": "",
      "preco": 10,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Foice",
    "system": {
      "descricao": "",
      "dano": "1d6",
      "critico": "x3",
      "tipo": "corte",
      "alcance": "",
      "grupo": "simples",
      "empunhadura": "leve",
      "propriedades": "",
      "preco": 4,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Clava",
    "system": {
      "descricao": "",
      "dano": "1d6",
      "critico": "x2",
      "tipo": "impacto",
      "alcance": "",
      "grupo": "simples",
      "empunhadura": "umaMao",
      "propriedades": "",
      "preco": 0,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Lança",
    "system": {
      "descricao": "Arremessável",
      "dano": "1d6",
      "critico": "x2",
      "tipo": "perfuração",
      "alcance": "curto",
      "grupo": "simples",
      "empunhadura": "umaMao",
      "propriedades": "Arremessável",
      "preco": 2,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Maça",
    "system": {
      "descricao": "",
      "dano": "1d8",
      "critico": "x2",
      "tipo": "impacto",
      "alcance": "",
      "grupo": "simples",
      "empunhadura": "umaMao",
      "propriedades": "",
      "preco": 12,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Bordão",
    "system": {
      "descricao": "Arma dupla",
      "dano": "1d6/1d6",
      "critico": "x2",
      "tipo": "impacto",
      "alcance": "",
      "grupo": "simples",
      "empunhadura": "duasMaos",
      "propriedades": "Arma dupla",
      "preco": 0,
      "espacos": 2,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Pique",
    "system": {
      "descricao": "Arma alongada",
      "dano": "1d8",
      "critico": "x2",
      "tipo": "perfuração",
      "alcance": "",
      "grupo": "simples",
      "empunhadura": "duasMaos",
      "propriedades": "Arma alongada",
      "preco": 2,
      "espacos": 2,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Tacape",
    "system": {
      "descricao": "",
      "dano": "1d10",
      "critico": "x2",
      "tipo": "impacto",
      "alcance": "",
      "grupo": "simples",
      "empunhadura": "duasMaos",
      "propriedades": "",
      "preco": 0,
      "espacos": 2,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Azagaia",
    "system": {
      "descricao": "Penalidade -5 corpo a corpo",
      "dano": "1d6",
      "critico": "x2",
      "tipo": "perfuração",
      "alcance": "médio",
      "grupo": "simples",
      "empunhadura": "umaMao",
      "propriedades": "Penalidade -5 corpo a corpo",
      "preco": 1,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Besta Leve",
    "system": {
      "descricao": "Recarregar: ação de movimento",
      "dano": "1d8",
      "critico": "19/x2",
      "tipo": "perfuração",
      "alcance": "médio",
      "grupo": "simples",
      "empunhadura": "umaMao",
      "propriedades": "Recarregar: ação de movimento",
      "preco": 35,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Funda",
    "system": {
      "descricao": "Aplica Força ao dano, Recarregar: ação de movimento",
      "dano": "1d4",
      "critico": "x2",
      "tipo": "impacto",
      "alcance": "médio",
      "grupo": "simples",
      "empunhadura": "umaMao",
      "propriedades": "Aplica Força ao dano, Recarregar: ação de movimento",
      "preco": 0,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Arco Curto",
    "system": {
      "descricao": "Pode ser usado montado",
      "dano": "1d6",
      "critico": "x3",
      "tipo": "perfuração",
      "alcance": "médio",
      "grupo": "simples",
      "empunhadura": "duasMaos",
      "propriedades": "Pode ser usado montado",
      "preco": 30,
      "espacos": 2,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Machadinha",
    "system": {
      "descricao": "Arremessável",
      "dano": "1d6",
      "critico": "x3",
      "tipo": "corte",
      "alcance": "curto",
      "grupo": "marcial",
      "empunhadura": "leve",
      "propriedades": "Arremessável",
      "preco": 6,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Cimitarra",
    "system": {
      "descricao": "Arma ágil",
      "dano": "1d6",
      "critico": "18/x2",
      "tipo": "corte",
      "alcance": "",
      "grupo": "marcial",
      "empunhadura": "umaMao",
      "propriedades": "Arma ágil",
      "preco": 15,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Espada Longa",
    "system": {
      "descricao": "",
      "dano": "1d8",
      "critico": "19/x2",
      "tipo": "corte",
      "alcance": "",
      "grupo": "marcial",
      "empunhadura": "umaMao",
      "propriedades": "",
      "preco": 15,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Florete",
    "system": {
      "descricao": "Arma ágil",
      "dano": "1d6",
      "critico": "18/x2",
      "tipo": "perfuração",
      "alcance": "",
      "grupo": "marcial",
      "empunhadura": "umaMao",
      "propriedades": "Arma ágil",
      "preco": 20,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Machado de Batalha",
    "system": {
      "descricao": "",
      "dano": "1d8",
      "critico": "x3",
      "tipo": "corte",
      "alcance": "",
      "grupo": "marcial",
      "empunhadura": "umaMao",
      "propriedades": "",
      "preco": 10,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Mangual",
    "system": {
      "descricao": "Arma versátil, +2 para desarmar",
      "dano": "1d8",
      "critico": "x2",
      "tipo": "impacto",
      "alcance": "",
      "grupo": "marcial",
      "empunhadura": "umaMao",
      "propriedades": "Arma versátil, +2 para desarmar",
      "preco": 8,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Martelo de Guerra",
    "system": {
      "descricao": "",
      "dano": "1d8",
      "critico": "x3",
      "tipo": "impacto",
      "alcance": "",
      "grupo": "marcial",
      "empunhadura": "umaMao",
      "propriedades": "",
      "preco": 12,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Picareta",
    "system": {
      "descricao": "",
      "dano": "1d6",
      "critico": "x4",
      "tipo": "perfuração",
      "alcance": "",
      "grupo": "marcial",
      "empunhadura": "umaMao",
      "propriedades": "",
      "preco": 8,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Tridente",
    "system": {
      "descricao": "Arma versátil, +2 para derrubar, arremessável",
      "dano": "1d8",
      "critico": "x2",
      "tipo": "perfuração",
      "alcance": "curto",
      "grupo": "marcial",
      "empunhadura": "umaMao",
      "propriedades": "Arma versátil, +2 para derrubar, arremessável",
      "preco": 15,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Alabarda",
    "system": {
      "descricao": "Arma alongada",
      "dano": "1d10",
      "critico": "x3",
      "tipo": "corte",
      "alcance": "",
      "grupo": "marcial",
      "empunhadura": "duasMaos",
      "propriedades": "Arma alongada",
      "preco": 10,
      "espacos": 2,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Alfange",
    "system": {
      "descricao": "",
      "dano": "2d4",
      "critico": "18/x2",
      "tipo": "corte",
      "alcance": "",
      "grupo": "marcial",
      "empunhadura": "duasMaos",
      "propriedades": "",
      "preco": 75,
      "espacos": 2,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Gadanho",
    "system": {
      "descricao": "",
      "dano": "2d4",
      "critico": "x4",
      "tipo": "corte",
      "alcance": "",
      "grupo": "marcial",
      "empunhadura": "duasMaos",
      "propriedades": "",
      "preco": 18,
      "espacos": 2,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Lança Montada",
    "system": {
      "descricao": "Arma alongada, uma mão se montado, +2d8 dano em investida montada",
      "dano": "1d8",
      "critico": "x3",
      "tipo": "perfuração",
      "alcance": "",
      "grupo": "marcial",
      "empunhadura": "duasMaos",
      "propriedades": "Arma alongada, uma mão se montado, +2d8 dano em investida montada",
      "preco": 10,
      "espacos": 2,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Machado de Guerra",
    "system": {
      "descricao": "",
      "dano": "1d12",
      "critico": "x3",
      "tipo": "corte",
      "alcance": "",
      "grupo": "marcial",
      "empunhadura": "duasMaos",
      "propriedades": "",
      "preco": 20,
      "espacos": 2,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Marreta",
    "system": {
      "descricao": "",
      "dano": "3d4",
      "critico": "x2",
      "tipo": "impacto",
      "alcance": "",
      "grupo": "marcial",
      "empunhadura": "duasMaos",
      "propriedades": "",
      "preco": 20,
      "espacos": 2,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Montante",
    "system": {
      "descricao": "",
      "dano": "2d6",
      "critico": "19/x2",
      "tipo": "corte",
      "alcance": "",
      "grupo": "marcial",
      "empunhadura": "duasMaos",
      "propriedades": "",
      "preco": 50,
      "espacos": 2,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Arco Longo",
    "system": {
      "descricao": "Aplica Força ao dano, não pode ser usado montado",
      "dano": "1d8",
      "critico": "x3",
      "tipo": "perfuração",
      "alcance": "médio",
      "grupo": "marcial",
      "empunhadura": "duasMaos",
      "propriedades": "Aplica Força ao dano, não pode ser usado montado",
      "preco": 100,
      "espacos": 2,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Besta Pesada",
    "system": {
      "descricao": "Recarregar: ação padrão",
      "dano": "1d12",
      "critico": "19/x2",
      "tipo": "perfuração",
      "alcance": "médio",
      "grupo": "marcial",
      "empunhadura": "duasMaos",
      "propriedades": "Recarregar: ação padrão",
      "preco": 50,
      "espacos": 2,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Chicote",
    "system": {
      "descricao": "Alcance 4,5m, arma ágil e versátil, +2 para derrubar ou desarmar",
      "dano": "1d3",
      "critico": "x2",
      "tipo": "corte",
      "alcance": "",
      "grupo": "exótica",
      "empunhadura": "umaMao",
      "propriedades": "Alcance 4,5m, arma ágil e versátil, +2 para derrubar ou desarmar",
      "preco": 2,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Espada Bastarda",
    "system": {
      "descricao": "Arma adaptável, pode ser usada como marcial de duas mãos (dano 1d12)",
      "dano": "1d10/1d12",
      "critico": "19/x2",
      "tipo": "corte",
      "alcance": "",
      "grupo": "exótica",
      "empunhadura": "umaMao",
      "propriedades": "Arma adaptável, pode ser usada como marcial de duas mãos (dano 1d12)",
      "preco": 35,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Katana",
    "system": {
      "descricao": "Arma adaptável e ágil, pode ser usada como marcial de duas mãos (dano 1d10)",
      "dano": "1d8/1d10",
      "critico": "19/x2",
      "tipo": "corte",
      "alcance": "",
      "grupo": "exótica",
      "empunhadura": "umaMao",
      "propriedades": "Arma adaptável e ágil, pode ser usada como marcial de duas mãos (dano 1d10)",
      "preco": 100,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Machado Anão",
    "system": {
      "descricao": "Pode ser usado como marcial de duas mãos",
      "dano": "1d10",
      "critico": "x3",
      "tipo": "corte",
      "alcance": "",
      "grupo": "exótica",
      "empunhadura": "umaMao",
      "propriedades": "Pode ser usado como marcial de duas mãos",
      "preco": 30,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Corrente de Espinhos",
    "system": {
      "descricao": "Alcance 4,5m, arma ágil, dupla e versátil, +2 para derrubar ou desarmar",
      "dano": "2d4/2d4",
      "critico": "19/x2",
      "tipo": "corte",
      "alcance": "",
      "grupo": "exótica",
      "empunhadura": "duasMaos",
      "propriedades": "Alcance 4,5m, arma ágil, dupla e versátil, +2 para derrubar ou desarmar",
      "preco": 25,
      "espacos": 2,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Machado Táurico",
    "system": {
      "descricao": "Arma desbalanceada",
      "dano": "2d8",
      "critico": "x3",
      "tipo": "corte",
      "alcance": "",
      "grupo": "exótica",
      "empunhadura": "duasMaos",
      "propriedades": "Arma desbalanceada",
      "preco": 50,
      "espacos": 2,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Rede",
    "system": {
      "descricao": "Não causa dano, enreda o alvo",
      "dano": "—",
      "critico": "—",
      "tipo": "",
      "alcance": "curto",
      "grupo": "exótica",
      "empunhadura": "umaMao",
      "propriedades": "Não causa dano, enreda o alvo",
      "preco": 20,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Pistola",
    "system": {
      "descricao": "Recarregar: ação padrão",
      "dano": "2d6",
      "critico": "19/x3",
      "tipo": "perfuração",
      "alcance": "curto",
      "grupo": "fogo",
      "empunhadura": "leve",
      "propriedades": "Recarregar: ação padrão",
      "preco": 250,
      "espacos": 1,
      "bonus": 0,
      "equipada": false
    }
  },
  {
    "name": "Mosquete",
    "system": {
      "descricao": "Recarregar: ação padrão",
      "dano": "2d8",
      "critico": "19/x3",
      "tipo": "perfuração",
      "alcance": "médio",
      "grupo": "fogo",
      "empunhadura": "duasMaos",
      "propriedades": "Recarregar: ação padrão",
      "preco": 500,
      "espacos": 2,
      "bonus": 0,
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
  ui.notifications.info("Importando 40 armas...");
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
  ui.notifications.info(count + " armas importados!");
}

importar();
