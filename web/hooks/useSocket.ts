"use client"
import { useEffect } from "react"
import io from "socket.io-client" 
import { useSession } from "next-auth/react"
import { currentPlaying, playerState, roomStore } from "@/store"
import { useAtom } from "jotai"
import { ListenerUser, Room, Song } from "@shared/types"

const socket = io(process.env.NEXT_PUBLIC_WS_URL, {
  autoConnect: false,
})

const useSocket = () => {
  const [currentTrack, setCurrentTrack] = useAtom(currentPlaying)
  const [audioPlayerState, setAudioPlayerState] = useAtom(playerState)
  const [room, setRoom] = useAtom(roomStore)
  const { data: session } = useSession()

  useEffect(() => {
    socket.on("joined-room", (data) => {
      console.log(data)
      setRoom(data.room)
    })
    socket.on("set", (data) => {
      setCurrentTrack(data.track)
    })
    socket.on("play", (data) => {
      setAudioPlayerState({ isPlaying: data.state })
    })
    socket.on("pause", (data) => {
      setAudioPlayerState({ isPlaying: data.state })
    })
    socket.on("timeSeeked", (data) => {
      setAudioPlayerState({ currentTime: data.duration })
    })
  }, [])

  const createRoom = (room: Room, user: ListenerUser) => {
    socket.emit("create-room", room, user)
    setRoom(room)
  }

  const joinRoom = (user: ListenerUser) => {
    socket.emit("join-room", user, room)
  }

  const setTrack = (track: Song) => {
    socket.emit("set", track, room)
    setCurrentTrack(track)
  }

  const getRoomMembers = (roomId: string) => {
    socket.emit("room-users", roomId)
  }

  const playMusic = () => {
    socket.emit("play", { state: true }, room)
    setAudioPlayerState({ isPlaying: true })
  }

  const pauseMusic = () => {
    socket.emit("pause", { state: false }, room)
    setAudioPlayerState({ isPlaying: false })
  }

  const timeSeeked = (duration: number) => {
    socket.emit("time-seeked", duration, room)
    setAudioPlayerState({ currentTime: duration })
  }

  const disconnectRoom = (roomId: string) => {
    socket.emit("leave-room", {name: session?.user.name, image: session?.user.email}, roomId)
    socket.disconnect()
  }

  return { createRoom, getRoomMembers, disconnectRoom, joinRoom, setTrack, playMusic, pauseMusic, setAudioPlayerState, timeSeeked, audioPlayerState, currentTrack, socket }
}

export default useSocket
