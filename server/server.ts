import { ListenerUser } from '@shared/types';
import express, { Request, Response } from "express"
import { createServer } from "node:http"
import { Server } from "socket.io"
import cors from "cors"
import bodyParser from "body-parser"
import path from "node:path"
import dotenv from "dotenv"
import Redis from "ioredis"

dotenv.config();

const app = express();
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
})

// Middleware
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }))
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")))
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

import { trackUpload, trackImageUpload, playlistImageUpload, userImageUpload } from "./config/multer"

// Routes
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "hi, derdo!",
  })
})

app.post("/track/upload/:id", trackUpload.single("song"), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      })
    }

    return res.status(200).json({
      success: true,
      url: req.body.trackUrl
    })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({
      success: false,
      message: "Failed to upload file"
    })
  }
})

app.post("/track/upload/image/:id", trackImageUpload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image file uploaded"
    })
  }
  
  return res.status(200).json({
    success: true,
    url: req.body.imageUrl
  })
})

app.post("/playlist/upload/image/:id", playlistImageUpload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image file uploaded"
    })
  }
  
  return res.status(200).json({
    success: true,
    url: req.body.imageUrl
  })
})
app.post("/user/upload/image/:id", userImageUpload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image file uploaded"
    })
  }
  return res.status(200).json({
    success: true,
    url: req.body.imageUrl
  })
})

// Create redis client
const redisClient = new Redis({
  port: 6379,
  host: "127.0.0.1",
  username: "default",
  password: "admin",
  db: 0,
})

// Socket.IO Events
io.on("connection", (socket) => {
  socket.on("join-room", async ({ data }: { data: { creator: ListenerUser, playlist: string } }, roomId: string) => {
    socket.join(roomId)
    await redisClient.rpush(`room:${roomId}:users`, JSON.stringify(data.creator))
    const roomUsers = await redisClient.lrange(`room:${roomId}:users`, 0, -1)
    console.log(typeof roomUsers, roomUsers)
    io.to(roomId).emit("room-users", { roomUsers })
  })

  socket.on("set", (data: any, room: string) => {
    socket.to(room).emit("set", data)
  })

  socket.on("play", (state: any, room: string) => {
    socket.to(room).emit("play", state)
  })

  socket.on("pause", (state: any, room: string) => {
    socket.to(room).emit("pause", state)
  })

  socket.on("timeSeeked", (duration: number, room: string) => {
    socket.to(room).emit("timeSeeked", duration)
  })

  socket.on("disconnect-room", async (user: ListenerUser, room:string) => {
    await redisClient.lrem(`room:${room}:users`, 0, JSON.stringify(user))
    const roomUsers = await redisClient.lrange(`room:${room}:users`, 0, -1)
    socket.to(room).emit("room-users", { roomUsers })
    socket.disconnect()
  })

  // Debugging: Check rooms and clients
  // io.of('/').adapter.rooms.forEach((clients, room) => {
  //     console.log(`Room: ${room}, Clients: ${[...clients]}`);
  // });
});

app.get("/room/info/:id", async (req: Request, res: Response) => {
  const roomInfo: string = await redisClient.get(`room:${req.params.id}`) as string
  return res.status(200).json({
    room: JSON.parse(roomInfo)
  })
})

// Start Server
const port = process.env.PORT
server.listen(port, () => {
  console.log(`WebSocket server running on ${port}`)
})
