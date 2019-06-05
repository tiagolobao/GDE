
module.exports = (appDir) => {
  const electron = require('electron')
  const {app, BrowserWindow, Menu, ipcMain} = electron;
  const ejse = require('ejs-electron');
  const fs = require('fs');
  const variables = require('./staticVar.js');
  let mainWindow;

  ejse.data('config',variables);

  app.on('ready',()=>{
    mainWindow = new BrowserWindow({
      width: electron.screen.getPrimaryDisplay().workAreaSize.width,
      height: electron.screen.getPrimaryDisplay().workAreaSize.height,
      webPreferences: {
        nodeIntegration: true
      },
      icon: appDir + '/images/icon.png'
    });

    //Load page as a simple HTML
    //mainWindow.loadFile('views/mainPage.html');
    mainWindow.loadURL('file://' + appDir + '/views/mainPage.ejs');

    mainWindow.on('closed', function () {
      mainWindow = null;
    });
    //Dealing with the menu
    require('./menu.js')(Menu,mainWindow);
    //Dealing with ipc Requests
    require('./ipc.js')(ipcMain,mainWindow,{
      ejse: ejse,
      browserWindow: BrowserWindow,
      dir: appDir,
      fs: fs,
      displaySize: electron.screen.getPrimaryDisplay().workAreaSize,
    });
  });

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', function () {
    if (mainWindow === null) createWindow();
  });

  app.on('will-quit', function () {
    /* Delete temp files */
    let tempDirectory = '/images/temp/';
    let fileList = fs.readdirSync(appDir + tempDirectory);
    if( fileList ){
      fileList.forEach( file =>{
        fs.unlinkSync( appDir + tempDirectory + file );
      });
    }
  });

}
