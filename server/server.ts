import express, { Request, Response } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import path from "node:path";
import upload from "./config/multer";
import dotenv from "dotenv";
import { createClient } from "redis"

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});
const client = createClient({ url: process.env.REDIS_URL })
.on('error', err => console.log('Redis Client Error', err))
.connect();

// Middleware
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Routes
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "hi, rewind!",
  });
});

app.post("/track/upload", upload.single("song") as any, (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    id: req.body.id,
  });
});

// Socket.IO Events
io.on("connection", (socket) => {
  socket.on("join-room", ({ data }: { data: { room: string } }) => {
    socket.join(data.room);
    console.log("User joined the room:", data.room);
    io.to(data.room).emit("joinedUser", { data });
  });

  socket.on("set", (data: any, room: string) => {
    socket.to(room).emit("set", data);
  });

  socket.on("play", (state: any, room: string) => {
    socket.to(room).emit("play", state);
  });

  socket.on("pause", (state: any, room: string) => {
    socket.to(room).emit("pause", state);
  });

  socket.on("timeSeeked", (duration: number, room: string) => {
    socket.to(room).emit("timeSeeked", duration);
  });

  // Debugging: Check rooms and clients
  // io.of('/').adapter.rooms.forEach((clients, room) => {
  //     console.log(`Room: ${room}, Clients: ${[...clients]}`);
  // });
});

// Start Server
const port = process.env.PORT
server.listen(port, () => {
  console.log(`WebSocket server running on ${port}`);
});
