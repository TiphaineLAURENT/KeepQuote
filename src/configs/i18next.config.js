"use strict";

const i18n = require("i18next");
const i18nextBackend = require("i18next-node-fs-backend");
const config = require("./app.config");
const path = require("path");
let { app } = require("electron");
if (app === undefined) {
    app = require("electron").remote.app;
}

const i18nextOptions = {
    debug: true,
    defaultNS: config.namespace,
    ns: config.namespace,
    lng: config.fallbackLng,
    backend: {
        // path where resources get loaded from
        loadPath: path.join(app.getAppPath(), "/src/{{ns}}/{{lng}}.json"),

        // path to post missing resources
        addPath: path.join(app.getAppPath(), "/src/{{ns}}/{{lng}}.missing.json"),

        // jsonIndent to use when storing json files
        jsonIndent: 4,
    },
    interpolation: {
        escapeValue: false
    },
    saveMissing: true,
    fallbackLng: config.fallbackLng,
    whitelist: config.languages,
    react: {
        wait: false
    }
};


i18n.use(i18nextBackend);

// initialize if not already initialized
if (!i18n.isInitialized) {
    i18n.init(i18nextOptions);
}

module.exports = i18n;