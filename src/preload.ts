const { contextBridge, ipcRenderer } = require("electron");
const backend = require("i18next-electron-fs-backend");

contextBridge.exposeInMainWorld(
    "api", {
    i18nextElectronBackend: backend.preloadBindings(ipcRenderer)
}
);
