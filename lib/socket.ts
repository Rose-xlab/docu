// lib/socket.ts
import { io } from "socket.io-client"

// Get the WebSocket URL from environment variables or use a default
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001"

// Create socket instance with configuration
export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ["websocket"],
})

// Socket event listeners
socket.on("connect", () => {
  console.log("Socket connected")
})

socket.on("disconnect", () => {
  console.log("Socket disconnected")
})

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error)
})

// Export event emitter and listener helpers
export const emitSocketEvent = (event: string, data: any) => {
  if (socket.connected) {
    socket.emit(event, data)
  } else {
    console.warn("Socket not connected. Event not emitted:", event)
  }
}

export const onSocketEvent = (event: string, callback: (data: any) => void) => {
  socket.on(event, callback)
  return () => {
    socket.off(event, callback)
  }
}

export const socketConnected = () => socket.connected