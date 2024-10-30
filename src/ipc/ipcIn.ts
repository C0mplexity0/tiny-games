import { generateDeviceQrCode } from "@/devices/qr-generator";
import { ipcMain } from "electron";
import ipcOut from "./ipcOut";
import { devices, getDeviceById, removeDevice } from "@/devices/devices";
import { games, gamesDir, getGames, playGame } from "@/games/games";
import openUrl from "openurl";
import { currentGame, endGame } from "@/games/player";
import { getConnectLink } from "@/web";
import openExplorer from "open-file-explorer";
import socketOut from "@/devices/connection/socketOut";
import { getGameData, saveGameData } from "@/games/data";

export function initIpc() {
  ipcMain.on("getConnectQrCode", async (event) => {
    const code = await generateDeviceQrCode(getConnectLink());
    event.reply("getConnectQrCode", code);
  });

  ipcMain.on("getConnectLink", () => {
    ipcOut.emitSetConnectLink(getConnectLink());
  });

  ipcMain.on("getDevices", () => {
    ipcOut.emitSetDevices(devices);
  });

  ipcMain.on("removeDevice", (_event, deviceId) => {
    if (typeof deviceId != "string") {
      return
    }

    const device = getDeviceById(deviceId);
    if (device) {
      removeDevice(device);
    }
  });

  ipcMain.on("getGames", (_event, order?: "lastPlayed" | "alphabetically" | undefined) => {
    ipcOut.emitSetGames(games, order);
  });

  ipcMain.on("openLinkInBrowser", (_event, link) => {
    openUrl.open(link);
  });

  ipcMain.on("playGame", (_event, gameId) => {
    playGame(games[gameId]);
  });

  ipcMain.on("getCurrentGame", () => {
    ipcOut.emitSetCurrentGame(currentGame);
  });

  ipcMain.on("exitGame", () => {
    endGame();
  });

  ipcMain.on("reloadGames", (_event, order?: "lastPlayed" | "alphabetically" | undefined) => {
    getGames(order);
  });

  ipcMain.on("openGamesDir", () => {
    openExplorer(gamesDir, err => {
      if (err) {
        console.error(err);
      }
    });
  });


  // Games

  ipcMain.on("games:emitToDevice", (_event, deviceId, event, data: any[]) => {
    const device = getDeviceById(deviceId);

    if (!device) {
      return;
    }

    socketOut.gameEmitToDevice(device.socket, event, data);
  });

  ipcMain.on("games:getData", async () => {
    const data = await getGameData(currentGame);

    ipcOut.gameEmitSetData(data);
  });

  let lastSaveTime = 0;

  ipcMain.on("games:saveData", (_event, data: object, time: number) => {
    if (!data || time < lastSaveTime) { // Prevents old data overriding new data
      return;
    }

    lastSaveTime = time;

    saveGameData(currentGame, data);
  });
}
