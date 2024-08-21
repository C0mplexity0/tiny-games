import { socket } from "./socketIn";

function emitJoin(username: string) {
  if (username.length < 1) {
    return;
  }

  socket.emit("join", username);
}

export default { emitJoin };
