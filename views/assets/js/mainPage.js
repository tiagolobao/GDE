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
      let damage = input.parentElement.previousElementSibling.textContent;
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
      let element = input.parentElement.parentElement.parentElement;
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
      let tab = input.parentElement.parentElement.parentElement.parentElement.parentElement;
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
  window.selectChange = function (id,element){
    let selectedValue = element.value;
    let response = ipcRenderer.sendSync('add_row',selectedValue,id);
    element.parentElement.parentElement.parentElement.insertAdjacentHTML('beforebegin', response);
    element.selectedIndex = 0;
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
    ipcRenderer.send('generate_results', gdf);
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
    // processSelector(data.elementId); //Custom selector needs to be processed
  });

/* Custom select code */
function processSelector(id){
  let x, i, j, selElmnt, a, b, c, first;
  if( id != '' ){
    x = document.getElementById(id).getElementsByClassName('custom-select');
    first = 0;
  }
  else{
    x = document.getElementsByClassName('custom-select');
    first = x.length - 1;
  }
  first = (id=='' ? 0 : x.length - 1);
  for (i = first; i < x.length; i++) {
    selElmnt = x[i].getElementsByTagName('select')[0];
    a = document.createElement('DIV');
    a.setAttribute('class', 'select-selected');
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    b = document.createElement('DIV');
    b.setAttribute('class', 'select-items select-hide');
    for (j = 1; j < selElmnt.length; j++) {
      c = document.createElement('DIV');
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener('click', function(e) {
          var y, i, k, s, h;
          s = this.parentNode.parentNode.getElementsByTagName('select')[0];
          h = this.parentNode.previousSibling;
          for (i = 0; i < s.length; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
              s.selectedIndex = i;
              h.innerHTML = this.innerHTML;
              y = this.parentNode.getElementsByClassName('same-as-selected');
              for (k = 0; k < y.length; k++) {
                y[k].removeAttribute('class');
              }
              this.setAttribute('class', 'same-as-selected');
              break;
            }
          }
          h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener('click', function(e) {
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle('select-hide');
      this.classList.toggle('select-arrow-active');
    });
  } //for every 'custom-select'
}
function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName('select-items');
  y = document.getElementsByClassName('select-selected');
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove('select-arrow-active');
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add('select-hide');
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener('click', closeAllSelect);
// processSelector(''); //Process every custom selectors

})();
