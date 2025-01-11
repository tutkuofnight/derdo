"use client"
import useSocket from "@/hooks/useSocket"
import { StepForward } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"

import { useAtom } from "jotai"
import { tracks, listeners, currentPlaying, playerState } from "@/store"

import { Card, Info } from "@/components/Track"
import Listeners from "@/components/Listeners"
import { Button } from "@/components/ui/button"
import { Song } from "@/types"
import { useEffect } from "react"

export default function Playlist({ playlist, className, playlistName }: { playlist: any[], className?: string, playlistName?: string }) {
  const [,setTracklist] = useAtom(tracks)
  const [listenerUsers,] = useAtom(listeners)
  const [currentTrack,] = useAtom(currentPlaying)
  const [audioPlayerState,setAudioPlayerState] = useAtom(playerState)
  const { setTrack } = useSocket()
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    setTracklist(playlist)
  }, [])

  const handleCreateRoom = () => {
    const link = window.location.origin + "/app/join/" + session?.user.id
    window.navigator.clipboard.writeText(link)
    toast({
      title: "Invite link copied to clipboard!",
      duration: 2000
    })
    router.push("/app/room/" + session?.user.id)
  }

  const handleCardClick = (song: Song) => {
    if (currentTrack?.id === song.id) {
      setAudioPlayerState({ isPlaying: !audioPlayerState?.isPlaying })
    } else {
      setTrack(song)
    }
  }

  return (
    <section className={className}>
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-bold my-3 p-1 px-2 bg-black text-white inline-block rounded-lg">{playlistName ? playlistName : "Your Playlist"}</h1>
          { !pathname.includes("room") && playlist.length > 0 ? <Button variant={"outline"} onClick={handleCreateRoom}>
            Create Room
            <StepForward />
          </Button>: null }
          { listenerUsers.length > 0 && <Listeners listeners={listenerUsers} /> }
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
