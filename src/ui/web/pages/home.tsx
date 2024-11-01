import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import socketOut from "@web/device/connection/socketOut";
import { activateWakeLock, device } from "@web/Web";
import React, { useRef, useState } from "react";

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

function ConnectPrompt() {
  [inputHasText, setInputHasText] = useState(false);

  return (
    <div>
      <div className="flex flex-col w-60 max-w-sm items-center space-y-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Input 
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
        />
        <Button onClick={submitUsername} disabled={!inputHasText} >Connect</Button>
      </div>
    </div>
  );
}

function ConnectedPage() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
      <h2 className="text-2xl font-bold">Connected!</h2>
      <span className="text-secondary-foreground">Continue through the app.</span>
    </div>
  );
}

export default function WebHomePage() {
  usernameInputRef = useRef();

  return (
    <div className="size-full">
      {
        device ?
        <ConnectedPage /> :
        <ConnectPrompt />
      }
    </div>
  );
}
