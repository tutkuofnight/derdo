"use client"
import { useEffect } from "react"
import io from "socket.io-client" 

import { currentPlaying, playerState, roomId, useAtom } from "@/store"
import { ListenerUser, Song } from "@shared/types"

const socket = io(process.env.NEXT_PUBLIC_WS_URL)

const useSocket = () => {
  const [currentTrack, setCurrentTrack] = useAtom(currentPlaying)
  const [audioPlayerState, setAudioPlayerState] = useAtom(playerState)
  const [room, setRoom] = useAtom(roomId)

  useEffect(() => {
    socket.on("set", async (data) => {
      setCurrentTrack(data.song)
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

  const createRoom = async (data: { creator: ListenerUser, playlist: string }, roomId: string) => {
    socket.emit("create-room", { data }, roomId)
  }

  const joinRoom = async (user: ListenerUser, roomId: string) => {
    socket.emit("join-room", { user }, roomId)
  }

  const setTrack = (song: Song) => {
    socket.emit("set", { song }, room)
    setCurrentTrack(song)
    playMusic()
  }

  const playMusic = () => {
    socket.emit("play", { state: true }, room)
    setAudioPlayerState({ isPlaying: true })
  }

  const pauseMusic = () => {
    socket.emit("pause", { state: false }, room)
    setAudioPlayerState({ isPlaying: false })
  }

  const timeSeeked = (duration: any) => {
    socket.emit("timeSeeked", { duration }, room)
    setAudioPlayerState({ currentTime: duration })
  }
  const leaveRoom = (user: ListenerUser, roomId: string) => {
    socket.emit("disconnect-room", { user }, roomId)
    socket.disconnect()
  }
  return { createRoom, joinRoom, setTrack, playMusic, pauseMusic, setAudioPlayerState, timeSeeked, leaveRoom, audioPlayerState, currentTrack, socket }
}

export default useSocket
