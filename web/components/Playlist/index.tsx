"use client"
import useSocket from "@/hooks/useSocket"
import { usePathname } from "next/navigation"

import { useAtom } from "jotai"
import { tracks, listeners, currentPlaying, playerState, roomStore } from "@/store"

import { Card, Info } from "@/components/Track"
import Listeners from "@/components/Listeners"
import { ListenerUser, Song } from "@shared/types"
import { useEffect } from "react"
import CreateRoom from "../CreateRoom"
import { Button } from "../ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Playlist({ playlist, className, playlistName }: { playlist: any[], className?: string, playlistName?: string }) {
  const [,setTracklist] = useAtom(tracks)
  const [listenerUsers,] = useAtom(listeners)
  const [currentTrack,] = useAtom(currentPlaying)
  const [audioPlayerState,setAudioPlayerState] = useAtom(playerState)
  const { setTrack, disconnectRoom } = useSocket()
  const [room,] = useAtom(roomStore)
  const router = useRouter()
  
  const pathname = usePathname()
  
  useEffect(() => {
    setTracklist(playlist)
  }, [])

  const handleCardClick = (song: Song) => {
    if (currentTrack?.id === song.id) {
      setAudioPlayerState({ isPlaying: !audioPlayerState?.isPlaying })
    } else {
      setTrack(song)
    }
  }

  const leaveRoom = () => {
    disconnectRoom(room?.id!)
    router.push("/app")
  }

  return (
    <section className={className}>
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-bold my-3 p-1 px-2 bg-black text-white dark:bg-gray-100 dark:text-black inline-block rounded-lg">{playlistName ? playlistName : "Your Playlist"}</h1>
          { !pathname.includes("room") && playlist.length > 0 ? <CreateRoom /> : 
          <Button size={"icon"} onClick={leaveRoom}>
            <LogOut />
          </Button> }
          <Listeners />
      </div>
      <div>
        {playlist.map((song: any, index: number) => (
          <button className="w-full cursor-pointer" key={index} onClick={() => handleCardClick(song)}>
            <Card trackId={song.id}>
              <Info song={song} />
            </Card>
          </button>
        ))}
      </div>
      { !playlist && <p>You don't have any uploaded songs your playlist. Please upload before </p> }
    </section>
  );
}
