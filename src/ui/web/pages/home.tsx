import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { emitJoin } from "@web/device/connection/out";
import { enterFullscreen } from "@web/Web";
import React, { useEffect, useRef, useState } from "react";

let usernameInputRef: React.MutableRefObject<HTMLInputElement>;

function ConnectPrompt() {
  let [inputHasText, setInputHasText] = useState(false);

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
        />
        <Button
          onClick={
            () => {
              const usernameElem = usernameInputRef.current;
              if (usernameElem && inputHasText) {
                emitJoin(usernameElem.value);
                enterFullscreen();
              }
            }
          } 
          disabled={!inputHasText}
        >Connect</Button>
      </div>
    </div>
  );
}

export default function WebHomePage() {
  let [pageContent, setPageContent] = useState(<></>);
  usernameInputRef = useRef();

  useEffect(() => {
    setPageContent(<ConnectPrompt />);
  }, [setPageContent]);

  return (
    <div className="size-full">
      {pageContent}
    </div>
  );
}
