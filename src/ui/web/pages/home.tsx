import { Button } from "@components/ui/button";
import { CharacterLimitInput } from "@components/ui/input";
import { hasConnected, socket } from "@web/device/connection/socketIn";
import socketOut from "@web/device/connection/socketOut";
import { activateWakeLock, device } from "@web/Web";
import React, { useEffect, useRef, useState } from "react";

let usernameInputRef: React.MutableRefObject<HTMLInputElement>;

let inputHasText: boolean;
let setInputHasText: (inputHasText: boolean) => void;

function submitUsername() {
  const usernameElem = usernameInputRef.current;
  if (usernameElem && inputHasText) {
    activateWakeLock();
    socketOut.emitJoin(usernameElem.value);
  }
}

function JoinPrompt() {
  [inputHasText, setInputHasText] = useState(false);

  return (
    <div>
      <div className="flex flex-col w-60 max-w-sm items-center space-y-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <CharacterLimitInput 
          type="text"
          ref={usernameInputRef} 
          placeholder="Username" 
          autoComplete="username" 
          onChange={
            () => {
              const usernameElem = usernameInputRef.current;
              setInputHasText(usernameElem && usernameElem.value.length >= 1);
            }
          }
          onKeyDown={
            (event) => {
              if (event.key === "Enter") {
                submitUsername();
              }
            }
          }
          maxLength={20}
        />
        <Button onClick={submitUsername} disabled={!inputHasText} >Connect</Button>
      </div>
    </div>
  );
}

function JoinedPage() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
      <h2 className="text-2xl font-bold">Connected!</h2>
      <span className="text-secondary-foreground">Continue through the app.</span>
    </div>
  );
}

function ConnectingPage() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
      <h2 className="text-2xl font-bold">Connecting...</h2>
      <span className="text-secondary-foreground">If this doesn't work, try scanning the code again.</span>
    </div>
  );
}

export default function WebHomePage() {
  usernameInputRef = useRef();

  let [socketConnected, setSocketConnected] = useState(hasConnected);

  useEffect(() => {
    setSocketConnected(hasConnected);

    if (!hasConnected) {
      const handleSocketConnected = () => {
        setSocketConnected(true);
      };

      socket.on("connect", handleSocketConnected);

      return () => {
        socket.off("connect", handleSocketConnected);
      };
    }
  });

  return (
    <div className="size-full">
      {
        socketConnected ?
        device ?
        <JoinedPage /> :
        <JoinPrompt />
        :
        <ConnectingPage />
      }
    </div>
  );
}
