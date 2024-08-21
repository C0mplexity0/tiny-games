import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import { initIpc } from "./ipc/ipcIn";
import { startWebServer } from "./web";
import { getGames } from "./games/games";
import MenuBuilder from "./menu";

export function isDev() {
  return process.env.NODE_ENV === "development" ||
    process.env.DEBUG_PROD === "true";
}

export const appDataDir = path.resolve(app.getPath("appData"), "tiny-games/data");

export let mainWindow: BrowserWindow;


if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 700,
    minHeight: 480,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const menu = new MenuBuilder(mainWindow).buildMenu();
  Menu.setApplicationMenu(menu);

  if (APP_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(APP_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${APP_VITE_NAME}/index.html`));
  }

  if (isDev()) {
    mainWindow.webContents.openDevTools();
  }
};

app.on("ready", () => {
  initIpc();
  startWebServer();

  getGames();
  
  createWindow();
});

// Don't quit the app if on macOS, since usually you would manually click the Quit button on there
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // Open a new window on macOS if the app icon has been clicked and the app hasn't been quit
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
