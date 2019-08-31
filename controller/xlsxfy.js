
module.exports = (data,variables,options) => {

  options['!cols'] = [{ wch: 15 }, { wch: 8 }, { wch: 22 }, { wch: 8 } ];
  let mergeCounter = 2;

  let output = [];
  data.forEach( tab => {

    //Putting element family name
    let nome = tab.id;
    variables.elementos.forEach(elem => { if(elem.id == tab.id) nome = elem.nome });
    output.push([nome]);

    //Putting elements
    tab.elementList.forEach( elem => {

      let damages = [];
      elem.damages.forEach( dam => {
        damages.push( [,,dam.name, dam.fp, dam.fi, dam.d] );
      });
      mergeCounter += 1;

      output = [ ...output,
        [,'Nome', elem.name  , , , elem.photos[0] ],
        [,'Local', elem.local , , ,                ],
          [, ,'Danos', 'Fp', 'Fi', 'D' ],
          ...damages,
        [,'gde', elem.gde ],
        [,'ndp', elem.ndp ],
      ];

    });

    //Putting GDF Values
    output = [ ...output,
      ['GDF', tab.gdf],
      [],  // <br>
      [],  // <br>
    ];

  });

  return output;
}
