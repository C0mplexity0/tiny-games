import { Device } from "@/devices/devices";
import { socket } from "@web/device/connection/socketIn";
import { currentGame } from "@web/Web";
import React, { useEffect, useRef } from "react";

let iframeRef: React.MutableRefObject<any>;


function postMessage(event: string, data?: any) {
  if (iframeRef.current)
    iframeRef.current.contentWindow.postMessage({fromTinyGames: true, event, data}, iframeRef.current.src);
}


function handleMessage(event: MessageEvent<any>) {
  if (!event.data || !event.data.fromTinyGames) {
    return;
  }

  const info = event.data;

  switch (info.event) {
    case "getDevices":
      socket.emit("getDevices");
      break;
    case "emitToApp": {
      socket.emit("emitToApp", info.data.event, info.data.data);
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


function handleSetDevices(devices: Device[]) {
  postMessage("setDevices", devices);
}

function handleEmitToDevice(event: string, data: any[]) {
  postMessage("emitToDevice", {
    event,
    data
  });
}


export default function PlayerPage() {
  iframeRef = useRef();

  useEffect(() => {
    socket.on("setDevices", handleSetDevices);
    socket.on("gameEmitToDevice", handleEmitToDevice);
    setupMessageListener();

    return () => {
      socket.off("setDevices", handleSetDevices);
      socket.off("gameEmitToDevice", handleEmitToDevice);
      removeMessageListener();
    };
  });

  if (!currentGame) {
    return;
  }

  const url = new URL(window.location.href);

  return (
    <div className="size-full">
      <div className="size-full">
        <iframe 
          ref={iframeRef} 
          src={currentGame.inDeveloperMode && currentGame.devWebUrl ? currentGame.devWebUrl : `http://${url.hostname}:${currentGame.hostPort}/${currentGame.inDeveloperMode && currentGame.devWebRoot ? currentGame.devWebRoot : currentGame.webRoot}`} 
          className="size-full bg-white"
          onLoad={() => {
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
    </div>
  );
}
