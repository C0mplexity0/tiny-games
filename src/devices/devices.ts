import ipcOut from "@/ipc/ipcOut";
import { Socket } from "socket.io";

export interface Device {
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
    ipcOut.emitSetDevices(devices);
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

  ipcOut.emitSetDevices(devices);
}

export function getIpcReadyDeviceInfo(device: Device) { // For filtering out socket from the device's information so that it can be sent through Socket.IO and IPC with no issues
  let filteredDevice: Device = {
    username: device.username,
    id: device.id,
  
    connected: device.connected,
    latency: device.latency,
    lastPong: device.lastPong,
  };

  return filteredDevice;
}
