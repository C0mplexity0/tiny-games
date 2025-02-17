import communication from "./communication.mjs";
import GameEvent from "./events.mjs";

let devices;

let data;


// Events

const gameReadyEvent = new GameEvent();
const devicesUpdatedEvent = new GameEvent();
const deviceMessageReceiveEvent = new GameEvent();
const gameExitingEvent = new GameEvent();


// Classes

/**
 * A device which is connected.
*/
class AppDevice {
  constructor (device) {
    for (let property in device) {
      this[property] = device[property];
    }
  }

  /**
   * Remove the device.
  */
  remove() {
    communication.postMessage("removeDevice", this.id);

    const i = devices.indexOf(this);
    if (i > -1) {
      devices.splice(i, 1);
    }
  }
}

function getAppDeviceFromDevice(device) {

  if (!devices) {
    return;
  }

  const id = device.id;

  for (let i=0;i<devices.length;i++) {
    if (devices[i].id === id) {
      return devices[i];
    }
  }

  return;
}


// Exported functions

/**
 * Checks if the API script has fetched all of the necessary info yet.
 * @returns {boolean} Whether the game is ready yet or not.
*/
function gameReady() {
  if (devices && data && communication.getParentUrl()) {
    return true;
  }

  return false;
}

/**
 * Gets an array of the currently connected devices.
 * @returns {AppDevice[]} The array of devices.
*/
function getDevices() {
  return devices ? devices : [];
}

/**
 * Gets the appropriate save data from the game's save file.
 * @returns {any} The data that has been fetched.
 * @param {string} key - The key for the save data to fetch.
*/
function getData(key) {
  if (!data) {
    return;
  }

  return data[key];
}

/**
 * Sets the appropriate save data and saves it to the game's save file.
 * @param {string} key - The key for the data to be saved to.
 * @param {any} val - The value to set the data to.
*/
function setData(key, val) {
  data[key] = val;

  communication.postMessage("setData", data);
}

/**
 * Emits a message to a specified device.
 * @param {AppDevice} device - The device to emit to.
 * @param {string} event - The event to emit.
 * @param {any[]} data - Any data to send with the event.
*/
function emitToDevice(device, event, ...data) {
  communication.postMessage("emitToDevice", {
    event,
    deviceId: device.id,
    data
  });
}

/**
 * Emits a message to all devices.
 * @param {string} event - The event to emit.
 * @param {any[]} data - Any data to send with the event.
*/
function emitToAllDevices(event, ...data) {
  if (!devices) {
    return;
  }

  for (let i=0;i<devices.length;i++) {
    emitToDevice(devices[i], event, ...data);
  }
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
 * @param {(devices: AppDevice[]) => void} listener - The callback for when the event fires.
*/
function onDevicesUpdated(listener) {
  devicesUpdatedEvent.addListener(listener);
}

/**
 * Fires when a device is added or removed.
 * @param {(devices: AppDevice[]) => void} listener - The callback to remove.
*/
function offDevicesUpdated(listener) {
  devicesUpdatedEvent.removeListener(listener);
}


/**
 * Fires when a device sends a message to the app.
 * @param {(event: string, device: AppDevice, ...data: any[]) => void} listener - The callback for when the event fires.
*/
function onDeviceMessageReceive(listener) {
  deviceMessageReceiveEvent.addListener(listener);
}

/**
 * Fires when a device sends a message to the app.
 * @param {(event: string, device?: AppDevice, ...data: any[]) => void} listener - The callback to remove.
*/
function offDeviceMessageReceive(listener) {
  deviceMessageReceiveEvent.removeListener(listener);
}


/**
 * Fires when the game is closing.
 * @param {() => void} listener - The callback for when the event fires.
*/
function onGameExiting(listener) {
  gameExitingEvent.addListener(listener);
}

/**
 * Fires when the game is closing.
 * @param {() => void} listener - The callback to remove.
*/
function offGameExiting(listener) {
  gameExitingEvent.removeListener(listener);
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
    case "setData":
      data = info.data;
      break;
    case "setDevices": {
      devices = [];
      for (let i=0;i<info.data.length;i++) {
        devices.push(new AppDevice(info.data[i]));
      }

      devicesUpdatedEvent.fire(devices);
      window.dispatchEvent(new CustomEvent("devicesUpdated", { // For compatibility
        detail: {
          devices
        }
      }));

      break;
    }
    case "emitToApp": {
      const messageInfo = info.data;

      const appDevice = getAppDeviceFromDevice(messageInfo.device);

      deviceMessageReceiveEvent.fire(appDevice, messageInfo.event, messageInfo.data);
      window.dispatchEvent(new CustomEvent("deviceMessageReceive", { // For compatibility
        detail: {
          device: appDevice,
          event: messageInfo.event,
          data: messageInfo.data
        }
      }));
      break; 
    }
    case "gameExiting":
      window.dispatchEvent(new CustomEvent("gameExiting")); // For compatibility
  }
}



function init() {
  window.addEventListener("message", handleMessage);

  let fetchedInfo = false;

  const checkReadyInterval = setInterval(() => {
    if (communication.getParentUrl() && !fetchedInfo) {
      fetchedInfo = true;
      communication.postMessage("getData");
      communication.postMessage("getDevices");
    }

    if (gameReady()) {
      clearInterval(checkReadyInterval);

      gameReadyEvent.fire();
      window.dispatchEvent(new CustomEvent("gameReady")); // For compatibility
    }
  }, 0);
}

init();



export default {
  // Variables
  getDevices,


  // Functions
  gameReady,

  getData,
  setData,

  emitToDevice,
  emitToAllDevices,

  // Events
  onGameReady,
  offGameReady,
  
  onDevicesUpdated,
  offDevicesUpdated,

  onDeviceMessageReceive,
  offDeviceMessageReceive,

  onGameExiting,
  offGameExiting
};
