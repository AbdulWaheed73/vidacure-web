import { io, Socket } from "socket.io-client";

const CHAT_URL = import.meta.env.VITE_CHAT_URL || "http://localhost:3001";

let socket: Socket | null = null;

export function getChatSocket(): Socket {
  if (!socket) {
    socket = io(CHAT_URL, {
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 10000,
    });
  }
  return socket;
}

export function disconnectChatSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getChatUrl(): string {
  return CHAT_URL;
}
