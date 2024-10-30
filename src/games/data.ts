import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { Game } from "./games";
import { getAppDataDir } from "@/main";

const HISTORY_FILE_PATH = path.join(getAppDataDir(), "history.json");

interface AbortControllers {
  [filePath: string]: AbortController;
}

interface GameHistoryEntry {
  game: string,
  timestamp: number
}

export let gameHistorySaved = true;
let gameHistory: GameHistoryEntry[];

let abortControllers: AbortControllers = {};


async function getJSONFileContent(dataPath: string, defaultValue: any) {
  if (!fs.existsSync(dataPath)) {
    return defaultValue;
  }

  const data = await fsPromises.readFile(dataPath);

  const str = data.toString();

  let json;

  try {
    json = JSON.parse(str);
  } catch(err) {
    json = defaultValue;
  }

  return json;
}

async function saveJSONFileContent(filePath: string, data: object) {
  if (abortControllers[filePath]) {
    abortControllers[filePath].abort();
  }

  let abortController = new AbortController();
  abortControllers[filePath] = abortController;

  const signal = abortController.signal;

  await fsPromises.writeFile(filePath, JSON.stringify(data), { signal: signal });
}

export function saveGameData(game: Game, data: object) {
  const dir = game.gameDir;
  const filePath = path.join(dir, "data.json");

  saveJSONFileContent(filePath, data);
}

export async function getGameData(game: Game) {
  const dir = game.gameDir;
  const dataPath = path.join(dir, "data.json");

  const data = await getJSONFileContent(dataPath, {});

  return data;
}

export async function getGameHistory() {
  if (gameHistory) {
    return gameHistory;
  }

  const data = await getJSONFileContent(HISTORY_FILE_PATH, []);

  gameHistory = data;

  return data;
}

export async function addGameHistoryEntry(entry: GameHistoryEntry) {
  gameHistory.push(entry);
  gameHistorySaved = false;
}

export async function saveGameHistory() {
  if (gameHistorySaved) {
    return;
  }

  await saveJSONFileContent(HISTORY_FILE_PATH, gameHistory);

  gameHistorySaved = true;
}
