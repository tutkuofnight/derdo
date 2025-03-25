"use client"
import useSocket from "@/hooks/useSocket"
import { DoorOpen, LoaderCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"

import { tracks, listeners, useAtom } from "@/store"

import { Card } from "@/components/Track"
import Listeners from "@/components/Listeners"
import { Button } from "@/components/ui/button"
import { ListenerUser, Song } from "@shared/types"
import { useEffect, useState } from "react"
import { v4 } from "uuid"

export default function Tracklist({ playlist, className, playlistId }: { playlist: any[], className?: string, playlistId?: string }) {
  const [,setTracklist] = useAtom(tracks)
  const [listenerUsers,] = useAtom(listeners)
  const [roomLoading, setRoomLoading] = useState<boolean>(false)
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const { joinRoom } = useSocket()
  
  useEffect(() => {
    setTracklist(playlist)
  }, [])

  const handleCreateRoom = async () => {
    setRoomLoading(true)
    const createRoomId = v4()
    const createRoomInfo = {
      playlist: playlistId || session?.user.id || '',
      creator: {
        id: session?.user.id,
        name: session?.user.name,
        image: session?.user.image
      } as ListenerUser
    }
    await joinRoom(createRoomInfo, createRoomId)
    const link = window.location.origin + "/app/join/" + createRoomId
    window.navigator.clipboard.writeText(link)
    router.push("/app/room/" + session?.user.id)
    toast({
      title: "Invite link copied to clipboard!",
      duration: 2000
    })
    setRoomLoading(false)
  }

  return (
    <section className={className}>
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-bold my-3 p-1 px-2 bg-black text-white dark:bg-gray-100 dark:text-black inline-block rounded-md">{playlistId ? "Tracklist" : "Your All Tracks"}</h1>
          { !pathname.includes("room") && playlist.length > 0 ? <Button variant={"outline"} onClick={handleCreateRoom} disabled={roomLoading}>
            { roomLoading && <LoaderCircle className="animate-spin" /> }
            Create Room
            { !roomLoading && <DoorOpen /> }
          </Button>: null }
          { listenerUsers.length > 0 && <Listeners listeners={listenerUsers} /> }
      </div>
      <div>
        {
          playlist && playlist.length > 0 ? 
            playlist.map((song: Song, index: number) => (
              <Card song={song} key={index} />
            )) : 
          <p>You don't have any uploaded songs your playlist. Please upload before </p>
        }
      </div>
    </section>
  );
}
