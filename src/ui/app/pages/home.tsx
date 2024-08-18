import { Device } from "@/devices/devices";
import { devices } from "@app/App";
import { Button } from "@components/ui/button";
import DeviceNewButton from "@components/ui/devices/new";
import DeviceProfile from "@components/ui/devices/profile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { EllipsisVertical } from "lucide-react";
import React from "react";

function DeviceProfileOptions({ device }: { device: Device }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem 
          color="red"
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

function DeviceButton({ device, newButton }: { device?: Device, newButton?: Boolean, isMainDevice?: Boolean }) {
  return (
    <div className="size-12">
      {
        newButton ?
        <DeviceNewButton to="/devices/add-devices" />
        :
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" className={"size-12 rounded-[37.5%] bg-accent hover:bg-accent/90 relative " + (device.connected ? "" : "bg-secondary hover:bg-secondary/90")}>
              <DeviceProfile className="bg-transparent" device={device} />
            </Button>
          </PopoverTrigger>

          <PopoverContent side="right">
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
        </Popover>
      }
    </div>
  )
}

function Sidebar() {
  return (
    <div className="w-16 h-full border-r p-2">
      <div className="flex flex-col gap-2">
        {
          devices.map((device, i) => <DeviceButton key={i} device={device} />)
        }
        <DeviceButton newButton={true} />
      </div>
      <div className="flex-1" />
      <div className="flex flex-col">

      </div>
    </div>
  )
}

export default function AppHomePage() {
  return (
    <div className="size-full flex flex-row">
      <Sidebar />
    </div>
  )
}
