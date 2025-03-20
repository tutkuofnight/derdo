"use client"
import { VolumeStorage } from "@/types"

export const getVolume = (): VolumeStorage => {
  let volume: VolumeStorage  = JSON.parse(localStorage.getItem("vol")!)
  if (volume){
    return {prev: parseFloat(volume.prev as string), current: parseFloat(volume.current as string)}
  }
  return { prev: 0, current: 0 }
}

export const setVolume = (previousValue: string | number | null, audioRef: any) => {
  const volume = getVolume()

  if (audioRef.current) {
    localStorage.setItem("vol", JSON.stringify({
      prev: previousValue?.toString(),
      current: audioRef.current?.volume.toString()
    }))
  }
}