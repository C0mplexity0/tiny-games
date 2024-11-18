import { Button } from "@components/ui/button";
import { CharacterLimitInput } from "@components/ui/input";
import { hasConnected, socket } from "@web/device/connection/socketIn";
import socketOut from "@web/device/connection/socketOut";
import { activateWakeLock, device } from "@web/Web";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CircleUserRound, X } from "lucide-react";
import { useToast } from "@hooks/use-toast";

let usernameInputRef: React.MutableRefObject<HTMLInputElement>;

let inputHasText: boolean;
let setInputHasText: (inputHasText: boolean) => void;

let currentFile: File;

function submitDetails() {
  const usernameElem = usernameInputRef.current;
  if (usernameElem && inputHasText) {
    activateWakeLock();
    console.log(currentFile);
    socketOut.emitJoin(usernameElem.value, currentFile);
  }
}

function ProfileImageUploader() {
  const previewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profileColour, setProfileColour] = useState<number | null>();
  const { toast } = useToast();

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file.size > 1e7) {
      toast({
        title: "Whoops",
        description: "Max file size is 10 MB.",
      });
      return;
    }

    currentFile = file;
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      previewRef.current = url;
    }
  }, []);

  const handleRemove = useCallback(() => {
    currentFile = null;
    previewUrl && URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    previewRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  useEffect(() => {
    setProfileColour(Math.floor(Math.random() * 6));

    return () => {
      previewRef.current && URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  return (
    <div>
      <div className="relative inline-flex">
        <Button
          style={{borderColor: `hsl(var(--device-${profileColour}))`}}
          className="relative size-20 overflow-hidden bg-tertiary-background hover:bg-tertiary-background/90 border-2 rounded-[37.5%] p-0"
          onClick={handleThumbnailClick}
          aria-label={previewUrl ? "Change image" : "Upload image"}
        >
          {previewUrl ? (
            <img
              className="h-full w-full object-cover"
              src={previewUrl}
              alt="Preview of uploaded image"
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRound className="text-foreground opacity-60" />
            </div>
          )}
        </Button>
        {previewUrl && (
          <Button
            onClick={handleRemove}
            size="icon"
            destructive
            className="absolute -right-2 -top-2 size-6 rounded-full border-2 border-background"
            aria-label="Remove image"
          >
            <X size={16} />
          </Button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          aria-label="Upload image file"
        />
      </div>
      <div className="sr-only" aria-live="polite" role="status">
        {previewUrl ? "Image uploaded and preview available" : "No image uploaded"}
      </div>
    </div>
  );
}

function JoinPrompt() {
  [inputHasText, setInputHasText] = useState(false);

  return (
    <div>
      <div className="flex flex-col w-60 max-w-sm items-center space-y-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ProfileImageUploader />
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
                submitDetails();
              }
            }
          }
          maxLength={20}
        />
        <Button onClick={submitDetails} disabled={!inputHasText} >Connect</Button>
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
