import communication from "./communication.mjs";

let devices;

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

function getWebDeviceFromDevice(device) {

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

      window.dispatchEvent(new CustomEvent("devicesUpdated", {
        detail: {
          devices
        }
      }));

      break;
    case "emitToDevice": {
      const messageInfo = info.data;
      window.dispatchEvent(new CustomEvent("appMessageReceive", {
        detail: {
          event: messageInfo.event,
          device: getWebDeviceFromDevice(messageInfo.device),
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
      window.dispatchEvent(new CustomEvent("gameReady"));
    }
  }, 0);
}

init();


export default {
  gameReady,

  getDevices,

  emitToApp
};
