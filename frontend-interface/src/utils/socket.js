// export const SOCKET_SERVER_URL = "http://localhost:8000"; // allows connection from frontend to backend socket server (testing)
export const SOCKET_SERVER_URL = "https://securechatapp-oiky.onrender.com/"; // allows connection from frontend to backend socket server (deployment)

import { io } from "socket.io-client"; // imports io

let socket = null; // declares variable for later use

export const getSocket = () => { // allows for a user to connect to the server
  if (!socket) {
    socket = io(SOCKET_SERVER_URL);
    console.log("Socket.IO connected to backend:", SOCKET_SERVER_URL);
  }
  return socket;
};

export const disconnectSocket = () => { // allows for a user to disconnect to the server
  if (socket) {
    socket.disconnect();
    console.log("Socket.IO disconnected");
    socket = null;
  }
};

// functions from the socket api notes