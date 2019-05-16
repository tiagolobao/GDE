
const {app, BrowserWindow, Menu, ipcMain} = require('electron')
let mainWindow;

/* Dealing with environment */
process.argv.forEach((arg)=>{
  switch (arg) {
    case 'development':
      process.env.NODE_ENV = 'development';
      console.log('Entering in development mode');
      break;
    default:
    case 'production':
      process.env.NODE_ENV = 'production';
      break;
  }
});

app.on('ready',()=>{
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  //Load page as a simple HTML
  mainWindow.loadFile('views/mainPage.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// If OSX, add empty object to menu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

// Create menu template
const mainMenuTemplate =  [
  // Each object is a dropdown
  {
    label: 'File',
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
