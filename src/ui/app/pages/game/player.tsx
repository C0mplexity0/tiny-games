import { currentGame, devices } from "@app/App";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";
import DeviceButton from "@components/ui/devices/device-button";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { Menu, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

let iframeRef: React.MutableRefObject<any>;

let gameData: object;
let gameExiting = false;


export function postMessage(event: string, data?: any) {
  if (iframeRef.current)
    iframeRef.current.contentWindow.postMessage({fromTinyGames: true, event, data}, "http://localhost:9977");
}

export function exitGame() {
  gameExiting = true;

  postMessage("gameExiting");

  saveData();
  window.electron.ipcRenderer.sendMessage("exitGame");
}


function saveData() {
  window.electron.ipcRenderer.sendMessage("games:saveData", gameData, Date.now());
}

function handleMessage(event: MessageEvent<any>) {
  if (!event.data || !event.data.fromTinyGames) {
    return;
  }

  const info = event.data;

  switch (info.event) {
    case "getDevices":
      postMessage("setDevices", devices);
      break;
    case "emitToDevice": {
      window.electron.ipcRenderer.sendMessage("games:emitToDevice", info.data.deviceId, info.data.event, info.data.data);
      break;
    }
    case "removeDevice":
      saveData(); // This is done in case the last device is removed and the game exits
      window.electron.ipcRenderer.sendMessage("removeDevice", info.data);
      break;
    
    case "getData":
      window.electron.ipcRenderer.sendMessage("games:getData");
      break;
    case "setData":
      gameData = info.data;

      if (gameExiting) {
        saveData(); // The last save happens when the gameExiting event fires, so this ensures that if any data is set as the gameExiting event is fired it gets saved properly
      }
      break;
  }
}

function setupMessageListener() {
  window.addEventListener("message", handleMessage);
}

function removeMessageListener() {
  window.removeEventListener("message", handleMessage);
}


export function ExitGameButton() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          className="w-full"
        >Exit Game</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Exit Game?</AlertDialogTitle>
          <AlertDialogDescription>
            All devices will be kicked from the game and the game will end.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={exitGame}>Exit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function PlayerPage() {
  let [menuOpen, setMenuOpen] = useState(false);

  let menuBackgroundRef = useRef();
  iframeRef = useRef();

  useEffect(() => {
    setupMessageListener();

    let saveInterval = setInterval(saveData, 60000);

    return () => {
      removeMessageListener();

      clearInterval(saveInterval);
    }
  });

  if (!currentGame) {
    return;
  }

  return (
    <div className="size-full">
      <div className="size-full absolute top-0 left-0">
        <iframe 
          ref={iframeRef} 
          className="size-full bg-white"
          src={`http://localhost:9977/${currentGame.appRoot}`}
          onLoad={() => {
            const url = new URL(window.location.href);
            let urlStr;

            if (window.location.href.startsWith("http://")) {
              urlStr = `http://${url.hostname}:${url.port}/`;
            } else {
              urlStr = "*";
            }

            postMessage("setParentUrl", urlStr);
          }}
        />
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

            <ExitGameButton />
          </div>
        </div>
      </div>
    </div>
  )
}
