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
  // Vite hosts its own development server when the app isn't packaged

  io = new Server(httpServer, { 
    serveClient: false, 
    cors: {
      origin: `http://${ip()}:${port}`,
      credentials: true
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
    }
  });

  httpServer.listen(port);
  currentPort = port;

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
