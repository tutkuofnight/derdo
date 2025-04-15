"use client"
import { useSession } from "next-auth/react"
import useSocket from "@/hooks/useSocket"
import { useEffect, useState } from "react"

import Tracklist from "@/components/Tracklist"
import Listeners from "@/components/Listeners"

import { Playlist } from "@shared/types"


export default function({ roomId, songs, playlist }: { roomId: string, songs: any[], playlist: Playlist }) {
  const [listenerUsers, setListenerUsers] = useState<any[]>([])
  const { data:session } = useSession()
  const { socket, joinRoom, leaveRoom } = useSocket()
  
  useEffect(() => {
    if (session?.user && socket) {
      socket.on("room-users", ({ roomUsers }) => {
        setListenerUsers(roomUsers.map((item: string) => JSON.parse(item)))
      })

      return () => {
        socket.off("room-users")
      }
    }
  }, [session?.user, socket])

  useEffect(() => {
    joinRoom({ id: session?.user.id!, name: session?.user.name!, image: session?.user.image! }, roomId)

    return () => {
      leaveRoom({ id: session?.user.id!, name: session?.user.name!, image: session?.user.image! }, roomId)
      setListenerUsers([])
    }
  }, [])

  return (
    <div>
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between pb-[32px] pt-4">
        <h1 className="text-4xl font-bold">{playlist.name}</h1>
        <Listeners listeners={listenerUsers} />
      </div>
      <Tracklist tracklist={songs} className="flex-1" playlist={playlist} />
    </div>
  )
}