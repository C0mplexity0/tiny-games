import { Device } from "@/devices/devices";
import { socket } from "@web/device/connection/socketIn";
import { currentGame } from "@web/Web";
import React, { useEffect, useRef } from "react";

let iframeRef: React.MutableRefObject<any>;
let iframeLoaded = false;

let webApiLoaded = false;
let appMessageQueue: object[] = [];
let postMessageQueue: any[][] = [];


function postMessage(event: string, data?: any) {
  if (!iframeRef.current || !iframeLoaded) {
    postMessageQueue.push([event, data]);
    return;
  }

  try {
    iframeRef.current.contentWindow.postMessage({fromTinyGames: true, event, data}, iframeRef.current.src);
  } catch(err) {
    console.warn("Failed to send message to iframe");
    console.error(err);
  }
}


function handleMessage(event: MessageEvent<any>) {
  if (!event.data || !event.data.fromTinyGames) {
    return;
  }

  const info = event.data;

  switch (info.event) {
    case "loaded":
      webApiLoaded = true;
      for (let i=0;i<appMessageQueue.length;i++) {
        postMessage("emitToDevice", appMessageQueue[i]);
      }
      break;

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
  if (!webApiLoaded) {
    appMessageQueue.push({event, data});
    return;
  }

  postMessage("emitToDevice", {event, data});
}


export default function PlayerPage() {
  iframeRef = useRef();

  useEffect(() => {
    iframeLoaded = false;
    webApiLoaded = false;

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
            iframeLoaded = true;

            let urlStr;

            if (window.location.href.startsWith("http://")) {
              urlStr = `http://${url.hostname}:${url.port}/`;
            } else {
              urlStr = "*";
            }

            for (let i=0;i<postMessageQueue.length;i++) {
              postMessage(postMessageQueue[i][0], postMessageQueue[i][1]);
            }

            postMessageQueue = [];

            postMessage("setParentUrl", urlStr);
          }}
        />
      </div>
    </div>
  );
}
