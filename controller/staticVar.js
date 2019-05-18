let danosPilares = [
  { dano: 'Carbonatação', fp:7 },
  { dano: 'Cobrimento Deficiente', fp:6 },
  { dano: 'Contaminação por Cloretos', fp:10 },
  { dano: 'Corrosão de Armaduras', fp:10 },
  { dano: 'Desagregação', fp:7 },
  { dano: 'Desvio de Geometria', fp:8 },
  { dano: 'Eflorescência', fp:5 },
  { dano: 'Esfoliação', fp:8 },
  { dano: 'Fissuras', fp:10 },
  { dano: 'Infiltração na Base', fp:6 },
  { dano: 'Manchas', fp:5 },
  { dano: 'Recalque', fp:10 },
  { dano: 'Segregação', fp:6 },
  { dano: 'Sinais de Esmagamento', fp:10 },
];

let danosVigas = [
  { dano: 'Carbonatação', fp: 7},
  { dano: 'Cobrimento Deficiente', fp: 6},
  { dano: 'Contaminação por Cloretos', fp: 10},
  { dano: 'Corrosão de Armaduras', fp: 10},
  { dano: 'Desgregação', fp: 7},
  { dano: 'Eflorescência', fp: 5},
  { dano: 'Esfoliação', fp: 8},
  { dano: 'Fissuras', fp: 10},
  { dano: 'Flechas', fp: 10},
  { dano: 'Infiltração', fp: 6},
  { dano: 'Manchas', fp: 5},
  { dano: 'Segregação', fp: 4},
  { dano: 'Sinais de Esmagamento', fp: 8},
];

let danosLajes = [
  { dano: 'Carbonatação' , fp: 7},
  { dano: 'Cobrimento Deficiente' , fp: 6},
  { dano: 'Contaminação por cloretos' , fp: 10},
  { dano: 'Corrosão de Armaduras' , fp: 10},
  { dano: 'Desagregação' , fp: 7},
  { dano: 'Eflorescência' , fp: 5},
  { dano: 'Esfoliação' , fp: 8},
  { dano: 'Fissuras' , fp: 10},
  { dano: 'Flechas' , fp: 10},
  { dano: 'Infiltração' , fp: 6},
  { dano: 'Manchas' , fp: 5},
  { dano: 'Segregação' , fp: 5},
];

let danosArquitetonicas = [
  { dano: 'Carbonatação', fp: 7},
  { dano: 'Cobrimento Deficiente', fp: 6},
  { dano: 'Contaminação por Cloretos', fp: 10},
  { dano: 'Corrosão das Armaduras', fp: 10},
  { dano: 'Desagregação', fp: 7},
  { dano: 'Eflorescência', fp: 4},
  { dano: 'Esfoliação', fp: 8},
  { dano: 'Fissuras', fp: 8},
  { dano: 'Segregação', fp: 4},
  { dano: 'Sinais de Esmagamento', fp: 10},
  { dano: 'Infiltração', fp: 5},
  { dano: 'Manchas', fp: 5},
];

let danosReservatorio = [
  { dano: 'Carbonatação', fp: 7},
  { dano: 'Cobrimento Deficiente', fp: 6},
  { dano: 'Contaminação por Cloretos', fp: 10},
  { dano: 'Corrosão de Armaduras', fp: 10},
  { dano: 'Desagregação', fp: 7},
  { dano: 'Eflorescência', fp: 4},
  { dano: 'Esfoliação', fp: 8},
  { dano: 'Fissuras', fp: 8},
  { dano: 'Segregação', fp: 4},
  { dano: 'Sinais de Esmagamento', fp: 10},
  { dano: 'Infiltração', fp: 5},
  { dano: 'Manchas', fp: 5},
];


module.exports = {

  fpLimits:
  {
    min: 1,
    max: 5,
  },

  niveis: [
    {
      nivel: 'Baixo',
      gdeMin: 0,
      gdeMax: 15,
      acao: 'Estado aceitável. Manutenção preventiva',
    },
    {
      nivel: 'Médio',
      gdeMin: 15,
      gdeMax: 50,
      acao: 'Definir prazo/natureza para nova inspeção. Planejar intervenção em longo prazo (máx. 2 anos)',
    },
    {
      nivel: 'Alto',
      gdeMin: 50,
      gdeMax: 80,
      acao: 'Definir prazo/natureza para inspeção especializada. Planejar intervenção em médio prazo (máx. 1 ano)',
    },
    {
      nivel: 'Sofrível',
      gdeMin: 80,
      gdeMax: 100,
      acao: 'Definir prazo/natureza para inspeção especializada detalhada. Planejar intervenção em médio curto prazo (máx. 6 meses)',
    },
    {
      nivel: 'Crítico',
      gdeMin: 100,
      gdeMax: -1,
      acao: 'Inspeção especial emergencial. Planejar intervenção imediata',
    },
  ],

  elementos: [
    {
      nome: 'Pilares Principais',
      id: 'pp',
      danos: danosPilares,
    },
    {
      nome: 'Pilares Secundários',
      id: 'ps',
      danos: danosPilares,
    },
    {
      nome: 'Vigas Principais',
      id: 'vp',
      danos: danosVigas,
    },
    {
      nome: 'Vigas Secundárias',
      id: 'vs',
      danos: danosVigas,
    },
    {
      nome: 'Lajes',
      id: 'l',
      danos: danosLajes,
    },
    {
      nome: 'Elementos Arquitetônicos',
      id: 'ea',
      danos: danosArquitetonicas,
    },
    {
      nome: 'Reservatórios',
      id: 'r',
      danos: danosReservatorio,
    },
    {
      nome: 'Escadas',
      id: 'e',
      danos: danosVigas,
    },
  ],
};
