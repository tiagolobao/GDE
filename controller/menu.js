module.exports = (app, Menu, targetWindow, type) => {
const { dialog } = require('electron');
const fs = require('fs');

  let menuTemplate = [];

  if( type == 'mainMenu' ){
    // Create menu template
    menuTemplate =  [
      // Each object is a dropdown
      {
        label: 'Opções',
        submenu:[
          {
            label: 'Salvar Alterações',
            accelerator:process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
            click(){
              targetWindow.webContents.send('save_changes');
            }
          },
          {
            label: 'Carregar Alterações',
            accelerator:process.platform == 'darwin' ? 'Command+L' : 'Ctrl+L',
            click(){
              const path = dialog.showOpenDialog(targetWindow, {
                properties: ['openFile'],
                filters: [
                  { name: 'Arquivos gde', extensions: ['gde'] },
                  { name: 'Arquivos de texto', extensions: ['txt','json'] },
                  { name: 'Todos os arquivos', extensions: ['*'] }
                ],
              });
              if( path.length > 0 ){
                const rawdata = fs.readFileSync(path[0]);
                targetWindow.webContents.send('load_changes', JSON.parse(rawdata));
              }
            }
          },
          {
            label: 'Exportar .xlsx',
            accelerator:process.platform == 'darwin' ? 'Command+E' : 'Ctrl+E',
            click(){
              targetWindow.webContents.send('export_excel');;
            }
          },
          {
            label: 'Gerar Resultados',
            accelerator:process.platform == 'darwin' ? 'Command+G' : 'Ctrl+G',
            click(){
              targetWindow.webContents.send('generate_results');;
            }
          },
          {
            label: 'Esconder/Mostrar Abas',
            accelerator:process.platform == 'darwin' ? 'Command+T' : 'Ctrl+T',
            click(){
              targetWindow.webContents.send('toggle_tabs');;
            }
          },
          {
            label: 'Desfazer',
            accelerator:process.platform == 'darwin' ? 'Command+Z' : 'Ctrl+Z',
            click(){
              targetWindow.webContents.send('undo');;
            }
          },
          {
            label: 'Sair',
            accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click(){
              app.quit();
            }
          },
        ]
      }
    ];

  }

  else if( type == 'results' ){
    // Create menu template
    menuTemplate =  [
      // Each object is a dropdown
      {
        label: 'Opções',
        submenu:[
          {
            label: 'Download (xlsx)',
            accelerator:process.platform == 'darwin' ? 'Command+D' : 'Ctrl+D',
            click(){
              targetWindow.webContents.send('download');;
            }
          },
          {
            label: 'Print',
            accelerator:process.platform == 'darwin' ? 'Command+P' : 'Ctrl+P',
            click(){
              targetWindow.webContents.send('print');;
            }
          },
          {
            label: 'Sair',
            accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click(){
              app.quit();
            }
          },
        ]
      }
    ];

  }

  // Add developer tools option if in dev
  if(process.env.NODE_ENV !== 'production'){
    menuTemplate.push({
      label: 'Developer Tools',
      submenu:[
        {
          role: 'reload'
        },
        {
          label: 'Toggle DevTools',
          accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
          click(item, focusedWindow){
            focusedWindow.toggleDevTools();
          }
        }
      ]
    });
  }
  // If OSX, add empty object to menu
  if(process.platform == 'darwin'){
    menuTemplate.unshift({});
  }

  // Build menu from template
  const menu = Menu.buildFromTemplate(menuTemplate);
  // Insert menu
  Menu.setApplicationMenu(menu);
}
