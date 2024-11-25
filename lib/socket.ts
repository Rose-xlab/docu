// lib/socket.ts
import { io, Socket } from "socket.io-client"

interface SocketConfig {
  autoConnect: boolean
  reconnection: boolean
  reconnectionAttempts: number
  reconnectionDelay: number
  reconnectionDelayMax: number
  timeout: number
  transports: string[]
}

interface ServerToClientEvents {
  documentUpdated: (documentId: string) => void
  collaboratorJoined: (userId: string) => void
  collaboratorLeft: (userId: string) => void
  newReaction: (documentId: string, reaction: string) => void
  error: (error: string) => void
}

interface ClientToServerEvents {
  joinDocument: (documentId: string) => void
  leaveDocument: (documentId: string) => void
  updateDocument: (documentId: string, data: any) => void
  addReaction: (documentId: string, reaction: string) => void
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001"

const socketConfig: SocketConfig = {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ["websocket"]
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_URL, socketConfig)

let connectionRetries = 0
const MAX_RETRIES = 5

socket.on("connect", () => {
  console.log("Socket connected successfully")
  connectionRetries = 0
})

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason)
  if (reason === "io server disconnect") {
    socket.connect()
  }
})

socket.on("connect_error", (error) => {
  connectionRetries++
  console.error("Socket connection error:", error)
  
  if (connectionRetries >= MAX_RETRIES) {
    console.error("Max connection retries reached")
    socket.disconnect()
  } else {
    setTimeout(() => {
      socket.connect()
    }, Math.min(1000 * Math.pow(2, connectionRetries), 10000))
  }
})

socket.on("error", (error) => {
  console.error("Socket error:", error)
})

export const emitSocketEvent = <T>(event: keyof ClientToServerEvents, data: T): void => {
  if (socket.connected) {
    socket.emit(event, data)
  } else {
    console.warn(`Socket not connected. Event '${event}' not emitted.`)
  }
}

export const onSocketEvent = <T>(
  event: keyof ServerToClientEvents, 
  callback: (data: T) => void
): () => void => {
  socket.on(event, callback as any)
  return () => {
    socket.off(event, callback as any)
  }
}

export const connectSocket = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (socket.connected) {
      resolve()
      return
    }

    const timeout = setTimeout(() => {
      reject(new Error("Connection timeout"))
    }, socketConfig.timeout)

    socket.connect()

    socket.once("connect", () => {
      clearTimeout(timeout)
      resolve()
    })

    socket.once("connect_error", (error) => {
      clearTimeout(timeout)
      reject(error)
    })
  })
}

export const disconnectSocket = (): void => {
  socket.disconnect()
}

export const socketConnected = (): boolean => socket.connected

export { socket }