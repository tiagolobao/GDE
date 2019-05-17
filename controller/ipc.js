
module.exports = (ipcRenderer,mainWindow) => {

  /*
    add_element Request
    Used for adding elements on a list
  */
  ipcRenderer.on('add_element', function(e, data){
    const response = {
      data: data,
      verified: false,
    }
    response.innerHTML = `
      <table class="element">
        <tr>
          <td class="element-id" colspan="4"> Local: </td>
          <td class="element-id"> Id: </td>
        </tr>
        <tr>
          <th> Danos </th>
          <th> Fp </th>
          <th> Fi </th>
          <th> D </th>
          <td rowspan="9000" > <img class="center" src="" max-height="100"> </td>
        </tr>
        <tr>
          <td class="add-row">
            <div class="custom-select">
              <select>
                <option value="0">Select car:</option>
                <option value="1">Audi</option>
                <option value="2">BMW</option>
                <option value="3">Citroen</option>
                <option value="4">Ford</option>
                <option value="5">Honda</option>
                <option value="6">Jaguar</option>
                <option value="7">Land Rover</option>
                <option value="8">Mercedes</option>
                <option value="9">Mini</option>
                <option value="10">Nissan</option>
                <option value="11">Toyota</option>
                <option value="12">Volvo</option>
              </select>
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
