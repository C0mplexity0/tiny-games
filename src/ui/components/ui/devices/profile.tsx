import React from "react";
import { Device } from "@/devices/devices";
import styles from "./profile.module.css";

function ReconnectingAnimation() {
  return (
    <div className={styles.reconnectingAnimation}></div>
  )
}

export default function DeviceProfile({ device, className }: { device: Device, className?: string }) {
  return (
    <div title={device.username} className={`${className} ` + (device.connected ? "" : styles.disconnectedDevice)}>
      {
        device.connected ?
        ""
        :
        <ReconnectingAnimation />
      }
    </div>
  );
}
