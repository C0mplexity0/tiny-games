import { socket } from "./in";

export function emitJoin(username: string) {
  if (username.length < 1) {
    return;
  }

  socket.emit("join", username);
}
