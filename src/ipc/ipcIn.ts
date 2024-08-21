import { generateDeviceQrCode } from "@/devices/qr-generator";
import { ipcMain } from "electron";
import ipcOut from "./ipcOut";
import { devices, getDeviceById, removeDevice } from "@/devices/devices";
import { games, playGame } from "@/games/games";
import openUrl from "openurl";
import { currentGame, endGame } from "@/games/player";

export function initIpc() {
  ipcMain.on("getConnectQrCode", async (event) => {
    const code = await generateDeviceQrCode();
    event.reply("getConnectQrCode", code);
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

  ipcMain.on("getGames", () => {
    ipcOut.emitSetGames(games);
  });

  ipcMain.on("openLinkInBrowser", (event, link) => {
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
}
