"use client"
import { Song } from "@/types"
import { Play, Pause, Repeat, Repeat1, Ellipsis } from "lucide-react"
import { currentPlaying, playerState } from "@/store"
import { useAtom } from "jotai"
import { useState, useEffect } from "react"
import TrackImage from "../controllers/TrackImage"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export const Info = ({ song, insideCard = false }: { song: Song, insideCard?: boolean }) => {
  const { activeTrack } = useActiveTrack(song.id)
  const stylingCondition = insideCard ? (activeTrack ? "text-white dark:text-black" : "text-black dark:text-white"): "text-black dark:text-white"

  return (
    <div>
      <p className={`font-bold text-left ${stylingCondition}`}>{song.name}</p>
      <div className="flex gap-1 pb-1">
      <span className={`text-xs ${stylingCondition}`}>{song.artist}</span>
      {
        song.featurings && <div className={`text-xs ${stylingCondition}`}>Feat: {song.featurings}</div>
      }
      </div>
    </div>
  )
}

export const Card = ({ song }: { song: Song }) => {
  const { activeTrack } = useActiveTrack(song.id)
  const [audioPlayerState,setAudioPlayerState] = useAtom(playerState)
  const [currentTrack,setCurrentTrack] = useAtom(currentPlaying)
  const activeCard = activeTrack ? "bg-black dark:bg-gray-100 *:text-white rounded-md hover:bg-gray-800 hover:dark:bg-opacity-80" : "bg-transparent *:text-black"

  const handleCardClick = (song: Song) => {
    if (currentTrack?.id === song.id) {
      setAudioPlayerState({ isPlaying: !audioPlayerState?.isPlaying })
    } else {
      setCurrentTrack(song)
    }
  }

  const handleRepeat = () => {
    setAudioPlayerState({ ...audioPlayerState, repeat: !audioPlayerState?.repeat })
  }

  return (
    <div className={`flex items-center justify-between border-b p-2 px-4 hover:bg-gray-100 hover:dark:bg-white hover:dark:bg-opacity-10 hover:rounded-md transition-colors ${activeCard}`}>
      <button className="flex items-center gap-4" onClick={() => handleCardClick(song)}>
        { activeTrack && audioPlayerState?.isPlaying ? <Pause className={activeTrack ? "text-white dark:text-black" : "text-black dark:text-white"} /> : <Play className={activeTrack ? "text-white dark:text-black" : "text-black dark:text-white"} /> }
        <div className="flex items-center gap-2">
          <TrackImage url={song.imageurl} className="w-[40px] h-[40px]" />
          <Info song={song} insideCard={true} />
        </div>
      </button>
      <div className="flex items-center">
        <div className={`${activeTrack ? 'flex items-center sm:hidden': 'hidden'}`}>
          {audioPlayerState?.repeat ? (
            <button onClick={handleRepeat}>
              <Repeat1 className="w-[22px] h-[22px] text-white dark:text-black" />
            </button>
          ): (
            <button onClick={handleRepeat}>
              <Repeat className="w-[22px] h-[22px] text-white dark:text-black" />
            </button>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-[20px]">
              <Ellipsis className="text-black dark:text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Song Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Email</DropdownMenuItem>
                    <DropdownMenuItem>Message</DropdownMenuItem>
                    <DropdownMenuItem>More...</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Update Info
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Delete Track
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

const useActiveTrack = (trackId: string) => {
  const [currentTrack,] = useAtom(currentPlaying)
  const [activeTrack, setActiveTrack] = useState(false)
  useEffect(() => {
    if (currentTrack?.id == trackId) {
      setActiveTrack(true)
    } else {
      setActiveTrack(false)
    }
  }, [currentTrack?.id])
  return { activeTrack, currentTrack }
}