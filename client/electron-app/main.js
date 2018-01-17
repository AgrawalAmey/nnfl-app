// Load vender libraries
const electron = require('electron');
const ejse = require('ejs-electron');
const path = require('path');
const request = require('request');
const url = require('url');

// Load custom scripts
const ipcChannels = require('./scripts/ipcChannels.js')
const Renderer = require('./scripts/renderer.js')
const remoteServerAddrHandler = require('./scripts/remoteServerAddrHandler.js');
const Session = require('./scripts/session.js')

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.maximize()
  
  // Init session
  session = new Session()

  // Create renderer
  renderer = new Renderer(mainWindow, session)
  // Set event handlers
  ipcChannels.setChannels(renderer);

  // Load remote server's addr from config
  var remoteServerAddr = remoteServerAddrHandler.getRemoteServerAddr();

  // Render
  renderer.renderIndex(remoteServerAddr);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    session.logout()
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

