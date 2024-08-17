import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";

import "@styles/globals.css";

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
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
