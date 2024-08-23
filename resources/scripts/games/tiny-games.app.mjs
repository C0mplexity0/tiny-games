// Exported Events

const onGameReady = new CustomEvent("gameReady");


// Exported Variables

let devices;


function getDevices() {
  return devices ? devices : [];
}


// Exported functions

function gameReady() {
  if (devices) {
    return true;
  }

  return false;
}

function emitToDevice(device, event, ...data) {
  postMessage("emitToDevice", JSON.stringify({
    event,
    deviceId: device.id,
    data
  }));
}

function emitToAllDevices(event, ...data) {
  if (!devices) {
    return;
  }

  for (let i=0;i<devices.length;i++) {
    postMessage("emitToDevice", JSON.stringify({
      event,
      deviceId: devices[i].id,
      data
    }));
  }
}


// Handling communication between iframe and player page

function postMessage(type, data) {
  window.parent.postMessage(`${type}${data ? ":" + data : ""}`, "http://localhost:8977");
}

function getMessageParts(msg) {
  let split = msg.split(":");

  const type = split.shift();

  return [type, split.join(":")];
}

function handleMessage(event) {
  const [messageType, messageData] = getMessageParts(event.data);
  
  switch (messageType) {
    case "setDevices":
      devices = JSON.parse(messageData);
      break;
  }
}



function init() {
  window.addEventListener("message", handleMessage);

  postMessage("getDevices");

  const checkReadyInterval = setInterval(() => {
    if (gameReady()) {
      clearInterval(checkReadyInterval);
      window.dispatchEvent(onGameReady);
    }
  }, 0);
}

init();



export default {
  // Variables
  getDevices,


  // Functions
  gameReady,

  emitToDevice,
  emitToAllDevices,
};
