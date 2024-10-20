import ipcOut from "@/ipc/ipcOut";
import { Game, getGames } from "./games";
import express from "express";
import http from "http";
import socketOut from "@/devices/connection/socketOut";
import { io } from "@/web";
import { getResourcesFolder, tryingToQuit } from "@/main";
import path from "path";
import { app } from "electron";
import { addGameHistoryEntry } from "./data";

const port = 9977;

export let currentGame: Game;
export let currentGameActive = false;

export let expressApp: express.Application;
let httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

export function startGame(game: Game) {
  currentGameActive = true;
  currentGame = game;

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
  
  httpServer.listen(port);

  ipcOut.emitLaunchGame(game);
  socketOut.emitLaunchGame(game, io);
}

export function endGame() {
  currentGameActive = false;
  addGameHistoryEntry({ game: path.basename(currentGame.gameDir), timestamp: Date.now() })
  ipcOut.emitGameEnd();
  socketOut.emitGameEnd(io);

  if (tryingToQuit) {
    app.quit();
  } else {
    getGames();
  }
}
