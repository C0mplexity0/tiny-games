::: warning
These docs are for **developers**. They only apply to you if you're trying to make a game for Tiny Games. You can find the download page [here](/#getting-started).
:::

::: warning
These docs are a WIP. Expect pieces of information to be missing. If you think anything here is confusing or incorrect feel free to open an issue.
:::


# Quick Start

Tiny Games is a simple piece of software which allows you to play games with friends without needing extra hardware such as controllers. People can connect their own devices (phones, tablets etc.) to a single computer and can play together that way (provided they are on the same network).

These docs will guide you through how to make your own games for Tiny Games, if you were looking for something else, it probably won't be here!

## Cloning the Template

To set up a project, first open Tiny Games, add a device and click 'Continue'.

You should find yourself on this page:

![Homepage](https://github.com/user-attachments/assets/944f378b-e14b-42eb-96ea-3bf1a3ccb47d)

Next to the "Games" title there is a folder button and a refresh button, click the folder button.

![Folder button](https://github.com/user-attachments/assets/ffcc40a5-8d83-402c-af89-e9e688a5347b)

This will open the games folder.

Now you can head to https://github.com/C0mplexity0/tiny-games-template and either clone the repository into the games folder, or just download the code and extract it into the games folder. Feel free to name this folder whatever you want.

Now you can click the refresh button and it should appear with this screen:

![Homepage with game](https://github.com/user-attachments/assets/8af8f1bd-97e4-4771-9c64-11289014023d)


## game.json

This file contains the config for your game.


## The App and Web Folders

These folders contain the code for your game. The app folder contains all of the code for the app, which is the software which the user hosts games off of. The web folder contains all code for any devices that are connected to the app.

The app should coordinate all of the devices and should ultimately have control over the full game, meanwhile the devices should be treated more as controllers. Do, however, remember that the connection between the devices and the app may be unreliable or slow. You should think about designing your game around this.


## Tiny Games API

By default, ``tiny-games.app.mjs`` and ``tiny-games.web.mjs`` are imported into the code (the app script being imported into the app's code, and the web script into the web's code).

These are both important as they enable your game to properly communicate with Tiny Games, which allows you to send information between the app and the devices connected to it, save information to a file, and a number of other things. It is essential that you use these scripts otherwise the devices simply won't be able to communicate properly with the app.

There are two ways you can import these:

```js
// App
import tinyGames from "/tiny-games/scripts/games/tiny-games.app.mjs";

// Web
import tinyGames from "/tiny-games/scripts/games/tiny-games.web.mjs";
```

or, if you're using NPM:

```js
// App
import tinyGames from "tiny-games-app";

// Web
import tinyGames from "tiny-games-web";
```


## data.json

This file contains any save data from your game. You shouldn't need to worry about this file.