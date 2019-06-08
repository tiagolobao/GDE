/* Electron commands */
const electron = require('electron');
const {ipcRenderer} = electron;
const { dialog } = electron.remote;

window.ipcVar = ipcRenderer.sendSync('get_global');

DomReady.ready(function() {

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
    let tab = btn.closest('div.tabcontent');
    let ok = confirm("Deseja realmente deletar o elemento?");
    if(ok) {
      btn.closest('.element').remove();
      updateGdf(tab);
    }
  }

  window.duplicateElement = function(btn) {
    let element = btn.closest('.element');
    element.insertAdjacentHTML('afterend', element.outerHTML);
    updateGdf(btn);
  }

  window.sendImg = function(elem) {
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
    document.querySelector('#' + data.elementId +  ' hr.endtabcontent').insertAdjacentHTML('beforebegin', data.innerHTML);
  });

})();
