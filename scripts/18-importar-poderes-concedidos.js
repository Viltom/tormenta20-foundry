// TORMENTA 20 — Importar Poderes Concedidos (64 itens)
// Fonte: Livro Básico — Jogo do Ano
// Pack: tormenta20.poderes

const PACK_NAME = "tormenta20.poderes";
const DATA = [
  {"name":"Afinidade com a Tormenta","system":{"descricao":"+10 em testes de resistência contra efeitos da Tormenta, de suas criaturas e de devotos de Aharadak. Seu primeiro poder da Tormenta não conta para perda de Carisma.","tipo":"concedido","requisitos":"Devoto de Aharadak","acao":"","custoPM":0}},
  {"name":"Almejar o Impossível","system":{"descricao":"Quando faz um teste de perícia, um resultado de 19 ou mais no dado sempre é um sucesso, não importando o valor a ser alcançado.","tipo":"concedido","requisitos":"Devoto de Valkaria ou Thwor","acao":"","custoPM":0}},
  {"name":"Anfíbio","system":{"descricao":"Você pode respirar embaixo d'água e adquire deslocamento de natação igual a seu deslocamento terrestre.","tipo":"concedido","requisitos":"Devoto do Oceano","acao":"","custoPM":0}},
  {"name":"Apostar com o Trapaceiro","system":{"descricao":"Quando faz um teste de perícia, gaste 1 PM para apostar com Hyninn. Você e o mestre rolam 1d20 (mestre oculto). Escolha usar seu resultado ou o do mestre.","tipo":"concedido","requisitos":"Devoto de Hyninn","acao":"","custoPM":1}},
  {"name":"Armas da Ambição","system":{"descricao":"+1 em testes de ataque e na margem de ameaça com armas nas quais é proficiente.","tipo":"concedido","requisitos":"Devoto de Valkaria","acao":"","custoPM":0}},
  {"name":"Arsenal das Profundezas","system":{"descricao":"+2 nas rolagens de dano com azagaias, lanças e tridentes e multiplicador de crítico +1 com essas armas.","tipo":"concedido","requisitos":"Devoto do Oceano","acao":"","custoPM":0}},
  {"name":"Astúcia da Serpente","system":{"descricao":"+2 em Enganação, Furtividade e Intuição.","tipo":"concedido","requisitos":"Devoto de Sszzaas","acao":"","custoPM":0}},
  {"name":"Ataque Piedoso","system":{"descricao":"Pode usar armas corpo a corpo para causar dano não letal sem penalidade de –5.","tipo":"concedido","requisitos":"Devoto de Lena ou Thyatis","acao":"","custoPM":0}},
  {"name":"Aura de Medo","system":{"descricao":"Gaste 2 PM: todas as criaturas a sua escolha em alcance curto ficam abaladas até o fim da cena (Von CD Sab anula). 1x/cena.","tipo":"concedido","requisitos":"Devoto de Kallyadranoch","acao":"padrão","custoPM":2}},
  {"name":"Aura de Paz","system":{"descricao":"Gaste 2 PM: criaturas em alcance curto não podem atacar você até o fim da cena ou até você atacar/causar dano (Von CD Sab anula). Afeta apenas criaturas com Int –3 ou maior.","tipo":"concedido","requisitos":"Devoto de Marah","acao":"padrão","custoPM":2}},
  {"name":"Aura Restauradora","system":{"descricao":"No início de cada cena, você e aliados em alcance curto recuperam PM igual à sua Sabedoria.","tipo":"concedido","requisitos":"Devoto de Lena","acao":"","custoPM":0}},
  {"name":"Bênção do Mana","system":{"descricao":"+1 PM por nível e +2 em Misticismo.","tipo":"concedido","requisitos":"Devoto de Wynna","acao":"","custoPM":0}},
  {"name":"Carícia Sombria","system":{"descricao":"Gaste 1 PM: toque causa 2d8 de dano de trevas (Fort CD Sab reduz à metade). Para cada PM extra, +1d8.","tipo":"concedido","requisitos":"Devoto de Tenebra","acao":"padrão","custoPM":1}},
  {"name":"Centelha Mágica","system":{"descricao":"Pode lançar 3 magias arcanas de 1° círculo (Int). Não precisa ser conjurador.","tipo":"concedido","requisitos":"Devoto de Wynna","acao":"","custoPM":0}},
  {"name":"Compreender os Ermos","system":{"descricao":"+2 Sobrevivência. Em áreas naturais, pode falar com animais (como Voz Divina) e sabe se está sendo seguido.","tipo":"concedido","requisitos":"Devoto de Allihanna","acao":"","custoPM":0}},
  {"name":"Conhecimento Enciclopédico","system":{"descricao":"+2 Conhecimento, Misticismo e Religião.","tipo":"concedido","requisitos":"Devoto de Tanna-Toh","acao":"","custoPM":0}},
  {"name":"Conjurar Arma","system":{"descricao":"Gaste 1 PM: conjura arma corpo a corpo ou de arremesso na qual é proficiente. Dura até o fim da cena. Bônus de +1 ataque/dano por Arsenal.","tipo":"concedido","requisitos":"Devoto de Arsenal","acao":"ação livre","custoPM":1}},
  {"name":"Coragem Total","system":{"descricao":"Imune a efeitos de medo, mesmo mágicos.","tipo":"concedido","requisitos":"Devoto de Arsenal, Khalmyr, Lin-Wu ou Valkaria","acao":"","custoPM":0}},
  {"name":"Cura Gentil","system":{"descricao":"Lança Curar Ferimentos como magia divina (Sab). Se aprender novamente, –1 PM.","tipo":"concedido","requisitos":"Devoto de Lena","acao":"","custoPM":0}},
  {"name":"Curandeira Perfeita","system":{"descricao":"Quando usa Curar Ferimentos, cura +1 PV por dado. Cura condições: abalado, debilitado, enjoado, esmorecido, fatigado, fraco.","tipo":"concedido","requisitos":"Devoto de Lena","acao":"","custoPM":0}},
  {"name":"Dedo Verde","system":{"descricao":"Lança Controlar Plantas como magia divina (Sab). Se aprender novamente, –1 PM.","tipo":"concedido","requisitos":"Devoto de Allihanna","acao":"","custoPM":0}},
  {"name":"Descanso Natural","system":{"descricao":"Descansando ao ar livre em área natural, você e aliados em alcance curto recuperam +1 PV por nível e +1 PM por nível.","tipo":"concedido","requisitos":"Devoto de Allihanna","acao":"","custoPM":0}},
  {"name":"Dom da Esperança","system":{"descricao":"Gaste 2 PM: aliados em alcance curto recebem +2 em testes de resistência e curam 1d6+Sab PV.","tipo":"concedido","requisitos":"Devoto de Marah","acao":"padrão","custoPM":2}},
  {"name":"Dom da Imortalidade","system":{"descricao":"Se for reduzido a 0 PV ou menos, pode gastar 5 PM para ficar com 1 PV. 1x/cena.","tipo":"concedido","requisitos":"Devoto de Thyatis, paladino","acao":"reação","custoPM":5}},
  {"name":"Dom da Profecia","system":{"descricao":"Pode gastar 2 PM para receber uma dica do mestre sobre a aventura atual.","tipo":"concedido","requisitos":"Devoto de Thyatis","acao":"","custoPM":2}},
  {"name":"Dom da Ressurreição","system":{"descricao":"Lança Ressurreição sem custo de T$. 1x/aventura.","tipo":"concedido","requisitos":"Devoto de Thyatis, clérigo","acao":"","custoPM":0}},
  {"name":"Dom da Verdade","system":{"descricao":"Pode gastar 2 PM para saber se uma afirmação que acabou de ouvir é verdadeira ou falsa.","tipo":"concedido","requisitos":"Devoto de Khalmyr","acao":"","custoPM":2}},
  {"name":"Escamas Dracônicas","system":{"descricao":"Recebe +1 Defesa e resistência a um tipo de energia (ácido/eletricidade/fogo/frio) 10.","tipo":"concedido","requisitos":"Devoto de Kallyadranoch","acao":"","custoPM":0}},
  {"name":"Escudo Mágico","system":{"descricao":"Gaste 1 PM: +2 Defesa até o início do seu próximo turno.","tipo":"concedido","requisitos":"Devoto de Wynna","acao":"reação","custoPM":1}},
  {"name":"Espada Justiceira","system":{"descricao":"Gaste 2 PM: sua próxima arma corpo a corpo causa +2d8 de dano contra criaturas malignas.","tipo":"concedido","requisitos":"Devoto de Khalmyr","acao":"","custoPM":2}},
  {"name":"Espada Solar","system":{"descricao":"Gaste 2 PM: arma corpo a corpo brilha com luz solar, causando +1d6 de dano de luz.","tipo":"concedido","requisitos":"Devoto de Azgher","acao":"","custoPM":2}},
  {"name":"Êstase da Loucura","system":{"descricao":"Gaste 2 PM: fica imune a dano e condições por 1 rodada, mas não pode agir.","tipo":"concedido","requisitos":"Devoto de Aharadak ou Nimb","acao":"reação","custoPM":2}},
  {"name":"Familiar Ofídico","system":{"descricao":"Recebe uma serpente como familiar. Fornece +2 Furtividade e resistência a veneno +5.","tipo":"concedido","requisitos":"Devoto de Sszzaas","acao":"","custoPM":0}},
  {"name":"Farsa do Fingidor","system":{"descricao":"Gaste 1 PM: usa Enganação no lugar de outra perícia por 1 teste.","tipo":"concedido","requisitos":"Devoto de Hyninn","acao":"","custoPM":1}},
  {"name":"Fé Guerreira","system":{"descricao":"Proficiente em todas as armas. +1 em rolagens de dano com armas de Arsenal.","tipo":"concedido","requisitos":"Devoto de Arsenal","acao":"","custoPM":0}},
  {"name":"Forma de Macaco","system":{"descricao":"Gaste 2 PM: se transforma em macaco Minúsculo (+5 Furtividade, –5 testes de manobra). Escalada 9m. Termina ao atacar/lançar magia/sofrer dano.","tipo":"concedido","requisitos":"Devoto de Hyninn","acao":"padrão","custoPM":2}},
  {"name":"Fulgor Solar","system":{"descricao":"RD frio/trevas 5. Ao ser alvo de ataque, gaste 1 PM: atacante fica ofuscado 1 rodada.","tipo":"concedido","requisitos":"Devoto de Azgher","acao":"","custoPM":0}},
  {"name":"Fúria Divina","system":{"descricao":"Gaste 2 PM: +2 ataque e dano corpo a corpo (cena). Não pode usar Furtividade ou lançar magias. Se combinada com Fúria, ela dura a cena.","tipo":"concedido","requisitos":"Devoto de Thwor","acao":"","custoPM":2}},
  {"name":"Golpista Divino","system":{"descricao":"+2 em Enganação, Jogatina e Ladinagem.","tipo":"concedido","requisitos":"Devoto de Hyninn","acao":"","custoPM":0}},
  {"name":"Habitante do Deserto","system":{"descricao":"RD fogo 10. Gaste 1 PM: cria água pura para 1 odre.","tipo":"concedido","requisitos":"Devoto de Azgher","acao":"","custoPM":0}},
  {"name":"Inimigo de Tenebra","system":{"descricao":"+1d6 dano contra mortos-vivos. Efeitos de luz têm alcance dobrado.","tipo":"concedido","requisitos":"Devoto de Azgher","acao":"","custoPM":0}},
  {"name":"Kiai Divino","system":{"descricao":"1x/rodada ao atacar corpo a corpo, gaste 3 PM: causa dano máximo sem rolar dados.","tipo":"concedido","requisitos":"Devoto de Lin-Wu","acao":"","custoPM":3}},
  {"name":"Liberdade Divina","system":{"descricao":"Gaste 2 PM: imune a efeitos de movimento por 1 rodada.","tipo":"concedido","requisitos":"Devoto de Valkaria","acao":"","custoPM":2}},
  {"name":"Manto da Penumbra","system":{"descricao":"Lança Escuridão (Sab). Se aprender novamente, –1 PM.","tipo":"concedido","requisitos":"Devoto de Tenebra","acao":"","custoPM":0}},
  {"name":"Mente Analítica","system":{"descricao":"+2 em Intuição, Investigação e Vontade.","tipo":"concedido","requisitos":"Devoto de Tanna-Toh","acao":"","custoPM":0}},
  {"name":"Mente Vazia","system":{"descricao":"+2 em Iniciativa, Percepção e Vontade.","tipo":"concedido","requisitos":"Devoto de Lin-Wu","acao":"","custoPM":0}},
  {"name":"Mestre dos Mares","system":{"descricao":"Fala com animais aquáticos. Lança Acalmar Animal (só contra aquáticos). Se aprender novamente, –1 PM.","tipo":"concedido","requisitos":"Devoto do Oceano","acao":"","custoPM":0}},
  {"name":"Olhar Amedrontador","system":{"descricao":"Lança Amedrontar (Sab). Se aprender novamente, –1 PM.","tipo":"concedido","requisitos":"Devoto de Megalokk ou Thwor","acao":"","custoPM":0}},
  {"name":"Palavras de Bondade","system":{"descricao":"Lança Enfeitiçar (Sab). Se aprender novamente, –1 PM.","tipo":"concedido","requisitos":"Devoto de Marah","acao":"","custoPM":0}},
  {"name":"Percepção Temporal","system":{"descricao":"Gaste 3 PM: soma Sabedoria (limitado pelo nível) nos ataques, Defesa e Reflexos (cena).","tipo":"concedido","requisitos":"Devoto de Aharadak","acao":"","custoPM":3}},
  {"name":"Pesquisa Abençoada","system":{"descricao":"Gaste 1h pesquisando: rola novamente teste de Int ou Sab feito desde a última cena. +2 com biblioteca pequena, +5 com biblioteca grande.","tipo":"concedido","requisitos":"Devoto de Tanna-Toh","acao":"","custoPM":0}},
  {"name":"Poder Oculto","system":{"descricao":"Gaste 1 mov + 2 PM: role 1d6 para +2 em For (1-2), Des (3-4) ou Con (5-6) (cena). Não cumulativo no mesmo atributo.","tipo":"concedido","requisitos":"Devoto de Nimb","acao":"movimento","custoPM":2}},
  {"name":"Presas Primordiais","system":{"descricao":"Gaste 1 PM: mordida (1d6, x2, perf) até fim da cena. 1x/rodada, 1 PM para ataque extra. Se já tem mordida, +2 passos de dano.","tipo":"concedido","requisitos":"Devoto de Kallyadranoch ou Megalokk","acao":"","custoPM":1}},
  {"name":"Presas Venenosas","system":{"descricao":"Gaste 1 mov + 1 PM: envenena arma corpo a corpo. Acerto = perda de 1d12 PV. Dura até acertar ou fim da cena.","tipo":"concedido","requisitos":"Devoto de Sszzaas","acao":"movimento","custoPM":1}},
  {"name":"Rejeição Divina","system":{"descricao":"Resistência a magia divina +5.","tipo":"concedido","requisitos":"Devoto de Aharadak","acao":"","custoPM":0}},
  {"name":"Reparar Injustiça","system":{"descricao":"1x/rodada quando oponente em alcance curto acerta ataque em você ou aliado, gaste 2 PM: oponente repete o ataque, usa o pior resultado.","tipo":"concedido","requisitos":"Devoto de Khalmyr","acao":"reação","custoPM":2}},
  {"name":"Sangue de Ferro","system":{"descricao":"Gaste 3 PM: +2 dano e RD 5 (cena).","tipo":"concedido","requisitos":"Devoto de Arsenal","acao":"","custoPM":3}},
  {"name":"Sangue Ofídico","system":{"descricao":"Resistência a veneno +5. CD dos seus venenos +2.","tipo":"concedido","requisitos":"Devoto de Sszzaas","acao":"","custoPM":0}},
  {"name":"Servos do Dragão","system":{"descricao":"Gaste 1 completa + 2 PM: invoca 2d4+1 kobolds capangas em alcance curto. 1 mov = andam (9m), 1 padrão = atacam (1d6–1 perf). Def 12, 1 PV. Fim da cena.","tipo":"concedido","requisitos":"Devoto de Kallyadranoch","acao":"completa","custoPM":2}},
  {"name":"Sopro do Mar","system":{"descricao":"Gaste 1 padrão + 1 PM: cone de 6m, 2d6 dano de frio (Ref CD Sab ½). Pode aprender Sopro das Uivantes como divina (–1 PM).","tipo":"concedido","requisitos":"Devoto do Oceano","acao":"padrão","custoPM":1}},
  {"name":"Sorte dos Loucos","system":{"descricao":"Gaste 1 PM: rola novamente teste recém realizado. Se falhar novamente, perde 1d6 PM.","tipo":"concedido","requisitos":"Devoto de Nimb","acao":"","custoPM":1}},
  {"name":"Talento Artístico","system":{"descricao":"+2 em Acrobacia, Atuação e Diplomacia.","tipo":"concedido","requisitos":"Devoto de Marah","acao":"","custoPM":0}},
  {"name":"Teurgista Místico","system":{"descricao":"Até 1 magia por círculo pode ser escolhida de magias divinas (se arcano) ou arcanas (se divino). Pré-requisito: habilidade de classe Magias.","tipo":"concedido","requisitos":"Devoto de Wynna, habilidade Magias","acao":"","custoPM":0}},
  {"name":"Tradição de Lin-Wu","system":{"descricao":"Katana conta como arma simples. Se proficiente em marciais, +1 margem de ameaça com katana.","tipo":"concedido","requisitos":"Devoto de Lin-Wu","acao":"","custoPM":0}},
  {"name":"Transmissão da Loucura","system":{"descricao":"Lança Sussurros Insanos (CD Car). Se aprender novamente, –1 PM.","tipo":"concedido","requisitos":"Devoto de Nimb","acao":"","custoPM":0}},
  {"name":"Tropas Duyshidakk","system":{"descricao":"Gaste 1 completa + 2 PM: invoca 1d4+1 goblinoides capangas em alcance curto. 1 mov = andam (9m), 1 padrão = atacam (1d6+1 corte). Def 15, 1 PV. Fim da cena.","tipo":"concedido","requisitos":"Devoto de Thwor","acao":"completa","custoPM":2}},
  {"name":"Urro Divino","system":{"descricao":"Gaste 1 padrão + 1 PM: todas as criaturas em alcance curto ficam abaladas (Von CD Sab anula). Criaturas de tipo animal ou monstro também ficam apavoradas.","tipo":"concedido","requisitos":"Devoto de Megalokk","acao":"padrão","custoPM":1}},
  {"name":"Visão nas Trevas","system":{"descricao":"Visão no escuro. +2 Percepção em ambientes de escuridão.","tipo":"concedido","requisitos":"Devoto de Tenebra","acao":"","custoPM":0}},
  {"name":"Voz da Civilização","system":{"descricao":"+2 Diplomacia. Em áreas urbanas, pode gastar 1 PM para falar qualquer idioma por 1 cena.","tipo":"concedido","requisitos":"Devoto de Tanna-Toh","acao":"","custoPM":0}},
  {"name":"Voz da Natureza","system":{"descricao":"Pode falar com animais e plantas (como Voz Divina permanente).","tipo":"concedido","requisitos":"Devoto de Allihanna","acao":"","custoPM":0}},
  {"name":"Voz dos Monstros","system":{"descricao":"Pode falar com monstros e criaturas não-inteligentes. +2 Adestramento com monstros.","tipo":"concedido","requisitos":"Devoto de Megalokk","acao":"","custoPM":0}},
  {"name":"Zumbificar","system":{"descricao":"Gaste 1 completa + 3 PM: reanima um cadáver como zumbi capanga. Segue regras de Tropas Duyshidakk, mas com For 2, Def 12, dano 1d6+2 impacto.","tipo":"concedido","requisitos":"Devoto de Tenebra","acao":"completa","custoPM":3}}
];

async function importAll() {
  const pack = game.packs.get(PACK_NAME);
  if (!pack) return ui.notifications.error("Pack não encontrado: " + PACK_NAME);
  await pack.configure({locked: false});
  let created = 0, updated = 0;
  for (const d of DATA) {
    const itemData = {name: d.name, type: "poder", img: "icons/svg/holy-shield.svg", system: d.system};
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
  ui.notifications.info(`Poderes concedidos: ${created} criados, ${updated} atualizados (total: ${DATA.length})`);
}
importAll();
