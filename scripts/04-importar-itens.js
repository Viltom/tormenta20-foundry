// ============================================================
// TORMENTA 20 - Importar Itens
// Total: 44 itens | Pack: tormenta20.itens
// ============================================================

const PACK_NAME = "tormenta20.itens";
const ITEM_TYPE = "equipamento";
const ICON = "icons/svg/item-bag.svg";

const DATA = [
  {
    "name": "Água Benta",
    "system": {
      "descricao": "Frasco com água abençoada. Pode ser arremessada (alcance curto). Causa 2d4 pontos de dano de luz a mortos-vivos e criaturas malignas.",
      "categoria": "aventura",
      "quantidade": 1,
      "peso": 0.5,
      "preco": "T$ 10",
      "espacos": 0.5
    }
  },
  {
    "name": "Algemas",
    "system": {
      "descricao": "Prendem os pulsos de uma criatura. Escapar exige teste de Ladinagem ou Força CD 30.",
      "categoria": "aventura",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 15",
      "espacos": 1
    }
  },
  {
    "name": "Arpéu",
    "system": {
      "descricao": "Gancho de ferro preso a uma corda. +2 em testes de Atletismo para escalar.",
      "categoria": "aventura",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 5",
      "espacos": 1
    }
  },
  {
    "name": "Bandoleira de Poções",
    "system": {
      "descricao": "Permite sacar uma poção como ação livre em vez de ação de movimento.",
      "categoria": "aventura",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 20",
      "espacos": 1
    }
  },
  {
    "name": "Barraca",
    "system": {
      "descricao": "Abrigo portátil para duas pessoas.",
      "categoria": "aventura",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 10",
      "espacos": 1
    }
  },
  {
    "name": "Corda (10m)",
    "system": {
      "descricao": "10 metros de corda de cânhamo.",
      "categoria": "aventura",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 1",
      "espacos": 1
    }
  },
  {
    "name": "Espelho",
    "system": {
      "descricao": "Pequeno espelho de aço polido.",
      "categoria": "aventura",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 10",
      "espacos": 1
    }
  },
  {
    "name": "Lampião",
    "system": {
      "descricao": "Ilumina como uma tocha, mas a chama é protegida. Dura 6 horas por dose de óleo.",
      "categoria": "aventura",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 7",
      "espacos": 1
    }
  },
  {
    "name": "Mochila",
    "system": {
      "descricao": "Permite carregar até 10 espaços de equipamento.",
      "categoria": "aventura",
      "quantidade": 1,
      "peso": 0,
      "preco": "T$ 2",
      "espacos": 0
    }
  },
  {
    "name": "Mochila de Aventureiro",
    "system": {
      "descricao": "Permite carregar até 14 espaços de equipamento.",
      "categoria": "aventura",
      "quantidade": 1,
      "peso": 0,
      "preco": "T$ 50",
      "espacos": 0
    }
  },
  {
    "name": "Óleo (frasco)",
    "system": {
      "descricao": "Pode abastecer um lampião ou ser jogado para criar terreno escorregadio.",
      "categoria": "aventura",
      "quantidade": 1,
      "peso": 0.5,
      "preco": "T$ 0.1",
      "espacos": 0.5
    }
  },
  {
    "name": "Organizador de Pergaminhos",
    "system": {
      "descricao": "Permite sacar um pergaminho como ação livre em vez de ação de movimento.",
      "categoria": "aventura",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 25",
      "espacos": 1
    }
  },
  {
    "name": "Pé de Cabra",
    "system": {
      "descricao": "+2 em testes de Força para arrombar.",
      "categoria": "aventura",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 2",
      "espacos": 1
    }
  },
  {
    "name": "Saco de Dormir",
    "system": {
      "descricao": "Necessário para descansar confortavelmente ao ar livre.",
      "categoria": "aventura",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 1",
      "espacos": 1
    }
  },
  {
    "name": "Símbolo Sagrado",
    "system": {
      "descricao": "Necessário para lançar magias divinas. Representa a divindade do personagem.",
      "categoria": "aventura",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 5",
      "espacos": 1
    }
  },
  {
    "name": "Tocha",
    "system": {
      "descricao": "Ilumina 6m. Pode ser usada como arma improvisada (1d4 dano de fogo). Dura 1 hora.",
      "categoria": "aventura",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 0.1",
      "espacos": 1
    }
  },
  {
    "name": "Vara de Madeira (3m)",
    "system": {
      "descricao": "Usada para verificar armadilhas e obstáculos.",
      "categoria": "aventura",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 0.2",
      "espacos": 1
    }
  },
  {
    "name": "Instrumento Musical",
    "system": {
      "descricao": "Necessário para usar habilidades de bardo.",
      "categoria": "ferramenta",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 30",
      "espacos": 1
    }
  },
  {
    "name": "Kit de Disfarces",
    "system": {
      "descricao": "+2 em testes de Enganação para disfarce.",
      "categoria": "ferramenta",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 50",
      "espacos": 1
    }
  },
  {
    "name": "Kit de Medicamentos",
    "system": {
      "descricao": "Necessário para usar Cura em primeiros socorros e tratamento. 10 usos.",
      "categoria": "ferramenta",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 15",
      "espacos": 1
    }
  },
  {
    "name": "Kit de Venenos",
    "system": {
      "descricao": "+2 em testes de Ofício (alquimia) para criar venenos.",
      "categoria": "ferramenta",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 50",
      "espacos": 1
    }
  },
  {
    "name": "Grimório",
    "system": {
      "descricao": "Livro onde arcanistas registram suas magias. Necessário para preparar magias.",
      "categoria": "ferramenta",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 100",
      "espacos": 1
    }
  },
  {
    "name": "Ferramentas de Ladrão",
    "system": {
      "descricao": "Necessário para usar Ladinagem em fechaduras e armadilhas.",
      "categoria": "ferramenta",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 30",
      "espacos": 1
    }
  },
  {
    "name": "Ferramentas de Ofício",
    "system": {
      "descricao": "Ferramentas para um ofício específico.",
      "categoria": "ferramenta",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 15",
      "espacos": 1
    }
  },
  {
    "name": "Chapéu Arcano",
    "system": {
      "descricao": "Um chapéu pontudo tradicional de magos.",
      "categoria": "vestuário",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 50",
      "espacos": 1
    }
  },
  {
    "name": "Manto Camuflado",
    "system": {
      "descricao": "+2 em Furtividade em ambientes naturais.",
      "categoria": "vestuário",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 12",
      "espacos": 1
    }
  },
  {
    "name": "Manto Eclesiástico",
    "system": {
      "descricao": "+2 em Diplomacia com membros da mesma fé.",
      "categoria": "vestuário",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 20",
      "espacos": 1
    }
  },
  {
    "name": "Robe Místico",
    "system": {
      "descricao": "Tradicional vestimenta de magos e estudiosos.",
      "categoria": "vestuário",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 50",
      "espacos": 1
    }
  },
  {
    "name": "Traje da Corte",
    "system": {
      "descricao": "+2 em Diplomacia e Nobreza em ambientes nobres.",
      "categoria": "vestuário",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 100",
      "espacos": 1
    }
  },
  {
    "name": "Traje de Viajante",
    "system": {
      "descricao": "Roupas confortáveis para viagem.",
      "categoria": "vestuário",
      "quantidade": 1,
      "peso": 0,
      "preco": "T$ 10",
      "espacos": 0
    }
  },
  {
    "name": "Ácido (frasco)",
    "system": {
      "descricao": "Pode ser arremessado (alcance curto). Causa 1d6 pontos de dano de ácido.",
      "categoria": "alquímico",
      "quantidade": 1,
      "peso": 0.5,
      "preco": "T$ 25",
      "espacos": 0.5
    }
  },
  {
    "name": "Fogo Alquímico (frasco)",
    "system": {
      "descricao": "Pode ser arremessado (alcance curto). Causa 1d6 pontos de dano de fogo.",
      "categoria": "alquímico",
      "quantidade": 1,
      "peso": 0.5,
      "preco": "T$ 20",
      "espacos": 0.5
    }
  },
  {
    "name": "Antídoto",
    "system": {
      "descricao": "Cura uma condição de envenenamento.",
      "categoria": "alquímico",
      "quantidade": 1,
      "peso": 0.5,
      "preco": "T$ 50",
      "espacos": 0.5
    }
  },
  {
    "name": "Poção de Cura Leve",
    "system": {
      "descricao": "Recupera 2d8+2 PV.",
      "categoria": "alquímico",
      "quantidade": 1,
      "peso": 0.5,
      "preco": "T$ 50",
      "espacos": 0.5
    }
  },
  {
    "name": "Poção de Cura Moderada",
    "system": {
      "descricao": "Recupera 4d8+4 PV.",
      "categoria": "alquímico",
      "quantidade": 1,
      "peso": 0.5,
      "preco": "T$ 300",
      "espacos": 0.5
    }
  },
  {
    "name": "Flechas (20)",
    "system": {
      "descricao": "Aljava com 20 flechas para arcos.",
      "categoria": "munição",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 1",
      "espacos": 1
    }
  },
  {
    "name": "Virotes (20)",
    "system": {
      "descricao": "Aljava com 20 virotes para bestas.",
      "categoria": "munição",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 2",
      "espacos": 1
    }
  },
  {
    "name": "Balas (20)",
    "system": {
      "descricao": "Bolsa com 20 balas e pólvora para armas de fogo.",
      "categoria": "munição",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 20",
      "espacos": 1
    }
  },
  {
    "name": "Pedras de Funda (20)",
    "system": {
      "descricao": "Saco com 20 pedras polidas para fundas.",
      "categoria": "munição",
      "quantidade": 1,
      "peso": 1,
      "preco": "T$ 0.5",
      "espacos": 1
    }
  },
  {
    "name": "Cavalo",
    "system": {
      "descricao": "Montaria comum.",
      "categoria": "animal",
      "quantidade": 1,
      "peso": 0,
      "preco": "T$ 75",
      "espacos": 0
    }
  },
  {
    "name": "Cavalo de Guerra",
    "system": {
      "descricao": "Montaria treinada para combate.",
      "categoria": "animal",
      "quantidade": 1,
      "peso": 0,
      "preco": "T$ 400",
      "espacos": 0
    }
  },
  {
    "name": "Pônei",
    "system": {
      "descricao": "Montaria para criaturas Pequenas.",
      "categoria": "animal",
      "quantidade": 1,
      "peso": 0,
      "preco": "T$ 5",
      "espacos": 0
    }
  },
  {
    "name": "Pônei de Guerra",
    "system": {
      "descricao": "Montaria de combate para criaturas Pequenas.",
      "categoria": "animal",
      "quantidade": 1,
      "peso": 0,
      "preco": "T$ 30",
      "espacos": 0
    }
  },
  {
    "name": "Cão de Caça",
    "system": {
      "descricao": "Animal treinado para rastrear.",
      "categoria": "animal",
      "quantidade": 1,
      "peso": 0,
      "preco": "T$ 150",
      "espacos": 0
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
  ui.notifications.info("Importando 44 itens...");
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
  ui.notifications.info(count + " itens importados!");
}

importar();
