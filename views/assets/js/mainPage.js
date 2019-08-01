/* Electron commands */
const electron = require('electron');
const {ipcRenderer} = electron;
const { dialog } = electron.remote;

window.ipcVar = ipcRenderer.sendSync('get_global');
window.ipcLastChanges = ipcRenderer.sendSync('get_lastChanges');
window.changesHistory = [];

DomReady.ready(function() {

  //Reput last changes
  if( ipcLastChanges != null ){
    ipcLastChanges.forEach( tab => {
      tab.elementList.forEach( element => {
        document.querySelector('#' + tab.id +  ' hr.endtabcontent').insertAdjacentHTML('beforebegin', element.htmlNode);
      });
      let tabNode = document.querySelector('div#' + tab.id + '.tabcontent');
      tabNode.querySelector('td.gdf-value').innerText = tab.gdf;
      tabNode.querySelector('td.gdeSum-value').innerText = tab.gdeSum;
      tabNode.querySelector('td.gdeMax-value').innerText = tab.gdeMax;
    });
  }

  window.getAllData = function(){


    /*******************
    buffer[i] => a tab
    buffet[i].elementList[j] => an element
    buffet[i].elementList[j].damages[k] => a damage

    [
      {
        id
        gdf
        gdeSum
        gdeMax
        elementList
        [
          {
            htmlNode
            name
            local
            GDE
            NDP
            photos
            damages
              [
                {
                  name
                  fp
                  fi
                  D
                }
              ]
          }
        ]
      }
    ]
    **********************/
    buffer = [];
    tabs = document.querySelectorAll('div.tabcontent');

    //Add tab layer
    tabs.forEach( tab => {
      if( tab.id == "none" ) return;
      buffer.push({
        id: tab.id,
        gdf: tab.querySelector('td.gdf-value').innerText,
        gdeSum: tab.querySelector('td.gdeSum-value').innerText,
        gdeMax: tab.querySelector('td.gdeMax-value').innerText,
        elementList: [],
      });
    });

    //Add elementList layer
    buffer.forEach( tab => {
      document.querySelectorAll('div.tabcontent#' + tab.id + ' table.element').forEach( element => {
        tab.elementList.push({
          htmlNode: element.outerHTML,
          name: element.querySelector('td.name-element div').innerText,
          local: element.querySelector('td.local-element div').innerText,
          gde: element.querySelector('td.gde').innerText,
          ndp: element.querySelector('td.ndp').innerText,
          photos: element.querySelector('td.element-img'),
          damages: [],
        });
      });
    });

    //Add damage layer
    buffer.forEach( tab => {
      tab.elementList.forEach( (element,i) => {
        document.querySelectorAll('div.tabcontent#' + tab.id + ' table.element')[i].
        querySelectorAll('tr.data-row').forEach( damage => {
          element.damages.push({
            name: damage.querySelector('td.damage').innerText,
            fp: damage.querySelector('input.fp').value,
            fi: damage.querySelector('input.fi').value,
            d: damage.querySelector('td.d').innerText,
          });
        });
      });
    });

    return buffer;
  }

  window.deleteRow = function(btn){
    let element = btn.closest('.element');
    let gde = element.querySelector('.gde');
    let ndp = element.querySelector('.ndp');

    btn.closest('.data-row').remove();
    let triggerer = element.querySelector('.data-row td.number input');

    if( triggerer ){
      triggerer.onchange();
    }
    else{
      gde.innerText = 0;
      ndp.innerText = 'Baixo';
    }

    updateGdf(element);
  }

  window.updateGdf = function(triggerer){
    let tab = triggerer.closest('.tabcontent');
    let gdeValues = [];
    let response = {
      gdf: 0,
      gdeSum: 0,
      gdeMax: 0,
    }
    let gdeNodes = tab.querySelectorAll('td.gde');
    if(gdeNodes.length > 0){
      gdeNodes.forEach( _gde => {
        let value = _gde.innerText;
        if( value != '---' )
          gdeValues.push(parseFloat(value));
      });
      response = ipcRenderer.sendSync('calc_gdf',gdeValues);
    }
    if (!response.gdf) response.gdf = 0;
    tab.querySelector('.gdf td.gdf-value').innerText = response.gdf.toFixed(ipcVar.precision);
    tab.querySelector('.gdf td.gdeSum-value').innerText = response.gdeSum.toFixed(ipcVar.precision);
    tab.querySelector('.gdf td.gdeMax-value').innerText = response.gdeMax.toFixed(ipcVar.precision);
  }

  window.deleteElement = function(btn) {
    window.changesHistory.push(document.querySelector('body').innerHTML);
    let tab = btn.closest('div.tabcontent');
    let ok = confirm("Deseja realmente deletar o elemento?");
    if(ok) {
      btn.closest('.element').remove();
      updateGdf(tab);
    }
  }

  window.duplicateElement = function(btn) {
    window.changesHistory.push(document.querySelector('body').innerHTML);
    let element = btn.closest('.element');
    element.insertAdjacentHTML('afterend', element.outerHTML);
    updateGdf(btn);
  }

  window.sendImg = function(elem) {
    window.changesHistory.push(document.querySelector('body').innerHTML);
    dialog.showOpenDialog( filePaths => {
      if (filePaths === undefined) return;
      let response = ipcRenderer.sendSync('save_img',filePaths[0]);
      elem.querySelector('img').src = '../images/temp/' + response;
    });
  }

  //onChange event
  window.inputNumber = function(input,type) {

    /*
      rangeLimiter usage for handling exceptions
    */
    window.changesHistory.push(document.querySelector('body').innerHTML);
    (function(){
      let damage = input.closest('.data-row').querySelector('.damage').textContent;
      let val = parseInt(input.value);
      let min, max;
      if( type == 'fp' && damage == 'fissuras'){
        max = 5;
        min = 2;
      }
      if( type == 'fi' ){
        min = 1;
        max = 4;
      }
      input.value = rangeLimiter(val,min,max);
    })();

    /*
      Live Calculate Element Results
    */
    (function(){
      let toSend = [];
      let element = input.closest('.element');
      let rows = element.querySelectorAll('.data-row');
      let gde = element.querySelector('.gde');
      let ndp = element.querySelector('.ndp');

      rows.forEach( row => {
        toSend.push({
          fp: row.querySelector('.fp').value,
          fi: row.querySelector('.fi').value,
        });
      });
      let response = ipcRenderer.sendSync('calc',toSend);
      gde.innerText = response.gde.toFixed(ipcVar.precision);
      ndp.innerText = response.ndp.nivel;
      rows.forEach( (row,i) => {
        row.querySelector('.d').innerText = response.d[i].toFixed(ipcVar.precision);
      });
    })();

    updateGdf(input);

  }

  /* Open tab function */
  window.openTab = function (evt, cityName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    document.getElementById(cityName).style.display = 'block';
    evt.currentTarget.className += ' active';
  }

  /* Onchange select */
  window.selectChange = function (id,selector){
    window.changesHistory.push(document.querySelector('body').innerHTML);
    let selectedValue = selector.value;
    let response = ipcRenderer.sendSync('add_row',selectedValue,id);
    selector.closest('.add-row').insertAdjacentHTML('beforebegin', response);
    selector.selectedIndex = 0;
    // startValue for D
    selector.closest('.element').querySelector('.data-row td.number input').onchange();
  }

  /* Limit input function */
  window.rangeLimiter = function (input,min,max){
    if(input < min) return min;
    else if(input > max) return max;
    else return input;
  }

});

