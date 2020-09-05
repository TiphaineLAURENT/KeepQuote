//@ts-check
'use strict';

if (require.main !== module) {
    require("update-electron-app")({
        logger: require("electron-log")
    })
}

const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow = null;

app.requestSingleInstanceLock();
app.on("second-instance", () => {
    if (mainWindow !== null) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }
        mainWindow.focus();
    }
});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 800,
        title: app.getName(),
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    mainWindow.loadURL(path.join("file://", __dirname, "index.html"));
}
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// const glob = require("glob");
// glob.sync(path.join(__dirname, "**/*.ts")).forEach(file => {
//     require(file);
// });