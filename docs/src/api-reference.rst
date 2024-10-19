API Reference
-------------

game.json Config
================

name ``string``
  The name of your game.

  .. code-block:: json

    {
      "name": "TG Template"
    }

author ``string``
  The author of your game.

  .. code-block:: json

    {
      "author": "C0mplexity"
    }

description? ``string``
  A description of your game.

  .. code-block:: json

    {
      "description": "A basic template that you can use to build games for Tiny Games."
    }

icon? ``string``
  A path to the icon for your game.

  .. code-block:: json

    {
      "icon": "./icon.png"
    }

thumbnail? ``string``
  A path to the thumbnail for your game.

  .. code-block:: json

    {
      "thumbnail": "./thumbnail.png"
    }

socials? ``string[]``
  An array of social media links for the author(s) of your game.

  .. code-block:: json

    {
      "socials": [
        "https://github.com/C0mplexity0"
      ]
    }

appRoot ``string``
  The root directory of your app code.

  .. code-block:: json

    {
      "appRoot": "./app"
    }

webRoot ``string``
  The root directory of your web code.

  .. code-block:: json

    {
      "webRoot": "./web"
    }

devAppRoot? ``string``
  The root directory of your app code to be used when developing your game.

  .. code-block:: json

    {
      "devAppRoot": "./dev/app"
    }

devWebRoot? ``string``
  The root directory of your web code to be used when developing your game.

  .. code-block:: json

    {
      "devWebRoot": "./dev/web"
    }

devAppUrl? ``string``
  A URL to your app page to be used when developing your game. You may want to use this when developing a game with vite, for example.

  .. code-block:: json

    {
      "devAppUrl": "http://localhost:3000"
    }

devWebUrl? ``string``
  A URL to your web page to be used when developing your game. You may want to use this when developing a game with vite, for example.

  .. code-block:: json

    {
      "devWebUrl": "http://localhost:3000"
    }

App API
=======

There are two ways you can import this script:

.. code-block:: javascript

  import tinyGames from "/tiny-games/scripts/games/tiny-games.app.mjs";

or, if you're using NPM:

.. code-block:: javascript

  import tinyGames from "tiny-games-app";


gameReady() method
~~~~~~~~~~~~~~~~~~

Returns whether or not the game has loaded all of the information it needs to (e.g. the currently connected devices & the save data). Your game shouldn't try to interact with Tiny Games while this is false.

.. code-block:: javascript

  if (tinyGames.gameReady()) {
    // Start the game
  }

**Parameters**

None

**Return Value** ``boolean``

Whether the game is ready yet or not.


gameReady event
~~~~~~~~~~~~~~~

Fires once gameReady() is set to true (see above).

.. code-block:: javascript

  window.addEventListener("gameReady", () => {
    // Start the game
  });

**Event Properties**

None


gameExiting event
~~~~~~~~~~~~~~~~~

Fires before the game closes. Any save data that hasn't been set yet should be set when this event fires, and anything else that needs to happen before the game closes should happen too.

.. code-block:: javascript

  window.addEventListener("gameExiting", () => {
    tinyGames.setData("lastExitTime", Date.now());
  });

**Event properties**

None


AppDevice class
~~~~~~~~~~~~~~~

The AppDevice class is used to list all of the currently connected devices through the app API. It is identical to the WebDevice class in the web API except it also includes the remove() method.

**Instance Properties**

username ``string``
  The username the user entered when connecting.

id ``string``
  The unique id of the device.

connected ``boolean``
  Whether or not the user is connected to the app. (The connection between their device and the app may sometimes disconnect and reconnect).

latency ``number``
  The latency in milliseconds of the connection between the device and the app.

lastPong ``number``
  The last time the device responded to a ping from the app.


**Instance Methods**

remove()
  Disconnects the device from the app entirely. If it is the last device connected, the game will stop and the app will return to the Add Device screen.

  **Parameters**

  None

  **Return Value**

  None


getDevices() method
~~~~~~~~~~~~~~~~~~~

Returns an array of the currently connected AppDevices (see above).

**Parameters**

None

**Return Value** ``AppDevice[]``

All of the currently connected AppDevices.


emitToDevice() method
~~~~~~~~~~~~~~~~~~~~~

Emits a message to a specified device.

.. code-block:: javascript

  if (tinyGames.gameReady()) {
    tinyGames.emitToDevice(device, "setLevel", 1);
  }

**Parameters**

device ``AppDevice``
  The device to emit to.

event ``string``
  The event to emit.

...data ``any[]``
  Any extra information to send to the device.

**Return Value**

None


getData() method
~~~~~~~~~~~~~~~~

Gets the specified save data.

.. code-block:: javascript

  window.addEventListener("gameReady", () => {
    const playerAchievements = tinyGames.getData("playerAchievements");
  });

**Parameters**

key ``string``
  The key for the save data that you want to access.

**Return Value** ``any``

The save data that you requested.

setData() method
~~~~~~~~~~~~~~~~

Sets a value in the game's save data. This value will be saved in a file automatically, ready for the next time your game is played.

.. code-block:: javascript

  tinyGames.setData("highScore", 30);

**Parameters**

key ``string``
  The key of the value you want to set.
value ``any``
  The value you want to set.

**Return value**

None


Web API
=======

gameReady() method
~~~~~~~~~~~~~~~~~~

Returns whether or not the game has loaded all of the information it needs to (e.g. the currently connected devices & the save data). Your game shouldn't try to interact with Tiny Games while this is false.

.. code-block:: javascript

  if (tinyGames.gameReady()) {
    // Start the game
  }

**Parameters**

None

**Return Value** ``boolean``

Whether the game is ready yet or not.


gameReady event
~~~~~~~~~~~~~~~

Fires once gameReady() is set to true (see above).

.. code-block:: javascript

  window.addEventListener("gameReady", () => {
    // Start the game
  });

**Event Properties**

None


WebDevice class
~~~~~~~~~~~~~~~

The WebDevice class is used to list all of the currently connected devices through the web API. It is identical to the AppDevice class in the app API except it doesn't include the remove() method.

**Instance Properties**

username ``string``
  The username the user entered when connecting.

id ``string``
  The unique id of the device.

connected ``boolean``
  Whether or not the user is connected to the app. (The connection between their device and the app may sometimes disconnect and reconnect).

latency ``number``
  The latency in milliseconds of the connection between the device and the app.

lastPong ``number``
  The last time the device responded to a ping from the app.


**Instance Methods**

None


getDevices() method
~~~~~~~~~~~~~~~~~~~

Returns an array of the currently connected WebDevices (see above).

**Parameters**

None

**Return Value** ``WebDevice[]``

All of the currently connected WebDevices.


emitToApp() method
~~~~~~~~~~~~~~~~~~~~~

Emits a message to the app.

.. code-block:: javascript

  if (tinyGames.gameReady()) {
    tinyGames.emitToApp("loaded");
  }

**Parameters**

event ``string``
  The event to emit.

...data ``any[]``
  Any extra information to send to the app.

**Return Value**

None
