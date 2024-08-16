import React from "react";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";

function Layout() {
  return (
    <>
      <Outlet />
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
        </Route>
      </Routes>
    </HashRouter>
  )
}
