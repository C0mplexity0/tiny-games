import React from "react";
import { Device } from "@/devices/devices";
import styles from "./profile.module.css";

function ReconnectingAnimation() {
  return (
    <div className={styles.reconnectingAnimation}></div>
  );
}

export default function DeviceProfile({ device, className }: { device: Device, className?: string }) {
  return (
    <div title={device.username} style={{borderColor: `hsl(var(--device-${device.colourId}))`}} className={`size-full bg-tertiary-background border-2 rounded-[37.5%] ${className}`}>
      {
        device.connected ?
        ""
        :
        <ReconnectingAnimation />
      }
    </div>
  );
}
