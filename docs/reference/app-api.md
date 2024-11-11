# App API

There are two ways you can import this script:

```js
import tinyGames from "/tiny-games/scripts/games/tiny-games.app.mjs";
```

or, if you're using NPM:

```js
import tinyGames from "tiny-games-app";
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


## ``onGameExiting()``

Fires the listener before the game closes. Any save data that hasn't been set yet should be set when this event fires, and anything else that needs to happen before the game closes should happen too.

```js
tinyGames.onGameExiting(() => {
  // End the game
});
```

### Parameters

listener <Badge type="info" text="() => void" /> - The callback to be executed when the event is fired

### Return Value

None


## ``offGameExiting()``

Removes a listener from the gameExiting event.

```js
const callback = () => {
  // End the game

  tinyGames.offGameExiting(callback);
};

tinyGames.onGameExiting(callback);
```

### Parameters

listener <Badge type="info" text="() => void" /> - The callback to be executed when the event is fired

### Return Value

None


## ``AppDevice`` class

The AppDevice class is used to list all of the currently connected devices through the app API. It is identical to the WebDevice class in the web API except it also includes the remove() method.

-----------------------

### Instance Properties

username <Badge type="info" text="string" /> - The username the user entered when connecting.

id <Badge type="info" text="string" /> - The unique id of the device.

connected <Badge type="info" text="boolean" /> - Whether or not the user is connected to the app. (The connection between their device and the app may sometimes disconnect and reconnect).

latency <Badge type="info" text="number" /> - The latency in milliseconds of the connection between the device and the app.

lastPong <Badge type="info" text="number" /> - The last time the device responded to a ping from the app.

-----------------------

### Instance Methods

#### ``remove()``
Disconnects the device from the app entirely. If it is the last device connected, the game will stop and the app will return to the Add Device screen.

##### Parameters

None

##### Return Value

None


## ``getDevices()``

Returns an array of the currently connected AppDevices (see above).

### Parameters

None

### Return Value <Badge type="info" text="AppDevice[]" />

All of the currently connected AppDevices.


## ``emitToDevice()``

Emits a message to a specified device.

```js
if (tinyGames.gameReady()) {
  tinyGames.emitToDevice(device, "setLevel", 1);
}
```

### Parameters

device <Badge type="info" text="AppDevice" /> - The device to emit to.

event <Badge type="info" text="string" /> - The event to emit.

...data <Badge type="info" text="any[]" /> - Any extra information to send to the device.

### Return Value

None


## ``emitToAllDevices()``

Emits a message to all connected devices.

```js
if (tinyGames.gameReady()) {
  tinyGames.emitToAllDevices("gameLoaded");
}
```

### Parameters

event <Badge type="info" text="string" /> - The event to emit.

...data <Badge type="info" text="any[]" /> - Any extra information to send to the devices.

### Return Value

None


## ``getData()``

Gets the specified save data.

```js
window.addEventListener("gameReady", () => {
  const playerAchievements = tinyGames.getData("playerAchievements");
});

tinyGames.onGameReady(() => {
  const playerAchievements = tinyGames.getData("playerAchievements");
});
```

### Parameters

key <Badge type="info" text="string" /> - The key for the save data that you want to access.

### Return Value <Badge type="info" text="any" />

The save data that you requested.

## ``setData()``

Sets a value in the game's save data. This value will be saved in a file automatically, ready for the next time your game is played.

```js
tinyGames.setData("highScore", 30);
```

### Parameters

key <Badge type="info" text="string" /> - The key of the value you want to set.

value <Badge type="info" text="any" /> - The value you want to set.

### Return value

None