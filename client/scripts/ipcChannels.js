// Load vendor scripts
const {app, ipcMain} = require('electron');

// Load custom scripts
const assignments = require('./assignments')
const notebook = require('./notebook')

const setChannels = (renderer, session) => {
    // On submission of server address form
    ipcMain.on('serverBtn-click', function (event, remoteServerAddr) {
        renderer.checkRemoteServerAddressAndRender(remoteServerAddr)
    });
    
    // Delete user credentials on logout
    ipcMain.on('logout', function () {
        session.logout()
    });

    // Save user credentials on login
    ipcMain.on('login', function (event, creds) {
        session.login(creds.username, creds.password)
    });

    ipcMain.on('getNotebooksList', (event, assignmentName, assignmentURL) => {
        assignments.getNotebooksList(assignmentName, assignmentURL, (notebooksList) => {
            event.sender.send('getNotebooksList-reply', notebooksList)
        })
    });

    ipcMain.on('openNotebook', (event, assignment, notebook, score, attemptsRemaining) => {
        renderer.renderNotebookIndex(assignment, notebook, score, attemptsRemaining, undefined);
    });

    ipcMain.on('showAssignment', (event, assignment) => {
        renderer.renderAssignmentIndex(assignment)
    });

    ipcMain.on('submitNotebook', (event, assignment, notebook, score, attemptsRemaining) => {
        notebook.submitNotebook(assignment, notebook, score, attemptsRemaining)
    });
}

module.exports = { setChannels }