const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const ipc = require('electron').ipcMain;
const fs = require('fs');
const spawn = require('child_process').spawn;


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 725,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

const isMac = process.platform === 'darwin'

const menuTemplate = [
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  {
    label: 'Archivo',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    label: 'Configuración',
    submenu: [
      {
        label: 'Carpetas de entrega',
        click: () => {
          openConfigurationWindow()
        }
      }
    ]
  },
]

const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Open configuration window
let configurationWindow

function openConfigurationWindow() {
  if (configurationWindow) {
    configurationWindow.focus()
    return
  }
  const pos = mainWindow.getPosition()

  let x = pos[0] + 10
  let y = pos[1] + 10

  configurationWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false,
    width: 350,
    height: 600,
    resizable: false,
    title: 'Carpetas de entrega',
    minimizable: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  configFile = loadConfiguration()

  configurationWindow.loadFile(__dirname + '/configuration.html', { query: { "configFile": JSON.stringify(configFile) } })

  configurationWindow.webContents.send('configData', configFile);

  configurationWindow.once('ready-to-show', () => {
    configurationWindow.show()
  })

  //configurationWindow.webContents.openDevTools();

}

const loadConfiguration = () => {
  let dataBuffer = fs.readFileSync(__dirname + '/config.json');
  configFile = JSON.parse(dataBuffer);
  return configFile
}

//Evento para empezar la entrega
ipc.on('startDeliverPreparation', (e, deliverOptions) => {
  console.log(deliverOptions)
  e.reply('processStarted')
  configFile = loadConfiguration()

  const arguments = [
    isMac ? "./src/scripts/entregarPortal_v3mac.sh" : "./src/scripts/entregarPortal_v3win.sh",
    deliverOptions.saoNumber,
    deliverOptions.processPortal ? "1" : "0",
    deliverOptions.procesBroadband ? "1" : "0",
    configFile.deliveryPath,
    configFile.saoDeliveryPath,
    configFile.sourceCodePath
  ]
  console.log(arguments)

  const ls = spawn("sh", arguments);
  const sendUpdate = (message) => {
    mainWindow.webContents.send('updateProgress', message)
  }
  // Eventos para salida del sh
  ls.stdout.on("data", data => {
    console.log(`stdout: ${data}`);
    sendUpdate(data);
  });

  ls.stderr.on("data", data => {
    console.log(`stderr: ${data}`);
    sendUpdate(data);
  });

  ls.on('error', (error) => {
    console.log(`error: ${error.message}`);
    sendUpdate(error.message);
  });

  ls.on("close", code => {
    console.log(`child process exited with code ${code}`);
  });

})


// Evento para cerrar ventana de configuración
ipc.on('closeConfigWindow', (e) => {
  configurationWindow.close()
  configurationWindow = null
})

//Evento para guardar los cambios de configuración
ipc.on('saveConfigOptions', (e, configOptions) => {
  configFile = loadConfiguration()
  console.log(configOptions)
  console.log(configFile)
  configFile.deliveryPath = configOptions.deliveryPath
  configFile.saoDeliveryPath = configOptions.saoDeliveryPath
  configFile.sourceCodePath = configOptions.sourceCodePath

  let stringConfig = JSON.stringify(configFile, null, 2);
  fs.writeFileSync(__dirname + '/config.json', stringConfig);

  configurationWindow.close()
  configurationWindow = null
})


module.exports.configurationWindow = configurationWindow