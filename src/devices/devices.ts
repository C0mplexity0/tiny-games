import { emitSetDevices } from "@/ipc/out";
import { Socket } from "socket.io";

export interface Device {
  isKeyboard: Boolean,
  username: string,
  socket?: Socket,
  id: string,

  connected: Boolean,
  latency: number,
  lastPong: number,
}

export let devices: Device[] = [];

export function getDeviceBySocket(socket: Socket | undefined) {
  if (!socket) {
    return;
  }

  for (let i=0;i<devices.length;i++) {
    if (devices[i].socket?.id == socket.id) {
      return devices[i];
    }
  }
}

export function getDeviceById(id: string) {
  for (let i=0;i<devices.length;i++) {
    if (devices[i].id == id) {
      return devices[i];
    }
  }
}

export function addDevice(device: Device) {
  if (!getDeviceBySocket(device.socket)) {
    devices.push(device);
    emitSetDevices(devices);
    return true; // The device was added
  }
  
  return false; // The socket was already listed in the devices, so the new device wasn't added
}

export function removeDevice(device: Device) {
  device.socket.emit("reload");

  const index = devices.indexOf(device);
  if (index > -1) {
    devices.splice(index, 1);
  }

  emitSetDevices(devices);
}
