import { currentGame, devices } from "@app/App";
import { Button } from "@components/ui/button";
import DeviceButton from "@components/ui/devices/device-button";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { Menu, X } from "lucide-react";
import React, { useRef, useState } from "react";

let menuOpen: boolean;
let setMenuOpen: (menuOpen: boolean) => void;

export default function PlayerPage() {
  if (!currentGame) {
    return;
  }

  [menuOpen, setMenuOpen] = useState(false);

  let menuBackgroundRef = useRef();

  return (
    <div className="size-full">
      <div className="size-full absolute top-0 left-0">
        <iframe className="size-full bg-white" src={`http://localhost:9977/${currentGame.appRoot}`} />
      </div>

      <Button 
        className={`absolute top-2 right-2 ${menuOpen ? "hidden" : ""}`} 
        size="icon" 
        variant="outline"
        onClick={() => {
          setMenuOpen(true);
        }}
      ><Menu /></Button>

      <div className={`size-full absolute top-0 left-0 z-2 ${menuOpen ? "" : "hidden"}`}>
        <div 
          ref={menuBackgroundRef}
          className="size-full relative bg-background/70"
          onClick={(event) => {
            if (event.target == menuBackgroundRef.current)
              setMenuOpen(false);
          }}
        >
          <Button 
            className="absolute top-2 right-2" 
            size="icon" 
            variant="outline"
            onClick={() => {
              setMenuOpen(false);
            }}
          ><X /></Button>

          <div className="border absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-xl p-4 flex flex-col gap-4">
            <ScrollArea className="flex flex-row h-fit gap-2 w-64 overflow-x-auto overflow-y-visible">
              <div className="flex flex-row h-fit gap-2">
                {
                  devices.map((device, i) => <DeviceButton popoverSide="bottom" device={device} key={i} />)
                }
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <Button 
              className="w-full"
              onClick={() => {
                window.electron.ipcRenderer.sendMessage("exitGame");
              }}
            >Exit Game</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
