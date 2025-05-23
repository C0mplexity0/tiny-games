import { mainWindow } from "@/main";
import { Device, getIpcReadyDeviceInfo } from "@/devices/devices";
import { Game } from "@/games/games";

function send(webContents: Electron.WebContents | null, channel: string, ...args: any[]) {
  if (!webContents) {
    return;
  }

  webContents.send(channel, ...args);
}

function emitQuitting(webContents=mainWindow.webContents) {
  send(webContents, "quitting");
}

function emitSetConnectLink(link: string, webContents=mainWindow.webContents) {
  if (!webContents) {
    return;
  }

  send(webContents, "setConnectLink", link);
}

function emitSetDevices(devices: Device[], webContents=mainWindow.webContents) {
  let ipcReadyDevices = [];

  for (let i=0;i<devices.length;i++) {
    ipcReadyDevices.push(getIpcReadyDeviceInfo(devices[i]));
  }

  send(webContents, "setDevices", ipcReadyDevices);
}

function emitDeviceConnected(device: Device, webContents=mainWindow.webContents) {
  send(webContents, "deviceConnected", getIpcReadyDeviceInfo(device));
}

function emitSetGames(games: Game[], order: "lastPlayed" | "alphabetically"="lastPlayed", webContents=mainWindow.webContents) {
  if (!webContents) {
    return;
  }

  if (order == "lastPlayed") {
    send(webContents, "setGames", games, order);
    return;
  }

  let sortedGames = [...games];

  sortedGames.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  send(webContents, "setGames", sortedGames, order);
}

function emitLaunchGame(game: Game, webContents=mainWindow.webContents) {
  if (!webContents) {
    return;
  }

  send(webContents, "launchGame", game);
}

function emitSetCurrentGame(currentGame: Game, webContents=mainWindow.webContents) {
  if (!webContents) {
    return;
  }

  send(webContents, "setCurrentGame", currentGame);
}

function emitGameEnd(webContents=mainWindow.webContents) {
  if (!webContents) {
    return;
  }

  send(webContents, "gameEnd");
}


// Games

function gameEmitSetData(data: object, webContents=mainWindow.webContents) {
  if (!webContents) {
    return;
  }

  send(webContents, "games:setData", data);
}

function gameEmitToApp(event: string, device: Device, data: any[], webContents=mainWindow.webContents) {
  if (!webContents) {
    return;
  }

  let filteredDevice: Device = getIpcReadyDeviceInfo(device);
  send(webContents, "games:emitToApp", event, filteredDevice, data);
}

export default {
  emitQuitting,
  emitSetConnectLink,
  emitSetDevices,
  emitDeviceConnected,

  emitSetGames,
  emitLaunchGame,
  emitSetCurrentGame,
  emitGameEnd,

  gameEmitSetData,
  gameEmitToApp
};
