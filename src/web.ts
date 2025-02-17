import express from "express";
import http from "http";
import { Server } from "socket.io";
import { nodeEnvDevelopment } from "./main";
import { setupIo } from "./devices/connection/socketIn";
import { ip } from "address";
import path from "path";
import ipcOut from "./ipc/ipcOut";
import findFreePorts from "find-free-ports";
import { config } from "./config";

export let currentIp: string | undefined;
export let currentProductionServerPort: number | undefined;
export let currentIoServerPort: number | undefined;

let expressApp: express.Application;
let httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
export let io: Server;

export function getIp() {
  if (currentIp) {
    return currentIp;
  }

  const ipAddress = ip();

  if (!ipAddress) {
    return "localhost";
  }

  return ipAddress;
}

async function getPorts() {
  if (nodeEnvDevelopment()) {
    return [8976, 9976];
  }

  const prodServerPort = await findFreePorts(1, {startPort: config.defaultProductionServerPort});
  const ioServerPort = await findFreePorts(1, {startPort: config.defaultIoServerPort});

  return [prodServerPort[0], ioServerPort[0]];
}

function startProductionServer() {
  const root = path.join(__dirname, `../renderer/${WEB_VITE_NAME}`);
  const staticHandler = express.static(root);

  expressApp.use(staticHandler);
  
  httpServer.listen(currentProductionServerPort);
}

function startIoServer() {
  io = new Server({ 
    serveClient: false, 
    cors: {
      origin: `http://${currentIp}:${currentProductionServerPort}`,
      credentials: true
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
    },
    maxHttpBufferSize: 1e7 // 10 MB
  });

  io.listen(currentIoServerPort);

  setupIo(io);
}

export async function startWebServer() {
  expressApp = express();
  httpServer = new http.Server(expressApp);
  currentIp = null;
  currentIp = getIp();
  
  [currentProductionServerPort, currentIoServerPort] = await getPorts();

  if (!nodeEnvDevelopment()) {
    startProductionServer();
  }

  startIoServer();

  ipcOut.emitSetConnectLink(getConnectLink());
}

export function getConnectLink() {
  // sp = socketPort
  return `http://${currentIp}:${currentProductionServerPort}${currentIoServerPort !== config.defaultIoServerPort ? `?sp=${currentIoServerPort}` : ""}`;
}
