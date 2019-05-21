let danosPilares = [
  { nome: 'Carbonatação', fp:7 },
  { nome: 'Cobrimento Deficiente', fp:6 },
  { nome: 'Contaminação por Cloretos', fp:10 },
  { nome: 'Corrosão de Armaduras', fp:10 },
  { nome: 'Desagregação', fp:7 },
  { nome: 'Desvio de Geometria', fp:8 },
  { nome: 'Eflorescência', fp:5 },
  { nome: 'Esfoliação', fp:8 },
  { nome: 'Fissuras', fp:10 },
  { nome: 'Infiltração na Base', fp:6 },
  { nome: 'Manchas', fp:5 },
  { nome: 'Recalque', fp:10 },
  { nome: 'Segregação', fp:6 },
  { nome: 'Sinais de Esmagamento', fp:10 },
];

let danosVigas = [
  { nome: 'Carbonatação', fp: 7},
  { nome: 'Cobrimento Deficiente', fp: 6},
  { nome: 'Contaminação por Cloretos', fp: 10},
  { nome: 'Corrosão de Armaduras', fp: 10},
  { nome: 'Desgregação', fp: 7},
  { nome: 'Eflorescência', fp: 5},
  { nome: 'Esfoliação', fp: 8},
  { nome: 'Fissuras', fp: 10},
  { nome: 'Flechas', fp: 10},
  { nome: 'Infiltração', fp: 6},
  { nome: 'Manchas', fp: 5},
  { nome: 'Segregação', fp: 4},
  { nome: 'Sinais de Esmagamento', fp: 8},
];

let danosLajes = [
  { nome: 'Carbonatação' , fp: 7},
  { nome: 'Cobrimento Deficiente' , fp: 6},
  { nome: 'Contaminação por cloretos' , fp: 10},
  { nome: 'Corrosão de Armaduras' , fp: 10},
  { nome: 'Desagregação' , fp: 7},
  { nome: 'Eflorescência' , fp: 5},
  { nome: 'Esfoliação' , fp: 8},
  { nome: 'Fissuras' , fp: 10},
  { nome: 'Flechas' , fp: 10},
  { nome: 'Infiltração' , fp: 6},
  { nome: 'Manchas' , fp: 5},
  { nome: 'Segregação' , fp: 5},
];

let danosArquitetonicas = [
  { nome: 'Carbonatação', fp: 7},
  { nome: 'Cobrimento Deficiente', fp: 6},
  { nome: 'Contaminação por Cloretos', fp: 10},
  { nome: 'Corrosão das Armaduras', fp: 10},
  { nome: 'Desagregação', fp: 7},
  { nome: 'Eflorescência', fp: 4},
  { nome: 'Esfoliação', fp: 8},
  { nome: 'Fissuras', fp: 8},
  { nome: 'Segregação', fp: 4},
  { nome: 'Sinais de Esmagamento', fp: 10},
  { nome: 'Infiltração', fp: 5},
  { nome: 'Manchas', fp: 5},
];

let danosReservatorio = [
  { nome: 'Carbonatação', fp: 7},
  { nome: 'Cobrimento Deficiente', fp: 6},
  { nome: 'Contaminação por Cloretos', fp: 10},
  { nome: 'Corrosão de Armaduras', fp: 10},
  { nome: 'Desagregação', fp: 7},
  { nome: 'Eflorescência', fp: 4},
  { nome: 'Esfoliação', fp: 8},
  { nome: 'Fissuras', fp: 8},
  { nome: 'Segregação', fp: 4},
  { nome: 'Sinais de Esmagamento', fp: 10},
  { nome: 'Infiltração', fp: 5},
  { nome: 'Manchas', fp: 5},
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
