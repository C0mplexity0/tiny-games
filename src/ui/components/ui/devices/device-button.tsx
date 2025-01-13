import { Device } from "@/devices/devices";
import { EllipsisVertical } from "lucide-react";
import React from "react";
import { Button } from "../button";
import DeviceNewButton from "./new";
import DeviceProfile from "./profile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

export function DeviceProfileOptions({ device }: { device: Device }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <EllipsisVertical />
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
      <div className="flex flex-col gap-2">

        <div className="w-full flex flex-row">
          <span className="flex-1 overflow-hidden whitespace-nowrap text-xl leading-10 align-middle text-ellipsis">{device.username}</span>
          <DeviceProfileOptions device={device} />
        </div>

        <div className="w-full flex flex-row gap-1 text-secondary-foreground">
          <span>{device.connected ? `Connected, Ping: ${device.latency}ms` : "Reconnecting..."}</span>
        </div>
        
      </div>
    </PopoverContent>
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