import { mainWindow } from "@/main";
import { Device, getIpcReadyDeviceInfo } from "@/devices/devices";
import { Game } from "@/games/games";

function emitSetConnectLink(link: string, webContents=mainWindow.webContents) {
  webContents.send("setConnectLink", link);
}

function emitSetDevices(devices: Device[], webContents=mainWindow.webContents) {
  let modifiedDevices = [];
    
  for (let i=0;i<devices.length;i++) {
    modifiedDevices.push({
      username: devices[i].username,
      connected: devices[i].connected,
      id: devices[i].id,
      latency: devices[i].latency
    });
  }

  webContents.send("setDevices", modifiedDevices);
}

function emitSetGames(games: Game[], webContents=mainWindow.webContents) {
  webContents.send("setGames", games);
}

function emitLaunchGame(game: Game, webContents=mainWindow.webContents) {
  webContents.send("launchGame", game);
}

function emitSetCurrentGame(currentGame: Game, webContents=mainWindow.webContents) {
  webContents.send("setCurrentGame", currentGame);
}

function emitGameEnd(webContents=mainWindow.webContents) {
  webContents.send("gameEnd");
}


// Games

function gameEmitSetData(data: object, webContents=mainWindow.webContents) {
  webContents.send("games:setData", data);
}

function gameEmitToApp(event: string, device: Device, data: any[], webContents=mainWindow.webContents) {
  let filteredDevice: Device = getIpcReadyDeviceInfo(device);
  webContents.send("games:emitToApp", event, filteredDevice, data);
}

export default {
  emitSetConnectLink,
  emitSetDevices,
  emitSetGames,
  emitLaunchGame,
  emitSetCurrentGame,
  emitGameEnd,

  gameEmitSetData,
  gameEmitToApp
};
