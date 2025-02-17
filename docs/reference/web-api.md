# Web API

There are two ways you can import this script:

```js
import tinyGames from "/tiny-games/scripts/games/tiny-games.web.mjs";
```

or, if you're using a package manager:

```bash
npm i tiny-games-web

yarn add tiny-games-web
```

```js
import tinyGames from "tiny-games-web";
```


## ``gameReady()``

Returns whether or not the game has loaded all of the information it needs to (e.g. the currently connected devices & the save data). Your game shouldn't try to interact with Tiny Games while this is false.

```js
if (tinyGames.gameReady()) {
  // Start the game
}
```

### Parameters

None

### Return Value <Badge type="info" text="boolean" />

Whether the game is ready yet or not.


## ``onGameReady()``

Calls the listener when the game has loaded all of the information it needs to. Your game shouldn't try to interact with Tiny Games while this is false.

```js
tinyGames.onGameReady(() => {
  // Start the game
});
```

### Parameters

listener <Badge type="info" text="() => void" /> - The callback to be executed when the event is fired.

### Return Value

None


## ``offGameReady()``

Removes a listener from the gameReady event.

```js
const callback = () => {
  // Start the game

  tinyGames.offGameReady(callback);
};

tinyGames.onGameReady(callback);
```

### Parameters

listener <Badge type="info" text="() => void" /> - The listener to be removed.

### Return Value

None


## ``onAppMessageReceive()``

Calls the listener when the app has sent a message to the device.

```js
tinyGames.onAppMessageReceive((event, ...data) => {
  // Respond to the message
});
```

### Parameters

listener <Badge type="info" text="(event: string, ...data: any) => void" /> - The callback to be executed when the event is fired.

### Return Value

None


## ``offAppMessageReceive()``

Removes a listener from the deiceMessageReceive event.

```js
const callback = (event, ...data) => {
  // Respond to the message

  tinyGames.onAppMessageReceive(callback);
};

tinyGames.onAppMessageReceive(callback);
```

### Parameters

listener <Badge type="info" text="(event: string, ...data: any) => void" /> - The listener to be removed.

### Return Value

None


## ``WebDevice`` class

The WebDevice class is used to list all of the currently connected devices through the web API. It is identical to the WebDevice class in the web API except it also includes the remove() method.

-----------------------

### Instance Properties

username <Badge type="info" text="string" /> - The username the user entered when connecting.

id <Badge type="info" text="string" /> - The unique id of the device.

connected <Badge type="info" text="boolean" /> - Whether or not the user is connected to the app. (The connection between their device and the app may sometimes disconnect and reconnect).

latency <Badge type="info" text="number" /> - The latency in milliseconds of the connection between the device and the app.

lastPong <Badge type="info" text="number" /> - The last time the device responded to a ping from the app.

-----------------------

### Instance Methods

None


## ``getDevices()``

Returns an array of the currently connected WebDevices (see above).

### Parameters

None

### Return Value <Badge type="info" text="WebDevice[]" />

All of the currently connected WebDevices.


## ``emitToApp()``

Emits a message to the app.

```js
if (tinyGames.gameReady()) {
  tinyGames.emitToApp("loaded");
}
```

### Parameters

event <Badge type="info" text="string" /> - The event to emit.

...data <Badge type="info" text="any[]" /> - Any extra information to send to the device.

### Return Value

None

