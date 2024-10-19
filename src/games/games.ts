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

  devAppUrl?: string,
  devWebUrl?: string,

  gameDir: string,
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

  devAppUrl?: string,
  devWebUrl?: string
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

export function addGame(game: Game) {
  games.push(game);
  ipcOut.emitSetGames(games);
}

export async function getGames() {
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
}

export function playGame(game: Game) {
  startGame(game);
}
