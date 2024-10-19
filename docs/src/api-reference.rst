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