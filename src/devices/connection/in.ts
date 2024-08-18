import { Server } from "socket.io";
import { addDevice, Device, devices, getDeviceBySocket, removeDevice } from "../devices";
import { emitJoined } from "./out";
import { emitSetDevices } from "@/ipc/out";

const PING_INTERVAL = 5000;

function ping() {
  for (let i=0;i<devices.length;i++) {
    if (Date.now() - devices[i].lastPong >= PING_INTERVAL * 2) {
      devices[i].connected = false;
      emitSetDevices(devices);
    }

    let start = Date.now();

    devices[i].socket.emit("ping", () => {
      devices[i].latency = Date.now() - start;
      devices[i].lastPong = Date.now();
      devices[i].connected = true;

      emitSetDevices(devices);
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
        emitJoined(socket, device);
        device.connected = true;
        emitSetDevices(devices);
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
        emitJoined(socket, device);
      }
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
