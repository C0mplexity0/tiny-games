import React from "react";
import { createRoot } from "react-dom/client";

import Web from "./Web";
import { initSocket } from "./device/connection/in";

initSocket();

const container = document.getElementById("root") as HTMLDivElement;
const root = createRoot(container);

root.render(<Web />);
