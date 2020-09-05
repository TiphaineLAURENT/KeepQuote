'use strict';

const config = require("../configs/app.config");

module.exports = (app, mainWindow, i18n) => {
    const menu = [{
            label: i18n.t("File"),
            submenu: [
                { role: "quit" }
            ]
        },
        {
            label: i18n.t("Edit"),
            submenu: [
                { role: "undo" },
                { role: "redo" },
                { type: "separator" },
                { role: "cut" },
                { role: "copy" },
                { role: "paste" }
            ]
        },
        {
            label: i18n.t("View"),
            submenu: [
                { role: "toggledevtools" },
                { type: "separator" },
                { role: "resetzoom" },
                { role: "zoomin" },
                { role: "zoomout" },
                { type: "separator" },
                { role: "togglefullscreen" }
            ]
        },
        {
            label: i18n.t("Window"),
            submenu: [
                { label: i18n.t("Minimize"), role: "minimize" },
                { role: "zoom" },
                { role: "close" }
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