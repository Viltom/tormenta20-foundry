// ========================================================
// T20 — 23. Atualizar descrições das classes conjuradoras
// ========================================================
//
// Por que este script existe:
//   Na v0.8.0 adicionamos a seção "MAGIAS CONHECIDAS" às 6 classes
//   conjuradoras (Arcanista, Bardo, Clérigo, Druida, Frade, Místico),
//   especificando quantas magias começam no 1º nível e como progridem.
//
//   Este script SÓ atualiza o campo `descricao` (e `acao`) dos itens já
//   existentes no compêndio `tormenta20.classes` — não cria/deleta nada,
//   não mexe em outros dados. Seguro de rodar quantas vezes quiser.
//
//   Se você já tem o compêndio importado e não quer reimportar tudo do
//   zero com 10 + 14, rode este aqui que atualiza só o que mudou.
//
// Como rodar:
//   1. Abra o Foundry, world com o sistema T20 carregado.
//   2. F12 → aba Console.
//   3. Cole TODO o conteúdo deste arquivo e aperte Enter.
// ========================================================

const PACK_NAME = "tormenta20.classes";

const UPDATES = {
  "Arcanista": {
    descricao: "PV: 8 (+2/nível). PM: 6/nível.\nAtributo-chave: Inteligência ou Carisma.\nPerícias fixas: misticismo, vontade + 2 à escolha.\nLista: conhecimento, diplomacia, enganacao, guerra, iniciativa, intimidacao, intuicao, investigacao, nobreza, oficio, percepcao.\nProficiências: Nenhuma armadura, armas simples.\n\nMAGIAS CONHECIDAS (arcanas):\n• 1º nível: 3 magias de 1º círculo.\n• A cada nível seguinte: +1 magia de qualquer círculo que possa lançar.\n• Acesso a círculos: 1º (1º nível), 2º (5º), 3º (9º), 4º (13º), 5º (17º).\n\nSubtipos: Bruxo, Feiticeiro, Mago.\n• Bruxo: Lança magias através de um foco (varinha, cajado). Atributo-chave: Inteligência.\n• Feiticeiro: Lança magias por poder inato no sangue. Escolha uma linhagem. Atributo-chave: Carisma. Aprende magia nova APENAS em níveis ÍMPARES (3º, 5º, 7º...).\n• Mago: Lança magias por estudo e memorização de grimório. Atributo-chave: Inteligência. Só lança magias memorizadas (metade das conhecidas). Começa com 1 magia adicional (total de 4 no 1º nível) e ganha +1 magia ao acessar cada novo círculo.",
    acao: "PV: 8+2/nv | PM: 6/nv | 3 magias no 1º, +1/nv (Feiticeiro: ímpares; Mago: +1 por círculo)",
  },
  "Bardo": {
    descricao: "PV: 12 (+3/nível). PM: 4/nível.\nAtributo-chave: Carisma.\nPerícias fixas: atuacao, reflexos + 6 à escolha.\nLista: acrobacia, cavalgar, conhecimento, diplomacia, enganacao, furtividade, iniciativa, intuicao, investigacao, jogatina, ladinagem, misticismo, nobreza, percepcao, pontaria.\nProficiências: Armaduras leves, escudos, armas marciais.\n\nMAGIAS CONHECIDAS (arcanas, 3 escolas à escolha):\n• 1º nível: 2 magias de 1º círculo.\n• A cada nível PAR (2º, 4º, 6º...): +1 magia de qualquer círculo e escola que possa lançar.\n• Acesso a círculos: 1º (1º nível), 2º (6º), 3º (10º), 4º (14º).\n• Pode lançar com armadura leve sem teste de Misticismo.",
    acao: "PV: 12+3/nv | PM: 4/nv | 2 magias no 1º, +1 por nível PAR",
  },
  "Clérigo": {
    descricao: "PV: 16 (+4/nível). PM: 5/nível.\nAtributo-chave: Sabedoria.\nPerícias fixas: religiao, vontade + 2 à escolha.\nLista: conhecimento, cura, diplomacia, fortitude, iniciativa, intuicao, misticismo, nobreza, oficio, percepcao.\nProficiências: Armaduras pesadas, escudos, armas simples.\n\nMAGIAS CONHECIDAS (divinas):\n• 1º nível: 3 magias de 1º círculo.\n• A cada nível seguinte: +1 magia de qualquer círculo que possa lançar.\n• Acesso a círculos: 1º (1º nível), 2º (5º), 3º (9º), 4º (13º), 5º (17º).",
    acao: "PV: 16+4/nv | PM: 5/nv | 3 magias no 1º, +1/nv",
  },
  "Druida": {
    descricao: "PV: 16 (+4/nível). PM: 4/nível.\nAtributo-chave: Sabedoria.\nPerícias fixas: sobrevivencia, vontade + 4 à escolha.\nLista: adestramento, atletismo, cavalgar, conhecimento, cura, fortitude, iniciativa, intuicao, misticismo, oficio, percepcao, religiao.\nProficiências: Armaduras leves, escudos, armas simples.\n\nMAGIAS CONHECIDAS (divinas, 3 escolas à escolha):\n• 1º nível: 2 magias de 1º círculo.\n• A cada nível PAR (2º, 4º, 6º...): +1 magia de qualquer círculo e escola que possa lançar.\n• Acesso a círculos: 1º (1º nível), 2º (6º), 3º (10º), 4º (14º).",
    acao: "PV: 16+4/nv | PM: 4/nv | 2 magias no 1º, +1 por nível PAR",
  },
  "Frade": {
    descricao: "PV: 12 (+3/nível). PM: 6/nível.\nAtributo-chave: Sabedoria.\nPerícias fixas: religião, vontade + 4 à escolha.\nLista: adestramento, atuação, conhecimento, cura, diplomacia, fortitude, guerra, iniciativa, intimidação, intuição, investigação, misticismo, ofício, percepção, nobreza.\nProficiências: Nenhuma.\n\nMAGIAS CONHECIDAS (divinas):\n• 1º nível: 3 magias de 1º círculo.\n• A cada nível seguinte: +1 magia de qualquer círculo que possa lançar.\n• Acesso a círculos: 1º a 5º (igual a Clérigo — 2º no 5º nível, 3º no 9º, 4º no 13º, 5º no 17º).\n• Lança com leve; pesada = teste de Misticismo.\n\nHabilidades de Classe:\n• Devoto Fiel: devoto de deus maior, recebe 2 poderes concedidos (em vez de 1). Alternativa: Panteão (sem armas cortantes/perfurantes, sem poderes concedidos, canaliza energia à escolha).\n• Erudição: teste de perícia (exceto ataque), gaste PM (limitado Int) para +2/PM.\n• Versiculário (2° nível): 1h/dia estudo; escolha magias = Int; ao lançar, +1 PM para aprimoramentos.\n• Dádiva da Fé (5° nível): Proteção Sagrada (energia positiva) ou Cólera Divina (energia negativa).\n• Solo Santificado (20° nível).\n\nPoderes incluem: Sacrários (áreas consagradas), Bênção Fortalecedora, Comunhão Vital, Conhecimento Mágico, Copista, Mago Branco, Sermão da Celeridade, entre outros.",
    acao: "PV: 12+3/nv | PM: 6/nv | 3 magias no 1º, +1/nv",
  },
  "Místico": {
    descricao: "PV: 16 (+4/nível). PM: 4/nível.\nAtributo-chave: Sabedoria.\nPerícias fixas: misticismo, vontade + 4 à escolha.\nLista: acrobacia, atletismo, conhecimento, cura, diplomacia, fortitude, iniciativa, luta, ofício, percepção, pontaria, reflexos.\nProficiências: Armas marciais.\n\nMAGIAS CONHECIDAS (arcanas — evocação + escola da Afinidade + 1 escola à escolha):\n• 1º nível: 3 magias de 1º círculo (similar a outras conjuradoras plenas).\n• A cada nível seguinte: +1 magia.\n• Acesso a círculos (1º a 4º): 1º (1º nível), 2º (6º), 3º (10º), 4º (14º).\n\nHabilidades de Classe:\n• Afinidade: escolha 1 elemento (água/ar/fogo/luz/terra/trevas). RD 5/círculo contra tipo associado. Pode converter tipo de dano. Perícia extra por elemento.\n• Ataque Elemental: corpo a corpo, gaste PM (limitado por círculo) = +1 ataque + 1d8 dano elemental por PM.\n• Língua Primordial (2°): comunica com espíritos elementais, +5 em testes de Car com eles.\n• Tradição Oral (3°): +2/+4/+6 Misticismo (3°/9°/13°).\n• Sexto Sentido (4°): soma Sab na Defesa (limitado nível, sem pesada).\n• Afinidade Evoluída (6°): Concentrada (+2 CD e ataque) OU Expandida (2° elemento).\n• Comunhão Suprema (20°): imune ao dano da Afinidade, custo de magias do tipo ½.\n\nElementos: Água=frio/encantamento, Ar=eletricidade/ilusão, Fogo=fogo/transmutação, Luz=luz/abjuração, Terra=ácido/convocação, Trevas=trevas/necromancia.",
    acao: "PV: 16+4/nv | PM: 4/nv | 3 magias no 1º, +1/nv (até 4º círculo)",
  },
};

async function atualizar() {
  const pack = game.packs.get(PACK_NAME);
  if (!pack) {
    ui.notifications.error(`Pack ${PACK_NAME} não encontrado.`);
    return;
  }
  await pack.configure({ locked: false });

  let atualizadas = 0, faltando = [];
  for (const [nome, data] of Object.entries(UPDATES)) {
    const entry = pack.index.find(e => e.name === nome);
    if (!entry) { faltando.push(nome); continue; }
    const doc = await pack.getDocument(entry._id);
    await doc.update({
      "system.descricao": data.descricao,
      "system.acao": data.acao,
    });
    atualizadas++;
  }

  await pack.configure({ locked: true });

  let msg = `${atualizadas}/${Object.keys(UPDATES).length} classes conjuradoras atualizadas.`;
  if (faltando.length) {
    msg += ` Não encontradas no compêndio: ${faltando.join(", ")} — rode os scripts 10 e 14 antes.`;
    ui.notifications.warn(msg);
  } else {
    ui.notifications.info(msg);
  }
  console.log("T20 |", msg);
}
atualizar();
