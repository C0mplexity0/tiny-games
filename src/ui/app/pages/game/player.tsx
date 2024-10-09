import { currentGame, devices } from "@app/App";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";
import DeviceButton from "@components/ui/devices/device-button";
import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu, X } from "lucide-react";
import React, { useEffect, useRef } from "react";

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

      <Dialog>
        <DialogTrigger asChild>
          <Button 
            className="absolute top-2 right-2" 
            size="icon" 
            variant="outline"
          ><Menu /></Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent aria-describedby={undefined}>
            <DialogClose
              className="h-8 w-8 absolute right-2 top-2 bg-transparent hover:bg-secondary rounded-md p-1 text-foreground/50 opacity-70 transition-opacity-colors hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600"
            >
              <X className="h-5 w-5" />
            </DialogClose>
            <VisuallyHidden><DialogTitle>Game Menu</DialogTitle></VisuallyHidden>
            <ScrollArea className="flex flex-row h-fit gap-2 w-64 overflow-x-auto overflow-y-visible">
              <div className="flex flex-row h-fit gap-2">
                {
                  devices.map((device, i) => <DeviceButton popoverSide="bottom" device={device} key={i} />)
                }
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <ExitGameButton />
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  )
}
