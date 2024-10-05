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
  if (!webContents) {
    return;
  }

  let modifiedDevices = [];
    
  for (let i=0;i<devices.length;i++) {
    modifiedDevices.push({
      username: devices[i].username,
      connected: devices[i].connected,
      id: devices[i].id,
      latency: devices[i].latency
    });
  }

  send(webContents, "setDevices", modifiedDevices);
}

function emitSetGames(games: Game[], webContents=mainWindow.webContents) {
  if (!webContents) {
    return;
  }

  send(webContents, "setGames", games);
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

  emitSetGames,
  emitLaunchGame,
  emitSetCurrentGame,
  emitGameEnd,

  gameEmitSetData,
  gameEmitToApp
};
