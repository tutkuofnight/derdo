"use client"
import { Song } from "@/types"
import { Play, Pause } from "lucide-react"
import { currentPlaying, playerState } from "@/store"
import { useAtom } from "jotai"
import React from "react"

export const Info = ({ song }: { song: Song }) => {
  return (
    <div>
      <p className="font-bold">{song.name}</p>
      <div className="flex gap-1">
      <span className="text-xs">{song.artist}</span>
      {
        song.featurings && <div className="text-xs">Feat: {song.featurings}</div>
      }
      </div>
    </div>
  )
}

export const Card = ({ children, trackId }: { children: React.ReactNode, trackId: string }) => {
  const [currentTrack,] = useAtom(currentPlaying)
  const [audioPlayerState,] = useAtom(playerState)
  const activeCard = currentTrack?.id == trackId ? "bg-black *:text-white rounded-md hover:bg-gray-800" : "bg-transparent *:text-black"
  
  return (
    <div className={`border-b p-2 px-4 hover:bg-gray-100 hover:rounded-md transition-colors ${activeCard}`}>
      <div className="flex items-center gap-4">
        { currentTrack?.id == trackId && audioPlayerState?.isPlaying ? <Pause /> : <Play /> }
        { children }
      </div>
    </div>
  )
}