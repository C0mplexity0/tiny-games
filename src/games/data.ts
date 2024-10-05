import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { Game } from "./games";

export function saveGameData(game: Game, data: object) {
  const dir = game.gameDir;

  fs.writeFile(path.join(dir, "data.json"), JSON.stringify(data), err => {
    if (err) throw err;
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
