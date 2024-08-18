import { generateDeviceQrCode } from "@/devices/qr-generator";
import { ipcMain } from "electron";
import { emitSetDevices } from "./out";
import { devices, getDeviceById, removeDevice } from "@/devices/devices";

export function initIpc() {
  ipcMain.on("getConnectQrCode", async (event) => {
    const code = await generateDeviceQrCode();
    event.reply("getConnectQrCode", code);
  });

  ipcMain.on("getDevices", () => {
    emitSetDevices(devices);
  });

  ipcMain.on("removeDevice", (_event, deviceId) => {
    if (typeof deviceId != "string") {
      return
    }

    const device = getDeviceById(deviceId);
    if (device) {
      removeDevice(device);
    }
  })
}
