"use client"
import { useEffect } from "react"
import io from "socket.io-client" 
import { useSession } from "next-auth/react"
import { currentPlaying, playerStateStore, roomStore } from "@/store"
import { useAtom } from "jotai"
import { ListenerUser, Room, Song } from "@shared/types"

const socket = io(process.env.NEXT_PUBLIC_WS_URL)

const useSocket = () => {
  const [currentTrack, setCurrentTrack] = useAtom(currentPlaying)
  const [audioPlayerState, setAudioPlayerState] = useAtom(playerStateStore)
  const [room, setRoom] = useAtom(roomStore)
  const { data: session } = useSession()

  useEffect(() => {
    socket.on("set", (data) => {
      setCurrentTrack(data.track)
    })
    socket.on("play", (data) => {
      setAudioPlayerState({ isPlaying: data.state })
    })
    socket.on("pause", (data) => {
      setAudioPlayerState({ isPlaying: data.state })
    })
    socket.on("current-track-time", (data) => {
      setAudioPlayerState({ ...audioPlayerState, currentTime: data })
    })
    socket.on("time-seeked", (data) => {
      setAudioPlayerState({ currentTime: data.duration })
    })
  }, [])

  const createRoom = (room: Room) => {
    setRoom(room)
    socket.emit("create-room", room)
  }

  const joinRoom = (roomId: string) => {
    const user: ListenerUser = {
      name: session?.user.name!,
      image: session?.user.image!
    }
    socket.emit("join-room", user, roomId)
  }

  const setTrack = (track: Song) => {
    socket.emit("set", track, room?.id)
    setCurrentTrack(track)
  }

  const getRoomMembers = (roomId: string) => {
    socket.emit("room-users", roomId)
  }

  const playMusic = () => {
    socket.emit("play", { state: true }, room?.id)
    setAudioPlayerState({ isPlaying: true })
  }

  const pauseMusic = () => {
    socket.emit("pause", { state: false }, room?.id)
    setAudioPlayerState({ isPlaying: false })
  }

  const timeSeeked = (duration: number) => {
    socket.emit("time-seeked", duration, room?.id)
    setAudioPlayerState({ currentTime: duration })
  }

  const disconnectRoom = (roomId: string) => {
    socket.emit("leave-room", {name: session?.user.name, image: session?.user.email}, roomId)
    socket.disconnect()
  }

  return { createRoom, getRoomMembers, disconnectRoom, joinRoom, setTrack, playMusic, pauseMusic, setAudioPlayerState, timeSeeked, audioPlayerState, currentTrack, socket }
}

export default useSocket
