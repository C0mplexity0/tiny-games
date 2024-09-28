import React, { useState } from "react";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import NoSleep from "nosleep.js";

import "@styles/globals.css";
import WebHomePage from "./pages/home";
import { Game } from "@/games/games";
import PlayerPage from "./pages/game/player";
import { Device } from "@/devices/devices";

export let device: Device | null;
export let setDevice: (device: Device) => void;

export let currentGame: Game | null;
export let setCurrentGame: (currentGame: Game | null) => void;
let noSleep = new NoSleep();

export function activateWakeLock() {
  noSleep.enable();
}

function Layout() {
  return (
    <>
      <Outlet />
    </>
  )
}

export default function Web() {
  [currentGame, setCurrentGame] = useState(null);
  [device, setDevice] = useState(null);

  if (!device) {
    window.location.hash = "";
  }

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
  )
}