/**********************************************
  non global script
***********************************************/

(function(){

  let lastTabContentWidth = 161;

  /* Open none tab */
  let tabs = document.getElementsByClassName('tabcontent');
  for (i = 0; i < tabs.length; i++) {
    tabs[i].style.display = 'none';
  }
  let tablinks = document.getElementsByClassName('tablinks');
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }
  document.getElementById('none').style.display = 'block';

  /* draggable tab width */
  draggable = new PlainDraggable(document.getElementById('width-selector'));
  draggable.onDrag = newPosition => {
    let newWidth = newPosition.left+1;
    lastTabContentWidth = newWidth;
    for(let i = 0; i < tabs.length; i++){
      tabs[i].style.width = 'calc(100% - ' + newWidth + 'px)';
      tabs[i].style['margin-left'] = newWidth + 'px';
    }
    document.getElementsByClassName('tab')[0].style.width = newWidth + 'px';
  };

  /* Gererate results commands - gets info from the screen */
  ipcRenderer.on('generate_results', function(){
    let gdf = [];
    document.querySelectorAll('.tabcontent').forEach( tab => {
      if( tab.id != 'none' )
        gdf.push( {
          id: tab.id,
          value: parseFloat(tab.querySelector('div.gdf td').innerText ),
        } );
    });
    let damageList = [];
    document.querySelectorAll('.data-row').forEach( row => {
      damageList.push( row.querySelector('td.damage').innerText );
    });
    ipcRenderer.send('generate_results', gdf, damageList);
  });

  /* Toggle tab command */
  ipcRenderer.on('toggle_tabs',()=>{
    let tab = document.getElementsByClassName('tab')[0];
    if(tab.style.display == 'none'){
      tab.style.display = 'inline-block';
      for(let i = 0; i < tabs.length; i++){
        tabs[i].style.width = 'calc(100% - ' + lastTabContentWidth + 'px)';
        tabs[i].style['margin-left'] = lastTabContentWidth + 'px';
        document.querySelector('#width-selector').style.display = 'inline-block';
      }
    }
    else{
      tab.style.display = 'none';
      for(let i = 0; i < tabs.length; i++){
        tabs[i].style.width = '100%';
        tabs[i].style['margin-left'] = '0px';
        document.querySelector('#width-selector').style.display = 'none';
      }
    }
  });


  //add_element handles
  document.querySelectorAll('.tabcontent').forEach((tab)=>{
    if(tab.id == 'none') return;
    let query = '#' + tab.id + ' button.add-element';
    document.querySelector(query).addEventListener('click',()=>{
      ipcRenderer.send('add_element', tab.id);
    });
  });

  ipcRenderer.on('add_element', function(e, data){
    window.changesHistory.push(document.querySelector('body').innerHTML);
    document.querySelector('#' + data.elementId +  ' hr.endtabcontent').insertAdjacentHTML('beforebegin', data.innerHTML);
  });

  //Save changes
  ipcRenderer.on('save_changes',()=>{
    let data = JSON.stringify(window.getAllData());
    ipcRenderer.send('save_changes',data);
    let box = document.querySelector('div.floatBox.savedChanges');
    box.classList.add('show');
    setTimeout(
      () => box.classList.remove('show')
      ,3000
    );
  });

  //Undo Changes
  ipcRenderer.on('undo',()=>{
    if( window.changesHistory.length > 0){
      const html = window.changesHistory.pop();
      let body = document.querySelector('body');
      body.innerHTML = '';
      body.insertAdjacentHTML('beforebegin',html);
      document.querySelectorAll('.tabcontent').forEach((tab)=>{
        if(tab.id == 'none') return;
        let query = '#' + tab.id + ' button.add-element';
        document.querySelector(query).addEventListener('click',()=>{
          ipcRenderer.send('add_element', tab.id);
        });
      });
    }
  });

  //Export to excel
  ipcRenderer.on('export_excel',()=>{
    const data = window.getAllData();
    dialog.showOpenDialog({
      title: 'Salvar os resultados em planilha',
      properties: [
        'openDirectory',
      ],
    }, path => {
      if (path === undefined) return;
      ipcRenderer.send('export_excel', path[0], data);
    });
  });

})();
