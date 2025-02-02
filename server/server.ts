import express, { Request, Response } from "express"
import { createServer } from "node:http"
import { Server } from "socket.io"
import cors from "cors"
import bodyParser from "body-parser"
import path from "node:path"
import upload from "./config/multer"
import dotenv from "dotenv"
import { ListenerUser, Song, Room } from "@shared/types"
import RedisService from "./services/RedisService"
dotenv.config()

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
})

// Middlewares
app.use(express.json())
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }))
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")))
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Routes
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "hi, derdo!",
  })
})

app.post("/track/upload", upload.single("song") as any, (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    id: req.body.id,
  })
})

// Socket.IO Events
io.on("connection", (socket) => {
  const db = new RedisService()
  console.log("a user connected")

  socket.on("create-room", async (room: Room, user: ListenerUser) => {
    await db.setUserToList(user, room.id, socket.id)
    const result = await db.createRoom(room)
    io.to(socket.id).emit("room-created", result)
  })

  socket.on("join-room", async (user: ListenerUser, roomId: string) => {
    socket.join(roomId)
    const res = await db.setUserToList(user, roomId, socket.id)
    if (res) {
      const playerCurrentTime = await db.getPlayerCurrentTime(roomId)
      const users = await db.listRoomUsers(roomId)
      io.to(socket.id).emit("current-track-time", playerCurrentTime)
      io.to(roomId).emit("room-users", users)
    }
  })

  socket.on("set", async (track: Song, roomId: string) => {
    await db.setPlayerState({ currentTrack: track }, roomId)
    socket.to(roomId).emit("set", track)
  })

  socket.on("play", async (state: boolean, roomId: string) => {
    await db.setPlayerState({ isPlaying: state }, roomId)
    socket.to(roomId).emit("play", state)
  })

  socket.on("pause", async (state: boolean, roomId: string) => {
    await db.setPlayerState({ isPlaying: state }, roomId)
    socket.to(roomId).emit("pause", state)
  })

  socket.on("time-seeked", async (duration: number, roomId: string) => {
    await db.setPlayerState({ currentTime: duration }, roomId)
    socket.to(roomId).emit("time-seeked", duration)
  })
  socket.on('room-users', async (roomId: string) => {
    const userlist = await db.listRoomUsers(roomId)
    io.to(roomId).emit('room-users', userlist)
  })

  socket.on('leave-room', async (roomId: string) => {
    await db.removeUserFromList(socket.id, roomId)

    const userlist = await db.listRoomUsers(roomId)
    io.to(roomId).emit("room-users", userlist)
    
    socket.disconnect()
  })
  // Debugging: Check rooms and clients
  io.of('/').adapter.rooms.forEach((clients, room) => {
      console.log(`Room: ${room}, Clients: ${[...clients]}`);
  });
})

// Start Server
const port = process.env.PORT
server.listen(port, () => {
  console.log(`WebSocket server running on ${port}`)
})
