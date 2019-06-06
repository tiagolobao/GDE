let danosPilares = [
  { nome: 'carbonatação', fp:3 },
  { nome: 'cobrimento deficiente', fp:3 },
  { nome: 'contaminação por cloretos', fp:4 },
  { nome: 'corrosão de armaduras', fp:5 },
  { nome: 'desagregação', fp:3 },
  { nome: 'desplacamento', fp:3 },
  { nome: 'desvio de geometria', fp:4 },
  { nome: 'eflorescência', fp:2 },
  { nome: 'falha de concretagem', fp:3 },
  { nome: 'manchas', fp:3 },
  { nome: 'fissuras', fp:2 },
  { nome: 'recalque', fp:5 },
  { nome: 'sinais de esmagamento', fp:5 },
  { nome: 'umidade na base', fp:3 },
];

let danosVigas = [
  { nome: 'carbonatação', fp:3 },
  { nome: 'cobrimento deficiente', fp:3 },
  { nome: 'contaminação por cloretos', fp:4 },
  { nome: 'corrosão de armaduras', fp:5 },
  { nome: 'desagregação', fp:3 },
  { nome: 'desplacamento', fp:3 },
  { nome: 'eflorescência', fp:2 },
  { nome: 'falhas de concretagem', fp:2 },
  { nome: 'fissuras', fp:2 },
  { nome: 'flechas', fp:5 },
  { nome: 'manchas', fp:3 },
  { nome: 'sinais de esmagamento', fp:4 },
  { nome: 'umidade', fp:3 },
];

let danosLajes = [
  { nome: 'carbonatação', fp:3 },
  { nome: 'cobrimento deficiente', fp:3 },
  { nome: 'contaminação por cloretos', fp:4 },
  { nome: 'corrosão de armaduras', fp:5 },
  { nome: 'desagregação', fp:3 },
  { nome: 'desplacamento', fp:3 },
  { nome: 'eflorescência', fp:2 },
  { nome: 'fissuras', fp:2 },
  { nome: 'falhas de concretagem', fp:2 },
  { nome: 'flechas', fp:5 },
  { nome: 'manchas', fp:3 },
  { nome: 'umidade', fp:3 },
];

let danosEscadasRampas = [
  { nome: 'carbonatação', fp:3 },
  { nome: 'cobrimento deficiente', fp:3 },
  { nome: 'contaminação por cloretos', fp:4 },
  { nome: 'corrosão de armaduras', fp:5 },
  { nome: 'desagregação', fp:3 },
  { nome: 'desplacamento', fp:3 },
  { nome: 'eflorescência', fp:2 },
  { nome: 'falha de concretagem', fp:2 },
  { nome: 'fissuras', fp:2 },
  { nome: 'flechas', fp:5 },
  { nome: 'manchas', fp:3 },
  { nome: 'sinais de esmagamento', fp:4 },
  { nome: 'umidade', fp:3 },
];

let danosCortinas = [
  { nome: 'carbonatação', fp:3 },
  { nome: 'cobrimento deficiente', fp:3 },
  { nome: 'contaminação por cloretos', fp:4 },
  { nome: 'corrosão de armaduras', fp:5 },
  { nome: 'desagregação', fp:3 },
  { nome: 'deslocamento por empuxo', fp:5 },
  { nome: 'desplacamento', fp:3 },
  { nome: 'desvio de geometria', fp:3 },
  { nome: 'eflorescência', fp:2 },
  { nome: 'falha de concretagem', fp:2 },
  { nome: 'fissuras', fp:2 },
  { nome: 'manchas', fp:3 },
  { nome: 'sinais de esmagamento', fp:5 },
  { nome: 'umidade', fp:3 },
];

let danosReservatorio = [
  { nome: 'carbonatação', fp:3 },
  { nome: 'cobrimento deficiente', fp:3 },
  { nome: 'contaminação por cloretos', fp:4 },
  { nome: 'corrosão de armaduras', fp:5 },
  { nome: 'desagregação', fp:3 },
  { nome: 'desplacamento', fp:5 },
  { nome: 'eflorescência', fp:2 },
  { nome: 'falha de concretagem', fp:3 },
  { nome: 'fissuras', fp:2 },
  { nome: 'impermeabilização deficiente', fp:4 },
  { nome: 'vazamento', fp:5 },
];

let danosBlocosDeFuncacao = [
  { nome: 'carbonatação', fp:3 },
  { nome: 'cobrimento deficiente', fp:3 },
  { nome: 'contaminação por cloretos', fp:4 },
  { nome: 'corrosão de armaduras', fp:5 },
  { nome: 'desagregação', fp:3 },
  { nome: 'desplacamento', fp:3 },
  { nome: 'eflorescência', fp:2 },
  { nome: 'falha de concretagem', fp:3 },
  { nome: 'fissuras', fp:2 },
  { nome: 'recalque', fp:5 },
  { nome: 'sinais de esmagamento', fp:5 },
  { nome: 'umidade na base', fp:3 },
];

let danosJuntasDeDilatacao = [
  { nome: 'obstrução de junta', fp:5 },
  { nome: 'umidade', fp:5 },
];

let danosComposicaoArquitetonica = [
  { nome: 'carbonatação', fp:3 },
  { nome: 'cobrimento deficiente', fp:3 },
  { nome: 'contaminação por cloretos', fp:4 },
  { nome: 'corrosão de armaduras', fp:5 },
  { nome: 'desagregação', fp:3 },
  { nome: 'desplacamento', fp:3 },
  { nome: 'eflorescência', fp:2 },
  { nome: 'falha de concretagem', fp:2 },
  { nome: 'fissuras', fp:2 },
  { nome: 'manchas', fp:3 },
  { nome: 'sinais de esmagamento', fp:5 },
  { nome: 'umidade', fp:3 },
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
      gdeMax: 10000,
      acao: 'Inspeção especial emergencial. Planejar intervenção imediata',
    },
  ],

  elementos: [
    {
      nome: 'Pilares Principais',
      id: 'pp',
      danos: danosPilares,
      fr: 5.0,
    },
    {
      nome: 'Pilares Secundários',
      id: 'ps',
      danos: danosPilares,
      fr: 4.0,
    },
    {
      nome: 'Vigas Principais',
      id: 'vp',
      danos: danosVigas,
      fr: 5.0,
    },
    {
      nome: 'Vigas Secundárias',
      id: 'vs',
      danos: danosVigas,
      fr: 4.0,
    },
    {
      nome: 'Lajes',
      id: 'l',
      danos: danosLajes,
      fr: 4.0,
    },
    {
      nome: 'Escadas/Rampas',
      id: 'e',
      danos: danosEscadasRampas,
      fr: 3.0,
    },
    {
      nome: 'Cortinas',
      id: 'c',
      danos: danosCortinas,
      fr: 3.0,
    },
    {
      nome: 'Reservatórios Inferiores',
      id: 'ri',
      danos: danosReservatorio,
      fr: 3.0,
    },
    {
      nome: 'Reservatórios Superiores',
      id: 'rs',
      danos: danosReservatorio,
      fr: 2.0,
    },
    {
      nome: 'Blocos de Fundação',
      id: 'bf',
      danos: danosBlocosDeFuncacao,
      fr: 3.0,
    },
    {
      nome: 'Juntas de dilatação',
      id: 'jd',
      danos: danosJuntasDeDilatacao,
      fr: 3.0,
    },
    {
      nome: 'Composição Arquitetônica',
      id: 'ca',
      danos: danosComposicaoArquitetonica,
      fr: 1.0,
    },
  ],
};
