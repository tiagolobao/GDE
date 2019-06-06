module.exports = (Menu, targetWindow, type) => {

  let menuTemplate = [];

  if( type == 'mainMenu' ){
    // Create menu template
    menuTemplate =  [
      // Each object is a dropdown
      {
        label: 'Opções',
        submenu:[
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
