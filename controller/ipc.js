
module.exports = (ipcRenderer,other) => {

  const electron = require('electron')
  const {app, BrowserWindow, Menu, ipcMain} = electron;
  const ejse = require('ejs-electron');
  const fs = require('fs');
  const variables = require('./staticVar.js');

  /*
    Send variables to the client
  */
  ipcRenderer.on('get_global', function(e) {
    e.returnValue = variables;
  });

  /*
    Gererate results request
  */
  ipcRenderer.on('generate_results',function(e, gdf, damageList){

    //Process gdf Values
    gdf.forEach( (_gdf) => {
      variables.elementos.forEach( elemento => {
        if ( _gdf.id == elemento.id ){
          _gdf.name = elemento.nome;
          _gdf.fr = elemento.fr;
        }
      });
    });

    let gdt = gdf.reduce( (acc,_gdf) => acc + (_gdf.fr*_gdf.value) , 0 ) / gdf.reduce( (acc,_gdf) => acc + _gdf.fr , 0 );
    //Search for ndp
    for ( let i = 0; i < variables.niveis.length; i++ ){
      if( variables.niveis[i].gdeMax > gdt && variables.niveis[i].gdeMin <= gdt )
        gdt = { value: gdt, ...variables.niveis[i] };
    }


    let damagesOrganized = []; //{name:, quantity:, percentage:}
    damageList.forEach( (dam,i,arr) => {
      if( arr.indexOf(dam) == i ){ //If is not repeated
        let quantity = arr.reduce( (acc,e) => {
            return ( e == dam ? acc+1 : acc );
        }, 0);
        damagesOrganized.push({
          name: dam,
          quantity: quantity,
          percentage: (quantity * 100 / arr.length).toFixed(variables.precision),
        });
      }
    });

    ejse.data('gdf',gdf);
    ejse.data('gdt',gdt);
    ejse.data('damages',damagesOrganized);

    //Calculate window size
    let windowHeight = other.displaySize.height;
    let windowWidth = windowHeight * 595 / 842; //A4 Size

    //Create Window
    resultsWindow = new BrowserWindow({
      width: windowWidth, //595
      height: windowHeight, //842
      title:'Resultados',
      resizable: false,
    });
    resultsWindow.loadURL('file://' + other.dir + '/views/results.ejs')
    require('./menu.js')(Menu,resultsWindow,'results');
    // Handle garbage collection
    resultsWindow.on('close', function(){
      resultsWindow = null;
    });
  });

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
      fs.copyFileSync(path, newPath, err => {
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
    e.returnValue = {
      gdf: gdf,
      gdeMax: gdeMax,
      gdeSum: gdeSum,
    };

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
        ( 12 * row.fi - 28 ) * row.fp :
        0.8 * row.fi * row.fp
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
    //Setting readonly
    let readOnly = ( data == 'fissuras' ? '' : 'readonly="readonly"' );
    // Getting html string
    e.returnValue = `
      <tr class="data-row">
        <td class="damage">${data}</td>
        <td class="number"> <input type="number" class="fp" value="${fp}" ${readOnly} onchange="inputNumber(this,'fp')"> </td>
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
          <td class="name-element element-id" colspan="4"><div contentEditable=true data-text="Nome do elemento"></div></td>
          <td rowspan="9000" class="element-img" onclick="sendImg(this)">
            <img class="center" src="assets/imagens/sem_imagem.png" height="150">
            <span class="add-img-btn" > <i class="fas fa-file-upload"></i> </span>
          </td>
        </tr>
        <tr>
          <td class="local-element element-id" colspan="4"><div contentEditable=true data-text="Local do elemento"></div></td>
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
    other.mainWindow.webContents.send('add_element', response);
  });


}
////
