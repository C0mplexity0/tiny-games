declare namespace _default {
    export { getDevices };
    export { gameReady };
    export { getData };
    export { setData };
    export { emitToDevice };
    export { emitToAllDevices };
    export { onGameReady };
    export { offGameReady };
    export { onDevicesUpdated };
    export { offDevicesUpdated };
    export { onDeviceMessageReceive };
    export { offDeviceMessageReceive };
    export { onGameExiting };
    export { offGameExiting };
}
export default _default;
/**
 * Gets an array of the currently connected devices.
 * @returns {AppDevice[]} The array of devices.
*/
declare function getDevices(): AppDevice[];
/**
 * Checks if the API script has fetched all of the necessary info yet.
 * @returns {boolean} Whether the game is ready yet or not.
*/
declare function gameReady(): boolean;
/**
 * Gets the appropriate save data from the game's save file.
 * @returns {any} The data that has been fetched.
 * @param {string} key - The key for the save data to fetch.
*/
declare function getData(key: string): any;
/**
 * Sets the appropriate save data and saves it to the game's save file.
 * @param {string} key - The key for the data to be saved to.
 * @param {any} val - The value to set the data to.
*/
declare function setData(key: string, val: any): void;
/**
 * Emits a message to a specified device.
 * @param {AppDevice} device - The device to emit to.
 * @param {string} event - The event to emit.
 * @param {any[]} data - Any data to send with the event.
*/
declare function emitToDevice(device: AppDevice, event: string, ...data: any[]): void;
/**
 * Emits a message to all devices.
 * @param {string} event - The event to emit.
 * @param {any[]} data - Any data to send with the event.
*/
declare function emitToAllDevices(event: string, ...data: any[]): void;
/**
 * Fires when the game has finished fetching all the required information.
 * @param {() => void} listener - The callback for when the event fires.
*/
declare function onGameReady(listener: () => void): void;
/**
 * Fires when the game has finished fetching all the required information.
 * @param {() => void} listener - The callback to remove.
*/
declare function offGameReady(listener: () => void): void;
/**
 * Fires when a device is added or removed.
 * @param {(devices: AppDevice[]) => void} listener - The callback for when the event fires.
*/
declare function onDevicesUpdated(listener: (devices: AppDevice[]) => void): void;
/**
 * Fires when a device is added or removed.
 * @param {(devices: AppDevice[]) => void} listener - The callback to remove.
*/
declare function offDevicesUpdated(listener: (devices: AppDevice[]) => void): void;
/**
 * Fires when a device sends a message to the app.
 * @param {(event: string, device: AppDevice, ...data: any[]) => void} listener - The callback for when the event fires.
*/
declare function onDeviceMessageReceive(listener: (event: string, device: AppDevice, ...data: any[]) => void): void;
/**
 * Fires when a device sends a message to the app.
 * @param {(event: string, device?: AppDevice, ...data: any[]) => void} listener - The callback to remove.
*/
declare function offDeviceMessageReceive(listener: (event: string, device?: AppDevice, ...data: any[]) => void): void;
/**
 * Fires when the game is closing.
 * @param {() => void} listener - The callback for when the event fires.
*/
declare function onGameExiting(listener: () => void): void;
/**
 * Fires when the game is closing.
 * @param {() => void} listener - The callback to remove.
*/
declare function offGameExiting(listener: () => void): void;
/**
 * A device which is connected.
*/
declare class AppDevice {
    constructor(device: any);
    /**
     * Remove the device.
    */
    remove(): void;
}
