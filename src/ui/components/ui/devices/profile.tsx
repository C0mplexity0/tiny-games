import React from "react";
import { Device } from "@/devices/devices";
import styles from "./profile.module.css";
import { CircleUserRound } from "lucide-react";

function ReconnectingAnimation() {
  return (
    <div className={styles.reconnectingAnimation}></div>
  );
}

export default function DeviceProfile({ device, className }: { device: Device, className?: string }) {
  return (
    <div title={device.username} style={{borderColor: `hsl(var(--device-${device.colourId}))`}} className={`size-full bg-tertiary-background border-2 rounded-[37.5%] overflow-hidden relative ${className}`}>
      {
        device.connected ?
        device.profileImage ? <img src={device.profileImage} className="size-full object-cover" /> : <CircleUserRound className="text-foreground opacity-60 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2/5" />
        :
        <ReconnectingAnimation />
      }
    </div>
  );
}
