import React from "react";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import { initSocket } from "./device/connection/in";

function Layout() {
  return (
    <>
      <Outlet />
    </>
  )
}

export default function Web() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
        </Route>
      </Routes>
    </HashRouter>
  )
}

initSocket();
