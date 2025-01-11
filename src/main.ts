import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import { initIpc } from "./ipc/ipcIn";
import { startWebServer } from "./web";
import { getGames } from "./games/games";
import MenuBuilder from "./menu";
import ipcOut from "./ipc/ipcOut";
import { currentGameActive } from "./games/player";
import { updateElectronApp } from "update-electron-app";
import { gameHistorySaved, saveGameHistory } from "./games/data";

export let tryingToQuit = false;

export function nodeEnvDevelopment() {
  return process.env.NODE_ENV === "development" ||
    process.env.DEBUG_PROD === "true";
}

export function getResourcesFolder() {
  if (nodeEnvDevelopment()) {
    return path.resolve(__dirname, "../../resources");
  } else {
    return path.resolve(process.resourcesPath, "resources");
  }
}

export function getAppDataDir() {
  return path.resolve(app.getPath("appData"), "Tiny Games/data");
}

export let mainWindow: BrowserWindow;


if (require("electron-squirrel-startup")) {
  app.quit();
}

updateElectronApp();

async function quitting(event: { preventDefault: () => void; }) {
  if (gameHistorySaved && !currentGameActive) {
    return;
  }

  event.preventDefault(); // Make sure everything saves and exits properly
  tryingToQuit = true;
  await saveGameHistory();

  if (currentGameActive) {
    ipcOut.emitQuitting();
  } else {
    app.quit();
  }
}


const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 700,
    minHeight: 480,
    autoHideMenuBar: true,
    backgroundColor: "#1E2023", // From globals.css
    icon: "./resources/branding/icons/tiny-games.png",
    show: false,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#1E202300",
      symbolColor: "#D2D2D2",
      height: 50
    },
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.on("close", quitting);

  const menu = new MenuBuilder(mainWindow).buildMenu();
  Menu.setApplicationMenu(menu);

  if (APP_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(APP_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${APP_VITE_NAME}/index.html`));
  }

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();

    if (nodeEnvDevelopment()) {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    }
  });
};

app.on("ready", () => {
  createWindow();

  initIpc();
  startWebServer();

  getGames();
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

app.on("before-quit", quitting);
