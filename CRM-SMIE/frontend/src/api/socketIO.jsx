import { io } from "socket.io-client";

let socket;

export const initSocket = (userId, role) => {
  socket = io(import.meta.env.VITE_BACKEND_URL, {
    auth: { userId, role },
  });

  socket.on("connect", () => {
    console.log("Connected to socket server with ID:", socket.id);
  });

  return socket;
};

export const getSocket = () => socket;
