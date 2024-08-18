import React, { useRef } from "react";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import NoSleep from "nosleep.js";

import "@styles/globals.css";
import WebHomePage from "./pages/home";

let pageContainerRef: React.MutableRefObject<HTMLDivElement>;
let noSleep = new NoSleep();

export function enterFullscreen() {
  const pageContainer = pageContainerRef.current;

  if (pageContainer) {
    pageContainer.requestFullscreen();
    noSleep.enable();
    
    try {
      // Sadly unsupported on Safari on iOS and Firefox for Android >:(, although at the time of writing the nightly build of Firefox does include it and it's already fully supported on Chrome, Opera and Samsung Internet.
      // More info: https://caniuse.com/mdn-api_screenorientation_lock
      // TypeScript support: https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1615
      // @ts-ignore
      window.screen.orientation["lock"]("landscape");
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch(err) {
      console.log("Screen orientation lock unsupported. User isn't on mobile?");
    }
  }
}

function Layout() {
  return (
    <>
      <Outlet />
    </>
  )
}

export default function Web() {
  pageContainerRef = useRef();

  return (
    <div ref={pageContainerRef} className="size-full">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<WebHomePage />} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  )
}
