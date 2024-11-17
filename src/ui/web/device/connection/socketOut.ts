import { socket } from "./socketIn";

function emitJoin(username: string, profileImage?: File) {
  if (username.length < 1) {
    return;
  }

  socket.emit("join", username, profileImage, (status: any) => {
    console.log(status);
  });
}

export default { emitJoin };
