export default class GameEvent {
  constructor() {
    this.listeners = [];
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    const i = this.listeners.indexOf(listener);

    if (i > -1) {
      this.listeners.splice(i, 1);
    }
  }

  fire(...detail) {
    for (let i=0;i<this.listeners.length;i++) {
      this.listeners[i](...detail);
    }
  }

  getListeners() {
    return this.listeners;
  }
}
