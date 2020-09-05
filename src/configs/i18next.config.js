"use strict";

const i18n = require("i18next");
const i18nextBackend = require("i18next-node-fs-backend");
const config = require("./app.config");

const i18nextOptions = {
    debug: true,
    defaultNS: config.namespace,
    ns: config.namespace,
    backend: {
        // path where resources get loaded from
        loadPath: "./src/{{ns}}/{{lng}}.json",

        // path to post missing resources
        addPath: "./src/{{ns}}/{{lng}}.missing.json",

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