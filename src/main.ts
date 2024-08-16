import { app, BrowserWindow } from "electron";
import path from "path";

if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (APP_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(APP_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${APP_VITE_NAME}/index.html`));
  }

  mainWindow.webContents.openDevTools();
};

app.on("ready", createWindow);

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
