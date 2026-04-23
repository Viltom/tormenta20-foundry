// TORMENTA 20 - Importar Classes (14 itens)
const PACK_NAME = "tormenta20.classes";
const DATA = [
  {
    "name": "Arcanista",
    "system": {
      "descricao": "PV: 8 (+2/nível). PM: 6/nível.\nAtributo-chave: Inteligência ou Carisma.\nPerícias fixas: misticismo, vontade + 2 à escolha.\nLista: conhecimento, diplomacia, enganacao, guerra, iniciativa, intimidacao, intuicao, investigacao, nobreza, oficio, percepcao.\nProficiências: Nenhuma armadura, armas simples.\n\nMAGIAS CONHECIDAS (arcanas):\n• 1º nível: 3 magias de 1º círculo.\n• A cada nível seguinte: +1 magia de qualquer círculo que possa lançar.\n• Acesso a círculos: 1º (1º nível), 2º (5º), 3º (9º), 4º (13º), 5º (17º).\n\nSubtipos: Bruxo, Feiticeiro, Mago.\n• Bruxo: Lança magias através de um foco (varinha, cajado). Atributo-chave: Inteligência.\n• Feiticeiro: Lança magias por poder inato no sangue. Escolha uma linhagem. Atributo-chave: Carisma. Aprende magia nova APENAS em níveis ÍMPARES (3º, 5º, 7º...).\n• Mago: Lança magias por estudo e memorização de grimório. Atributo-chave: Inteligência. Só lança magias memorizadas (metade das conhecidas). Começa com 1 magia adicional (total de 4 no 1º nível) e ganha +1 magia ao acessar cada novo círculo.",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Inteligência ou Carisma",
      "acao": "PV: 8+2/nv | PM: 6/nv | 3 magias no 1º, +1/nv (Feiticeiro: ímpares; Mago: +1 por círculo)"
    }
  },
  {
    "name": "Bárbaro",
    "system": {
      "descricao": "PV: 24 (+6/nível). PM: 3/nível.\nAtributo-chave: Força.\nPerícias fixas: fortitude, luta + 4 à escolha.\nLista: adestramento, atletismo, cavalgar, iniciativa, intimidacao, oficio, percepcao, pontaria, sobrevivencia.\nProficiências: Armaduras leves, escudos, armas marciais.",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Força",
      "acao": "PV: 24+6/nv | PM: 3/nv | fortitude, luta +4"
    }
  },
  {
    "name": "Bardo",
    "system": {
      "descricao": "PV: 12 (+3/nível). PM: 4/nível.\nAtributo-chave: Carisma.\nPerícias fixas: atuacao, reflexos + 6 à escolha.\nLista: acrobacia, cavalgar, conhecimento, diplomacia, enganacao, furtividade, iniciativa, intuicao, investigacao, jogatina, ladinagem, misticismo, nobreza, percepcao, pontaria.\nProficiências: Armaduras leves, escudos, armas marciais.\n\nMAGIAS CONHECIDAS (arcanas, 3 escolas à escolha):\n• 1º nível: 2 magias de 1º círculo.\n• A cada nível PAR (2º, 4º, 6º...): +1 magia de qualquer círculo e escola que possa lançar.\n• Acesso a círculos: 1º (1º nível), 2º (6º), 3º (10º), 4º (14º).\n• Pode lançar com armadura leve sem teste de Misticismo.",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Carisma",
      "acao": "PV: 12+3/nv | PM: 4/nv | 2 magias no 1º, +1 por nível PAR"
    }
  },
  {
    "name": "Bucaneiro",
    "system": {
      "descricao": "PV: 16 (+4/nível). PM: 3/nível.\nAtributo-chave: Destreza.\nPerícias fixas: reflexos + 4 à escolha.\nLista: acrobacia, atletismo, atuacao, enganacao, furtividade, iniciativa, intimidacao, jogatina, luta, percepcao, pilotagem, pontaria.\nProficiências: Armaduras leves, armas marciais.\nSubtipos: Audácia (Luta), Audácia (Pontaria).\n• Audácia (Luta): Perícia fixa: Luta. Estilo corpo a corpo.\n• Audácia (Pontaria): Perícia fixa: Pontaria. Estilo à distância.",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Destreza",
      "acao": "PV: 16+4/nv | PM: 3/nv | reflexos +4"
    }
  },
  {
    "name": "Caçador",
    "system": {
      "descricao": "PV: 16 (+4/nível). PM: 4/nível.\nAtributo-chave: Força ou Destreza.\nPerícias fixas: sobrevivencia + 4 à escolha.\nLista: adestramento, atletismo, cavalgar, cura, fortitude, furtividade, iniciativa, investigacao, luta, oficio, percepcao, pontaria, religiao.\nProficiências: Armaduras leves, escudos, armas marciais.\nSubtipos: Marca (Luta), Marca (Pontaria).\n• Marca (Luta): Perícia fixa: Luta. Foco corpo a corpo.\n• Marca (Pontaria): Perícia fixa: Pontaria. Foco à distância.",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Força ou Destreza",
      "acao": "PV: 16+4/nv | PM: 4/nv | sobrevivencia +4"
    }
  },
  {
    "name": "Cavaleiro",
    "system": {
      "descricao": "PV: 20 (+5/nível). PM: 3/nível.\nAtributo-chave: Força.\nPerícias fixas: fortitude, luta + 2 à escolha.\nLista: adestramento, atletismo, cavalgar, diplomacia, guerra, iniciativa, intimidacao, nobreza, percepcao, vontade.\nProficiências: Armaduras pesadas, escudos, armas marciais.\nSubtipos: Bastião (5° nível), Montaria (5° nível).\n• Bastião (5° nível): Armadura pesada concede RD 5.\n• Montaria (5° nível): Recebe cavalo de guerra como parceiro veterano.",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Força",
      "acao": "PV: 20+5/nv | PM: 3/nv | fortitude, luta +2"
    }
  },
  {
    "name": "Clérigo",
    "system": {
      "descricao": "PV: 16 (+4/nível). PM: 5/nível.\nAtributo-chave: Sabedoria.\nPerícias fixas: religiao, vontade + 2 à escolha.\nLista: conhecimento, cura, diplomacia, fortitude, iniciativa, intuicao, misticismo, nobreza, oficio, percepcao.\nProficiências: Armaduras pesadas, escudos, armas simples.\n\nMAGIAS CONHECIDAS (divinas):\n• 1º nível: 3 magias de 1º círculo.\n• A cada nível seguinte: +1 magia de qualquer círculo que possa lançar.\n• Acesso a círculos: 1º (1º nível), 2º (5º), 3º (9º), 4º (13º), 5º (17º).",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Sabedoria",
      "acao": "PV: 16+4/nv | PM: 5/nv | 3 magias no 1º, +1/nv"
    }
  },
  {
    "name": "Druida",
    "system": {
      "descricao": "PV: 16 (+4/nível). PM: 4/nível.\nAtributo-chave: Sabedoria.\nPerícias fixas: sobrevivencia, vontade + 4 à escolha.\nLista: adestramento, atletismo, cavalgar, conhecimento, cura, fortitude, iniciativa, intuicao, misticismo, oficio, percepcao, religiao.\nProficiências: Armaduras leves, escudos, armas simples.\n\nMAGIAS CONHECIDAS (divinas, 3 escolas à escolha):\n• 1º nível: 2 magias de 1º círculo.\n• A cada nível PAR (2º, 4º, 6º...): +1 magia de qualquer círculo e escola que possa lançar.\n• Acesso a círculos: 1º (1º nível), 2º (6º), 3º (10º), 4º (14º).",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Sabedoria",
      "acao": "PV: 16+4/nv | PM: 4/nv | 2 magias no 1º, +1 por nível PAR"
    }
  },
  {
    "name": "Guerreiro",
    "system": {
      "descricao": "PV: 20 (+5/nível). PM: 3/nível.\nAtributo-chave: Força ou Destreza.\nPerícias fixas: fortitude + 2 à escolha.\nLista: adestramento, atletismo, cavalgar, guerra, iniciativa, intimidacao, luta, oficio, percepcao, pontaria, reflexos.\nProficiências: Armaduras pesadas, escudos, armas marciais.\nSubtipos: Ataque Especial (Luta), Ataque Especial (Pontaria).\n• Ataque Especial (Luta): Perícia fixa: Luta.\n• Ataque Especial (Pontaria): Perícia fixa: Pontaria.",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Força ou Destreza",
      "acao": "PV: 20+5/nv | PM: 3/nv | fortitude +2"
    }
  },
  {
    "name": "Inventor",
    "system": {
      "descricao": "PV: 12 (+3/nível). PM: 4/nível.\nAtributo-chave: Inteligência.\nPerícias fixas: oficio, vontade + 4 à escolha.\nLista: conhecimento, cura, diplomacia, fortitude, iniciativa, investigacao, luta, misticismo, oficio, percepcao, pilotagem, pontaria.\nProficiências: Armaduras leves, armas simples, armas de fogo.",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Inteligência",
      "acao": "PV: 12+3/nv | PM: 4/nv | oficio, vontade +4"
    }
  },
  {
    "name": "Ladino",
    "system": {
      "descricao": "PV: 12 (+3/nível). PM: 4/nível.\nAtributo-chave: Destreza ou Inteligência.\nPerícias fixas: ladinagem, reflexos + 8 à escolha.\nLista: acrobacia, atletismo, atuacao, cavalgar, conhecimento, diplomacia, enganacao, furtividade, iniciativa, intimidacao, intuicao, investigacao, jogatina, luta, misticismo, nobreza, oficio, percepcao, pilotagem, pontaria.\nProficiências: Armaduras leves, armas marciais.",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Destreza ou Inteligência",
      "acao": "PV: 12+3/nv | PM: 4/nv | ladinagem, reflexos +8"
    }
  },
  {
    "name": "Lutador",
    "system": {
      "descricao": "PV: 20 (+5/nível). PM: 3/nível.\nAtributo-chave: Força.\nPerícias fixas: fortitude, luta + 4 à escolha.\nLista: acrobacia, adestramento, atletismo, enganacao, furtividade, iniciativa, intimidacao, oficio, percepcao, pontaria, reflexos.\nProficiências: Armaduras leves, armas simples.",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Força",
      "acao": "PV: 20+5/nv | PM: 3/nv | fortitude, luta +4"
    }
  },
  {
    "name": "Nobre",
    "system": {
      "descricao": "PV: 16 (+4/nível). PM: 4/nível.\nAtributo-chave: Carisma.\nPerícias fixas: vontade + 4 à escolha.\nLista: adestramento, atuacao, cavalgar, conhecimento, diplomacia, enganacao, fortitude, guerra, iniciativa, intimidacao, intuicao, investigacao, jogatina, misticismo, nobreza, oficio, percepcao.\nProficiências: Armaduras leves, escudos, armas marciais.\nSubtipos: Liderança (Diplomacia), Liderança (Intimidação).\n• Liderança (Diplomacia): Perícia fixa: Diplomacia.\n• Liderança (Intimidação): Perícia fixa: Intimidação.",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Carisma",
      "acao": "PV: 16+4/nv | PM: 4/nv | vontade +4"
    }
  },
  {
    "name": "Paladino",
    "system": {
      "descricao": "PV: 20 (+5/nível). PM: 3/nível.\nAtributo-chave: Força e Carisma.\nPerícias fixas: luta, vontade + 2 à escolha.\nLista: adestramento, atletismo, cavalgar, cura, diplomacia, fortitude, guerra, iniciativa, intuicao, nobreza, percepcao, religiao.\nProficiências: Armaduras pesadas, escudos, armas marciais.",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Força e Carisma",
      "acao": "PV: 20+5/nv | PM: 3/nv | luta, vontade +2"
    }
  }
];
async function importar() {
  const pack = game.packs.get(PACK_NAME);
  if (!pack) { ui.notifications.error("Pack " + PACK_NAME + " não encontrado!"); return; }
  await pack.configure({locked: false});
  // Clear existing
  const existing = await pack.getDocuments();
  for (const doc of existing) await doc.delete();
  ui.notifications.info("Importando 14 classes...");
  let count = 0;
  for (const entry of DATA) {
    try {
      await Item.create({ name: entry.name, type: "habilidade", img: "icons/svg/combat.svg", system: entry.system }, { pack: PACK_NAME });
      count++;
    } catch (e) { console.error("Erro:", entry.name, e); }
  }
  await pack.configure({locked: true});
  ui.notifications.info(count + " classes importados!");
}
importar();
