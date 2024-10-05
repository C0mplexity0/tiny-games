import communication from "./communication.mjs";

let devices;

let data;


// Classes

class AppDevice {
  constructor (device) {
    for (let property in device) {
      this[property] = device[property];
    }
  }

  remove() {
    communication.postMessage("removeDevice", this.id);

    const i = devices.indexOf(this);
    if (i > -1) {
      devices.splice(i, 1);
    }
  }
}


// Exported functions

function gameReady() {
  if (devices && data && communication.getParentUrl()) {
    return true;
  }

  return false;
}


function getDevices() {
  return devices ? devices : [];
}


function getData(key) {
  if (!data) {
    return;
  }

  return data[key];
}

function setData(key, val) {
  data[key] = val;

  communication.postMessage("setData", data);
}


function emitToDevice(device, event, ...data) {
  communication.postMessage("emitToDevice", {
    event,
    deviceId: device.id,
    data
  });
}

function emitToAllDevices(event, ...data) {
  if (!devices) {
    return;
  }

  for (let i=0;i<devices.length;i++) {
    communication.postMessage("emitToDevice", {
      event,
      deviceId: devices[i].id,
      data
    });
  }
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
    case "setDevices":
      devices = [];
      for (let i=0;i<info.data.length;i++) {
        devices.push(new AppDevice(info.data[i]));
      }

      window.dispatchEvent(new CustomEvent("devicesUpdated", {
        detail: {
          devices
        }
      }));

      break;
    case "emitToApp": {
      const messageInfo = info.data;
      window.dispatchEvent(new CustomEvent("deviceMessageRecieve", {
        detail: {
          event: messageInfo.event,
          device: messageInfo.device,
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
      fetchedInfo = true;
      communication.postMessage("getData");
      communication.postMessage("getDevices");
    }

    if (gameReady()) {
      clearInterval(checkReadyInterval);
      window.dispatchEvent(new CustomEvent("gameReady"));
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
};
