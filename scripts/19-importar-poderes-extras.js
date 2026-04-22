// TORMENTA 20 — Importar Poderes Extras (77+ itens)
// Fonte: Heróis de Arton — Novos Poderes Gerais, Raciais e de Grupo
// Pack: tormenta20.poderes

const PACK_NAME = "tormenta20.poderes";
const DATA = [
  // === NOVOS PODERES DE COMBATE (8) ===
  {"name":"Alma Livre","system":{"descricao":"Quando sofre um efeito que o deixe agarrado, enredado ou preso, você pode gastar 1 PM como reação para ignorar esse efeito por 1 rodada.","tipo":"combate","requisitos":"—","acao":"reação","custoPM":1}},
  {"name":"Andarilho Urbano","system":{"descricao":"Você não sofre penalidade em seu deslocamento por terreno difícil em ambientes urbanos e recebe +2 em Acrobacia para equilibrar-se em telhados, vigas e bordas.","tipo":"combate","requisitos":"—","acao":"","custoPM":0}},
  {"name":"Carícias Revigorantes","system":{"descricao":"Quando usa Sedução Lasciva, se o alvo falhar, além de ficar enfeitiçado, você recupera 2d6 PM. 1x/dia.","tipo":"combate","requisitos":"Car 2, Sedução Lasciva","acao":"","custoPM":0}},
  {"name":"Diligente","system":{"descricao":"Gaste 1 movimento para se concentrar: +2 em um teste de perícia (exceto ataque) que exija no máximo uma ação completa, realizado até o fim do próximo turno.","tipo":"combate","requisitos":"—","acao":"movimento","custoPM":0}},
  {"name":"Foco em Habilidade","system":{"descricao":"Escolha uma habilidade. A CD para resistir a ela aumenta em +2. Pode escolher outras vezes para habilidades diferentes. Não se aplica a magias.","tipo":"combate","requisitos":"—","acao":"","custoPM":0}},
  {"name":"Grandão","system":{"descricao":"Conta como uma categoria de tamanho maior para Furtividade, manobras, espaço e alcance natural. +5 capacidade de carga.","tipo":"combate","requisitos":"Con 2","acao":"","custoPM":0}},
  {"name":"Herói dos Sete Instrumentos","system":{"descricao":"+1 em testes de perícias não treinadas (+2 no 7° nível, +3 no 15° nível).","tipo":"combate","requisitos":"—","acao":"","custoPM":0}},
  {"name":"Catafractário","system":{"descricao":"Quando faz uma investida montado com armadura pesada, o dano da investida aumenta em +2d8. Pré-requisito: Encouraçado, Cavalgar.","tipo":"combate","requisitos":"Encouraçado, Cavalgar","acao":"","custoPM":0}},

  // === NOVOS PODERES DE DESTINO (6) ===
  {"name":"Impostor","system":{"descricao":"1x/cena, gaste 2 PM: use Enganação no lugar de uma perícia (teste que exija no máx. ação completa).","tipo":"destino","requisitos":"Car 3, Foco em Perícia (Enganação)","acao":"","custoPM":2}},
  {"name":"Liderança Inspiradora","system":{"descricao":"Posiciona capangas como ação padrão (em vez de completa). 1x/rodada, ação livre para movê-los ou fazê-los causar dano.","tipo":"destino","requisitos":"Car 1","acao":"","custoPM":0}},
  {"name":"Meditação Autoafirmativa","system":{"descricao":"Medite por 1 dia e faça teste de Carisma para adquirir benefício temporário (1 semana): +1 ataque, +1 Defesa, +1 perícia, etc.","tipo":"destino","requisitos":"Sab 1, Car 1, 5° nível","acao":"","custoPM":0}},
  {"name":"Pose Assustadora","system":{"descricao":"Quando usa Intimidação para desmoralizar, pode afetar todas as criaturas em alcance curto com um único teste.","tipo":"destino","requisitos":"Car 1, Intimidação","acao":"","custoPM":0}},
  {"name":"Sedução Lasciva","system":{"descricao":"Teste de Enganação vs Vontade: alvo fica enfeitiçado por 1 dia. Custa alguns minutos + 3 PM.","tipo":"destino","requisitos":"Car 1, Enganação","acao":"","custoPM":3}},
  {"name":"Ventriloquismo","system":{"descricao":"Gaste 1 PM: voz parece vir de outro lugar por 1 rodada. Situação suspeita = teste de Enganação vs Intuição.","tipo":"destino","requisitos":"Atuação, Enganação","acao":"","custoPM":1}},

  // === NOVOS PODERES DE MAGIA (8) ===
  {"name":"Barreira Mística","system":{"descricao":"Ao lançar magia, gaste +1 PM: +4 Defesa até o início do próximo turno.","tipo":"magia","requisitos":"Lançar magias","acao":"","custoPM":1}},
  {"name":"Esoterismo","system":{"descricao":"Ao lançar magia, pague +2 PM para canalizar por dois itens esotéricos simultaneamente.","tipo":"magia","requisitos":"Lançar magias de 2° círculo","acao":"","custoPM":2}},
  {"name":"Estilo Esotérico","system":{"descricao":"1x/rodada ao agredir corpo a corpo com item esotérico, gaste 2 PM para lançar magia como ação livre.","tipo":"magia","requisitos":"Luta, Misticismo, 5° nível","acao":"","custoPM":2}},
  {"name":"Encantar Itens Menores","system":{"descricao":"Pode encantar itens mágicos menores permanentes usando Misticismo/Religião.","tipo":"magia","requisitos":"Lançar magias 3° círculo, Misticismo ou Religião","acao":"","custoPM":0}},
  {"name":"Encantar Itens Médios","system":{"descricao":"Como Encantar Itens Menores, mas para itens médios.","tipo":"magia","requisitos":"Lançar magias 4° círculo, Encantar Itens Menores","acao":"","custoPM":0}},
  {"name":"Encantar Itens Maiores","system":{"descricao":"Como Encantar Itens Menores, mas para itens maiores.","tipo":"magia","requisitos":"Lançar magias 5° círculo, Encantar Itens Médios","acao":"","custoPM":0}},
  {"name":"Especialização em Magia","system":{"descricao":"Escolha uma magia. CD para resistir +2. Pré-requisito: Foco em Magia com a magia escolhida.","tipo":"magia","requisitos":"Foco em Magia","acao":"","custoPM":0}},
  {"name":"Explosão Fulgente","system":{"descricao":"Aprimoramento (+1 PM): alvo que falhe fica cego 1 rodada. Só magias de fogo com teste de resistência.","tipo":"magia","requisitos":"Lançar magias","acao":"","custoPM":1}},
  {"name":"Gênese Elemental","system":{"descricao":"Aprimoramento (+3 PM): magia cria 1d4+1/círculo capangas elementais Pequenos (Des 9m, Def 15, 1d6+1 dano).","tipo":"magia","requisitos":"Lançar magias 2° círculo","acao":"","custoPM":3}},
  {"name":"Magia Dividida","system":{"descricao":"Aprimoramento (+2 PM): área da magia é dividida em duas metades não sobrepostas.","tipo":"magia","requisitos":"Lançar magias 2° círculo","acao":"","custoPM":2}},
  {"name":"Magia Suspensa","system":{"descricao":"Aumente execução para completa/2 rodadas/3 rodadas: CD +1/+2/+5 respectivamente.","tipo":"magia","requisitos":"Lançar magias 2° círculo","acao":"","custoPM":0}},
  {"name":"Miasma Tóxico","system":{"descricao":"Aprimoramento (+1 PM): alvo que falhe fica enjoado 1 rodada. Só magias de ácido com teste.","tipo":"magia","requisitos":"Lançar magias","acao":"","custoPM":1}},
  {"name":"Prisão Gélida","system":{"descricao":"Aprimoramento (+1 PM): alvo que falhe fica enredado 1 rodada. Só magias de frio com teste.","tipo":"magia","requisitos":"Lançar magias","acao":"","custoPM":1}},
  {"name":"Trovão Retumbante","system":{"descricao":"Aprimoramento (+1 PM): alvo que falhe fica caído (1x/cena) e surdo. Só magias de eletricidade com teste.","tipo":"magia","requisitos":"Lançar magias","acao":"","custoPM":1}},

  // === NOVOS PODERES DA TORMENTA (5) ===
  {"name":"Bolsões Insanos","system":{"descricao":"Limite de carga +2 espaços (+1 por poder da Tormenta). +5 Ladinagem para ocultar itens nesses espaços.","tipo":"tormenta","requisitos":"—","acao":"","custoPM":0}},
  {"name":"Carapaça Corrompida","system":{"descricao":"RD 1 (+1 para cada dois outros poderes da Tormenta). Pré-requisito: Carapaça.","tipo":"tormenta","requisitos":"Carapaça","acao":"","custoPM":0}},
  {"name":"Repulsivo","system":{"descricao":"O primeiro ataque de cada inimigo contra você em cada cena sofre penalidade = total de poderes da Tormenta.","tipo":"tormenta","requisitos":"—","acao":"","custoPM":0}},
  {"name":"Simetria Radial","system":{"descricao":"Não pode ser flanqueado ou ficar caído. +5 para evitar ser agarrado. Pré-requisito: 4 poderes da Tormenta.","tipo":"tormenta","requisitos":"4 poderes da Tormenta","acao":"","custoPM":0}},
  {"name":"Tempo Místico","system":{"descricao":"1x/rodada ao lançar magia, gaste 2 PM + perca 1d6/1d8/1d12 PV para reduzir execução em 1/2/3 passos. Só cura com descanso.","tipo":"tormenta","requisitos":"2 poderes da Tormenta","acao":"","custoPM":2}},

  // === PODERES DE GRUPO (20) ===
  {"name":"Abrir a Guarda","system":{"descricao":"Quando você acerta um ataque, o próximo aliado que atacar o mesmo alvo nessa rodada recebe +2 no teste de ataque.","tipo":"grupo","requisitos":"Luta ou Pontaria","acao":"","custoPM":0}},
  {"name":"Ajuda do Amador","system":{"descricao":"Quando usa a ação ajudar em um aliado com este poder, o bônus fornecido aumenta em +2.","tipo":"grupo","requisitos":"—","acao":"","custoPM":0}},
  {"name":"Apontar Fraqueza","system":{"descricao":"Quando identifica uma criatura (Misticismo), aliados com este poder recebem +1 em testes contra ela (cena).","tipo":"grupo","requisitos":"—","acao":"","custoPM":0}},
  {"name":"Barragem de Golpes","system":{"descricao":"Quando dois ou mais aliados com este poder acertam ataques contra o mesmo alvo na mesma rodada, cada acerto após o primeiro causa +1d6 dano.","tipo":"grupo","requisitos":"—","acao":"","custoPM":0}},
  {"name":"Bode Expiatório","system":{"descricao":"1x/cena, quando um aliado com este poder seria reduzido a 0 PV, você pode gastar 3 PM como reação para receber o dano no lugar dele.","tipo":"grupo","requisitos":"—","acao":"reação","custoPM":3}},
  {"name":"Bote Coletivo","system":{"descricao":"Na primeira rodada de combate, aliados com este poder que ajam antes dos inimigos recebem +2 em ataques e dano.","tipo":"grupo","requisitos":"Iniciativa","acao":"","custoPM":0}},
  {"name":"Conforto Familiar","system":{"descricao":"Quando descansa junto com aliados com este poder, todos recuperam +1 PV e +1 PM por nível.","tipo":"grupo","requisitos":"—","acao":"","custoPM":0}},
  {"name":"Conselhos Salvadores","system":{"descricao":"Quando aliado com este poder falha em teste de resistência, você pode gastar 2 PM como reação para ele rolar novamente.","tipo":"grupo","requisitos":"—","acao":"reação","custoPM":2}},
  {"name":"Corrente de Corpos","system":{"descricao":"Quando aliado com este poder é alvo de um ataque, você pode gastar 1 PM para trocar de posição com ele (se estiver adjacente).","tipo":"grupo","requisitos":"—","acao":"reação","custoPM":1}},
  {"name":"Defesa do Mártir","system":{"descricao":"Quando aliado adjacente com este poder sofre dano, você pode gastar 1 PM para reduzir esse dano em um valor igual à sua Defesa – 10.","tipo":"grupo","requisitos":"—","acao":"reação","custoPM":1}},
  {"name":"Dinheiro Atrai Dinheiro","system":{"descricao":"No fim de cada aventura, o grupo recebe T$ extras iguais a 10% do tesouro total por membro com este poder.","tipo":"grupo","requisitos":"—","acao":"","custoPM":0}},
  {"name":"Escudo Vivo","system":{"descricao":"Enquanto adjacente a aliado com este poder, ambos recebem +1 na Defesa. Se ambos estiverem usando escudos, +2.","tipo":"grupo","requisitos":"—","acao":"","custoPM":0}},
  {"name":"Espírito de União","system":{"descricao":"PV de todos os heróis com este poder são somados em um total compartilhado. Dano/cura é aplicado ao total. Fim da cena: divide igualmente.","tipo":"grupo","requisitos":"Exército de Um Grupo Só, outro poder de grupo","acao":"","custoPM":0}},
  {"name":"Exército de Um Grupo Só","system":{"descricao":"Gaste 1 padrão + 2 PM para formar bando com aliados (cada um gasta 1 padrão + 2 PM). Aliados não agem mas dão +2 ataque cada. Acertar por 10+ = aliados somam dano.","tipo":"grupo","requisitos":"Guerra","acao":"padrão","custoPM":2}},
  {"name":"Magia Comunitária","system":{"descricao":"1x/rodada, ao lançar magia com alvo você/1 criatura, pague custo novamente por aliado com este poder em alcance curto para estender efeito.","tipo":"grupo","requisitos":"—","acao":"","custoPM":0}},
  {"name":"Mão Amiga","system":{"descricao":"Em ações que demoram mais de 1 semana, aliados com este poder adicionam 1 semana cada ao tempo da ação.","tipo":"grupo","requisitos":"—","acao":"","custoPM":0}},
  {"name":"Parede de Escudos","system":{"descricao":"Enquanto adjacente a aliado com escudo e este poder, ambos recebem +2 Defesa e +2 Reflexos.","tipo":"grupo","requisitos":"—","acao":"","custoPM":0}},
  {"name":"Presença Luminosa","system":{"descricao":"Aliados com este poder em alcance curto recebem +1 em testes de resistência contra medo e efeitos mentais.","tipo":"grupo","requisitos":"—","acao":"","custoPM":0}},
  {"name":"Saúde Coletiva","system":{"descricao":"Quando aliado com este poder é curado, outros aliados adjacentes com este poder recuperam metade da cura.","tipo":"grupo","requisitos":"—","acao":"","custoPM":0}},
  {"name":"Uma Mão Lava a Outra","system":{"descricao":"Quando usa Mão Amiga, cada aliado adiciona 2 semanas em vez de 1.","tipo":"grupo","requisitos":"Mão Amiga","acao":"","custoPM":0}}
];

async function importAll() {
  const pack = game.packs.get(PACK_NAME);
  if (!pack) return ui.notifications.error("Pack não encontrado: " + PACK_NAME);
  await pack.configure({locked: false});
  let created = 0, updated = 0;
  for (const d of DATA) {
    const itemData = {name: d.name, type: "poder", img: "icons/svg/combat.svg", system: d.system};
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
  ui.notifications.info(`Poderes extras: ${created} criados, ${updated} atualizados (total: ${DATA.length})`);
}
importAll();
