import { Device } from "@/devices/devices";
import { currentGame, devices } from "@app/App";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";
import { DeviceProfileOptions } from "@components/ui/devices/device-button";
import DeviceProfile from "@components/ui/devices/profile";
import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Content, DraggableArea, Title, TitleBar } from "@components/ui/pages/page-structure";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu, SignalHigh, SignalLow, SignalMedium, Terminal, X } from "lucide-react";
import React, { useEffect, useRef } from "react";

let iframeRef: React.MutableRefObject<any>;

let gameData: object;
let gameExiting = false;


export function postMessage(event: string, data?: any) {
  if (iframeRef.current)
    iframeRef.current.contentWindow.postMessage({fromTinyGames: true, event, data}, iframeRef.current.src);
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


function DeviceRow({ device }: { device: Device }) {
  return (
    <div className="w-full h-14 border rounded-md p-2 flex flex-row gap-2">
      <div className={"size-10 rounded-[37.5%] bg-accent hover:bg-accent/90 relative " + (device.connected ? "" : "bg-secondary-background hover:bg-secondary-background/90")}>
        <DeviceProfile device={device} />
      </div>
      <span className="inline-block flex-1 h-10 leading-10">{device.username}</span>
      <div className="flex flex-row py-2.5">
        {
          (() => {
            if (device.latency > 200) {
              return <SignalLow className="text-secondary-foreground" width="18" height="18" />;
            } else if (device.latency > 70) {
              return <SignalMedium className="text-secondary-foreground" width="18" height="18" />;
            } else {
              return <SignalHigh className="text-secondary-foreground" width="18" height="18" />;
            }
          })()
        }
        <span className="text-sm text-secondary-foreground">{device.latency}ms</span>
      </div>
      <DeviceProfileOptions device={device} />
    </div>
  );
}

function ExitGameButton() {
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
  );
}

function DevToolsToggle() {
  return (
    <Button
      variant="outline"
      className="bg-transparent flex flex-row gap-2 p-2 h-8"
      onClick={() => {window.electron.ipcRenderer.sendMessage("toggleDevTools");}}
    >
      <Terminal className="h-4 w-4" />
      Dev Tools
    </Button>
  );
}

export default function PlayerPage() {
  iframeRef = useRef();

  useEffect(() => {
    setupMessageListener();

    let saveInterval = setInterval(saveData, 60000);

    return () => {
      removeMessageListener();

      clearInterval(saveInterval);
    };
  });

  if (!currentGame) {
    return;
  }

  return (
    <div className="size-full">
      <TitleBar className="px-1 flex flex-row items-center">
        <TooltipProvider>
          <Tooltip>
            <Dialog>
              <DialogTrigger asChild>
                <TooltipTrigger asChild>
                  <Button 
                    className="w-8 h-8 bg-transparent" 
                    size="icon" 
                    variant="outline"
                  ><Menu className="h-5 w-5" /></Button>
                </TooltipTrigger>
              </DialogTrigger>
              <TooltipContent>
                <p>Menu</p>
              </TooltipContent>
              <DialogPortal>
                <DialogOverlay />
                <DialogContent aria-describedby={undefined} className="pt-12">
                  <DialogClose
                    className="h-8 w-8 absolute right-2 top-2 bg-transparent hover:bg-secondary-background rounded-md p-1 text-foreground/50 opacity-70 transition-opacity-colors hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600"
                  >
                    <X className="h-5 w-5" />
                  </DialogClose>
                  <VisuallyHidden><DialogTitle>Game Menu</DialogTitle></VisuallyHidden>
                  <ScrollArea className="flex flex-col gap-2 w-full h-fit max-h-64 overflow-x-auto overflow-y-visible">
                    <div className="flex flex-col w-full h-fit gap-2">
                      {
                        devices.map((device, i) => <DeviceRow device={device} key={i} />)
                      }
                    </div>
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                  <ExitGameButton />
                </DialogContent>
              </DialogPortal>
            </Dialog>
          </Tooltip>
        </TooltipProvider>
        <DraggableArea className="h-full flex-1">
          <Title>{currentGame.name}</Title>
        </DraggableArea>
        {
          currentGame.inDeveloperMode ?
          <DevToolsToggle />
          :
          null
        }
      </TitleBar>
      <Content>
        <div className="size-full absolute top-0 left-0">
          <iframe 
            ref={iframeRef} 
            className="size-full bg-white"
            src={currentGame.inDeveloperMode && currentGame.devAppUrl ? currentGame.devAppUrl : `http://localhost:9977/${currentGame.inDeveloperMode && currentGame.devAppRoot ? currentGame.devAppRoot : currentGame.appRoot}`}
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
      </Content>
    </div>
  );
}
