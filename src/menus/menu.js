'use strict';

const config = require("../configs/app.config");

module.exports = (app, mainWindow, i18n) => {
    const menu = [{
            label: i18n.t("File"),
            submenu: [
                { label: i18n.t("Quit"), role: "quit" }
            ]
        },
        {
            label: i18n.t("Edit"),
            submenu: [
                { label: i18n.t("Undo"), role: "undo" },
                { label: i18n.t("Redo"), role: "redo" },
                { type: "separator" },
                { label: i18n.t("Cut"), role: "cut" },
                { label: i18n.t("Copy"), role: "copy" },
                { label: i18n.t("Paste"), role: "paste" }
            ]
        },
        {
            label: i18n.t("View"),
            submenu: [
                { label: i18n.t("Toggle Developer Tools"), role: "toggledevtools" },
                { type: "separator" },
                { label: i18n.t("Reset Zoom"), role: "resetzoom" },
                { label: i18n.t("Zoom In"), role: "zoomin" },
                { label: i18n.t("Zoom Out"), role: "zoomout" },
                { type: "separator" },
                { label: i18n.t("Toggle Fullscreen"), role: "togglefullscreen" }
            ]
        },
        {
            label: i18n.t("Window"),
            submenu: [
                { label: i18n.t("Minimize"), role: "minimize" },
                { label: i18n.t("Zoom"), role: "zoom" },
                { label: i18n.t("Close"), role: "close" }
            ]
        },
        {
            label: i18n.t("Help"),
            submenu: [{
                label: "Documentation",
                click: async() => {
                    const { shell } = require("electron");
                    await shell.openExternal("https://github.com/guigrpa/docx-templates#supported-commands");
                }
            }]
        }
    ];

    const languageMenu = config.languages.map((languageCode) => {
        console.log(i18n.language);
        return {
            label: i18n.t(languageCode),
            type: 'radio',
            checked: i18n.language === languageCode,
            click: () => {
                i18n.changeLanguage(languageCode);
            }
        }
    });
    menu.push({
        label: i18n.t('Language'),
        submenu: languageMenu
    });

    return menu;
};