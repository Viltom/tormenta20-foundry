// TORMENTA 20 — Importar Origens Extras (29 itens)
// Fonte: Heróis de Arton
// Pack: tormenta20.origens

const PACK_NAME = "tormenta20.origens";
const DATA = [
  {"name":"Bacharel","system":{"descricao":"Perícias: Conhecimento, Diplomacia, Nobreza.\nBenefício: 1x/cena usa Diplomacia para mudar atitude como ação livre.\nItens: Tabardo com símbolo de Khalmyr, coleção de livros.","tipo":"origem","requisitos":"Conhecimento, Diplomacia, Nobreza","acao":""}},
  {"name":"Boticário","system":{"descricao":"Perícias: Cura, Ofício (alquimista).\nBenefício: Pode fabricar poções de 2 fórmulas de 1° círculo (como Alquimista Iniciado).\nItens: Bálsamo restaurador, instrumentos de alquimista.","tipo":"origem","requisitos":"Cura, Ofício (alquimista)","acao":""}},
  {"name":"Caçador de Recompensas","system":{"descricao":"Perícias: Furtividade, Investigação, Sobrevivência.\nBenefício: +2 em testes de perícias contra criaturas de 2 categorias de tamanho menor (mín. Minúsculas).\nItens: Clava, gato (parceiro perseguidor iniciante), T$ 50.","tipo":"origem","requisitos":"Furtividade, Investigação, Sobrevivência","acao":""}},
  {"name":"Cão de Briga","system":{"descricao":"Perícias: Fortitude, Luta.\nBenefício: 1x/cena ao acertar ataque desarmado ou arma natural, +1d6 dano.\nItens: Manoplas ou uma arma marcial.","tipo":"origem","requisitos":"Fortitude, Luta","acao":""}},
  {"name":"Carcereiro","system":{"descricao":"Perícias: Intimidação, Investigação.\nBenefício: +2 em testes contra criaturas que estejam agarradas, amarradas ou presas.\nItens: Algemas, lampião, uma arma de até T$ 100.","tipo":"origem","requisitos":"Intimidação, Investigação","acao":""}},
  {"name":"Carpinteiro de Guilda","system":{"descricao":"Perícias: Ofício (artesão).\nBenefício: RD corte 2. Em suas mãos, qualquer item de madeira conta como clava (1d6).\nItens: Instrumentos de carpinteiro, uma arma de madeira.","tipo":"origem","requisitos":"Ofício (artesão)","acao":""}},
  {"name":"Catador da Catástrofe","system":{"descricao":"Perícias: Fortitude, Percepção.\nBenefício: No início de cada aventura, teste de Sobrevivência (CD 15). Sucesso = tesouro aleatório.\nItens: Dois equipamentos de aventura de até T$ 150 cada.","tipo":"origem","requisitos":"Fortitude, Percepção","acao":""}},
  {"name":"Chef Hynne","system":{"descricao":"Perícias: Ofício (cozinheiro).\nBenefício: Quando prepara prato especial, benefício dura +1 dia. Se tiver uso diário, pode usar novamente.\nItens: Cutelo (= foice), instrumentos de cozinheiro aprimorados.","tipo":"origem","requisitos":"Ofício (cozinheiro)","acao":""}},
  {"name":"Cirurgião-Barbeiro","system":{"descricao":"Perícias: Cura, Ofício (barbeiro).\nBenefício: Ação completa + 2 PM para remover 1 condição de criatura adjacente (abalado, atordoado, cego, confuso, envenenado, etc.), mas a criatura perde 1d6 PV.\nItens: Dente falso, instrumentos de barbeiro, maleta de medicamentos.","tipo":"origem","requisitos":"Cura, Ofício (barbeiro)","acao":""}},
  {"name":"Citadino Abastado","system":{"descricao":"Perícias: Nobreza, Ofício (à escolha).\nBenefício: Em cidade grande, gaste T$ 10 × nível para aprender um poder de combate/destino/classe (pré-requisitos cumpridos) por 1 cena até fim da aventura.\nItens: Arma, armadura, ferramenta ou vestuário até T$ 500.","tipo":"origem","requisitos":"Nobreza, Ofício (à escolha)","acao":""}},
  {"name":"Cocheiro","system":{"descricao":"Perícias: Adestramento, Pilotagem.\nBenefício: Ao conduzir veículo, você e o veículo recebem +2 Defesa e testes de resistência.\nItens: Cavalo ou trobo, carroça.","tipo":"origem","requisitos":"Adestramento, Pilotagem","acao":""}},
  {"name":"Construtor","system":{"descricao":"Perícias: Fortitude, Ofício (pedreiro).\nBenefício: 2 PM para você ou aliado em alc. curto ignorar 5 RD de criatura ou objeto (cena).\nItens: Instrumentos de pedreiro ou ferramenta pesada (= maça ou lança).","tipo":"origem","requisitos":"Fortitude, Ofício (pedreiro)","acao":""}},
  {"name":"Contrabandista","system":{"descricao":"Perícias: Enganação, Ladinagem.\nBenefício: +5 Ladinagem para ocultar itens em si ou veículos. Capacidade de carga +2 espaços.\nItens: Arma de fogo ou 10 doses de venenos (até T$ 500 total).","tipo":"origem","requisitos":"Enganação, Ladinagem","acao":""}},
  {"name":"Coureiro","system":{"descricao":"Perícias: Fortitude, Ofício (coureiro).\nBenefício: 10 min + T$ 10 para +1 Defesa e –2 penalidade em armadura de couro (1 dia).\nItens: Faca de corte (= adaga, dano corte), instrumentos de coureiro, T$ 100 em alquímicos.","tipo":"origem","requisitos":"Fortitude, Ofício (coureiro)","acao":""}},
  {"name":"Escriba","system":{"descricao":"Perícias: Conhecimento, Ofício (escriba).\nBenefício: Recebe Lendas e Histórias (poder de bardo). Se receber novamente, +5 ao rolar novamente.\nItens: Instrumentos de escriba, organizador de pergaminhos, coleção de livros.","tipo":"origem","requisitos":"Conhecimento, Ofício (escriba)","acao":""}},
  {"name":"Espião","system":{"descricao":"Perícias: Enganação, Ladinagem.\nBenefício: Escolha 1 perícia (exceto Luta/Pontaria). Pode usar Carisma como atributo-chave dela.\nItens: Kit de disfarce, equipamento de espionagem.","tipo":"origem","requisitos":"Enganação, Ladinagem","acao":""}},
  {"name":"Freira","system":{"descricao":"Perícias: Cura.\nBenefício: Quando usa Cura para cuidados prolongados, o alvo recupera +1 PV/nível adicional.\nItens: Símbolo sagrado, traje religioso, kit de Cura.","tipo":"origem","requisitos":"Cura","acao":""}},
  {"name":"Goradista","system":{"descricao":"Perícias: Ofício (cozinheiro).\nBenefício: Quando prepara prato especial, pode gastar PM extras para efeitos adicionais.\nItens: Instrumentos de cozinheiro, ingredientes especiais.","tipo":"origem","requisitos":"Ofício (cozinheiro)","acao":""}},
  {"name":"Insciente","system":{"descricao":"Perícias: Sobrevivência.\nBenefício: Treinamento especial de sobrevivência com bônus adicionais.\nItens: Equipamento de aventura básico.","tipo":"origem","requisitos":"Sobrevivência","acao":""}},
  {"name":"Interrogador","system":{"descricao":"Perícias: Intimidação, Intuição.\nBenefício: Especialista em extrair informações. Bônus em interrogatórios.\nItens: Instrumentos de interrogatório, algemas.","tipo":"origem","requisitos":"Intimidação, Intuição","acao":""}},
  {"name":"Ladrão de Túmulos","system":{"descricao":"Perícias: Ladinagem, Religião.\nBenefício: Treinado em explorar ruínas e tumbas. Bônus contra mortos-vivos e armadilhas.\nItens: Ferramentas de ladrão, tocha, corda.","tipo":"origem","requisitos":"Ladinagem, Religião","acao":""}},
  {"name":"Menestrel","system":{"descricao":"Perícias: Atuação.\nBenefício: Recebe habilidade musical especial. +2 Atuação.\nItens: Instrumento musical, roupas de artista.","tipo":"origem","requisitos":"Atuação","acao":""}},
  {"name":"Mensageiro","system":{"descricao":"Perícias: Atletismo, Iniciativa.\nBenefício: +3m deslocamento, +2 em testes de resistência.\nItens: Botas de viagem, bolsa de mensageiro.","tipo":"origem","requisitos":"Atletismo, Iniciativa","acao":""}},
  {"name":"Náufrago","system":{"descricao":"Perícias: Atletismo, Sobrevivência.\nBenefício: +5 PV e +2 PM. Bônus de sobrevivência em ambientes aquáticos.\nItens: Equipamento improvisado, frasco de água.","tipo":"origem","requisitos":"Atletismo, Sobrevivência","acao":""}},
  {"name":"Padeiro","system":{"descricao":"Perícias: Ofício (cozinheiro).\nBenefício: Profissão fortificou seus braços. Bônus em Força para carregar e empurrar.\nItens: Rolo de massa (= clava), ingredientes de panificação.","tipo":"origem","requisitos":"Ofício (cozinheiro)","acao":""}},
  {"name":"Pedinte","system":{"descricao":"Perícias: Furtividade, Enganação.\nBenefício: Muito discreto, +2 em Furtividade e Enganação em ambientes urbanos.\nItens: Roupas de mendigo, tigela, mapa improvisado.","tipo":"origem","requisitos":"Furtividade, Enganação","acao":""}},
  {"name":"Pescador","system":{"descricao":"Perícias: Ofício (pescador), Sobrevivência.\nBenefício: Especialista em ambientes aquáticos. Bônus em pesca e natação.\nItens: Vara de pescar, rede, faca.","tipo":"origem","requisitos":"Ofício (pescador), Sobrevivência","acao":""}},
  {"name":"Servo","system":{"descricao":"Perícias: Diplomacia, Intuição.\nBenefício: Experiência servindo nobres. Bônus social em ambientes nobres.\nItens: Uniforme de servo, chaves, bandeja.","tipo":"origem","requisitos":"Diplomacia, Intuição","acao":""}},
  {"name":"Suporte de Tropas","system":{"descricao":"Perícias: Cura, Guerra.\nBenefício: Sempre que faz teste para ajudar aliado, bônus adicional.\nItens: Kit de primeiros socorros, bandeira ou estandarte.","tipo":"origem","requisitos":"Cura, Guerra","acao":""}}
];

async function importAll() {
  const pack = game.packs.get(PACK_NAME);
  if (!pack) return ui.notifications.error("Pack não encontrado: " + PACK_NAME);
  await pack.configure({locked: false});
  let created = 0, updated = 0;
  for (const d of DATA) {
    const itemData = {name: d.name, type: "poder", img: "icons/svg/village.svg", system: d.system};
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
  ui.notifications.info(`Origens extras: ${created} criadas, ${updated} atualizadas (total: ${DATA.length})`);
}
importAll();
