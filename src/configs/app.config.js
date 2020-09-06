"use strict";

module.exports = {
    platform: process.platform,
    port: process.env.PORT ? process.env.PORT : 3000,
    title: "KeepQuote",
    languages: ["fr", "en"],
    fallbackLng: "en",
    namespace: "locales"
};