export default class GameEvent {
    listeners: any[];
    addListener(listener: any): void;
    removeListener(listener: any): void;
    fire(...detail: any[]): void;
    getListeners(): any[];
}
