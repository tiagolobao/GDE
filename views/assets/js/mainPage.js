/* Electron commands */
const electron = require('electron');
const {ipcRenderer} = electron;
const { dialog } = electron.remote

DomReady.ready(function() {

  window.sendImg = function(elem) {
    console.log(elem);
    console.log(dialog);
    dialog.showOpenDialog( filePaths => {
      if (filePaths === undefined) return;
      let response = ipcRenderer.sendSync('save_img',filePaths[0]);
      elem.querySelector('img').src = '../images/temp/' + response;
      console.log(response);
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
      let min = 1;
      let max = 20;
      if( type == 'fp' ){
        max = 10;
        min = ( damage == 'Fissuras' ? 2 : 1);
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
      gde.innerText = response.gde.toFixed(2);
      ndp.innerText = response.ndp.nivel;
      rows.forEach( (row,i) => {
        row.querySelector('.d').innerText = response.d[i].toFixed(2);
      });
    })();

    /*
     Update GDF - Grau de deterioração da família
    */
    (function(){
      let tab = input.closest('.tabcontent');
      let gdf = tab.querySelector('.gdf td');
      let gdeValues = [];
      tab.querySelectorAll('td.gde').forEach( _gde => {
        let value = _gde.innerText;
        if( value != '---' )
          gdeValues.push(parseFloat(value));
      });
      let response = ipcRenderer.sendSync('calc_gdf',gdeValues);
      gdf.innerText = response.toFixed(2);
    })();

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
    let rows = selector.closest('.element').querySelectorAll('.data-row');
    rows[rows.length-1].querySelector('td.number input').onchange();
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
      }
    }
    else{
      tab.style.display = 'none';
      for(let i = 0; i < tabs.length; i++){
        tabs[i].style.width = '100%';
        tabs[i].style['margin-left'] = '0px';
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
    document.querySelector('#' + data.elementId).insertAdjacentHTML('afterbegin', data.innerHTML);
  });

})();
