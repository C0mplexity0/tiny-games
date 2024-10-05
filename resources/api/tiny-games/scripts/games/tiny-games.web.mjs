import communication from "./communication.mjs";

let devices;

// Exported Functions

function gameReady() {
  if (devices && communication.getParentUrl()) {
    return true;
  }

  return false;
}

function getDevices() {
  return devices;
}

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
      window.dispatchEvent(new CustomEvent("appMessageRecieve", {
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
