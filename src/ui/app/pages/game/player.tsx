import { currentGame, devices } from "@app/App";
import { Button } from "@components/ui/button";
import DeviceButton from "@components/ui/devices/device-button";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { Menu, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

let iframeRef: React.MutableRefObject<any>;


function postMessage(type: string, data?: string) {
  if (iframeRef.current)
    iframeRef.current.contentWindow.postMessage(`${type}${data ? ":" + data : ""}`, "http://localhost:9977");
}

function getMessageParts(msg: string) {
  let split = msg.split(":");

  const type = split.shift();

  return [type, split.join(":")];
}


function handleMessage(event: MessageEvent<any>) {
  const [messageType, messageData] = getMessageParts(event.data);

  switch (messageType) {
    case "getDevices":
      postMessage("setDevices", JSON.stringify(devices));
      break;
    case "emitToDevice": {
      const info = JSON.parse(messageData);

      window.electron.ipcRenderer.sendMessage("games:emitToDevice", info.deviceId, info.event, info.data);
      break;
    }
  }
}

function setupMessageListener() {
  window.addEventListener("message", handleMessage);
}

function removeMessageListener() {
  window.removeEventListener("message", handleMessage);
}


export default function PlayerPage() {
  let [menuOpen, setMenuOpen] = useState(false);

  let menuBackgroundRef = useRef();
  iframeRef = useRef();

  useEffect(() => {
    setupMessageListener();

    return () => {
      removeMessageListener();
    }
  });

  if (!currentGame) {
    return;
  }

  return (
    <div className="size-full">
      <div className="size-full absolute top-0 left-0">
        <iframe ref={iframeRef} className="size-full bg-white" src={`http://localhost:9977/${currentGame.appRoot}`} />
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
