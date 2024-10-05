import { Server, Socket } from "socket.io";
import { Device, getIpcReadyDeviceInfo } from "../devices";
import { Game } from "@/games/games";

function emitJoined(socket: Socket | Server, device: Device) {
  socket.emit("joined", JSON.stringify({
    username: device.username
  }));
}

function emitSetCurrentGame(game: Game | null, socket: Socket | Server) {
  socket.emit("setCurrentGame", game);
}

function emitLaunchGame(game: Game, socket: Socket | Server) {
  socket.emit("launchGame", game);
}

function emitGameEnd(socket: Socket | Server) {
  socket.emit("gameEnd");
}

function emitSetDevices(devices: Device[], socket: Socket | Server) {
  let ipcReadyDevices = [];

  for (let i=0;i<devices.length;i++) {
    ipcReadyDevices.push(getIpcReadyDeviceInfo(devices[i]));
  }

  socket.emit("setDevices", ipcReadyDevices);
}

function gameEmitToDevice(socket: Socket, event: string, data: any[]) {
  socket.emit("gameEmitToDevice", event, data);
}

export default { emitJoined, emitSetCurrentGame, emitLaunchGame, emitGameEnd, emitSetDevices, gameEmitToDevice };
