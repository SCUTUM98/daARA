const {app, BrowserWindow, dialog} = require('electron');
var path = require('path');
let mainWindow;
let child_win_choice;
let child_win_upload;
let chile_win_InLecture;

function onClosed()
{
    mainWindow = null;
}

app.on('ready', () => 
{
    mainWindow = new BrowserWindow(
    {
        width:1000,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        },
        center: true,
        //frame: false,
        icon: path.join(__dirname, 'img/daARA ICON.png')
    });
    //mainWindow.loadURL(`file://${__dirname}/daARA_InLecture.html`)
    mainWindow.loadURL(`file://${__dirname}/daARA_choice.html`)
    //mainWindow.loadURL(`file://${__dirname}/daARA_LoginForm.html`);
    mainWindow.on('closed', onClosed);
});