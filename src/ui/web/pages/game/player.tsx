import { socket } from "@web/device/connection/socketIn";
import { currentGame } from "@web/Web";
import React, { useEffect, useRef } from "react";

let iframeRef: React.MutableRefObject<any>;


function postMessage(event: string, data?: any) {
  const url = new URL(window.location.href);

  if (iframeRef.current)
    iframeRef.current.contentWindow.postMessage({fromTinyGames: true, event, data}, `http://${url.hostname}:9977`);
}


function handleMessage(event: MessageEvent<any>) {
  if (!event.data || !event.data.fromTinyGames) {
    return;
  }

  const info = event.data;

  switch (info.event) {
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


function handleEmitToDevice(event: string, data: any[]) {
  postMessage("emitToDevice", {
    event,
    data
  });
}


export default function PlayerPage() {
  iframeRef = useRef();

  useEffect(() => {
    socket.on("gameEmitToDevice", handleEmitToDevice);
    setupMessageListener();

    return () => {
      socket.off("gameEmitToDevice", handleEmitToDevice);
      removeMessageListener();
    }
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
          src={`http://${url.hostname}:9977/${currentGame.webRoot}`} 
          className="size-full bg-white"
          onLoad={() => {
            postMessage("setParentUrl", `http://${url.hostname}:${url.port}/`);
          }}
        />
      </div>
    </div>
  )
}
