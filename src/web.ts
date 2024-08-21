import express from "express";
import http from "http";
import { Server } from "socket.io";
import { isDev } from "./main";
import { setupIo } from "./devices/connection/socketIn";
import { ip } from "address";
import path from "path";
import ipcOut from "./ipc/ipcOut";

const port = 8976;
const socketIoPort = 9976;
let currentPort: number | undefined;

let expressApp: express.Application;
let httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
export let io: Server;

function startProductionServer() {
  const root = path.join(__dirname, `../renderer/${WEB_VITE_NAME}`);
  const staticHandler = express.static(root);

  expressApp.use(staticHandler);
  
  httpServer.listen(port);
  currentPort = port;
}

function startIoServer() {
  io = new Server({ 
    serveClient: false, 
    cors: {
      origin: `http://${ip()}:${port}`,
      credentials: true
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
    }
  });

  io.listen(socketIoPort);

  setupIo(io);
}

export function startWebServer() {
  expressApp = express();
  httpServer = new http.Server(expressApp);

  if (!isDev()) {
    startProductionServer();
  } else {
    currentPort = port;
  }

  startIoServer();

  ipcOut.emitSetConnectLink(getConnectLink());
}

export function getWebServerPort() {
  return currentPort;
}

export function getConnectLink() {
  return `http://${ip()}:${getWebServerPort()}`;
}
