import mimeTypes from "mime-types";
import fs from "original-fs";
import { Game, GameConfig, games, gamesDir } from "./games";
import path from "path";

function imageToBase64Url(path: string) {
  const contents = fs.readFileSync(path);
  const b64 = contents.toString("base64");

  const type = mimeTypes.lookup(path);
  if (!type) {
    return;
  }

  return `data:${type};base64,${b64}`;
}

function removePathPrefix(rootPath: string) {
  let newPath = rootPath;

  if (newPath.startsWith("./") || newPath.startsWith(".\\")) {
    newPath =  newPath.substring(2);
  }

  if (newPath.startsWith("/") || newPath.startsWith("\\")) {
    newPath = newPath.substring(1);
  }

  if (newPath.endsWith("/") || newPath.endsWith("\\")) {
    newPath = newPath.substring(newPath.length-1);
  }

  return newPath;
}

export function loadGame(file: string) {
  const gameDir = path.resolve(gamesDir, file);

  const config: GameConfig = JSON.parse(fs.readFileSync(path.resolve(gameDir, "game.json"), "utf8"));

  let icon: string | undefined;
  let thumbnail: string | undefined;

  if (config.icon) {
    icon = imageToBase64Url(path.resolve(gameDir, config.icon));
  }

  if (config.thumbnail) {
    thumbnail = imageToBase64Url(path.resolve(gameDir, config.thumbnail));
  }

  let game: Game = {
    name: config.name,
    author: config.author,
    description: config.description,
    icon,
    thumbnail,
    socials: config.socials ? config.socials : [],

    appRoot: removePathPrefix(config.appRoot),
    webRoot: removePathPrefix(config.webRoot),

    devAppRoot: config.devAppRoot ? removePathPrefix(config.devAppRoot) : undefined,
    devWebRoot: config.devWebRoot ? removePathPrefix(config.devWebRoot) : undefined,

    devAppUrl: config.devAppUrl,
    devWebUrl: config.devWebUrl,

    gameDir
  };

  games.push(game);
}
