"use client"
import { Slider } from "@/components/ui/slider"
import { Volume1, Volume2, VolumeX } from "lucide-react"
import { getVolume, setVolume } from "./functions"
import { useState, useEffect, Ref } from "react"

export default function Volume({ audioRef }: {audioRef: any}){
  const [volumeState, setVolumeState] = useState<number>(getVolume())
  const [mute, setMute] = useState<boolean>(false)
  
  const VolumeIcon = () => {
    if (volumeState > 0.5) {
      return <Volume2 />
    }
    if (volumeState > 0){
      return <Volume1 />
    } else {
      return <VolumeX />
    }
  }
  const onChange = (value: number) => {
    audioRef.volume = value
    setVolumeState(value)
    setVolume(value)
  }

  useEffect(() => {
    if (audioRef) {
      if (mute == true) {
        audioRef.volume = 0
        setVolumeState(0.00)
      } else {
        const vol = getVolume()
        audioRef.volume = vol
        setVolumeState(vol)
      }
    }
  }, [mute])

  return (
    <div className="hidden sm:flex sm:items-center sm:gap-2">
      <Slider className="w-[80px]" defaultValue={[volumeState]} max={1} step={0.01} onValueChange={(e) => onChange(e[0])} />
        <button onClick={() => setMute(!mute)}>
          { VolumeIcon() }
        </button>
    </div>
  )
}