// TORMENTA 20 - Importar Origens (35 itens)
const PACK_NAME = "tormenta20.origens";
const DATA = [
  {
    "name": "Acólito",
    "system": {
      "descricao": "Perícias: cura, religiao, vontade\nPoderes: Medicina, Membro da Igreja, Vontade de Ferro",
      "tipo": "origem",
      "requisitos": "Perícias: cura, religiao, vontade; Poderes: Medicina, Membro da Igreja, Vontade de Ferro",
      "acao": ""
    }
  },
  {
    "name": "Amigo dos Animais",
    "system": {
      "descricao": "Perícias: adestramento, cavalgar\nPoderes: Amigo Especial",
      "tipo": "origem",
      "requisitos": "Perícias: adestramento, cavalgar; Poderes: Amigo Especial",
      "acao": ""
    }
  },
  {
    "name": "Amnésico",
    "system": {
      "descricao": "Perícias: Variável\nPoderes: Lembranças Graduais",
      "tipo": "origem",
      "requisitos": "Perícias: Variável; Poderes: Lembranças Graduais",
      "acao": ""
    }
  },
  {
    "name": "Aristocrata",
    "system": {
      "descricao": "Perícias: diplomacia, enganacao, nobreza\nPoderes: Comandar, Sangue Azul",
      "tipo": "origem",
      "requisitos": "Perícias: diplomacia, enganacao, nobreza; Poderes: Comandar, Sangue Azul",
      "acao": ""
    }
  },
  {
    "name": "Artesão",
    "system": {
      "descricao": "Perícias: oficio, vontade\nPoderes: Frutos do Trabalho, Sortudo",
      "tipo": "origem",
      "requisitos": "Perícias: oficio, vontade; Poderes: Frutos do Trabalho, Sortudo",
      "acao": ""
    }
  },
  {
    "name": "Artista",
    "system": {
      "descricao": "Perícias: atuacao, enganacao\nPoderes: Atraente, Dom Artístico, Sortudo, Torcida",
      "tipo": "origem",
      "requisitos": "Perícias: atuacao, enganacao; Poderes: Atraente, Dom Artístico, Sortudo, Torcida",
      "acao": ""
    }
  },
  {
    "name": "Assistente de Laboratório",
    "system": {
      "descricao": "Perícias: oficio, misticismo\nPoderes: Esse Cheiro..., Venefício, 1 poder da Tormenta",
      "tipo": "origem",
      "requisitos": "Perícias: oficio, misticismo; Poderes: Esse Cheiro..., Venefício, 1 poder da Tormenta",
      "acao": ""
    }
  },
  {
    "name": "Batedor",
    "system": {
      "descricao": "Perícias: furtividade, percepcao, sobrevivencia\nPoderes: À Prova de Tudo, Estilo de Disparo, Sentidos Aguçados",
      "tipo": "origem",
      "requisitos": "Perícias: furtividade, percepcao, sobrevivencia; Poderes: À Prova de Tudo, Estilo de Disparo, Sentidos Aguçados",
      "acao": ""
    }
  },
  {
    "name": "Capanga",
    "system": {
      "descricao": "Perícias: luta, intimidacao\nPoderes: Confissão, 1 poder de combate",
      "tipo": "origem",
      "requisitos": "Perícias: luta, intimidacao; Poderes: Confissão, 1 poder de combate",
      "acao": ""
    }
  },
  {
    "name": "Charlatão",
    "system": {
      "descricao": "Perícias: enganacao, jogatina\nPoderes: Alpinista Social, Aparência Inofensiva, Sortudo",
      "tipo": "origem",
      "requisitos": "Perícias: enganacao, jogatina; Poderes: Alpinista Social, Aparência Inofensiva, Sortudo",
      "acao": ""
    }
  },
  {
    "name": "Circense",
    "system": {
      "descricao": "Perícias: acrobacia, atuacao, reflexos\nPoderes: Acrobático, Torcida, Truque de Mágica",
      "tipo": "origem",
      "requisitos": "Perícias: acrobacia, atuacao, reflexos; Poderes: Acrobático, Torcida, Truque de Mágica",
      "acao": ""
    }
  },
  {
    "name": "Criminoso",
    "system": {
      "descricao": "Perícias: enganacao, furtividade, ladinagem\nPoderes: Punguista, Venefício",
      "tipo": "origem",
      "requisitos": "Perícias: enganacao, furtividade, ladinagem; Poderes: Punguista, Venefício",
      "acao": ""
    }
  },
  {
    "name": "Curandeiro",
    "system": {
      "descricao": "Perícias: cura, vontade\nPoderes: Medicina, Médico de Campo, Venefício",
      "tipo": "origem",
      "requisitos": "Perícias: cura, vontade; Poderes: Medicina, Médico de Campo, Venefício",
      "acao": ""
    }
  },
  {
    "name": "Eremita",
    "system": {
      "descricao": "Perícias: misticismo, religiao, sobrevivencia\nPoderes: Busca Interior, Lobo Solitário",
      "tipo": "origem",
      "requisitos": "Perícias: misticismo, religiao, sobrevivencia; Poderes: Busca Interior, Lobo Solitário",
      "acao": ""
    }
  },
  {
    "name": "Escravo",
    "system": {
      "descricao": "Perícias: atletismo, fortitude, furtividade\nPoderes: Desejo de Liberdade, Vitalidade",
      "tipo": "origem",
      "requisitos": "Perícias: atletismo, fortitude, furtividade; Poderes: Desejo de Liberdade, Vitalidade",
      "acao": ""
    }
  },
  {
    "name": "Estudioso",
    "system": {
      "descricao": "Perícias: conhecimento, guerra, misticismo\nPoderes: Aparência Inofensiva, Palpite Fundamentado",
      "tipo": "origem",
      "requisitos": "Perícias: conhecimento, guerra, misticismo; Poderes: Aparência Inofensiva, Palpite Fundamentado",
      "acao": ""
    }
  },
  {
    "name": "Fazendeiro",
    "system": {
      "descricao": "Perícias: adestramento, cavalgar, oficio, sobrevivencia\nPoderes: Água no Feijão, Ginete",
      "tipo": "origem",
      "requisitos": "Perícias: adestramento, cavalgar, oficio, sobrevivencia; Poderes: Água no Feijão, Ginete",
      "acao": ""
    }
  },
  {
    "name": "Forasteiro",
    "system": {
      "descricao": "Perícias: cavalgar, pilotagem, sobrevivencia\nPoderes: Cultura Exótica, Lobo Solitário",
      "tipo": "origem",
      "requisitos": "Perícias: cavalgar, pilotagem, sobrevivencia; Poderes: Cultura Exótica, Lobo Solitário",
      "acao": ""
    }
  },
  {
    "name": "Gladiador",
    "system": {
      "descricao": "Perícias: atuacao, luta\nPoderes: Atraente, Pão e Circo, Torcida, 1 poder de combate",
      "tipo": "origem",
      "requisitos": "Perícias: atuacao, luta; Poderes: Atraente, Pão e Circo, Torcida, 1 poder de combate",
      "acao": ""
    }
  },
  {
    "name": "Guarda",
    "system": {
      "descricao": "Perícias: investigacao, luta, percepcao\nPoderes: Detetive, Investigador, 1 poder de combate",
      "tipo": "origem",
      "requisitos": "Perícias: investigacao, luta, percepcao; Poderes: Detetive, Investigador, 1 poder de combate",
      "acao": ""
    }
  },
  {
    "name": "Herdeiro",
    "system": {
      "descricao": "Perícias: misticismo, nobreza, oficio\nPoderes: Comandar, Herança",
      "tipo": "origem",
      "requisitos": "Perícias: misticismo, nobreza, oficio; Poderes: Comandar, Herança",
      "acao": ""
    }
  },
  {
    "name": "Herói Camponês",
    "system": {
      "descricao": "Perícias: adestramento, oficio\nPoderes: Coração Heroico, Sortudo, Surto Heroico, Torcida",
      "tipo": "origem",
      "requisitos": "Perícias: adestramento, oficio; Poderes: Coração Heroico, Sortudo, Surto Heroico, Torcida",
      "acao": ""
    }
  },
  {
    "name": "Marujo",
    "system": {
      "descricao": "Perícias: atletismo, jogatina, pilotagem\nPoderes: Acrobático, Passagem de Navio",
      "tipo": "origem",
      "requisitos": "Perícias: atletismo, jogatina, pilotagem; Poderes: Acrobático, Passagem de Navio",
      "acao": ""
    }
  },
  {
    "name": "Mateiro",
    "system": {
      "descricao": "Perícias: atletismo, furtividade, sobrevivencia\nPoderes: Lobo Solitário, Sentidos Aguçados, Vendedor de Carcaças",
      "tipo": "origem",
      "requisitos": "Perícias: atletismo, furtividade, sobrevivencia; Poderes: Lobo Solitário, Sentidos Aguçados, Vendedor de Carcaças",
      "acao": ""
    }
  },
  {
    "name": "Membro de Guilda",
    "system": {
      "descricao": "Perícias: diplomacia, enganacao, misticismo, oficio\nPoderes: Foco em Perícia, Rede de Contatos",
      "tipo": "origem",
      "requisitos": "Perícias: diplomacia, enganacao, misticismo, oficio; Poderes: Foco em Perícia, Rede de Contatos",
      "acao": ""
    }
  },
  {
    "name": "Mercador",
    "system": {
      "descricao": "Perícias: diplomacia, intuicao, oficio\nPoderes: Negociação, Proficiência, Sortudo",
      "tipo": "origem",
      "requisitos": "Perícias: diplomacia, intuicao, oficio; Poderes: Negociação, Proficiência, Sortudo",
      "acao": ""
    }
  },
  {
    "name": "Minerador",
    "system": {
      "descricao": "Perícias: atletismo, fortitude, oficio\nPoderes: Ataque Poderoso, Escavador, Sentidos Aguçados",
      "tipo": "origem",
      "requisitos": "Perícias: atletismo, fortitude, oficio; Poderes: Ataque Poderoso, Escavador, Sentidos Aguçados",
      "acao": ""
    }
  },
  {
    "name": "Nômade",
    "system": {
      "descricao": "Perícias: cavalgar, pilotagem, sobrevivencia\nPoderes: Lobo Solitário, Mochileiro, Sentidos Aguçados",
      "tipo": "origem",
      "requisitos": "Perícias: cavalgar, pilotagem, sobrevivencia; Poderes: Lobo Solitário, Mochileiro, Sentidos Aguçados",
      "acao": ""
    }
  },
  {
    "name": "Pivete",
    "system": {
      "descricao": "Perícias: furtividade, iniciativa, ladinagem\nPoderes: Acrobático, Aparência Inofensiva, Quebra-Galho",
      "tipo": "origem",
      "requisitos": "Perícias: furtividade, iniciativa, ladinagem; Poderes: Acrobático, Aparência Inofensiva, Quebra-Galho",
      "acao": ""
    }
  },
  {
    "name": "Refugiado",
    "system": {
      "descricao": "Perícias: fortitude, reflexos, vontade\nPoderes: Estoico, Vontade de Ferro",
      "tipo": "origem",
      "requisitos": "Perícias: fortitude, reflexos, vontade; Poderes: Estoico, Vontade de Ferro",
      "acao": ""
    }
  },
  {
    "name": "Seguidor",
    "system": {
      "descricao": "Perícias: adestramento, oficio\nPoderes: Antigo Mestre, Proficiência, Surto Heroico",
      "tipo": "origem",
      "requisitos": "Perícias: adestramento, oficio; Poderes: Antigo Mestre, Proficiência, Surto Heroico",
      "acao": ""
    }
  },
  {
    "name": "Selvagem",
    "system": {
      "descricao": "Perícias: percepcao, reflexos, sobrevivencia\nPoderes: Lobo Solitário, Vida Rústica, Vitalidade",
      "tipo": "origem",
      "requisitos": "Perícias: percepcao, reflexos, sobrevivencia; Poderes: Lobo Solitário, Vida Rústica, Vitalidade",
      "acao": ""
    }
  },
  {
    "name": "Soldado",
    "system": {
      "descricao": "Perícias: fortitude, guerra, luta, pontaria\nPoderes: Influência Militar, 1 poder de combate",
      "tipo": "origem",
      "requisitos": "Perícias: fortitude, guerra, luta, pontaria; Poderes: Influência Militar, 1 poder de combate",
      "acao": ""
    }
  },
  {
    "name": "Taverneiro",
    "system": {
      "descricao": "Perícias: diplomacia, jogatina, oficio\nPoderes: Gororoba, Proficiência, Vitalidade",
      "tipo": "origem",
      "requisitos": "Perícias: diplomacia, jogatina, oficio; Poderes: Gororoba, Proficiência, Vitalidade",
      "acao": ""
    }
  },
  {
    "name": "Trabalhador Braçal",
    "system": {
      "descricao": "Perícias: atletismo, fortitude\nPoderes: Atlético, Esforçado",
      "tipo": "origem",
      "requisitos": "Perícias: atletismo, fortitude; Poderes: Atlético, Esforçado",
      "acao": ""
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
  ui.notifications.info("Importando 35 origens...");
  let count = 0;
  for (const entry of DATA) {
    try {
      await Item.create({ name: entry.name, type: "habilidade", img: "icons/svg/village.svg", system: entry.system }, { pack: PACK_NAME });
      count++;
    } catch (e) { console.error("Erro:", entry.name, e); }
  }
  await pack.configure({locked: true});
  ui.notifications.info(count + " origens importados!");
}
importar();
