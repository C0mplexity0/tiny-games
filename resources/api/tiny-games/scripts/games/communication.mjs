let parentUrl;


function setParentUrl(url) {
  parentUrl = url;
}

function getParentUrl() {
  return parentUrl;
}


function postMessage(event, data) {
  try {
    window.parent.postMessage({fromTinyGames: true, event, data}, parentUrl);
  } catch(err) {
    console.warn("Failed to send message from iframe to main page");
    console.error(err);
  }
}

export default {
  setParentUrl,
  getParentUrl,

  postMessage,
};
