import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { Game } from "./games";

let currentAbortController: AbortController | undefined;

export function saveGameData(game: Game, data: object) {
  const dir = game.gameDir;

  if (currentAbortController) {
    currentAbortController.abort();
  }

  currentAbortController = new AbortController();
  const signal = currentAbortController.signal;

  fs.writeFile(path.join(dir, "data.json"), JSON.stringify(data), { signal: signal }, (err) => {
    if (err && !signal.aborted) console.error(err);
  });
}

export async function getGameData(game: Game) {
  const dir = game.gameDir;
  const dataPath = path.join(dir, "data.json");

  if (!fs.existsSync(dataPath)) {
    return {};
  }

  const data = await fsPromises.readFile(dataPath);

  const str = data.toString();

  return JSON.parse(str);
}
