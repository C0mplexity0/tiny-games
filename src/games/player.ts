import ipcOut from "@/ipc/ipcOut";
import { Game } from "./games";
import express from "express";
import http from "http";
import path from "path";
import socketOut from "@/devices/connection/socketOut";
import { io } from "@/web";
import { getResourcesFolder } from "@/main";

const port = 9977;

export let currentGame: Game;

export let expressApp: express.Application;
let httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

export function startGame(game: Game) {
  currentGame = game;

  if (httpServer) {
    httpServer.close();
  }

  expressApp = express();
  httpServer = new http.Server(expressApp);

  const staticHandler = express.static(game.gameDir);

  expressApp.use("/", (req, res, next) => {
    if (!req.path.startsWith("/tiny-games")) {
      staticHandler(req, res, next);
    } else if (req.path.startsWith("/tiny-games/tiny-games.app.mjs")) {
      res.sendFile(path.join(getResourcesFolder(), "scripts/games/tiny-games.app.mjs"));
    } else if (req.path.startsWith("/tiny-games/tiny-games.web.mjs")) {
      res.sendFile(path.join(getResourcesFolder(), "scripts/games/tiny-games.web.mjs"));
    }
  });
  
  httpServer.listen(port);

  ipcOut.emitLaunchGame(game);
  socketOut.emitLaunchGame(game, io);
}

export function endGame() {
  currentGame = null;
  ipcOut.emitGameEnd();
  socketOut.emitGameEnd(io);
}
