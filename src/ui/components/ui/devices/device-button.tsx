import { Device } from "@/devices/devices";
import { CircleUserRound, EllipsisVertical, SignalHigh, SignalLow, SignalMedium } from "lucide-react";
import React from "react";
import { Button } from "../button";
import DeviceNewButton from "./new";
import DeviceProfile, { ReconnectingAnimation } from "./profile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

export function DeviceProfileOptions({ device }: { device: Device }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="size-8" variant="ghost">
          <EllipsisVertical size={22} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem 
          destructive
          onClick={() => {
            window.electron.ipcRenderer.sendMessage("removeDevice", device.id);
          }}
        >
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DeviceButtonPopoverContent({ device, popoverSide }: { device?: Device, popoverSide?: "top" | "bottom" | "left" | "right" }) {
  return (
    <PopoverContent side={popoverSide ? popoverSide : "right"}>
      <div className="flex flex-col gap-3">

        <div className="w-full flex flex-row gap-3">
          <DeviceIcon device={device} />
          <span className="flex-1 overflow-hidden whitespace-nowrap text-xl h-8 leading-8 align-middle text-ellipsis">{device.username}</span>
          <DeviceProfileOptions device={device} />
        </div>

        <div className="w-full h-5 text-secondary-foreground">
          {
            device.connected ? 
            <div className="w-full h-5 flex flex-row gap-0.5">
              <span className="h-5">Connected</span>
              <div className="flex-1" />
              <div className="pt-0.5">
                {(() => {
                  if (device.latency > 200) {
                    return <SignalLow className="text-secondary-foreground" size={20} />;
                  } else if (device.latency > 70) {
                    return <SignalMedium className="text-secondary-foreground" size={20} />;
                  } else {
                    return <SignalHigh className="text-secondary-foreground" size={20} />;
                  }
                })()}
              </div>
              <span className="h-5">{device.latency}ms</span>
            </div> : 
            <span className="h-5 inline-block">Reconnecting...</span>
          }
        </div>
        
      </div>
    </PopoverContent>
  );
}

export function DeviceIcon({ device }:  { device: Device }) {
  return (
    <div title={device.username} style={{borderColor: `hsl(var(--device-${device.colourId}))`}} className="size-8 bg-element hover:bg-element/90 border-2 rounded-full overflow-hidden relative">
        {
          device.connected ?
          device.profileImage ? <img src={device.profileImage} className="size-full object-cover" /> : <CircleUserRound className="text-foreground opacity-60 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2/5" />
          :
          <ReconnectingAnimation />
        }
      </div>
  );
}

export default function DeviceButton({ device, newButton, popoverSide }: { device?: Device, newButton?: Boolean, popoverSide?: "top" | "bottom" | "left" | "right" }) {
  return (
    <div className="size-12">
      {
        newButton ?
        <DeviceNewButton to="/devices/add-devices" />
        :
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" className="size-12 rounded-[37.5%] relative bg-tertiary-background hover:bg-tertiary-background/90">
              <DeviceProfile className="bg-transparent" device={device} />
            </Button>
          </PopoverTrigger>

          <DeviceButtonPopoverContent device={device} popoverSide={popoverSide} />
        </Popover>
      }
    </div>
  );
}