// ============================================================
// TORMENTA 20 - Importar Poderes
// Total: 84 itens | Pack: tormenta20.poderes
// ============================================================

const PACK_NAME = "tormenta20.poderes";
const ITEM_TYPE = "poder";
const ICON = "icons/svg/lightning.svg";

const DATA = [
  {
    "name": "Acuidade com Arma",
    "system": {
      "descricao": "Quando usa uma arma corpo a corpo leve ou uma arma de arremesso, você pode usar sua Destreza em vez de Força nos testes de ataque e rolagens de dano.",
      "tipo": "combate",
      "requisitos": "Des 1",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Arma Secundária Grande",
    "system": {
      "descricao": "Você pode empunhar duas armas de uma mão com o poder Estilo de Duas Armas.",
      "tipo": "combate",
      "requisitos": "Estilo de Duas Armas",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Arremesso Múltiplo",
    "system": {
      "descricao": "Uma vez por rodada, quando faz um ataque com uma arma de arremesso, você pode gastar 1 PM para fazer um ataque adicional contra o mesmo alvo, arremessando outra arma de arremesso.",
      "tipo": "combate",
      "requisitos": "Des 1, Estilo de Arremesso",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Arremesso Potente",
    "system": {
      "descricao": "Quando usa uma arma de arremesso, você pode usar sua Força em vez de Destreza nos testes de ataque. Se você possuir o poder Ataque Poderoso, poderá usá-lo com armas de arremesso.",
      "tipo": "combate",
      "requisitos": "For 1, Estilo de Arremesso",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Ataque com Escudo",
    "system": {
      "descricao": "Uma vez por rodada, se estiver empunhando um escudo e fizer a ação agredir, você pode gastar 1 PM para fazer um ataque corpo a corpo extra com o escudo. Este ataque não faz você perder o bônus do escudo na Defesa.",
      "tipo": "combate",
      "requisitos": "Estilo de Arma e Escudo",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Ataque Pesado",
    "system": {
      "descricao": "Quando faz um ataque corpo a corpo com uma arma de duas mãos, você pode pagar 1 PM. Se fizer isso e acertar o ataque, além do dano você faz uma manobra derrubar ou empurrar contra o alvo como uma ação livre.",
      "tipo": "combate",
      "requisitos": "Estilo de Duas Mãos",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Ataque Poderoso",
    "system": {
      "descricao": "Sempre que faz um ataque corpo a corpo, você pode sofrer –2 no teste de ataque para receber +5 na rolagem de dano.",
      "tipo": "combate",
      "requisitos": "For 1",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Ataque Preciso",
    "system": {
      "descricao": "Se estiver empunhando uma arma corpo a corpo em uma das mãos e nada na outra, você recebe +2 na margem de ameaça e +1 no multiplicador de crítico.",
      "tipo": "combate",
      "requisitos": "Estilo de Uma Arma",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Bloqueio com Escudo",
    "system": {
      "descricao": "Quando sofre dano, você pode gastar 1 PM para receber redução de dano igual ao bônus na Defesa que seu escudo fornece contra este dano.",
      "tipo": "combate",
      "requisitos": "Estilo de Arma e Escudo",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Carga de Cavalaria",
    "system": {
      "descricao": "Quando faz uma investida montada, você causa +2d8 pontos de dano. Além disso, pode continuar se movendo depois do ataque.",
      "tipo": "combate",
      "requisitos": "Ginete",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Combate Defensivo",
    "system": {
      "descricao": "Quando usa a ação agredir, você pode sofrer –2 nos testes de ataque para receber +5 na Defesa até o início do seu próximo turno.",
      "tipo": "combate",
      "requisitos": "Int 1",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Derrubar Aprimorado",
    "system": {
      "descricao": "Você recebe +2 em testes de manobra de derrubar. Quando derruba uma criatura, pode gastar 1 PM para fazer um ataque corpo a corpo extra contra ela como ação livre.",
      "tipo": "combate",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Desarmar Aprimorado",
    "system": {
      "descricao": "Você recebe +2 em testes de manobra de desarmar. Quando desarma uma criatura, pode gastar 1 PM para arremessar a arma dela para onde quiser em alcance curto.",
      "tipo": "combate",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Disparo Preciso",
    "system": {
      "descricao": "Você pode fazer ataques à distância contra alvos envolvidos em combate corpo a corpo sem sofrer a penalidade de –5 no teste de ataque.",
      "tipo": "combate",
      "requisitos": "Estilo de Disparo",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Disparo Rápido",
    "system": {
      "descricao": "Se estiver empunhando uma arma de disparo e fizer a ação agredir, pode gastar 2 PM para fazer um ataque adicional com essa arma.",
      "tipo": "combate",
      "requisitos": "Des 1, Estilo de Disparo",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Empunhadura Poderosa",
    "system": {
      "descricao": "Você pode usar armas de duas mãos com apenas uma mão, mas sofre –2 nos testes de ataque.",
      "tipo": "combate",
      "requisitos": "For 3",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Encouraçado",
    "system": {
      "descricao": "Se estiver usando uma armadura pesada, a penalidade de armadura dela diminui em 1 e você recebe +1 na Defesa.",
      "tipo": "combate",
      "requisitos": "Proficiência com armaduras pesadas",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Esquiva",
    "system": {
      "descricao": "Você recebe +2 na Defesa e em Reflexos.",
      "tipo": "combate",
      "requisitos": "Des 1",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Estilo de Arma e Escudo",
    "system": {
      "descricao": "Se estiver usando escudo, você aplica o bônus de Defesa dele em testes de Reflexos.",
      "tipo": "combate",
      "requisitos": "Proficiência com escudos",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Estilo de Arma Longa",
    "system": {
      "descricao": "Se estiver usando uma arma alongada, você pode atacar inimigos adjacentes.",
      "tipo": "combate",
      "requisitos": "For 1, Luta",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Estilo de Arremesso",
    "system": {
      "descricao": "Você pode sacar armas de arremesso como uma ação livre e recebe +2 nas rolagens de dano com elas.",
      "tipo": "combate",
      "requisitos": "Pontaria",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Estilo de Disparo",
    "system": {
      "descricao": "Se estiver usando uma arma de disparo, você soma sua Destreza nas rolagens de dano.",
      "tipo": "combate",
      "requisitos": "Pontaria",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Estilo de Duas Armas",
    "system": {
      "descricao": "Se estiver empunhando duas armas e fizer a ação agredir, pode gastar 2 PM para fazer um ataque adicional com a arma secundária (leve). Sofre –2 em todos os ataques da rodada.",
      "tipo": "combate",
      "requisitos": "Des 2, Luta",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Estilo de Duas Mãos",
    "system": {
      "descricao": "Se estiver empunhando uma arma de duas mãos, você recebe +5 nas rolagens de dano.",
      "tipo": "combate",
      "requisitos": "For 2, Luta",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Estilo de Uma Arma",
    "system": {
      "descricao": "Se estiver empunhando uma arma corpo a corpo em uma das mãos e nada na outra, recebe +2 na Defesa.",
      "tipo": "combate",
      "requisitos": "Luta",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Estilo Desarmado",
    "system": {
      "descricao": "Seus ataques desarmados causam 1d6 de dano e podem causar dano letal. Você pode usar Luta para ataques desarmados.",
      "tipo": "combate",
      "requisitos": "Luta",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Fanático",
    "system": {
      "descricao": "Sempre que perde pontos de vida, você recebe +1 em testes de ataque e rolagens de dano até o final da cena (cumulativo).",
      "tipo": "combate",
      "requisitos": "12º nível",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Finta Aprimorada",
    "system": {
      "descricao": "Você pode gastar 1 PM para usar Enganação para fintar como ação de movimento. Além disso, quando finta, pode gastar 2 PM para fazer com que o alvo perca a Destreza na Defesa contra todos os ataques até o início de seu próximo turno.",
      "tipo": "combate",
      "requisitos": "Enganação",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Foco em Arma",
    "system": {
      "descricao": "Escolha uma arma. Você recebe +2 em testes de ataque com essa arma.",
      "tipo": "combate",
      "requisitos": "Proficiência com a arma",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Ginete",
    "system": {
      "descricao": "Você pode atacar, conjurar magias e usar habilidades normalmente quando montado. Além disso, a Defesa e os testes de Reflexos da montaria usam seu bônus de Des se for maior.",
      "tipo": "combate",
      "requisitos": "Cavalgar",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Inexpugnável",
    "system": {
      "descricao": "Você recebe +2 em testes de resistência.",
      "tipo": "combate",
      "requisitos": "6º nível",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Mira Apurada",
    "system": {
      "descricao": "Se estiver usando uma arma de disparo, pode gastar 1 PM para somar sua Sabedoria na rolagem de dano.",
      "tipo": "combate",
      "requisitos": "Sab 1, Estilo de Disparo",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Piqueiro",
    "system": {
      "descricao": "Uma vez por rodada, quando uma criatura entra no alcance de sua arma alongada, pode gastar 1 PM para fazer um ataque corpo a corpo contra ela como reação.",
      "tipo": "combate",
      "requisitos": "Estilo de Arma Longa",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Presença Aterradora",
    "system": {
      "descricao": "Você pode gastar uma ação padrão e 1 PM para fazer um teste de Intimidação contra todas as criaturas a até 9m que possam vê-lo.",
      "tipo": "combate",
      "requisitos": "Intimidação",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Proficiência",
    "system": {
      "descricao": "Você se torna proficiente em uma categoria de armas ou armaduras a sua escolha.",
      "tipo": "combate",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Quebrar Aprimorado",
    "system": {
      "descricao": "Você recebe +2 em testes de manobra de quebrar e ignora 5 pontos de RD de objetos.",
      "tipo": "combate",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Reflexos de Combate",
    "system": {
      "descricao": "Você ganha uma ação de movimento extra no primeiro turno de cada combate.",
      "tipo": "combate",
      "requisitos": "Des 1",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Saque Rápido",
    "system": {
      "descricao": "Você pode sacar ou guardar itens como ação livre. Além disso, ganha +2 em Iniciativa.",
      "tipo": "combate",
      "requisitos": "Iniciativa",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Trespassar",
    "system": {
      "descricao": "Quando reduz uma criatura a 0 PV com um ataque corpo a corpo, pode gastar 1 PM para fazer outro ataque corpo a corpo contra uma criatura adjacente.",
      "tipo": "combate",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Vitalidade",
    "system": {
      "descricao": "Você recebe +1 PV por nível e +2 em Fortitude.",
      "tipo": "combate",
      "requisitos": "Con 1",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Acrobático",
    "system": {
      "descricao": "Você recebe +2 em Acrobacia e +1 em Reflexos.",
      "tipo": "destino",
      "requisitos": "Des 2",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Aparência Inofensiva",
    "system": {
      "descricao": "A primeira criatura que atacar você em cada cena deve fazer um teste de Vontade (CD Car). Se falhar, perde a ação.",
      "tipo": "destino",
      "requisitos": "Car 1",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Atlético",
    "system": {
      "descricao": "Você recebe +2 em Atletismo e +1 em Fortitude.",
      "tipo": "destino",
      "requisitos": "For 2",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Atraente",
    "system": {
      "descricao": "Você recebe +2 em testes de perícias baseadas em Carisma contra criaturas que possam se sentir atraídas por você.",
      "tipo": "destino",
      "requisitos": "Car 1",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Comandar",
    "system": {
      "descricao": "Você pode gastar uma ação padrão e 1 PM para gritar ordens para aliados em alcance médio. Eles recebem +1 em testes de ataque até o início de seu próximo turno.",
      "tipo": "destino",
      "requisitos": "Car 1",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Costas Largas",
    "system": {
      "descricao": "Você recebe +2 na capacidade de carga e pode usar armaduras pesadas sem redução de deslocamento.",
      "tipo": "destino",
      "requisitos": "Con 1, For 1",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Foco em Perícia",
    "system": {
      "descricao": "Escolha uma perícia. Você recebe +2 nessa perícia.",
      "tipo": "destino",
      "requisitos": "Treinado na perícia",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Inventário Organizado",
    "system": {
      "descricao": "Você recebe +2 espaços em sua capacidade de carga. Pode gastar 1 PM para sacar um item como ação livre.",
      "tipo": "destino",
      "requisitos": "Int 1",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Investigador",
    "system": {
      "descricao": "Você recebe +2 em Investigação e pode vasculhar uma área inteira com uma única ação padrão.",
      "tipo": "destino",
      "requisitos": "Int 1",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Lobo Solitário",
    "system": {
      "descricao": "Enquanto não estiver adjacente a nenhum aliado, você recebe +1 em testes de ataque, Defesa e testes de resistência.",
      "tipo": "destino",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Medicina",
    "system": {
      "descricao": "Você recebe +2 em Cura e pode curar 1d6 PV de um aliado adjacente como ação padrão usando kit de medicamentos.",
      "tipo": "destino",
      "requisitos": "Sab 1",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Médico de Campo",
    "system": {
      "descricao": "Quando usa Cura para primeiros socorros, o aliado recupera PV iguais à margem de sucesso.",
      "tipo": "destino",
      "requisitos": "Medicina",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Sortudo",
    "system": {
      "descricao": "Você pode gastar 3 PM para rolar novamente um teste recém realizado.",
      "tipo": "destino",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Surto Heroico",
    "system": {
      "descricao": "Uma vez por rodada, você pode gastar 5 PM para realizar uma ação padrão ou de movimento adicional.",
      "tipo": "destino",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Torcida",
    "system": {
      "descricao": "Você recebe +2 em testes de perícia quando incentivado por pelo menos uma criatura amigável.",
      "tipo": "destino",
      "requisitos": "Car 1",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Treinamento em Perícia",
    "system": {
      "descricao": "Você se torna treinado em uma perícia a sua escolha.",
      "tipo": "destino",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Venefício",
    "system": {
      "descricao": "Você recebe +2 para criar e aplicar venenos. Ao aplicar um veneno numa arma, ele dura um combate inteiro.",
      "tipo": "destino",
      "requisitos": "Ofício (alquimista)",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Vontade de Ferro",
    "system": {
      "descricao": "Você recebe +2 em Vontade e pode gastar 1 PM para refazer um teste de Vontade que acabou de falhar.",
      "tipo": "destino",
      "requisitos": "Sab 1",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Celebrar Ritual",
    "system": {
      "descricao": "Você pode lançar magias como rituais. O tempo de execução aumenta para 1 hora e o custo em PM é reduzido à metade.",
      "tipo": "magia",
      "requisitos": "Habilidade Magias, Misticismo ou Religião, 8º nível",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Escrever Pergaminho",
    "system": {
      "descricao": "Você pode criar pergaminhos de magias que conhece.",
      "tipo": "magia",
      "requisitos": "Habilidade Magias, Ofício (escriba)",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Foco em Magia",
    "system": {
      "descricao": "Escolha uma magia. Sua CD aumenta em +2.",
      "tipo": "magia",
      "requisitos": "Lançar magias",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Magia Acelerada",
    "system": {
      "descricao": "Você pode gastar +4 PM para lançar uma magia como ação livre. Só pode usar uma vez por rodada.",
      "tipo": "magia",
      "requisitos": "Lançar magias de 2º círculo",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Magia Ampliada",
    "system": {
      "descricao": "Você pode gastar +2 PM para dobrar o alcance ou a área de uma magia.",
      "tipo": "magia",
      "requisitos": "Lançar magias",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Magia Discreta",
    "system": {
      "descricao": "Você pode gastar +2 PM para lançar uma magia sem gesticular e sem componentes verbais.",
      "tipo": "magia",
      "requisitos": "Lançar magias",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Magia Ilimitada",
    "system": {
      "descricao": "Você pode lançar truques (magias com custo 0 PM) sem limite de usos.",
      "tipo": "magia",
      "requisitos": "Lançar magias",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Preparar Poção",
    "system": {
      "descricao": "Você pode criar poções de magias que conhece.",
      "tipo": "magia",
      "requisitos": "Habilidade Magias, Ofício (alquimista)",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Anatomia Insana",
    "system": {
      "descricao": "Você tem 25% de chance (resultado '1' em 1d4) de ignorar o dano adicional de um acerto crítico ou ataque furtivo. A chance aumenta em +25% para cada dois outros poderes da Tormenta que você possui.",
      "tipo": "tormenta",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Antenas",
    "system": {
      "descricao": "Você recebe +1 em Iniciativa, Percepção e Vontade. Este bônus aumenta em +1 para cada dois outros poderes da Tormenta que você possui.",
      "tipo": "tormenta",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Armamento Aberrante",
    "system": {
      "descricao": "Você pode gastar uma ação de movimento e 1 PM para produzir uma versão orgânica de qualquer arma corpo a corpo ou de arremesso com a qual seja proficiente. O dano da arma aumenta em um passo para cada dois outros poderes da Tormenta.",
      "tipo": "tormenta",
      "requisitos": "Outro poder da Tormenta",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Articulações Flexíveis",
    "system": {
      "descricao": "Você recebe +1 em Acrobacia, Furtividade e Reflexos. Este bônus aumenta em +1 para cada dois outros poderes da Tormenta que você possui.",
      "tipo": "tormenta",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Asas Insetoides",
    "system": {
      "descricao": "Você pode gastar 1 PM para receber deslocamento de voo 9m até o fim do seu turno. O deslocamento aumenta em +1,5m para cada outro poder da Tormenta.",
      "tipo": "tormenta",
      "requisitos": "Quatro outros poderes da Tormenta",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Carapaça",
    "system": {
      "descricao": "Sua pele é recoberta por placas quitinosas. Você recebe +1 na Defesa. Este bônus aumenta em +1 para cada dois outros poderes da Tormenta.",
      "tipo": "tormenta",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Corpo Aberrante",
    "system": {
      "descricao": "Seu dano desarmado aumenta em um passo, mais um passo para cada quatro outros poderes da Tormenta que você possui.",
      "tipo": "tormenta",
      "requisitos": "Outro poder da Tormenta",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Cuspir Enxame",
    "system": {
      "descricao": "Você pode gastar uma ação completa e 2 PM para criar um enxame de insetos rubros que causa 2d6 de dano de ácido. Para cada dois outros poderes da Tormenta, pode gastar +1 PM para aumentar o dano em +1d6.",
      "tipo": "tormenta",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Dentes Afiados",
    "system": {
      "descricao": "Você recebe uma arma natural de mordida (dano 1d4, crítico x2, corte). Uma vez por rodada, quando ataca com outra arma, pode gastar 1 PM para fazer um ataque extra com a mordida.",
      "tipo": "tormenta",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Desprezar a Realidade",
    "system": {
      "descricao": "Você pode gastar 2 PM para ficar no limiar da realidade até o início de seu próximo turno. Nesse estado, ignora terreno difícil e causa 20% de chance de falha em efeitos contra você.",
      "tipo": "tormenta",
      "requisitos": "Quatro outros poderes da Tormenta",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Empunhadura Rubra",
    "system": {
      "descricao": "Você pode gastar 1 PM para receber +1 em Luta até o final da cena. Este bônus aumenta em +1 para cada dois outros poderes da Tormenta.",
      "tipo": "tormenta",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Fome de Mana",
    "system": {
      "descricao": "Quando passa em um teste de resistência para resistir a uma habilidade mágica, você recebe 1 PM temporário cumulativo.",
      "tipo": "tormenta",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Larva Explosiva",
    "system": {
      "descricao": "Se uma criatura que tenha sofrido dano de sua mordida for reduzida a 0 PV, ela explode causando 4d4 de dano de ácido em criaturas adjacentes.",
      "tipo": "tormenta",
      "requisitos": "Dentes Afiados",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Legião Aberrante",
    "system": {
      "descricao": "Seu corpo se transforma em uma massa de insetos rubros. Você pode atravessar espaços mínimos e recebe +1 contra manobras e efeitos que tenham você como alvo.",
      "tipo": "tormenta",
      "requisitos": "Anatomia Insana, três outros poderes da Tormenta",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Mãos Membranosas",
    "system": {
      "descricao": "Você recebe +1 em Atletismo, Fortitude e testes de agarrar. Este bônus aumenta em +1 para cada dois outros poderes da Tormenta.",
      "tipo": "tormenta",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Membros Estendidos",
    "system": {
      "descricao": "Seus braços aumentam seu alcance natural para ataques corpo a corpo em +1,5m. Para cada quatro outros poderes da Tormenta, esse alcance aumenta em +1,5m.",
      "tipo": "tormenta",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Membros Extras",
    "system": {
      "descricao": "Você possui duas armas naturais de patas insetoides (dano 1d4, crítico x2, corte). Pode gastar 2 PM para fazer ataques extras com elas.",
      "tipo": "tormenta",
      "requisitos": "Quatro outros poderes da Tormenta",
      "acao": "",
      "custoPM": 0
    }
  },
  {
    "name": "Mente Aberrante",
    "system": {
      "descricao": "Você recebe resistência a efeitos mentais +1. Além disso, criaturas que usem habilidades contra você sofrem 1d6 de dano psíquico.",
      "tipo": "tormenta",
      "requisitos": "",
      "acao": "",
      "custoPM": 0
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
  ui.notifications.info("Importando 84 poderes...");
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
  ui.notifications.info(count + " poderes importados!");
}

importar();
