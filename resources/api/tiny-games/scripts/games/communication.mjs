let parentUrl;


function setParentUrl(url) {
  parentUrl = url;
}

function getParentUrl() {
  return parentUrl;
}


function postMessage(event, data) {
  window.parent.postMessage({fromTinyGames: true, event, data}, parentUrl);
}

export default {
  setParentUrl,
  getParentUrl,

  postMessage,
}
