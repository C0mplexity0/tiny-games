import communication from "./communication.mjs";
import GameEvent from "./events.mjs";

let devices;

let appMessageQueue = [];

// Events

const gameReadyEvent = new GameEvent();
const devicesUpdatedEvent = new GameEvent();
const appMessageReceiveEvent = new GameEvent();


// Classes

/**
 * A device which is connected.
*/
class WebDevice {
  constructor (device) {
    for (let property in device) {
      this[property] = device[property];
    }
  }
}


// Exported Functions

/**
 * Checks if the API script has fetched all of the necessary info yet.
*/
function gameReady() {
  if (devices && communication.getParentUrl()) {
    return true;
  }

  return false;
}

/**
 * Gets an array of the currently connected devices.
 * @returns {WebDevice[]} The array of devices.
*/
function getDevices() {
  return devices ? devices : [];
}

/**
 * Emits a message to the app.
 * @param {string} event - The event to emit.
 * @param {any[]} data - Any data to send with the event.
*/
function emitToApp(event, ...data) {
  communication.postMessage("emitToApp", {
    event,
    data
  });
}


// Events

/**
 * Fires when the game has finished fetching all the required information.
 * @param {() => void} listener - The callback for when the event fires.
*/
function onGameReady(listener) {
  gameReadyEvent.addListener(listener);
}

/**
 * Fires when the game has finished fetching all the required information.
 * @param {() => void} listener - The callback to remove.
*/
function offGameReady(listener) {
  gameReadyEvent.removeListener(listener);
}


/**
 * Fires when a device is added or removed.
 * @param {(devices: WebDevice[]) => void} listener - The callback for when the event fires.
*/
function onDevicesUpdated(listener) {
  devicesUpdatedEvent.addListener(listener);
}

/**
 * Fires when a device is added or removed.
 * @param {(devices: WebDevice[]) => void} listener - The callback to remove.
*/
function offDevicesUpdated(listener) {
  devicesUpdatedEvent.removeListener(listener);
}


/**
 * Fires when a device sends a message to the app.
 * @param {(event: string, ...data: any[]) => void} listener - The callback for when the event fires.
*/
function onAppMessageReceive(listener) {
  appMessageReceiveEvent.addListener(listener);

  for (let i=0;i<appMessageQueue.length;i++) {
    const messageInfo = appMessageQueue[i];

    appMessageReceiveEvent.fire(messageInfo.event, messageInfo.data);
    window.dispatchEvent(new CustomEvent("deviceMessageReceive", { // For compatibility
      detail: {
        event: messageInfo.event,
        data: messageInfo.data
      }
    }));
  }

  appMessageQueue = [];
}

/**
 * Fires when a app sends a message to this device.
 * @param {(event: string, ...data: any[]) => void} listener - The callback to remove.
*/
function offAppMessageReceive(listener) {
  appMessageReceiveEvent.removeListener(listener);
}


// Handling communication between iframe and player page

function handleMessage(event) {
  if (!event.data || !event.data.fromTinyGames) {
    return;
  }

  const info = event.data;
  
  switch (info.event) {
    case "setParentUrl":
      communication.setParentUrl(info.data);
      break;

    case "setDevices":
      devices = [];
      for (let i=0;i<info.data.length;i++) {
        devices.push(new WebDevice(info.data[i]));
      }

      devicesUpdatedEvent.fire(devices);
      window.dispatchEvent(new CustomEvent("devicesUpdated", { // For compatibility
        detail: {
          devices
        }
      }));
      break;

    case "emitToDevice": {
      const messageInfo = info.data;

      if (appMessageReceiveEvent.getListeners().length == 0) {
        appMessageQueue.push(messageInfo);
        break;
      }

      appMessageReceiveEvent.fire(messageInfo.event, messageInfo.data);
      window.dispatchEvent(new CustomEvent("appMessageReceive", { // For compatibility
        detail: {
          event: messageInfo.event,
          data: messageInfo.data
        }
      }));
      break;
    }
  }
}


function init() {
  window.addEventListener("message", handleMessage);

  let fetchedInfo = false;

  const checkReadyInterval = setInterval(() => {
    if (communication.getParentUrl() && !fetchedInfo) {
      communication.postMessage("getDevices");
      fetchedInfo = true;
    }

    if (gameReady()) {
      clearInterval(checkReadyInterval);

      gameReadyEvent.fire();
      window.dispatchEvent(new CustomEvent("gameReady")); // For compatibility

      communication.postMessage("loaded");
    }
  }, 0);
}

init();


export default {
  // Variables
  getDevices,

  // Functions
  gameReady,

  emitToApp,

  // Events
  onGameReady,
  offGameReady,

  onDevicesUpdated,
  offDevicesUpdated,

  onAppMessageReceive,
  offAppMessageReceive
};
