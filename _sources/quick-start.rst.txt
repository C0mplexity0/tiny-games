Quick Start
-------------

Cloning the Template
====================

To set up a project, first open Tiny Games, add a device and click 'Continue'.

You should find yourself on this page:

.. image:: https://github.com/user-attachments/assets/944f378b-e14b-42eb-96ea-3bf1a3ccb47d
  :alt: Homepage
  :width: 500

Next to the "Games" title there is a folder button and a refresh button, click the folder button.

.. image:: https://github.com/user-attachments/assets/ffcc40a5-8d83-402c-af89-e9e688a5347b
  :alt: Folder button
  :width: 250

This will open the games folder.

Now you can head to https://github.com/C0mplexity0/tiny-games-template and either clone the repository into the games folder, or just download the code and extract it into the games folder. Feel free to name this folder whatever you want.

Now you can click the refresh button and it should appear with this screen:

.. image:: https://github.com/user-attachments/assets/8af8f1bd-97e4-4771-9c64-11289014023d
  :alt: Homepage with game
  :width: 500


The App and Web Folders
===========================

These folders contain the code for your game. The app folder contains all of the code for the app, which is the software which the user hosts games off of. The web folder contains all code for any devices that are connected to the app.

The app should coordinate all of the devices and should ultimately have control over the full game, meanwhile the devices should be treated more as controllers. Do, however, remember that the connection between the devices and the app may be unreliable or slow. You should think about designing your game around this.