// TORMENTA 20 — Importar Classes Extras (5 itens)
// Fontes: Heróis de Arton (Treinador), Deuses de Arton (Frade), Classes Novas (Miragem, Místico, Samurai)
// Pack: tormenta20.classes

const PACK_NAME = "tormenta20.classes";
const DATA = [
  {
    "name": "Treinador",
    "system": {
      "descricao": "PV: 12 (+3/nível). PM: 4/nível.\nAtributo-chave: Carisma.\nPerícias fixas: adestramento, vontade + 4 à escolha.\nLista: atletismo, cavalgar, diplomacia, guerra, iniciativa, intimidação, intuição, luta, ofício, percepção, pontaria, reflexos, religião, sobrevivência.\nProficiências: Nenhuma.\n\nHabilidades de Classe:\n• Direcionar: melhor amigo em alc. curto faz teste de perícia, 2 PM = +Car no teste.\n• Melhor Amigo: parceiro especial (veja regras). Começa com 2 truques, +1 a cada 3 níveis.\n• Domar Criatura (2° nível): 1 mov + 1 PM, teste Adestramento vs Vontade, 2d8 dano psíquico não letal. +2d8/+1 PM a cada 4 níveis. 5° nível: controla criatura rendida (ND ≤ nível). 8° nível: criatura fica até fim do dia.\n• Treino Especializado (5° nível): Conquistar pelos Números (2° melhor amigo) OU Treino Intensivo (+4 PV/nível, RD 5, +1 truque).\n• Sincronia de Combate (6° nível): 1x/rodada, melhor amigo acerta = 2 PM = seu ataque contra mesmo alvo.\n• Sincronia Perfeita (20° nível): 1 mov + 6 PM, tamanho do amigo +1, ação padrão extra para ele 1x/rodada.",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Carisma",
      "acao": "PV: 12+3/nv | PM: 4/nv | adestramento, vontade +4"
    }
  },
  {
    "name": "Frade",
    "system": {
      "descricao": "PV: 12 (+3/nível). PM: 6/nível.\nAtributo-chave: Sabedoria.\nPerícias fixas: religião, vontade + 4 à escolha.\nLista: adestramento, atuação, conhecimento, cura, diplomacia, fortitude, guerra, iniciativa, intimidação, intuição, investigação, misticismo, ofício, percepção, nobreza.\nProficiências: Nenhuma.\n\nHabilidades de Classe:\n• Devoto Fiel: devoto de deus maior, recebe 2 poderes concedidos (em vez de 1). Alternativa: Panteão (sem armas cortantes/perfurantes, sem poderes concedidos, canaliza energia à escolha).\n• Erudição: teste de perícia (exceto ataque), gaste PM (limitado Int) para +2/PM.\n• Magias: divinas de 1° a 5° círculo. Começa com 3 magias de 1°, +1/nível. Sab como atributo-chave. Lança com leve; pesada = teste de Misticismo.\n• Versiculário (2° nível): 1h/dia estudo; escolha magias = Int; ao lançar, +1 PM para aprimoramentos.\n• Dádiva da Fé (5° nível): Proteção Sagrada (energia positiva) ou Cólera Divina (energia negativa).\n• Solo Santificado (20° nível).\n\nPoderes incluem: Sacrários (áreas consagradas), Bênção Fortalecedora, Comunhão Vital, Conhecimento Mágico, Copista, Mago Branco, Sermão da Celeridade, entre outros.",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Sabedoria",
      "acao": "PV: 12+3/nv | PM: 6/nv | religião, vontade +4"
    }
  },
  {
    "name": "Miragem",
    "system": {
      "descricao": "PV: 16 (+4/nível). PM: 3/nível.\nAtributo-chave: Destreza ou Sabedoria.\nPerícias fixas: luta ou pontaria, reflexos + 2 à escolha.\nLista: acrobacia, adestramento, atletismo, fortitude, furtividade, guerra, iniciativa, intimidação, luta, ofício, percepção, pontaria, sobrevivência.\nProficiências: Armas marciais, escudos.\n\nHabilidades de Classe:\n• Dança da Areia: 2 PM, +1d4 dano em alc. curto (sobe: 1d6/5°, 1d8/9°, 1d10/13°, 1d12/17°). Termina se não mover 6m/rodada. Sem pesada.\n• Movimento Furtivo: move com desloc normal em Furtividade sem penalidade.\n• Investida Acrobática (3°): investida não precisa de linha reta.\n• Cortina de Poeira (5°): com Dança, 2 PM = camuflagem leve.\n• Guerrilheiro das Dunas (7°): pen. Furtividade por atacar reduzida para –5.\n• Mergulho Terrestre (9°): sobre areia/terra, 1x/rodada 3 PM teleporte alc. curto.\n• Corpo de Areia (20°): com Dança, 5 PM = redemoinho, fortificação 25%, imune a mov., ignora 20 primeiros dano/turno.",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Destreza ou Sabedoria",
      "acao": "PV: 16+4/nv | PM: 3/nv | luta/pontaria, reflexos +2"
    }
  },
  {
    "name": "Místico",
    "system": {
      "descricao": "PV: 16 (+4/nível). PM: 4/nível.\nAtributo-chave: Sabedoria.\nPerícias fixas: misticismo, vontade + 4 à escolha.\nLista: acrobacia, atletismo, conhecimento, cura, diplomacia, fortitude, iniciativa, luta, ofício, percepção, pontaria, reflexos.\nProficiências: Armas marciais.\n\nHabilidades de Classe:\n• Afinidade: escolha 1 elemento (água/ar/fogo/luz/terra/trevas). RD 5/círculo contra tipo associado. Pode converter tipo de dano. Perícia extra por elemento.\n• Ataque Elemental: corpo a corpo, gaste PM (limitado por círculo) = +1 ataque + 1d8 dano elemental por PM.\n• Magias: arcanas de evocação + escola da Afinidade + 1 escola extra. 1° a 4° círculo (2°/6°, 3°/10°, 4°/14°). Sab atributo-chave.\n• Língua Primordial (2°): comunica com espíritos elementais, +5 em testes de Car com eles.\n• Tradição Oral (3°): +2/+4/+6 Misticismo (3°/9°/13°).\n• Sexto Sentido (4°): soma Sab na Defesa (limitado nível, sem pesada).\n• Afinidade Evoluída (6°): Concentrada (+2 CD e ataque) OU Expandida (2° elemento).\n• Comunhão Suprema (20°): imune ao dano da Afinidade, custo de magias do tipo ½.\n\nElementos: Água=frio/encantamento, Ar=eletricidade/ilusão, Fogo=fogo/transmutação, Luz=luz/abjuração, Terra=ácido/convocação, Trevas=trevas/necromancia.",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Sabedoria",
      "acao": "PV: 16+4/nv | PM: 4/nv | misticismo, vontade +4"
    }
  },
  {
    "name": "Samurai",
    "system": {
      "descricao": "PV: 20 (+5/nível). PM: 3/nível.\nAtributo-chave: Sabedoria.\nPerícias fixas: luta, vontade + 2 à escolha.\nLista: acrobacia, adestramento, atletismo, cavalgar, conhecimento, diplomacia, fortitude, guerra, iniciativa, intimidação, intuição, nobreza, ofício, percepção, pontaria.\nProficiências: Armas marciais, armaduras pesadas.\n\nHabilidades de Classe:\n• Arma Ancestral: proficiência em katana; katana superior com 1 melhoria (até T$500). +1 melhoria nos níveis 4, 6, 8. Só funciona nas suas mãos. Perder = perde todos PM.\n• Código do Samurai: manter palavra, nunca recusar ajuda inocente, nunca mentir/trapacear/roubar. Violar = perde PM por 1 dia.\n• Grito de Kiai: corpo a corpo, 2 PM = rola dois d20 usa melhor + bônus dano (1d4→1d6/5°→1d8/9°→1d10/13°→1d12/17°). Multiplicado no crítico.\n• Olhar Assustador (3°): +1/+2/+3 em Intimidação/Intuição (3°/9°/15°).\n• Arma Espiritual (10°): arma ancestral se torna mágica com encantos (10°/12°/14°).\n• Shogun (20°): multiplicador de crítico +2, cura PV = dano extra.\n\nArma nova — Wakizashi: Exótica de uma mão, T$75, 1d6, 19/x2, 1 espaço, corte. Com katana, sem penalidade de Duas Armas.",
      "tipo": "classe",
      "requisitos": "Atributo-chave: Sabedoria",
      "acao": "PV: 20+5/nv | PM: 3/nv | luta, vontade +2"
    }
  }
];

async function importAll() {
  const pack = game.packs.get(PACK_NAME);
  if (!pack) return ui.notifications.error("Pack não encontrado: " + PACK_NAME);
  await pack.configure({locked: false});
  let created = 0, updated = 0;
  for (const d of DATA) {
    const itemData = {name: d.name, type: "poder", img: "icons/svg/book.svg", system: d.system};
    const existing = pack.index.find(e => e.name === d.name);
    if (existing) {
      await pack.getDocument(existing._id).then(doc => doc.update({system: d.system}));
      updated++;
    } else {
      await Item.create(itemData, {pack: PACK_NAME});
      created++;
    }
  }
  await pack.configure({locked: true});
  ui.notifications.info(`Classes extras: ${created} criadas, ${updated} atualizadas (total: ${DATA.length})`);
}
importAll();
