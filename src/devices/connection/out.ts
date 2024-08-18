import { Server, Socket } from "socket.io";
import { Device } from "../devices";

export function emitJoined(socket: Socket | Server, device: Device) {
  socket.emit("joined", JSON.stringify({
    username: device.username
  }));
}
