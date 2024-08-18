import { mainWindow } from "@/main";
import { Device } from "@/devices/devices";

export function emitSetDevices(devices: Device[], webContents=mainWindow.webContents) {
  let modifiedDevices = [];
    
  for (let i=0;i<devices.length;i++) {
    modifiedDevices.push({
      isKeyboard: devices[i].isKeyboard,
      username: devices[i].username,
      connected: devices[i].connected,
      id: devices[i].id,
      latency: devices[i].latency
    });
  }

  webContents.send("setDevices", modifiedDevices);
}
