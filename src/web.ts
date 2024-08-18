import express from "express";
import http from "http";
import { Server } from "socket.io";
import { isDev } from "./main";
import { setupIo } from "./devices/connection/in";
import { ip } from "address";
import path from "path";

const port = 8976;
let currentPort: number | undefined;

let expressApp: express.Application;
let httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
export let io: Server;

function startProductionServer() {
  const root = path.join(__dirname, `../renderer/${WEB_VITE_NAME}`);
  const staticHandler = express.static(root);

  expressApp.use(staticHandler);

  io = new Server(httpServer, {
    serveClient: false ,
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
    }
  });
  
  httpServer.listen(port);
  currentPort = port;

  setupIo(io);
}

function startDevelopmentServer() {
  expressApp.use((_req, res) => {
    res.redirect(WEB_VITE_DEV_SERVER_URL); // When in development, vite hosts a webserver
  });

  io = new Server(httpServer, { 
    serveClient: false, 
    cors: {
      origin: `http://${ip()}:5174`,
      credentials: true
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
    }
  });

  httpServer.listen(port);
  currentPort = 5174;

  setupIo(io);
}

export function startWebServer() {
  expressApp = express();
  httpServer = new http.Server(expressApp);

  if (isDev()) {
    startDevelopmentServer();
  } else {
    startProductionServer();
  }
}

export function getWebServerPort() {
  return currentPort;
}
