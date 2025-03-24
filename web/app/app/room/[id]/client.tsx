"use client"
import { useSession } from "next-auth/react"
import useSocket from "@/hooks/useSocket"
import { useEffect } from "react"
import { roomId as roomIdStore, listeners, useAtom } from "@/store"

import Playlist from "@/components/Tracklist"
import { ListenerUser } from "@shared/types"

export default function({ roomId, songs, playlistName }: { roomId: string, songs: any[], playlistName: string }) {
  const [,setRoomIdState] = useAtom(roomIdStore) 
  const [listenerUsers, setListenerUsers] = useAtom(listeners)
  const { data:session } = useSession()
  const { joinRoom, socket } = useSocket()
  
  setRoomIdState(roomId)
  
  useEffect(() => {
    if (session?.user) {
      joinRoom({ user: { name: session?.user.name as string, image: session?.user.image as string }, room: roomId})
      
      socket.on("joinedUser", ({ data }) => {
        const findedUser = listenerUsers.find((item: ListenerUser) => item.name == data.user.name)
        if (!findedUser) {
          setListenerUsers([...listenerUsers, data.user])
        }
      }) 
    }
  }, [session?.user])

  useEffect(() => {
    return () => {
      setListenerUsers([])
    }
  }, [])

  return (
    <div className="flex">
      <Playlist playlist={songs} className="flex-1" playlistName={playlistName} />
    </div>
  )
}