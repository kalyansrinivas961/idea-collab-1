import { io } from "socket.io-client";

const socket = io("https://idea-collab-backend.onrender.com", {
  transports: ["websocket"], // avoids polling issues
});

export default socket;