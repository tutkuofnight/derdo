import express, { Request, Response } from "express"
import { createServer } from "node:http"
import { Server } from "socket.io"
import cors from "cors"
import bodyParser from "body-parser"
import path from "node:path"
import upload from "./config/multer"
import dotenv from "dotenv"
import { ListenerUser, Song } from "@shared/types"
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

  socket.on("create-room", async (room, user) => {
    await db.createRoom(room.id, room)
    await db.setRoomMember(room.id, user)
    socket.join(room.id)
  })

  socket.on("join-room", async (user: ListenerUser, roomId: string) => {
    socket.join(roomId)
    await db.setRoomMember(roomId, user)
    const room = await db.getRoom(roomId)
    socket.to(roomId).emit("joined-room", room)
  })
  
  socket.on("room-users", async (roomId: string) => {
    setTimeout(async () => {
      const users = await db.getRoomMembers(roomId)
      socket.to(roomId).emit("room-users", users)
    }, 200)
  })

  socket.on("set", async (track: Song, room: string) => {
    await db.setRoomCurrentTrack(room, track)
    socket.to(room).emit("set", track)
  })

  socket.on("play", async (state: boolean, roomId: string) => {
    await db.setPlayerState(roomId, { isPlaying: state })
    socket.to(roomId).emit("play", state)
  })

  socket.on("pause", async (state: boolean, roomId: string) => {
    await db.setPlayerState(roomId, { isPlaying: state })
    socket.to(roomId).emit("pause", state)
  })

  socket.on("timeSeeked", async (duration: number, roomId: string) => {
    await db.setPlayerState(roomId, { currentTime: duration })
    socket.to(roomId).emit("timeSeeked", duration)
  })

  socket.on("leave-room", async (user: ListenerUser, roomId: string) => {
    await db.removeRoomMember(roomId, user)
  })

  // Debugging: Check rooms and clients
  // io.of('/').adapter.rooms.forEach((clients, room) => {
  //     console.log(`Room: ${room}, Clients: ${[...clients]}`);
  // });
})

// Start Server
const port = process.env.PORT
server.listen(port, () => {
  console.log(`WebSocket server running on ${port}`)
})
