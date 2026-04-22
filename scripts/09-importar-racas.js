// TORMENTA 20 - Importar Raças (18 itens)
const PACK_NAME = "tormenta20.racas";
const DATA = [
  {
    "name": "Humano",
    "system": {
      "descricao": "Atributos: +1 em três atributos diferentes\nDeslocamento: 9m | Tamanho: Médio\nHabilidades:\n• Versátil: treinado em 2 perícias a sua escolha (ou 1 perícia + 1 poder geral)",
      "tipo": "raca",
      "requisitos": "+1 em três atributos diferentes",
      "acao": "Desloc: 9m, Tam: Médio"
    }
  },
  {
    "name": "Anão",
    "system": {
      "descricao": "Atributos: Con +2, Sab +1, Des –1\nDeslocamento: 6m | Tamanho: Médio\nHabilidades:\n• Conhecimento das Rochas: visão no escuro, +2 Percepção/Sobrevivência subterrâneo\n• Devagar e Sempre: desloc 6m, não reduzido por armadura/carga\n• Duro como Pedra: +3 PV no 1° nível, +1 PV/nível\n• Tradição de Heredrimm: machados/martelos/marretas/picaretas são simples, +2 ataque",
      "tipo": "raca",
      "requisitos": "Con +2, Sab +1, Des –1",
      "acao": "Desloc: 6m, Tam: Médio"
    }
  },
  {
    "name": "Dahllan",
    "system": {
      "descricao": "Atributos: Sab +2, Des +1, Int –1\nDeslocamento: 9m | Tamanho: Médio\nHabilidades:\n• Amiga das Plantas: lança Controlar Plantas (Sab)\n• Armadura de Allihanna: 1 PM, +2 Defesa (cena)\n• Empatia Selvagem: comunicar com animais",
      "tipo": "raca",
      "requisitos": "Sab +2, Des +1, Int –1",
      "acao": "Desloc: 9m, Tam: Médio"
    }
  },
  {
    "name": "Elfo",
    "system": {
      "descricao": "Atributos: Int +2, Des +1, Con –1\nDeslocamento: 9m | Tamanho: Médio\nHabilidades:\n• Graça de Glórienn: +2 Misticismo, ignora armadura arcana\n• Sentidos Élficos: visão na penumbra, +2 Percepção",
      "tipo": "raca",
      "requisitos": "Int +2, Des +1, Con –1",
      "acao": "Desloc: 9m, Tam: Médio"
    }
  },
  {
    "name": "Goblin",
    "system": {
      "descricao": "Atributos: Des +2, Int +1, Car –1\nDeslocamento: 9m | Tamanho: Pequeno\nHabilidades:\n• Engenhoso: +2 Ofício e Ladinagem\n• Espelunqueiro: visão no escuro, desloc escalada 6m\n• Tamanho Pequeno: +2 Furtividade, +1 ataque/Defesa",
      "tipo": "raca",
      "requisitos": "Des +2, Int +1, Car –1",
      "acao": "Desloc: 9m, Tam: Pequeno"
    }
  },
  {
    "name": "Lefou",
    "system": {
      "descricao": "Atributos: +1 em três (exceto Car), Car –1\nDeslocamento: 9m | Tamanho: Médio\nHabilidades:\n• Cria da Tormenta: 3 poderes da Tormenta à escolha, sem perda extra de Car",
      "tipo": "raca",
      "requisitos": "+1 em três (exceto Car), Car –1",
      "acao": "Desloc: 9m, Tam: Médio"
    }
  },
  {
    "name": "Minotauro",
    "system": {
      "descricao": "Atributos: For +2, Con +1, Sab –1\nDeslocamento: 9m | Tamanho: Grande\nHabilidades:\n• Chifres: arma natural 1d6 impacto\n• Couro Grosso: +1 Defesa\n• Faro: +2 Percepção olfato",
      "tipo": "raca",
      "requisitos": "For +2, Con +1, Sab –1",
      "acao": "Desloc: 9m, Tam: Grande"
    }
  },
  {
    "name": "Qareen",
    "system": {
      "descricao": "Atributos: Car +2, Int +1, Sab –1\nDeslocamento: 9m | Tamanho: Médio\nHabilidades:\n• Herança Gênio: escolha elemento (fogo/água/ar/terra), resistência 10\n• Desejos: lança magias do elemento",
      "tipo": "raca",
      "requisitos": "Car +2, Int +1, Sab –1",
      "acao": "Desloc: 9m, Tam: Médio"
    }
  },
  {
    "name": "Golem",
    "system": {
      "descricao": "Atributos: For +2, Con +1, Car –1\nDeslocamento: 6m | Tamanho: Médio\nHabilidades:\n• Criatura Artificial: imune a efeitos metabólicos/veneno/doença\n• Sem Espírito: +5 contra Encantamento",
      "tipo": "raca",
      "requisitos": "For +2, Con +1, Car –1",
      "acao": "Desloc: 6m, Tam: Médio"
    }
  },
  {
    "name": "Hynne",
    "system": {
      "descricao": "Atributos: Des +2, Car +1, For –1\nDeslocamento: 6m | Tamanho: Pequeno\nHabilidades:\n• Pequeno e Rechonchudo: +2 Furtividade, +1 ataque/Defesa\n• Sorte Salvadora: +1 testes de resistência",
      "tipo": "raca",
      "requisitos": "Des +2, Car +1, For –1",
      "acao": "Desloc: 6m, Tam: Pequeno"
    }
  },
  {
    "name": "Kliren",
    "system": {
      "descricao": "Atributos: Int +2, Car +1, For –1\nDeslocamento: 6m | Tamanho: Pequeno\nHabilidades:\n• Memória Fotográfica: +2 Conhecimento, refazer 1 teste/dia\n• Tamanho Pequeno",
      "tipo": "raca",
      "requisitos": "Int +2, Car +1, For –1",
      "acao": "Desloc: 6m, Tam: Pequeno"
    }
  },
  {
    "name": "Medusa",
    "system": {
      "descricao": "Atributos: Des +2, Car +1\nDeslocamento: 9m | Tamanho: Médio\nHabilidades:\n• Olhar Petrificante: 2 PM, Fortitude ou lento/paralisado\n• Sangue de Serpente: dano a quem ferir corpo a corpo",
      "tipo": "raca",
      "requisitos": "Des +2, Car +1",
      "acao": "Desloc: 9m, Tam: Médio"
    }
  },
  {
    "name": "Osteon",
    "system": {
      "descricao": "Atributos: +1 em três (exceto Con), Con –1\nDeslocamento: 9m | Tamanho: Médio\nHabilidades:\n• Armadura Óssea: RD 5 corte/frio/perfuração\n• Natureza Esquelética: morto-vivo, visão no escuro, imunidades",
      "tipo": "raca",
      "requisitos": "+1 em três (exceto Con), Con –1",
      "acao": "Desloc: 9m, Tam: Médio"
    }
  },
  {
    "name": "Sereia/Tritão",
    "system": {
      "descricao": "Atributos: +1 em três atributos\nDeslocamento: 9m | Tamanho: Médio\nHabilidades:\n• Canção dos Mares: 2 magias à escolha\n• Mestre do Tridente: +2 dano lanças/tridentes\n• Transformação Anfíbia",
      "tipo": "raca",
      "requisitos": "+1 em três atributos",
      "acao": "Desloc: 9m, Tam: Médio"
    }
  },
  {
    "name": "Sílfide",
    "system": {
      "descricao": "Atributos: Car +2, Des +1, For –2\nDeslocamento: 9m | Tamanho: Minúsculo\nHabilidades:\n• Asas de Fada: voo 9m\n• Magia de Fada: 2 magias de 1° círculo (Car)\n• Tamanho Minúsculo",
      "tipo": "raca",
      "requisitos": "Car +2, Des +1, For –2",
      "acao": "Desloc: 9m, Tam: Minúsculo"
    }
  },
  {
    "name": "Suraggel (Aggelus)",
    "system": {
      "descricao": "Atributos: Sab +2, Car +1\nDeslocamento: 9m | Tamanho: Médio\nHabilidades:\n• Herança Celestial\n• Luz Sagrada: +2 Diplomacia, lança Luz divina",
      "tipo": "raca",
      "requisitos": "Sab +2, Car +1",
      "acao": "Desloc: 9m, Tam: Médio"
    }
  },
  {
    "name": "Suraggel (Sulfure)",
    "system": {
      "descricao": "Atributos: Des +2, Int +1\nDeslocamento: 9m | Tamanho: Médio\nHabilidades:\n• Herança Infernal\n• Sombras Profanas: +2 Intimidação, lança Escuridão",
      "tipo": "raca",
      "requisitos": "Des +2, Int +1",
      "acao": "Desloc: 9m, Tam: Médio"
    }
  },
  {
    "name": "Trog",
    "system": {
      "descricao": "Atributos: Con +2, For +1, Int –1\nDeslocamento: 9m | Tamanho: Médio\nHabilidades:\n• Mau Cheiro: adjacentes Fortitude ou enjoados\n• Mordida: 1d6 perfuração\n• Reptiliano: +1 Def, natação 6m",
      "tipo": "raca",
      "requisitos": "Con +2, For +1, Int –1",
      "acao": "Desloc: 9m, Tam: Médio"
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
  ui.notifications.info("Importando 18 raças...");
  let count = 0;
  for (const entry of DATA) {
    try {
      await Item.create({ name: entry.name, type: "habilidade", img: "icons/svg/mystery-man.svg", system: entry.system }, { pack: PACK_NAME });
      count++;
    } catch (e) { console.error("Erro:", entry.name, e); }
  }
  await pack.configure({locked: true});
  ui.notifications.info(count + " raças importados!");
}
importar();
