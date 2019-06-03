
module.exports = (ipcRenderer,mainWindow,other) => {

  const variables = require('./staticVar.js');


  /* Used to generate unique names */
  function makeid(length) {
     var result           = '';
     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }

  /*
    Save Image request
  */
  ipcRenderer.on('save_img',function(e, path){
    try{
      let fileName = makeid(10) + path.substr( path.length - 4, 4 );
      let newPath = other.dir + '/images/temp/' + fileName;
      other.fs.copyFileSync(path, newPath, err => {
        if (err) throw err;
      });
      e.returnValue = fileName;
    }
    catch(err){
      console.log(err);
    }
  });

  /*
    GDF calc request
  */
  ipcRenderer.on('calc_gdf',function(e, gde){

    let gdeMax = Math.max.apply(null, gde);
    let gdeSum = gde.reduce( (acc,val) => (acc+val), 0 );
    let gdf = gdeMax * Math.sqrt( 1 + (
      (gdeSum - gdeMax) / gdeSum
    ) );
    e.returnValue = gdf;

  });
  /*
    calc request
    Used for calculate D (Grau de dano) and GDE (Grau de deterioração)
  */
  ipcRenderer.on('calc',function(e, rows){

    //Calculate each D value
    let d = [];
    rows.forEach( row => {
      d.push(( row.fi > 2 ?
        ( 6 * row.fi - 14 ) * row.fp :
        0.4 * row.fi * row.fp
      ));
    });

    //Calculate GDE
    let dMax = Math.max.apply(null, d);
    let dSum = d.reduce( (acc,val) => (acc+val), 0 );
    let gde = dMax * ( 1 + (
      (dSum - dMax) / dSum
    ) );

    //Search for ndp
    let ndp = 0;
    for ( let i = 0; i < variables.niveis.length; i++ ){
      if( variables.niveis[i].gdeMax > gde && variables.niveis[i].gdeMin <= gde )
        ndp = variables.niveis[i];
    }

    e.returnValue = {
      d: d,
      gde: gde,
      ndp: ndp,
    };
  });

  /*
    add_row Request
    Used for adding row on a element
    OBS: Need sync requests
  */
  ipcRenderer.on('add_row',function(e, data, id){
    let fp;
    // Getting fp value
    variables.elementos.forEach( elem => {
      if( elem.id == id ){
        elem.danos.forEach( dano => {
          if( dano.nome == data ) fp = dano.fp;
        });
      }
    });
    // Getting html string
    e.returnValue = `
      <tr class="data-row">
        <td>${data}</td>
        <td class="number"> <input type="number" class="fp" value="${fp}" onchange="inputNumber(this,'fp')"> </td>
        <td class="number"> <input type="number" class="fi" value="1" onchange="inputNumber(this,'fi')"> </td>
        <td class="number d"> --- </td>
      </tr>
    `;
  });

  /*
    add_element Request
    Used for adding elements on a list
  */
  ipcRenderer.on('add_element', function(e, data){
    const response = {
      elementId: data,
      verified: false,
    }

    let selectHTML = `<select onchange="selectChange('${data}',this)">`;
    selectHTML += `<option value="none"> Adicionar </option>`;
    variables.elementos.forEach((elemento)=>{
      if( elemento.id == data ){
        elemento.danos.forEach((dano)=>{
          selectHTML += `<option value="${dano.nome}" data-fp="${dano.fp}"> ${dano.nome} </option>`;
        });
      }
    })
    selectHTML += '</select>';

    response.innerHTML = `
      <table class="element">
        <tr>
          <td class="element-id" colspan="4"><div contentEditable=true data-text="Local: ____"></div></td>
          <td rowspan="9000" class="element-img" onclick="sendImg(this)">
            <img class="center" src="assets/imagens/sem_imagem.png" height="150">
            <span class="add-img-btn" > <i class="fas fa-file-upload"></i> </span>
          </td>
        </tr>
        <tr>
          <th> Danos </th>
          <th> Fp </th>
          <th> Fi </th>
          <th> D </th>
        </tr>
        <tr class="add-row">
          <td>
            <div class="simple-select">
              ${selectHTML}
            </div>
          </td>
          <td class="number"> --- </td>
          <td class="number"> --- </td>
          <td class="number"> --- </td>
        </tr>
        <tr>
          <td colspan="3"> Grau de Deterioração do Elemento </td>
          <td class="gde"> --- </td>
        </tr>
        <tr>
          <td colspan="3"> Nível de Deterioração da Peça </td>
          <td class="ndp"> --- </td>
        </tr>
      </table> <!-- .element -->
    `;
    mainWindow.webContents.send('add_element', response);
  });


}
