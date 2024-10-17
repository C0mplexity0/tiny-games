import communication from "./communication.mjs";

let devices;

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
 * @returns {any[] | undefined}
*/
function getDevices() {
  return devices;
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
      devices = info;
      break;
    case "emitToDevice": { 
      window.dispatchEvent(new CustomEvent("appMessageReceive", {
        detail: info.data
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
