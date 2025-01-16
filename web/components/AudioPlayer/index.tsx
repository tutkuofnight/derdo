"use client"
import { useEffect, useRef, useState } from "react"
import useSocket from "@/hooks/useSocket"
// import { Play, Pause } from "lucide-react"
import { getVolume, setVolume } from "./functions"
import { tracks } from "@/store"
import { useAtom } from "jotai"
import { Song } from "@shared/types"

export default function () {
  const [playerDuration, setPlayerDuration] = useState<number>(0)
  const audioRef = useRef<HTMLMediaElement>(null)
  const [tracklist,] = useAtom(tracks)
  const { setTrack, playMusic, pauseMusic, timeSeeked, audioPlayerState, currentTrack } = useSocket()

  useEffect(() => {
    const audio: any = audioRef.current
    if (audio) {
      playMusic()
      // audio.addEventListener('timeupdate', (e: any) => setPlayerDuration(e.target.currentTime))
      audio.addEventListener('play', playMusic)
      audio.addEventListener('pause', pauseMusic)
      audio.addEventListener("ended", () => setNextTrack())
      audio.addEventListener('seeked', () => timeSeeked(audioRef.current?.currentTime!))
      audio.addEventListener("volumechange", () => setVolume(audioRef))

      return () => {
        audio.removeEventListener('play', playMusic)
        audio.removeEventListener('pause', pauseMusic)
        audio.removeEventListener('ended', () => setNextTrack())
        audio.removeEventListener('seeked', () => timeSeeked(audioRef.current?.currentTime!))
        audio.removeEventListener("volumechange", () => setVolume(audioRef))
      };
    }
  }, [currentTrack])

  useEffect(() => {
    if (audioRef.current) {
      if(audioPlayerState?.isPlaying) {
        const volume = getVolume()
        if (typeof volume === 'number' && isFinite(volume)) {
          audioRef.current.volume = volume
        }
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [audioPlayerState?.isPlaying])

  useEffect(() => {
    if (typeof audioPlayerState?.currentTime === 'number' && isFinite(audioPlayerState.currentTime)) {
      if (audioRef.current) {
        audioRef.current.currentTime = audioPlayerState.currentTime
      }
    }
  }, [audioPlayerState?.currentTime])

  const setNextTrack = () => {
    const trackIndex = tracklist.indexOf(currentTrack as Song)
    if (tracklist.length !== trackIndex + 1) {
      setTrack(tracklist[trackIndex + 1])
    } else {
      setTrack(tracklist[0])
    }
  }


  return <>{currentTrack ? (
    <div className="w-full p-4 py-5 bg-background border-t flex items-center justify-center gap-64 fixed bottom-0 left-0 ">
      {/* <Slider defaultValue={0} max={audioRef.current?.duration} step={0.000001} value={playerDuration} /> */}
      {/* <Info song={currentTrack} /> */}
      <audio 
        ref={audioRef} 
        controls 
        src={process.env.NEXT_PUBLIC_TRACK_URL + currentTrack.id + ".mp3"} 
        className="w-[85%] md:w-1/3 scale-125"
      ></audio>
      {/* <button onClick={() => playMusic()}>
        <Play />
      </button>
      <button onClick={() => pauseMusic()}>
        <Pause />
      </button> */}
    </div>
  ) : null}</>
}