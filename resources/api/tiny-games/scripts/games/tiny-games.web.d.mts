declare namespace _default {
    export { getDevices };
    export { gameReady };
    export { emitToApp };
    export { onGameReady };
    export { offGameReady };
    export { onDevicesUpdated };
    export { offDevicesUpdated };
    export { onAppMessageReceive };
    export { offAppMessageReceive };
}
export default _default;
/**
 * Gets an array of the currently connected devices.
 * @returns {WebDevice[]} The array of devices.
*/
declare function getDevices(): WebDevice[];
/**
 * Checks if the API script has fetched all of the necessary info yet.
*/
declare function gameReady(): boolean;
/**
 * Emits a message to the app.
 * @param {string} event - The event to emit.
 * @param {any[]} data - Any data to send with the event.
*/
declare function emitToApp(event: string, ...data: any[]): void;
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
 * @param {(devices: WebDevice[]) => void} listener - The callback for when the event fires.
*/
declare function onDevicesUpdated(listener: (devices: WebDevice[]) => void): void;
/**
 * Fires when a device is added or removed.
 * @param {(devices: WebDevice[]) => void} listener - The callback to remove.
*/
declare function offDevicesUpdated(listener: (devices: WebDevice[]) => void): void;
/**
 * Fires when a device sends a message to the app.
 * @param {(event: string, device: WebDevice, ...data: any[]) => void} listener - The callback for when the event fires.
*/
declare function onAppMessageReceive(listener: (event: string, device: WebDevice, ...data: any[]) => void): void;
/**
 * Fires when a app sends a message to this device.
 * @param {(event: string, device: WebDevice, ...data: any[]) => void} listener - The callback to remove.
*/
declare function offAppMessageReceive(listener: (event: string, device: WebDevice, ...data: any[]) => void): void;
/**
 * A device which is connected.
*/
declare class WebDevice {
    constructor(device: any);
}
