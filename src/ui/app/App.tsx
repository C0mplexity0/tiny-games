import React, { useEffect, useState } from "react";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import { Device } from "@/devices/devices";

import "@styles/globals.css";
import AddDevicesPage from "./pages/devices/add-devices";

export let devices: Device[];
let setDevices: (arg0: Device[]) => void;

function Layout() {
  return (
    <>
      <Outlet />
    </>
  )
}

export default function App() {
  let [createdSetDevicesListener, setCreatedSetDevicesListener] = useState(false);
  let [fetchedDevices, setFetchedDevices] = useState(false);
  [devices, setDevices] = useState([]);

  useEffect(() => {
    if (!createdSetDevicesListener) {
      window.electron.ipcRenderer.on("setDevices", (devices: Device[]) => {
        setFetchedDevices(true);
        setDevices(devices);

        if (devices.length == 0) {
          window.location.hash = "/devices/add-devices";
        }
      });

      setCreatedSetDevicesListener(true);
    }

    if (!fetchedDevices) {
      window.electron.ipcRenderer.sendMessage("getDevices");
    }
  }, [devices, fetchedDevices, createdSetDevicesListener]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="devices">
            <Route path="add-devices" element={<AddDevicesPage />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  )
}
