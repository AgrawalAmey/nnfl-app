// Vendor scripts
const { app } = require('electron')
const fs = require('fs');
const path = require('path');

// Custom scripts
const cipher = require('./cipher.js')

function Creds() {

    this.getCredsPath = () => {
        if (this.credsPath == undefined) {
            var tempDir = app.getPath('temp')
            this.credsPath = path.join(tempDir, Date.now() + '.txt')
        }

        return this.credsPath
    }

    this.login = (username, password, callback) => {
        var credsPath = this.getCredsPath()

        var encryptedCreds = {
            "username": cipher.encrypt(username),
            "password": cipher.encrypt(password)
        }

        fs.writeFile(credsPath, JSON.stringify(encryptedCreds, null, 2), function (err) {
            if (err) return console.log(err);
            callback()
        });
    }

    this.getCreds = () => {
        var encryptedCreds = require(this.getCredsPath())

        var creds = {
            "username": cipher.decrypt(username),
            "password": cipher.decrypt(password)
        }

        return creds
    }

    this.logout = () => {
        var credsPath = this.getCredsPath()

        if (fs.existsSync(credsPath)) {
            fs.unlinkSync(credsPath)
        }
    }
}

module.exports = Creds