"use client"
import Playlist from "@/components/Playlist"
import useSocket from "@/hooks/useSocket"
import { PlayerState, Room } from "@shared/types"
import { useEffect } from "react"

import { useAtom } from "jotai"
import { roomStore, playerStateStore } from "@/store"

export default function RoomClient({ roomId, room, playerState, songs, playlistName }: { roomId:string, room: Room, playerState: PlayerState, songs: any[], playlistName: string }) { 
  const { joinRoom } = useSocket()
  const [, setRoom] = useAtom(roomStore)
  const [, setPlayerStateStore] = useAtom(playerStateStore)
  
  setRoom(room)
  setPlayerStateStore(playerState)
  joinRoom(roomId)

  // useEffect(() => {
  // }, [])

  return (
    <div className="flex">
      <Playlist playlist={songs} className="flex-1" playlistName={playlistName} />
    </div>
  )
}