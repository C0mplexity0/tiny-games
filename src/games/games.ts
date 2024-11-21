import path from "path";
import fs from "original-fs";
import { getAppDataDir } from "@/main";
import ipcOut from "@/ipc/ipcOut";
import { loadGame } from "./loader";
import { startGame } from "./player";
import { getGameHistory } from "./data";

export interface Game {
  name: string,
  author?: string,
  description?: string,
  icon?: string, // Icon/thumbnail should both be base64 images
  thumbnail?: string,
  socials?: string[],

  
  appRoot: string,
  webRoot: string,

  devAppRoot?: string,
  devWebRoot?: string,

  devAppUrl?: string,
  devWebUrl?: string,

  gameDir: string,


  inDeveloperMode?: boolean,
  hostPort?: number
}

export interface GameConfig {
  name: string,
  author: string,
  description?: string,
  icon?: string, // Icon/thumbnail should both be paths to images
  thumbnail?: string,
  socials?: string[],


  appRoot: string,
  webRoot: string,

  devAppRoot?: string,
  devWebRoot?: string,

  devAppUrl?: string | { host?: string, port: string | number, path?: string },
  devWebUrl?: string | { host?: string, port: string | number, path?: string }
}

export let games: Game[] = [];
export let gamesDir: string;

export function createGamesDir() {
  return new Promise<void>((resolve) => {
    fs.mkdir(gamesDir, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
      } else {
        resolve();
      }
    });
  });
}

export async function getGames(order?: "lastPlayed" | "alphabetically" | undefined) {
  gamesDir = path.resolve(getAppDataDir(), "games");
  await createGamesDir();

  games = [];
  ipcOut.emitSetGames(games);

  let files: string[] = [];
  let gamesLastOpened: {[key: string]: number} = {};

  let gameHistory = await getGameHistory();

  fs.readdirSync(gamesDir).forEach(async file => {
    files.push(file);

    for (let i=gameHistory.length-1;i>=0;i--) {
      if (gameHistory[i].game === file) {
        gamesLastOpened[file] = gameHistory[i].timestamp;
        break;
      }
    }
  });

  let orderedFiles = Object.keys(gamesLastOpened); // Order by last played

  orderedFiles.sort((a, b) => {
    return gamesLastOpened[b] - gamesLastOpened[a];
  });

  for (let i=0;i<files.length;i++) {
    if (!orderedFiles.includes(files[i])) {
      orderedFiles.push(files[i]);
    }
  }

  for (let i=0;i<orderedFiles.length;i++) {
    loadGame(orderedFiles[i]);
  }

  ipcOut.emitSetGames(games, order);
}

export function playGame(game: Game, developerMode: boolean) {
  startGame(game, developerMode);
}
