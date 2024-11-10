import { config } from "@/config";
import { Game } from "@/games/games";
import { currentGame, device, setCurrentGame, setDevice } from "@web/Web";
import io, { Socket } from "socket.io-client";

export let socket: Socket;

export let hasConnected = false;

export function initSocket() {
  const url = new URL(window.location.href);
  const socketPort = url.searchParams.get("sp") ?? config.defaultIoServerPort;

  if (!socketPort) {
    return;
  }

  socket = io(`http://${url.hostname}:${socketPort}`, {path: "/socket.io/", withCredentials: true});

  socket.on("connect", () => {
    hasConnected = true;

    socket.emit("getCurrentGame");
  });

  socket.on("ping", (callback) => {
    callback();
  });


  socket.on("joined", (json: string) => {
    setDevice(JSON.parse(json));
    if (currentGame) {
      window.location.hash = "/game/player";
    }
  });

  socket.on("setCurrentGame", (game: Game) => {
    setCurrentGame(game);

    if (game && device) {
      window.location.hash = "/game/player";
    }
  });

  socket.on("launchGame", (game: Game) => {
    setCurrentGame(game);
    window.location.hash = "/game/player";
  });

  socket.on("gameEnd", () => {
    if (window.location.hash == "#/game/player")
      window.location.hash = "/";
    setCurrentGame(null);
  });
}
