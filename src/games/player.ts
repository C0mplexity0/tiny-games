import ipcOut from "@/ipc/ipcOut";
import { Game, getGames } from "./games";
import express from "express";
import http from "http";
import socketOut from "@/devices/connection/socketOut";
import { io } from "@/web";
import { getResourcesFolder, mainWindow, nodeEnvDevelopment, tryingToQuit } from "@/main";
import path from "path";
import { app } from "electron";
import { addGameHistoryEntry } from "./data";
import findFreePorts from "find-free-ports";
import { config } from "@/config";

export let currentGame: Game;
export let currentGameActive = false;

export let expressApp: express.Application;
let httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

export async function startGame(game: Game, developerMode=false) {
  currentGameActive = true;
  currentGame = game;
  currentGame.inDeveloperMode = developerMode;

  if (developerMode) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  if (httpServer) {
    httpServer.close();
  }

  expressApp = express();
  httpServer = new http.Server(expressApp);

  const staticHandler = express.static(game.gameDir);
  const tgStaticHandler = express.static(path.resolve(getResourcesFolder(), "api"));

  expressApp.use("/", (req, res, next) => {
    if (!req.path.startsWith("/tiny-games/scripts/games")) {
      staticHandler(req, res, next);
    } else {
      tgStaticHandler(req, res, next);
    }
  });

  const port = await findFreePorts(1, {startPort: config.defaultGameServerPort});
  
  httpServer.listen(port[0]);

  game.hostPort = port[0];

  ipcOut.emitLaunchGame(game);
  socketOut.emitLaunchGame(game, io);
}

export function endGame() {
  currentGameActive = false;
  addGameHistoryEntry({ game: path.basename(currentGame.gameDir), timestamp: Date.now() });
  ipcOut.emitGameEnd();
  socketOut.emitGameEnd(io);

  if (!nodeEnvDevelopment()) {
    mainWindow.webContents.closeDevTools();
  }

  if (tryingToQuit) {
    app.quit();
  } else {
    getGames();
  }
}
