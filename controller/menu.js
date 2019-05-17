module.exports = (Menu, mainWindow) => {
  // Create menu template
  const mainMenuTemplate =  [
    // Each object is a dropdown
    {
      label: 'Options',
      submenu:[
        {
          label: 'Toggle tabs',
          accelerator:process.platform == 'darwin' ? 'Command+T' : 'Ctrl+T',
          click(){
            mainWindow.webContents.send('toggle:tabs');;
          }
        },
        {
          label: 'Quit',
          accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
          click(){
            app.quit();
          }
        },
      ]
    }
  ];

  // Add developer tools option if in dev
  if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
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
    mainMenuTemplate.unshift({});
  }

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
}
