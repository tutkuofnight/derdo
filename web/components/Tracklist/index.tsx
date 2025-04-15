"use client"
import useSocket from "@/hooks/useSocket"
import { DoorOpen, LoaderCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"

import { tracks, useAtom } from "@/store"

import { Card } from "@/components/Track"
import { Button } from "@/components/ui/button"
import { ListenerUser, Playlist, Song } from "@shared/types"
import { useEffect, useState } from "react"
import { v4 } from "uuid"

export default function Tracklist({ tracklist, className, playlist }: { tracklist: Song[], className?: string, playlist?: Playlist }) {
  const [,setTracklist] = useAtom(tracks)
  const [roomLoading, setRoomLoading] = useState<boolean>(false)
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const { createRoom } = useSocket()
  
  useEffect(() => {
    setTracklist(tracklist)
  }, [])
  
  const handleCreateRoom = async () => {
    if (pathname.includes("room")) return

    setRoomLoading(true)
    const createRoomId = v4()
    const createRoomInfo = {
      playlist: playlist?.id || session?.user.id || '',
      creator: {
        id: session?.user.id,
        name: session?.user.name,
        image: session?.user.image
      } as ListenerUser
    }
    await createRoom(createRoomInfo, createRoomId)
    const link = window.location.origin + "/app/join/" + createRoomId
    router.push("/app/room/" + createRoomId)
    window.navigator.clipboard.writeText(link)
    toast({
      title: "Invite link copied to clipboard!",
      duration: 2000
    })
    setRoomLoading(false)
  }

  return (
    <section className={className}>
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-bold my-3 p-1 px-2 bg-black text-white dark:bg-gray-100 dark:text-black inline-block rounded-md">{playlist?.id ? "Tracklist" : "Your All Tracks"}</h1>
          { !pathname.includes("room") && tracklist.length > 0 ? <Button variant={"outline"} onClick={handleCreateRoom} disabled={roomLoading}>
            { roomLoading && <LoaderCircle className="animate-spin" /> }
            Create Room
            { !roomLoading && <DoorOpen /> }
          </Button>: null }
      </div>
      <div>
        {
          tracklist && tracklist.length > 0 ? 
            tracklist.map((song: Song, index: number) => (
              <Card song={song} key={index} />
            )) : 
          <p>You don't have any uploaded songs your playlist. Please upload before </p>
        }
      </div>
    </section>
  );
}
