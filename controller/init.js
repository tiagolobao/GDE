
module.exports = (appDir) => {
  const {app, BrowserWindow, Menu, ipcMain} = require('electron');
  const ejse = require('ejs-electron');
  const fs = require('fs');
  const variables = require('./staticVar.js');
  let mainWindow;

  ejse.data('config',variables);

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
