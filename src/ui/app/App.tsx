import React, { useEffect, useState } from "react";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import AppHomePage from "./pages/home";
import { Device } from "@/devices/devices";

import "@styles/globals.css";
import AddDevicesPage from "./pages/devices/add-devices";
import ConnectDevicePage from "./pages/devices/connect-device";
import { Game } from "@/games/games";
import PlayerPage, { exitGame, postMessage, prepareNewSession } from "./pages/game/player";
import { Toast, useToast } from "../hooks/use-toast";
import { Toaster } from "@components/ui/toaster";

export let devices: Device[];
let setDevices: (devices: Device[]) => void;

export let games: Game[];
let setGames: (games: Game[]) => void;

export let gamesOrder: "lastPlayed" | "alphabetically";
let setGamesOrder: (order: "lastPlayed" | "alphabetically") => void;

export let currentGame: Game | null;
export let setCurrentGame: (game: Game) => void;

export let connectLink: string;
let setConnectLink: (connectLink: string) => void;

export let toast: ({ ...props }: Toast) => object;

function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default function App() {
  [devices, setDevices] = useState([]);
  [games, setGames] = useState([]);
  [gamesOrder, setGamesOrder] = useState<"lastPlayed" | "alphabetically">("lastPlayed");
  [currentGame, setCurrentGame] = useState(null);
  [connectLink, setConnectLink] = useState("");

  toast = useToast().toast;

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage("getDevices");

    const removeQuittingListener = window.electron.ipcRenderer.on("quitting", () => {
      if (window.location.hash == "#/game/player") {
        exitGame();
      }
    });

    const removeSetDevicesListener = window.electron.ipcRenderer.on("setDevices", (devices: Device[]) => {
      setDevices(devices);

      if (window.location.hash == "#/game/player") {
        postMessage("setDevices", devices);
      }
    });

    const removeDeviceConnectedListener = window.electron.ipcRenderer.on("deviceConnected", (device: Device) => {
      toast({
        title: "Device Connected",
        description: `${device.username} connected to Tiny Games!`
      });
    });


    window.electron.ipcRenderer.sendMessage("getGames");

    const removeSetGamesListener = window.electron.ipcRenderer.on("setGames", (games: Game[], order: "lastPlayed" | "alphabetically") => {
      setGames(games);
      setGamesOrder(order);
    });


    window.electron.ipcRenderer.sendMessage("getCurrentGame");

    const removeSetCurrentGameListener = window.electron.ipcRenderer.on("setCurrentGame", (game: Game) => {
      setCurrentGame(game);
    });


    window.electron.ipcRenderer.sendMessage("getConnectLink");

    const removeSetConnectLinkListener = window.electron.ipcRenderer.on("setConnectLink", (link: string) => {
      setConnectLink(link);
    });

    const removeLaunchGameListener = window.electron.ipcRenderer.on("launchGame", (game: Game) => {
      setCurrentGame(game);
      prepareNewSession();
      window.location.hash = "/game/player";
    });

    
    const removeGameEndListener = window.electron.ipcRenderer.on("gameEnd", () => {
      if (window.location.hash == "#/game/player")
        window.location.hash = "";
      setCurrentGame(null);
    });

    return () => {
      removeQuittingListener();
      removeSetDevicesListener();
      removeDeviceConnectedListener();
      removeSetGamesListener();
      removeSetCurrentGameListener();
      removeSetConnectLinkListener();
      removeLaunchGameListener();
      removeGameEndListener();
    };
  }, [devices, games]);

  return (
    <div className="size-full">
      <Toaster />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<AppHomePage />} />
            <Route path="devices">
              <Route path="add-devices" element={<AddDevicesPage />} />
              <Route path="connect-device" element={<ConnectDevicePage />} />
            </Route>
            <Route path="game">
              <Route path="player" element={<PlayerPage />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}
