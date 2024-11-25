// lib/socket.ts
import { io, Socket } from "socket.io-client"

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001"
const MAX_RETRIES = 5
const INITIAL_RETRY_DELAY = 1000

let connectionRetries = 0
let retryTimeout: NodeJS.Timeout

const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: MAX_RETRIES,
  reconnectionDelay: INITIAL_RETRY_DELAY,
  timeout: 20000,
  transports: ["websocket"]
})

const connect = () => {
  if (!socket.connected && !retryTimeout) {
    socket.connect()
  }
}

socket.on("connect", () => {
  connectionRetries = 0
  console.log("Socket connected")
})

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason)
  if (reason === "io server disconnect") {
    connect()
  }
})

socket.on("connect_error", () => {
  connectionRetries++
  
  if (connectionRetries >= MAX_RETRIES) {
    socket.disconnect()
    return
  }

  retryTimeout = setTimeout(() => {
    retryTimeout = undefined
    connect()
  }, Math.min(1000 * Math.pow(2, connectionRetries), 10000))
})

export const emitSocketEvent = (event: string, data: any) => {
  if (socket.connected) {
    socket.emit(event, data)
  }
}

export const onSocketEvent = (event: string, callback: (data: any) => void) => {
  socket.on(event, callback)
  return () => socket.off(event, callback)
}

export const initSocket = () => {
  connect()
  return () => {
    socket.disconnect()
    if (retryTimeout) {
      clearTimeout(retryTimeout)
    }
  }
}

export { socket }