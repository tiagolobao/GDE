/* Electron commands */
const electron = require('electron');
const {ipcRenderer} = electron;
const { dialog } = electron.remote;

window.ipcVar = ipcRenderer.sendSync('get_global');
window.changesHistory = [];

DomReady.ready(function() {

  //Load Changes
  ipcRenderer.on('load_changes', function(e, data){
    data.forEach( tab => {
      tab.elementList.forEach( element => {
        document.querySelector('#' + tab.id +  ' hr.endtabcontent').insertAdjacentHTML('beforebegin', element.htmlNode);
      });
      let tabNode = document.querySelector('div#' + tab.id + '.tabcontent');
      tabNode.querySelector('td.gdf-value').innerText = tab.gdf;
      tabNode.querySelector('td.gdeSum-value').innerText = tab.gdeSum;
      tabNode.querySelector('td.gdeMax-value').innerText = tab.gdeMax;
    });
  });

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
              [
                {
                  file
                  base64
                }
              ]
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
        let photos = [];
        element.querySelectorAll('td.element-img img.not-shown').forEach((img) => {
          const src = img.getAttribute('src');
          if(src != 'assets/imagens/sem_imagem.png') photos.push({ file: src });
        });
        console.log(photos);
        tab.elementList.push({
          htmlNode: element.outerHTML,
          name: element.querySelector('td.name-element div').innerText,
          local: element.querySelector('td.local-element div').innerText,
          gde: element.querySelector('td.gde').innerText,
          ndp: element.querySelector('td.ndp').innerText,
          photos: photos,
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
      let response = '../images/temp/' + ipcRenderer.sendSync('save_img',filePaths[0]);
      elem.querySelector('img.shown').src = response;
      elem.querySelector('div.image-list').insertAdjacentHTML('beforeend',
        '<img class="not-shown" src="' + response + '">'
      );
      elem
        .querySelectorAll('span.cursor-pointer')
        .forEach( span => span.style.display = 'block' );
    });
  }

  window.delImg = function(event,elem) {
    event.stopPropagation();
    let photosDiv = elem.closest('.element-img');
    let shownImg = photosDiv.querySelector('img.shown');
    let notShownImg = photosDiv.querySelectorAll('img.not-shown');
    let prevImg = 0;
    //remove from img list
    notShownImg.forEach((img,i)=>{
      if( img.src == shownImg.src ){
        img.parentNode.removeChild(img);
        prevImg = i-1;
      }
    });
    //go to next img
    notShownImg = photosDiv.querySelectorAll('img.not-shown');
    if( notShownImg.length == 0 ){
      shownImg.src = 'assets/imagens/sem_imagem.png';
      shownImg
        .closest('td.element-img')
        .querySelectorAll('span.cursor-pointer')
        .forEach( span => span.style.display = 'none' );
      shownImg
        .closest('td.element-img')
        .querySelector('span.add-img-btn')
        .style
        .display = 'block';
    }
    else{
      if(prevImg < 0) prevImg == 0;
      shownImg.src = notShownImg[prevImg].src;
    }
  }

  window.skipImg = function(event,elem) {
    event.stopPropagation();
    let photosDiv = elem.closest('.element-img');
    let shownImg = photosDiv.querySelector('img.shown');
    let notShownImg = photosDiv.querySelectorAll('img.not-shown');
    for (var i = 0; i < notShownImg.length; i++) {
      if( notShownImg[i].src == shownImg.src && (i+1) < notShownImg.length ){
        shownImg.src = notShownImg[i+1].src;
        break;
      }
    }
  }

  window.prevImg = function(event,elem) {
    event.stopPropagation();
    let photosDiv = elem.closest('.element-img');
    let shownImg = photosDiv.querySelector('img.shown');
    let notShownImg = photosDiv.querySelectorAll('img.not-shown');
    notShownImg.forEach((img,i) => {
      if( img.src == shownImg.src && i>0 ){
        shownImg.src = notShownImg[i-1].src;
      }
    });
  }

  //onChange event
  window.inputNumber = function(input,type) {

    /*
      rangeLimiter usage for handling exceptions
    */
    window.changesHistory.push(document.querySelector('body').innerHTML);
    (function(){

      let damage = input.closest('.data-row').querySelector('.damage').textContent.replace(/\s{2,}$/g,'');
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
      damageList.push( row.querySelector('td.damage').innerText.replace(/\s{2,}$/g,'') );
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
    let data = window.getAllData()
    dialog.showSaveDialog(
      {
        title: 'Salvar as alterações',
        properties: ['saveFile'],
        filters: [
          { name: 'Arquivos gde', extensions: ['gde'] },
          { name: 'Arquivos de texto', extensions: ['txt','json'] },
          { name: 'Todos os arquivos', extensions: ['*'] }
        ],
      },
      path => {
        if (path === undefined) return;
        ipcRenderer.send('save_changes',data,path);
      }
    );
  });
  ipcRenderer.on('save_done',()=>{
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

  //Print
  ipcRenderer.on('print_mainPage',()=>{
    window.print();
  });

  //Export to excel
  ipcRenderer.on('export_excel',()=>{
    const data = window.getAllData();
    dialog.showSaveDialog(
      {
        title: 'Salvar os resultados em planilha',
        properties: ['saveFile'],
        filters: [
          { name: 'Planilha Excel', extensions: ['xlsx'] },
          { name: 'Todos os arquivos', extensions: ['*'] }
        ],
      },
      path => {
        if (path === undefined) return;
        ipcRenderer.send('export_excel',data,path);
      }
    );
  });

})();
