"use client"
import { Slider } from "@/components/ui/slider"
import { Volume1, Volume2, VolumeX } from "lucide-react"
import { getVolume, setVolume } from "./functions"
import { useState, useEffect } from "react"
import { VolumeStorage } from "@/types"

export default function Volume({ audioRef }: {audioRef: any}){
  const [volumeState, setVolumeState] = useState<VolumeStorage>(getVolume())
  const [mute, setMute] = useState<boolean>(false)
  
  const VolumeIcon = () => {
    const volume = Number(volumeState.current)
    if (volume > 0.5) {
      return <Volume2 />
    }
    if (volume > 0){
      return <Volume1 />
    } else {
      return <VolumeX />
    }
  }
  const onChange = (value: number) => {
    audioRef.volume = value
    setVolumeState((prevVolume) => ({ prev: prevVolume.current, current: value }))
    console.log(volumeState)
    setVolume(volumeState.prev, value)
  }

  useEffect(() => {
    if (audioRef) {
      if (mute == true) {
        audioRef.volume = 0
        setVolumeState((prevVolume) => ({ ...prevVolume, current: 0 }))
      } else {
        const vol = getVolume()
        audioRef.volume = vol.current
        setVolumeState((prevVolume) => ({ ...prevVolume, current: vol.current }))
      }
    }
  }, [mute])

  return (
    <div className="hidden sm:flex sm:items-center sm:gap-2">
      <Slider className="w-[80px]" defaultValue={[volumeState.current as number]} max={1} step={0.01} onValueChange={(e) => onChange(e[0])} />
        <button onClick={() => setMute((mute) => !mute)}>
          { VolumeIcon() }
        </button>
    </div>
  )
}