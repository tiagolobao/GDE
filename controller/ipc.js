
module.exports = (ipcRenderer,mainWindow) => {

  const variables = require('./staticVar.js');
  /*
    add_element Request
    Used for adding elements on a list
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
      <tr>
        <td>${data}</td>
        <td class="number"> <input type="number" value="${fp}" onchange="inputNumber(this,'fp')"> </td>
        <td class="number"> <input type="number" value="0" onchange="inputNumber(this,'fi')"> </td>
        <td class="number"> --- </td>
      </tr>
    `;
  });

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
          <td rowspan="9000" > <img class="center" src="assets/imagens/sem_imagem.png" height="150"> </td>
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
          <td></td>
        </tr>
        <tr>
          <td colspan="3"> Nível de Deterioração da Peça </td>
          <td></td>
        </tr>
      </table> <!-- .element -->
    `;
    mainWindow.webContents.send('add_element', response);
  });

  ipcRenderer.on('add_row', function(e, data){

  });

}
