import io, { Socket } from "socket.io-client";

export let socket: Socket;

export function initSocket() {
  let url = new URL(window.location.href);
  socket = io(`http://${url.hostname}:8976`, {path: "/socket.io/", withCredentials: true});


  socket.on("ping", (callback) => {
    callback();
  });


  socket.on("joined", (json: string) => {
    let device = JSON.parse(json);
    console.log(device);
  });

  socket.on("reload", () => {
    window.location.reload();
  });
}
