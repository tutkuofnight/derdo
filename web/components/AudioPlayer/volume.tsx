"use client"
import { Slider } from "@/components/ui/slider"
import { Volume1, Volume2, VolumeX } from "lucide-react"
import { getVolume, setVolume } from "./functions"
import { useState, useEffect, useRef } from "react"
import { VolumeStorage } from "@shared/types"

export default function Volume({ audioRef }: {audioRef: any}){
  const [volumeState, setVolumeState] = useState<VolumeStorage>(getVolume())
  const [mute, setMute] = useState<boolean>(false)
  const prevVolume = useRef<number | null>(null)

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
    if (mute) {
      setMute(false)
    }

    const currentVolumeValue = typeof volumeState.current === 'number' ? volumeState.current : 0;
    
    audioRef.volume = value;
    
    const newVolumeState = { 
      prev: currentVolumeValue,
      current: value 
    };
    
    prevVolume.current = currentVolumeValue;
    
    setVolumeState(newVolumeState);
    setVolume(newVolumeState);

  }

  useEffect(() => {
    if (audioRef) {
      if (mute) {
        const currentVolume = volumeState.current as number || 0;
        audioRef.volume = 0;
        setVolumeState({ prev: currentVolume, current: 0 });
      } else {
        const vol = getVolume();
        audioRef.volume = vol.current;
        setVolumeState({ prev: vol.prev, current: vol.current });
      }
    }
  }, [mute, audioRef]);

  return (
    <div className="hidden sm:flex sm:items-center sm:gap-2">
      <Slider className="w-[80px]" defaultValue={[volumeState.current as number]} max={1} step={0.01} onValueChange={(e) => onChange(e[0])} />
        <button onClick={() => setMute((mute) => !mute)}>
          { VolumeIcon() }
        </button>
    </div>
  )
}