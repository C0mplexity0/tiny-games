import { Server } from "socket.io";
import { addDevice, Device, devices, getDeviceBySocket, removeDevice } from "../devices";
import socketOut from "./socketOut";
import ipcOut from "@/ipc/ipcOut";
import { currentGame, currentGameActive } from "@/games/player";
import { fileTypeFromBuffer } from "file-type";

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
    let device: Device;

    if (socket.recovered) {
      device = getDeviceBySocket(socket);
      if (device) {
        device.socket = socket;
        socketOut.emitJoined(socket, device);
        device.connected = true;
        ipcOut.emitSetDevices(devices);
      }
    }

    socket.on("join", async (username: string, profileImage?: Buffer) => {
      if (username.length < 1 || username.length > 20) {
        return;
      }

      let profileImageType: string;

      if (profileImage) {
        profileImageType = (await fileTypeFromBuffer(profileImage)).mime;

        if (!profileImageType.startsWith("image/")) {
          return; // Another file type has been uploaded
        }
      }

      device = {
        username,
        colourId: Math.floor(Math.random() * 6),
        socket,
        connected: true,
        id: socket.id,
        latency: 0,
        lastPong: Date.now(),
        profileImage: profileImage ? `data:${profileImageType};base64, ${profileImage.toString("base64")}` : null
      };

      if (addDevice(device)) {
        socketOut.emitJoined(socket, device);
      }
    });

    socket.on("getCurrentGame", () => {
      if (currentGameActive) {
        socketOut.emitSetCurrentGame(currentGame, socket);
      } else {
        socketOut.emitSetCurrentGame(undefined, socket);
      }
    });


    socket.on("getDevices", () => {
      socketOut.emitSetDevices(devices, socket);
    });

    socket.on("emitToApp", (event: string, data: any[]) => {
      if (!device) {
        return;
      }

      ipcOut.gameEmitToApp(event, device, data);
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
