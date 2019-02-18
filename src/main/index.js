import { app, BrowserWindow, protocol, ipcMain } from "electron";
import contextMenu from "electron-context-menu";
// eslint-disable-next-line no-unused-vars
import store from "../renderer/store";

contextMenu({
  prepend: (_params, _browserWindow) => [{}]
});

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  // eslint-disable-next-line global-require, no-underscore-dangle
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      webSecurity: false
    }
  });

  mainWindow.loadURL(winURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

protocol.registerStandardSchemes(["freetubeelectornvue"]);

app.setAsDefaultProtocolClient("freetubeelectornvue");

const isSecondInstance = app.makeSingleInstance(
  (commandLine, _workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();

      mainWindow.webContents.send("ping", commandLine);
    }
  }
);

// eslint-disable-next-line global-require
if (require("electron-squirrel-startup") || isSecondInstance) app.quit();

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

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

ipcMain.on("openMiniPlayer", (_e, data) => {
  const modalPath =
    process.env.NODE_ENV === "development"
      ? "http://localhost:9080/#/empty"
      : `file://${__dirname}/index.html/#/empty`;

  let win = new BrowserWindow({
    width: 1200,
    height: 710,
    autoHideMenuBar: true,
    webPreferences: { webSecurity: false }
  });

  win.on("close", () => {
    win = null;
  });

  win.loadURL(modalPath);

  win.webContents.on("did-finish-load", () => {
    win.webContents.send("openMiniPlayerRenderer", data);
  });
});
