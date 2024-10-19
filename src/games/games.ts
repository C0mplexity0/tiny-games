import path from "path";
import fs from "original-fs";
import { appDataDir } from "@/main";
import ipcOut from "@/ipc/ipcOut";
import { loadGame } from "./loader";
import { startGame } from "./player";

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
  gamesDir = path.resolve(appDataDir, "games");
  await createGamesDir();

  games = [];
  ipcOut.emitSetGames(games);

  fs.readdirSync(gamesDir).forEach(async file => {
    loadGame(file);
  });
}

export function playGame(game: Game) {
  startGame(game);
}
