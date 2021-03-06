// Load vender libraries
const electron = require('electron')
const { Menu, protocol } = require('electron')
const ejse = require('ejs-electron')
const path = require('path')
const request = require('request')
const url = require('url')

// Load custom scripts
const ipcChannels = require('./scripts/ipcChannels')
const Renderer = require('./scripts/renderer')
const remoteServerAddrHandler = require('./scripts/remoteServerAddrHandler')
const Session = require('./scripts/session')
const menuTemplate = require('./scripts/menuTemplate')

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {

    var shouldQuit = makeSingleInstance()
    if (shouldQuit) return app.quit()

    // Register nnfl protocol to serve static files locally
    registerNNFLProtocol()

    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800, 
        height: 600,
        icon: path.join(__dirname, 'static/img/icons/1024x1024.png')
    });

    mainWindow.maximize();


    renderer = new Renderer(mainWindow)
    session = new Session()

    // Set event handlers
    ipcChannels.setChannels(renderer, session)

    renderer.render()

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        session.logout()
        app.quit()
    })
}

function makeSingleInstance() {
    if (process.mas) return false

    return app.makeSingleInstance(function () {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })
}

function registerNNFLProtocol() {
    protocol.registerFileProtocol('nnfl', (request, callback) => {
        const url = request.url.replace(/^.*\/\//, '')
        callback({ path: path.normalize(`${__dirname}/static/${url}`) })
    }, (error) => {
        if (error) console.error('Failed to register protocol')
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('ready', function () {

})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
})
