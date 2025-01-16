"use client"
import { Song } from "@shared/types"
import { Play, Pause } from "lucide-react"
import { currentPlaying, playerState } from "@/store"
import { useAtom } from "jotai"
import React, { useState, useEffect } from "react"

export const Info = ({ song }: { song: Song }) => {
  const { activeTrack } = useActiveTrack(song.id)
  return (
    <div>
      <p className={`font-bold text-left ${activeTrack ? "text-white dark:text-black" : "text-black dark:text-white"}`}>{song.name}</p>
      <div className="flex gap-1">
      <span className={`text-xs ${activeTrack ? "text-white dark:text-black" : "text-black dark:text-white"}`}>{song.artist}</span>
      {
        song.featurings && <div className={`text-xs ${activeTrack ? "text-white dark:text-black" : "text-black dark:text-white"}`}>Feat: {song.featurings}</div>
      }
      </div>
    </div>
  )
}

export const Card = ({ children, trackId }: { children: React.ReactNode, trackId: string }) => {
  const { activeTrack } = useActiveTrack(trackId)
  const [audioPlayerState,] = useAtom(playerState)
  const activeCard = activeTrack ? "bg-black dark:bg-gray-100 *:text-white rounded-md hover:bg-gray-800 hover:dark:bg-opacity-80" : "bg-transparent *:text-black"
  return (
    <div className={`border-b p-2 px-4 hover:bg-gray-100 hover:dark:bg-white hover:dark:bg-opacity-10 hover:rounded-md transition-colors ${activeCard}`}>
      <div className="flex items-center gap-4">
        { activeTrack && audioPlayerState?.isPlaying ? <Pause className={activeTrack ? "text-white dark:text-black" : "text-black dark:text-white"} /> : <Play className={activeTrack ? "text-white dark:text-black" : "text-black dark:text-white"} /> }
        { children }
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