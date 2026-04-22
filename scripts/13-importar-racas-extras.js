// TORMENTA 20 — Importar Raças Extras (30 itens)
// Fontes: Heróis de Arton (5), Livro das Raças / Ameaças de Arton (25)
// Pack: tormenta20.racas

const PACK_NAME = "tormenta20.racas";
const DATA = [
  // === HERÓIS DE ARTON (5) ===
  {
    "name": "Duende",
    "system": {
      "descricao": "Tipo: Espírito. Criatura feérica personalizável.\nAtributos: +1 em dois atributos diferentes (Dons) + ajustes por Natureza/Tamanho.\n\n**Passo 1 — Natureza** (escolha):\n• Animal: +1 em um atributo a sua escolha.\n• Vegetal: Imune a atordoamento/metamorfose; Florescer Feérico.\n• Mineral: Imune a metabolismo; RD corte/fogo/perfuração 5; sem alimentação.\n\n**Passo 2 — Tamanho** (escolha):\n• Minúsculo: +5 Furtividade, –5 manobras, desloc 6m, For –1.\n• Pequeno: +2 Furtividade, –2 manobras, desloc 6m.\n• Médio: Sem modificadores, desloc 9m.\n• Grande: –2 Furtividade, +2 manobras, desloc 9m, Des –1.\n\n**Passo 4 — Presentes** (escolha 3; 1x/patamar pode trocar):\n1) Afinidade Elemental 2) Encantar Objetos 3) Enfeitiçar 4) Invisibilidade 5) Língua da Natureza 6) Maldição 7) Mais Lá do que Aqui 8) Metamorfose Animal 9) Sonhos Proféticos 10) Velocidade do Pensamento 11) Visão Feérica 12) Voo\n\n**Limitações** (todas obrigatórias):\n• Aversão a Ferro: +1 dano/dado com ferro; 1d6/rodada empunhando.\n• Aversão a Sinos: alquebrado/esmorecido.\n• Tabu: –5 em uma perícia. Desrespeitar = fatigado → exausto → morte.\n\nDevoção: Allihanna, Hyninn, Nimb, Wynna.",
      "tipo": "raca",
      "requisitos": "+1 em dois atributos + Natureza/Tamanho",
      "acao": "Espírito | Desloc/Tam variável"
    }
  },
  {
    "name": "Eiradaan",
    "system": {
      "descricao": "Atributos: Sab +2, Car +1, For –1\nDeslocamento: 9m | Tamanho: Médio | Tipo: Espírito\n\n• Essência Feérica: tipo espírito, visão na penumbra, fala com animais.\n• Magia Instintiva: usa Sab no lugar do atributo-chave de magias arcanas e Misticismo. Ao lançar magia, +1 PM para aprimoramentos.\n• Sentidos Místicos: permanentemente sob Visão Mística básica.\n• Canção da Melancolia: Vontade contra efeitos mentais rola dois dados, usa o pior.\n\nDevoção: Allihanna, Lena, Thyatis, Wynna.",
      "tipo": "raca",
      "requisitos": "Sab +2, Car +1, For –1",
      "acao": "Desloc: 9m, Tam: Médio"
    }
  },
  {
    "name": "Galokk",
    "system": {
      "descricao": "Atributos: For +1, Con +1, +1 em um atributo, Car –1\nDeslocamento: 9m | Tamanho: Grande | Tipo: Humanoide (gigante)\n\n• Força dos Titãs: ao acertar corpo a corpo/arremesso, 1 PM: rolar máximo = dado extra (limite = For).\n• Meio-Gigante: Grande, usa For como atributo-chave de Intimidação.\n• Infância entre os Pequenos: treinado em 1 perícia.\n\nDevoção: Allihanna, Arsenal, Megalokk.",
      "tipo": "raca",
      "requisitos": "For +1, Con +1, +1 livre, Car –1",
      "acao": "Desloc: 9m, Tam: Grande"
    }
  },
  {
    "name": "Meio-Elfo",
    "system": {
      "descricao": "Atributos: Int +1, +1 em dois atributos (exceto Con)\nDeslocamento: 9m | Tamanho: Médio\n\n• Ambição Herdada: 1 poder geral ou poder único de origem.\n• Entre Dois Mundos: +1 em perícias de Carisma.\n• Sangue Élfico: visão na penumbra, +1 PM/nível ímpar. Conta como elfo.\n\nDevoção: Qualquer.",
      "tipo": "raca",
      "requisitos": "Int +1, +1 em dois (exceto Con)",
      "acao": "Desloc: 9m, Tam: Médio"
    }
  },
  {
    "name": "Sátiro",
    "system": {
      "descricao": "Atributos: Car +2, Des +1, Sab –1\nDeslocamento: 12m | Tamanho: Médio | Tipo: Espírito\n\n• Festeiro Feérico: tipo espírito, visão na penumbra, +2 Atuação/Fortitude.\n• Instrumentista Mágico: com instrumento, lança Amedrontar/Enfeitiçar/Hipnotismo/Sono (Car). Reaprender = –1 PM.\n• Marrada: arma natural (1d6, x2, impacto). 1x/rodada, 1 PM ataque extra.\n• Pernas Caprinas: desloc 12m, Des como atributo-chave de Atletismo.\n\nDevoção: Allihanna, Hyninn, Marah, Nimb, Wynna.",
      "tipo": "raca",
      "requisitos": "Car +2, Des +1, Sab –1",
      "acao": "Desloc: 12m, Tam: Médio"
    }
  },
  // === LIVRO DAS RAÇAS (25) ===
  {"name":"Orc","system":{"descricao":"Atributos: For +2, Con +1, Int –1\nDesloc: 9m | Tam: Médio\n\n• Feroz: +2 dano corpo a corpo/arremesso. Após sofrer dano, +4 até fim do próximo turno.\n• Habitante das Cavernas: visão no escuro, +2 Percepção/Sobrevivência subterrâneo. Sensibilidade a luz.\n• Vigor Brutal: +2 Fortitude, soma For no total de PV.\n\nDevoção: Allihanna, Arsenal, Megalokk, Nimb, Tenebra.","tipo":"raca","requisitos":"For +2, Con +1, Int –1","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Meio-Orc","system":{"descricao":"Atributos: For +2, +1 em outro (exceto Car)\nDesloc: 9m | Tam: Médio\n\n• Adaptável: +2 Intimidação, treinado em 1 perícia.\n• Criatura das Profundezas: visão no escuro, +2 Percepção/Sobrevivência subterrâneo.\n• Sangue Orc: +1 dano corpo a corpo/arremesso. Conta como orc.\n\nDevoção: Qualquer.","tipo":"raca","requisitos":"For +2, +1 outro (exceto Car)","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Tabrachi","system":{"descricao":"Atributos: Con +2, For +1, Car –1\nDesloc: 9m | Tam: Médio\n\n• Batráquio: visão na penumbra, natação = terrestre.\n• Linguarudo: língua (1d4, x2, impacto, 3m), +2 desarmar/derrubar. 1x/rodada 1 PM ataque extra.\n• Saltador: +10 Atletismo para saltar.\n\nDevoção: Allihanna, Megalokk, Nimb, Sszzaas, Tenebra.","tipo":"raca","requisitos":"Con +2, For +1, Car –1","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Trog Anão","system":{"descricao":"Atributos: Con +2, For +1, Int –1, Des –1\nDesloc: 6m | Tam: Médio | Tipo: Monstro\n\n• Mau Cheiro: criaturas (exceto trogs) alc. curto enjoadas 1d6 rodadas (Fort evita). Veneno.\n• Sangue Frio: +1 dano/dado de frio.\n• Quase Anão: tipo monstro, visão no escuro, +1 PV/nível. Desloc 6m, não reduzido por armadura.\n\nDevoção: Megalokk, Tenebra.","tipo":"raca","requisitos":"Con +2, For +1, Int –1, Des –1","acao":"Desloc: 6m, Tam: Médio"}},
  {"name":"Ogro","system":{"descricao":"Atributos: For +3, Con +2, Int –1, Car –1\nDesloc: 9m | Tam: Grande | Humanoide (gigante)\n\n• Quanto Maior o Tamanho...: Grande, visão na penumbra.\n• ...Maior a Porrada!: ao acertar corpo a corpo, 1 PM = +1d8 dano.\n• Camada de Ingenuidade: –5 Intuição e Vontade.\n\nDevoção: Allihanna, Arsenal, Megalokk, Tenebra.","tipo":"raca","requisitos":"For +3, Con +2, Int –1, Car –1","acao":"Desloc: 9m, Tam: Grande"}},
  {"name":"Bugbear","system":{"descricao":"Atributos: For +2, Des +1, Car –1\nDesloc: 9m | Tam: Médio\n\n• Empunhadura Poderosa: penalidade por arma maior = –2 (se receber novamente, 0).\n• Saborear Pavor: For como atributo-chave de Intimidação. Alcance curto de abalado/apavorado = bônus de ataque.\n• Sentidos de Predador: faro e visão no escuro.\n\nDevoção: Arsenal, Megalokk, Tenebra.","tipo":"raca","requisitos":"For +2, Des +1, Car –1","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Hobgoblin","system":{"descricao":"Atributos: Con +2, Des +1, Car –1\nDesloc: 9m | Tam: Médio\n\n• Arte da Guerra: treinado em Guerra, proficiência marciais. Se repetir, +2 dano marciais.\n• Metalurgia Hobgoblin: +2 Ofício (armeiro). Treinado: fabrica armas/armaduras superiores.\n• Táticas de Guerrilha: visão no escuro, +2 Furtividade.\n\nDevoção: Arsenal, Megalokk, Tenebra.","tipo":"raca","requisitos":"Con +2, Des +1, Car –1","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Gnoll","system":{"descricao":"Atributos: Con +2, Sab +1, Int –1\nDesloc: 9m | Tam: Médio\n\n• Faro: alc. curto invisível = não desprevenido, camuflagem total 20%.\n• Mordida: (1d6, x2, perfuração). 1x/rodada 1 PM ataque extra.\n• Oportunista: +2 dano contra alvo que já sofreu dano nesta rodada.\n• Rendição: inimigo se render = 1d4 PM temp. Em 1/4 PV: instinto de se render, se não, alquebrado.\n\nDevoção: Allihanna, Hyninn, Marah, Megalokk, Nimb, Tenebra.","tipo":"raca","requisitos":"Con +2, Sab +1, Int –1","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Tengu","system":{"descricao":"Atributos: Des +2, Int +1\nDesloc: 9m | Tam: Médio | Tipo: Espírito\n\n• Asas Desorientadoras: sem voar = Finta Aprimorada. Se já tiver, +5 Enganação.\n• Caminhante do Céu: paira 1,5m (9m), ignora terreno difícil, imune a queda. 1 PM/rodada voo 12m.\n• Espírito Corvino: tipo espírito, visão no escuro, +2 Percepção.\n\nDevoção: Arsenal, Khalmyr, Lin-Wu, Tanna-Toh, Valkaria, Wynna.","tipo":"raca","requisitos":"Des +2, Int +1","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Kaijin","system":{"descricao":"Atributos: For +2, Con +1, Car –2\nDesloc: 9m | Tam: Médio | Tipo: Monstro\n\n• Couraça Rubra: RD 2 (poder da Tormenta, sem perda Car).\n• Cria da Tormenta: tipo monstro, +5 resist. contra lefeu/Tormenta.\n• Disforme: sem equipar itens não-mágicos (adaptar: 1 dia, 50%). Poder da Tormenta.\n• Terror Vivo: For p/ Intimidação, +1 poder da Tormenta (sem perda Car).\n\nDevoção: Arsenal, Lin-Wu.","tipo":"raca","requisitos":"For +2, Con +1, Car –2","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Nezumi","system":{"descricao":"Atributos: Con +2, Des +1, Int –1\nDesloc: 9m | Tam: Pequeno\n\n• Empunhadura Poderosa: pen. arma maior = –2.\n• Pequeno, Mas Não Metade: Pequeno com desloc 9m, resist. medo +5 vs maiores, +2 Intimidação.\n• Roedor: mordida (1d6, x2, corte). Crítico avaria armadura ou +1 mult.\n• Sentidos Murídeos: faro, visão na penumbra.\n\nDevoção: Arsenal, Megalokk, Tenebra.","tipo":"raca","requisitos":"Con +2, Des +1, Int –1","acao":"Desloc: 9m, Tam: Pequeno"}},
  {"name":"Kappa","system":{"descricao":"Atributos: Des +2, Con +1, Car –1\nDesloc: 9m | Tam: Médio | Tipo: Espírito\n\n• Alma da Água: tipo espírito, natação = terrestre.\n• Carapaça Kappa: não flanqueado; cobertura leve se submerso/caído. Soma Con na Defesa (limitado nível, sem pesada).\n• Cura das Águas: lança Curar Ferimentos (Sab). Não funciona com tigela vazia.\n• Tigela d'Água: falhar por 5+ em agarrar/derrubar = derrama. Enjoado até encher.\n\nDevoção: Hyninn, Lena, Lin-Wu, Oceano.","tipo":"raca","requisitos":"Des +2, Con +1, Car –1","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Centauro","system":{"descricao":"Atributos: Sab +2, For +1, Int –1\nDesloc: 12m | Tam: Grande\n\n• Avantajado: Grande, desloc 12m.\n• Cascos: (1d8, x2, impacto). 1x/rodada 1 PM ataque extra.\n• Ginete Natural: montado p/ investidas. Carga de Cavalaria sem pré-req. Não monta.\n• Medo de Altura: adjacente a queda 3m+ = abalado.\n\nDevoção: Allihanna, Hippion, Megalokk.","tipo":"raca","requisitos":"Sab +2, For +1, Int –1","acao":"Desloc: 12m, Tam: Grande"}},
  {"name":"Minauro","system":{"descricao":"Atributos: For +1, +1 em dois atributos\nDesloc: 9m | Tam: Médio\n\n• Faro.\n• Mente Aberta: +2 Diplomacia/Investigação.\n• Plurivalente: 1 poder geral.\n\nDevoção: Qualquer.","tipo":"raca","requisitos":"For +1, +1 em dois","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Harpia","system":{"descricao":"Atributos: Des +2, Car +1, Int –1\nDesloc: 9m | Tam: Médio | Tipo: Monstro\n\n• Asas de Abutre: paira 1,5m (12m). Sem pesada, 1 PM/rodada voo 12m.\n• Cria de Masmorra: tipo monstro, visão no escuro, +2 Intimidação/Sobrevivência.\n• Grito Aterrorizante: 1 padrão + 1 PM, alc. curto abalados (Von CD Car).\n• Pés Rapinantes: garras (1d6, x2, corte). 1 PM ataque extra.\n\nDevoção: Hyninn, Megalokk, Tenebra.","tipo":"raca","requisitos":"Des +2, Car +1, Int –1","acao":"Desloc: 9m (voo 12m), Tam: Médio"}},
  {"name":"Nagah","system":{"descricao":"Atributos: For/Des/Con +1 (macho) OU Int/Sab/Car +1 (fêmea)\nDesloc: 9m | Tam: Médio\n\n• Cauda: (1d6, x2, impacto). 1x/rodada 1 PM ataque extra.\n• Inocência Dissimulada: +2 Enganação. 2 PM p/ substituir teste de Int/Sab/Car por Enganação.\n• Presentes de Sszzaas: visão penumbra, +1 Def, resist. veneno +5.\n• Fraquezas Ofídicas: +1 dano/dado frio, –5 resist. Músicas de bardo.\n\nDevoção: Allihanna, Hyninn, Kally, Megalokk, Sszzaas, Tenebra, Wynna.","tipo":"raca","requisitos":"For/Des/Con +1 (M) ou Int/Sab/Car +1 (F)","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Ceratops","system":{"descricao":"Atributos: Con +2, For +1, Des –1, Int –1\nDesloc: 9m | Tam: Grande\n\n• Chifres: (1d8, x2, perfuração). 1 PM ataque extra.\n• Papel Tribal: treinado em Cura/Intimidação/Ofício/Sobrevivência.\n• Paquidérmico: Grande, +1 Def, For p/ Intimidação.\n• Medo de Altura: queda 3m+ = abalado.\n\nDevoção: Allihanna, Arsenal, Azgher, Lena, Megalokk.","tipo":"raca","requisitos":"Con +2, For +1, Des –1, Int –1","acao":"Desloc: 9m, Tam: Grande"}},
  {"name":"Pteros","system":{"descricao":"Atributos: Sab +2, Des +1, Int –1\nDesloc: 9m | Tam: Médio\n\n• Ligação Natural: vínculo mental com 1 criatura inteligente, comunicação alc. longo.\n• Mãos Rudimentares: só empunha itens mágicos ou adaptados.\n• Pés Rapinantes: garras (1d6, x2, corte). 1 PM ataque extra.\n• Senhor dos Céus: paira 1,5m (9m). 1 PM/rodada voo 12m.\n• Sentidos Rapinantes: visão penumbra, +2 Percepção/Sobrevivência.\n\nDevoção: Allihanna, Lena, Marah, Wynna.","tipo":"raca","requisitos":"Sab +2, Des +1, Int –1","acao":"Desloc: 9m (voo 12m), Tam: Médio"}},
  {"name":"Velocis","system":{"descricao":"Atributos: Des +2, Sab +1, Int –1\nDesloc: 12m | Tam: Médio\n\n• Através de Espinheiros: RD corte/perfuração 2, sem redução por terreno difícil.\n• Sentidos Selvagens: +2 Sobrevivência, visão penumbra, faro.\n• Velocista da Planície: desloc 12m, Des p/ Atletismo, correr/saltar = dois dados melhor.\n\nDevoção: Allihanna, Lena, Marah.","tipo":"raca","requisitos":"Des +2, Sab +1, Int –1","acao":"Desloc: 12m, Tam: Médio"}},
  {"name":"Voracis","system":{"descricao":"Atributos: Des +2, Con +1, Int –1\nDesloc: 9m | Tam: Médio\n\n• Garras: duas (1d6, x2, corte). 1 PM ataque extra. Estilo de Duas Armas.\n• Rainha da Selva: escalada 9m, +2 Atletismo, +1 PV/nível ao descansar.\n• Sentidos Selvagens: +2 Sobrevivência, visão penumbra, faro.\n\nDevoção: Allihanna, Arsenal, Megalokk.","tipo":"raca","requisitos":"Des +2, Con +1, Int –1","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Yidishan","system":{"descricao":"Atributos: +1 em três (exceto Car), Car –2\nDesloc: 9m | Tam: Médio | Tipo: Construto\n\n• Híbrido Mecânico: construto, visão no escuro, imune cansaço/metabolismo/veneno. Cura mundana ½. 8h inerte/dia.\n• Natureza Orgânica: 1 perícia ou 1 poder geral. Ou outra raça (1 habilidade + tamanho).\n• Peças Metálicas: +2 Def, pen. armadura –2.\n\nDevoção: Arsenal, Megalokk, Nimb.","tipo":"raca","requisitos":"+1 em três (exceto Car), Car –2","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Elfo-do-Mar","system":{"descricao":"Atributos: Des +2, Con +1, Int –1\nDesloc: 9m | Tam: Médio\n\n• Arsenal do Oceano: prof. arpão/rede/tridente, +2 ataque. Se repetir, leves.\n• Cria das Águas: natação = terrestre, visão penumbra. Na água: percepção às cegas, +2 Def/Furt/Sobrev.\n• Dependência de Água: 1+ dia sem água = sem PM no descanso.\n\nDevoção: Allihanna, Arsenal, Hyninn, Megalokk, Oceano.","tipo":"raca","requisitos":"Des +2, Con +1, Int –1","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Fintroll","system":{"descricao":"Atributos: Int +2, Con +1, For –1\nDesloc: 9m | Tam: Médio | Tipo: Monstro\n\n• Corpo Vegetal: monstro, natureza vegetal, visão no escuro.\n• Presença Arcana: +2 Misticismo, resist. magia +2.\n• Regeneração Vegetal: 1x/rodada, 1 PM = 5 PV (não cura ácido/fogo).\n• Intolerância a Luz: sensibilidade a luz, sol = sem Regeneração.\n\nDevoção: Kally, Megalokk, Sszzaas, Tenebra.","tipo":"raca","requisitos":"Int +2, Con +1, For –1","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Soterrado","system":{"descricao":"Variante de Osteon.\nAtributos: +1 em três (exceto Con), Con –1\nDesloc: 9m | Tam: Médio | Tipo: Morto-vivo\n\n• Abraço Gélido: +2 agarrar, desarmados/naturais +2 dano frio.\n• Esquife de Gelo: RD corte/perf 5, RD frio 10. +1 dano/dado fogo.\n• Natureza Esquelética: morto-vivo, visão escuro, imune cansaço/metabolismo/trevas/veneno. Cura de luz = dano; trevas = cura.\n• Preço da Não Vida: 8h sob estrelas/subterrâneo.\n\nDevoção: Aharadak, Tenebra.","tipo":"raca","requisitos":"+1 em três (exceto Con), Con –1","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Kobolds","system":{"descricao":"Atributos: Des +2, For –1\nDesloc: 9m | Tam: Médio (Pequeno p/ passagem) | Tipo: Monstro\n\n• Ajuntamento Escamoso: grupo = 1 criatura Média. Pequeno p/ passagem. Resist. 1 criatura = dois dados. Vulnerável a área.\n• Praga Monstruosa: monstro, visão no escuro, +2 Sobrevivência.\n• Sensibilidade a Luz.\n• Talentos do Bando (escolha 2): Amontoados, Armadilha Terrível, Diferentão, Ex-Familiar, O Ousado, Os do Fundo, Organizadinhos, Pestes Oportunistas, Somos Explosivos, Tática de Enxame.\n\nDevoção: Kally, Khalmyr, Lena, Megalokk, Tenebra.","tipo":"raca","requisitos":"Des +2, For –1","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Kallyanach","system":{"descricao":"Atributos: +2 em um OU +1 em dois\nDesloc: 9m | Tam: Médio | Tipo: Monstro\n\n• Herança Dracônica: monstro, RD 5 de um tipo (ácido/eletric./fogo/frio/luz/trevas).\n• Bênção de Kally (escolha 2): Armamento (1d6 natural), Asas (1 PM/rodada voo 9m), Escamas (+2 Def, RD 10), Prática Arcana (magia 1°), Sentidos (faro + visão no escuro), Sopro (cone 6m, 1d12 dano, +1d12/4 níveis).\n\nDevoção: Arsenal, Kally, Megalokk, Wynna.","tipo":"raca","requisitos":"+2 em um OU +1 em dois","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Moreau (Coruja)","system":{"descricao":"Atributos: Sab +1, +1 em dois\nDesloc: 9m | Tam: Médio | Conta como Humano\n\n• Espreitador: visão no escuro, +2 Percepção/Vontade.\n• Garras: duas (1d6, x2, corte). 1 PM ataque extra.\n• Sapiência: 1 magia de adivinhação 1° (Sab). Reaprender = –1 PM.\n\nDevoção: Qualquer.","tipo":"raca","requisitos":"Sab +1, +1 em dois","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Moreau (Lobo)","system":{"descricao":"Atributos: Car +1, +1 em dois\nDesloc: 9m | Tam: Médio | Conta como Humano\n\n• Faro.\n• Mordida: (1d6, x2, perfuração). 1 PM ataque extra.\n• Táticas de Matilha: +2 dano e +2 margem de ameaça flanqueando.\n\nDevoção: Qualquer.","tipo":"raca","requisitos":"Car +1, +1 em dois","acao":"Desloc: 9m, Tam: Médio"}},
  {"name":"Moreau (Raposa)","system":{"descricao":"Atributos: Int +1, +1 em dois\nDesloc: 12m | Tam: Médio | Conta como Humano\n\n• Agarra-me Se Puderes: desloc 12m, visão penumbra.\n• Esperteza Vulpina: +2 em duas perícias de Int ou Car.\n• Faro.\n\nDevoção: Qualquer.","tipo":"raca","requisitos":"Int +1, +1 em dois","acao":"Desloc: 12m, Tam: Médio"}},
  {"name":"Moreau (Urso)","system":{"descricao":"Atributos: Con +1, +1 em dois\nDesloc: 9m | Tam: Grande | Conta como Humano\n\n• Abraço de Urso: Grande, Con p/ Intimidação.\n• Faro.\n• Mordida: (1d8, x2, perfuração). 1 PM ataque extra.\n\nDevoção: Qualquer.","tipo":"raca","requisitos":"Con +1, +1 em dois","acao":"Desloc: 9m, Tam: Grande"}},
  {"name":"Golem Desperto","system":{"descricao":"Atributos: For +1, Car –1 + ajustes de chassi/tamanho\nDesloc: variável | Tipo: Construto\n\n• Criatura Artificial: construto, visão no escuro, imune cansaço/metabolismo/veneno. Sem cura mundana. 8h inerte. Ofício substitui Cura.\n• Propósito de Criação: sem origem, 1 poder geral.\n• Chassi (escolha): Barro (Con +2), Bronze (+1 em dois), Carne (Con +2, For +1, Car –1), Espelhos (Car +2, Sab +1, Con –1), Ferro (For +1, Con +1, +2 Def, pen –2), Gelo Eterno (Con +2), Pedra (Con +2, RD 5), Sucata (For +1, Con +1), Machin (+1 em dois, 2 perícias).\n• Fonte de Energia: Alquímica, Elemental, Sagrada, Vapor.\n• Tamanho: Pequeno (Des +1), Médio (—), Grande (Des –1).\n\nDevoção: Qualquer.","tipo":"raca","requisitos":"For +1, Car –1 + chassi/tamanho","acao":"Desloc: variável, Tam: variável"}}
];

async function importAll() {
  const pack = game.packs.get(PACK_NAME);
  if (!pack) return ui.notifications.error("Pack não encontrado: " + PACK_NAME);
  await pack.configure({locked: false});
  let created = 0, updated = 0;
  for (const d of DATA) {
    const itemData = {name: d.name, type: "poder", img: "icons/svg/mystery-man.svg", system: d.system};
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
  ui.notifications.info(`Raças extras: ${created} criadas, ${updated} atualizadas (total: ${DATA.length})`);
}
importAll();
