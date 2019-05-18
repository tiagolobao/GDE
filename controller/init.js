
module.exports = (appDir) => {
  const {app, BrowserWindow, Menu, ipcMain} = require('electron');
  let mainWindow;


  app.on('ready',()=>{
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      },
      icon: appDir + '/images/icon.png'
    });

    //Load page as a simple HTML
    mainWindow.loadFile('views/mainPage.html');

    mainWindow.on('closed', function () {
      mainWindow = null;
    });
    //Dealing with the menu
    require('./menu.js')(Menu,mainWindow);
    //Dealing with ipc Requests
    require('./ipc.js')(ipcMain,mainWindow);
  });

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', function () {
    if (mainWindow === null) createWindow();
  });

}
