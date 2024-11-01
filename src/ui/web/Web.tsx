import React, { useEffect, useState } from "react";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import NoSleep from "nosleep.js";

import "@styles/globals.css";
import WebHomePage from "./pages/home";
import { Game } from "@/games/games";
import PlayerPage from "./pages/game/player";
import { Device } from "@/devices/devices";
import { Toaster } from "@components/ui/toaster";
import { Toast, useToast } from "@hooks/use-toast";
import { socket } from "./device/connection/socketIn";

export let device: Device | null;
export let setDevice: (device: Device) => void;

export let currentGame: Game | null;
export let setCurrentGame: (currentGame: Game | null) => void;
let noSleep = new NoSleep();

export let toast: ({ ...props }: Toast) => object;

export function activateWakeLock() {
  noSleep.enable();
}

function notifyRemoved() {
  setDevice(null);
  toast({
    title: "Disconnected from Tiny Games"
  });
}

function Layout() {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
}

export default function Web() {
  [currentGame, setCurrentGame] = useState(null);
  [device, setDevice] = useState(null);

  toast = useToast().toast;

  if (!device) {
    window.location.hash = "";
  }

  useEffect(() => {
    socket.on("deviceRemoved", notifyRemoved);

    return () => {
      socket.off("deviceRemoved", notifyRemoved);
    };
  });

  return (
    <div className="size-full">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<WebHomePage />} />
            <Route path="game">
              <Route path="player" element={<PlayerPage />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}
