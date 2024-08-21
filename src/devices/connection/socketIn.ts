import { Server } from "socket.io";
import { addDevice, Device, devices, getDeviceBySocket, removeDevice } from "../devices";
import socketOut from "./socketOut";
import ipcOut from "@/ipc/ipcOut";
import { currentGame } from "@/games/player";

const PING_INTERVAL = 5000;

function ping() {
  for (let i=0;i<devices.length;i++) {
    if (Date.now() - devices[i].lastPong >= PING_INTERVAL * 2) {
      devices[i].connected = false;
      ipcOut.emitSetDevices(devices);
    }

    let start = Date.now();

    devices[i].socket.emit("ping", () => {
      devices[i].latency = Date.now() - start;
      devices[i].lastPong = Date.now();
      devices[i].connected = true;

      ipcOut.emitSetDevices(devices);
    });
  }
}

export function setupIo(io: Server) {
  setInterval(() => {
    ping();
  }, PING_INTERVAL);

  io.on("connection", (socket) => {
    if (socket.recovered) {
      const device = getDeviceBySocket(socket);
      if (device) {
        device.socket = socket;
        socketOut.emitJoined(socket, device);
        device.connected = true;
        ipcOut.emitSetDevices(devices);
      }
    }

    socket.on("join", (username: string) => {
      if (username.length < 1) {
        return;
      }

      let device: Device = {
        isKeyboard: false,
        username,
        socket,
        connected: true,
        id: socket.id,
        latency: 0,
        lastPong: Date.now()
      };

      if (addDevice(device)) {
        socketOut.emitJoined(socket, device);
      }
    });

    socket.on("getCurrentGame", () => {
      socketOut.emitSetCurrentGame(currentGame, socket);
    });

    socket.on("disconnect", (reason) => {
      switch(reason) {
        case "ping timeout":
        case "transport close": // The user has lost connection
        case "transport error": // The connection has encountered an error
          return;
        default: {
          const device = getDeviceBySocket(socket);
          if (device) {
            removeDevice(device);
          }
        }
      }
    });
  });
}
