"use strict";

const unhandled = require('electron-unhandled');
unhandled();

const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const url = require("url");

const menuFactoryService = require("./services/menuFactory");
const i18n = require("./configs/i18next.config");
const config = require("./configs/app.config");

const iconPath = path.join(app.getAppPath(), "/assets/keepquote.png");

let mainWindow = null;

const menuTemplater = require(path.join(__dirname, "menus/menu"));

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 800,
        icon: iconPath,
        title: config.title,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    mainWindow.loadURL(path.join("file://", __dirname, "index.html"));
    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    i18n.on("loaded", (loaded) => {
        i18n.changeLanguage(config.fallbackLng);
        i18n.off("loaded");
    });

    i18n.on("languageChanged", (language) => {
        menuFactoryService.buildMenu(app, mainWindow, i18n);
        mainWindow.webContents.send("language-changed", {
            language: language,
            namespace: config.namespace,
            resource: i18n.getResourceBundle(language, config.namespace)
        });
    });
}
app.on("ready", createWindow);

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

app.requestSingleInstanceLock();
app.on("second-instance", () => {
    if (mainWindow !== null) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }
        mainWindow.focus();
    }
});

ipcMain.on("get-initial-translations", (event, arg) => {
    i18n.loadLanguages("fr", (err, t) => {
        const initial = {
            "fr": {
                "locales": i18n.getResourceBundle("fr", config.namespace)
            }
        };
        event.returnValue = initial;
    });
});