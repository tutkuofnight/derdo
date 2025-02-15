import express, { Request, Response } from "express"
import { createServer } from "node:http"
import { Server } from "socket.io"
import cors from "cors"
import bodyParser from "body-parser"
import path from "node:path"
import dotenv from "dotenv"
import { createClient } from "redis"

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
const client = createClient({ url: process.env.REDIS_URL })
.on('error', err => console.log('Redis Client Error', err))
.connect()

// Middleware
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }))
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")))
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

import { trackUpload, trackImageUpload, playlistImageUpload } from "./config/multer"

// Routes
app.get("/", (req: Request, res: Response) => {
  console.log()
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

// Socket.IO Events
io.on("connection", (socket) => {
  socket.on("join-room", ({ data }: { data: { room: string } }) => {
    socket.join(data.room)
    console.log("User joined the room:", data.room)
    io.to(data.room).emit("joinedUser", { data })
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

  // Debugging: Check rooms and clients
  // io.of('/').adapter.rooms.forEach((clients, room) => {
  //     console.log(`Room: ${room}, Clients: ${[...clients]}`);
  // });
});

// Start Server
const port = process.env.PORT
server.listen(port, () => {
  console.log(`WebSocket server running on ${port}`)
})
