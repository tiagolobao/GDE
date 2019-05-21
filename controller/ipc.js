
module.exports = (ipcRenderer,mainWindow) => {

  let variables = require('./staticVar.js');
  /*
    add_element Request
    Used for adding elements on a list
  */
  ipcRenderer.on('add_element', function(e, data){
    const response = {
      elementId: data,
      verified: false,
    }

    let selectHTML = `<select onchange="selectChange('${data}')">`;
    selectHTML += `<option value="none"> Adicionar </option>`;
    variables.elementos.forEach((elemento)=>{
      if( elemento.id == data ){
        elemento.danos.forEach((dano)=>{
          selectHTML += ` <option value="${dano.nome}" data-fp="${dano.fp}"> ${dano.nome} </option> `;
        });
      }
    })
    selectHTML += '</select>';

    response.innerHTML = `
      <table class="element">
        <tr>
          <td class="element-id" colspan="4"> Local: </td>
          <td rowspan="9000" > <img class="center" src="assets/imagens/sem_imagem.png" height="150"> </td>
        </tr>
        <tr>
          <th> Danos </th>
          <th> Fp </th>
          <th> Fi </th>
          <th> D </th>
        </tr>
        <tr>
          <td class="add-row">
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
