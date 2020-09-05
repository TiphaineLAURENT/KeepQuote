"use strict";

const { Menu } = require("electron");
const config = require("../configs/app.config");
const i18n = require("../configs/i18next.config");

const menuTemplate = require("../menus/menu");

const menu = null;
const platform = process.platform;

function MenuFactoryService(menu) {
    this.menu = menu;

    this.buildMenu = buildMenu;
}

function buildMenu(app, mainWindow) {
    this.menu = Menu.buildFromTemplate(menuTemplate(app, mainWindow, i18n));
    mainWindow.setMenu(this.menu)
}

module.exports = new MenuFactoryService(menu);