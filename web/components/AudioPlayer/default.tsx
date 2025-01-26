"use client"
import { useEffect, useRef, useState } from "react"
import { getVolume, setVolume } from "./functions"
import { useAtom } from "jotai"
import { currentPlaying, tracks, playerState } from "@/store"
import { Song } from "@/types"
import { Play, Pause, Disc3, SkipBack, SkipForward, Repeat, Repeat1 } from "lucide-react"
import { Info } from "@/components/Track"
import Volume from "./volume"
import trackTime from "@/utils/track-time"

export default function () {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const [currentTrack, setCurrentTrack] = useAtom(currentPlaying)
  const [audioPlayerState, setAudioPlayerState] = useAtom(playerState)
  const [tracklist,] = useAtom(tracks)

  const [duration, setDuration] = useState<number>(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      audio.play()
    }

    const volume = getVolume()
    if (typeof volume === 'number' && isFinite(volume)) {
      audio.volume = volume
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [currentTrack?.id])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setDuration(audio.currentTime)
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [currentTrack?.id])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      if (audioPlayerState?.repeat) {
        rewind()
      } else {
        setNextTrack()
      }
    }

    audio.addEventListener("ended", handleEnded)
    
    return () => {
      audio.removeEventListener("ended", handleEnded)
    }
  }, [audioPlayerState?.repeat, currentTrack?.id])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (progressRef.current) {
      progressRef.current.style.width = '0%'
    }

    const handlePause = () => setAudioPlayerState({ isPlaying: false })
    const handlePlay = () => setAudioPlayerState({ isPlaying: true })
    const handleVolumeChange = () => setVolume(audioRef)

    audio.addEventListener("pause", handlePause)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("volumechange", handleVolumeChange)
    
    return () => {
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("volumechange", handleVolumeChange)
    }
  }, [currentTrack?.id])

  useEffect(() => {
    if (audioPlayerState?.isPlaying) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }, [audioPlayerState?.isPlaying])

  const setNextTrack = () => {
    const trackIndex = tracklist.indexOf(currentTrack as Song)
    if (tracklist.length !== trackIndex + 1) {
      setCurrentTrack(tracklist[trackIndex + 1])
    } else {
      setCurrentTrack(tracklist[0])
    }
  }

  const rewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
  }

  const setPrevTrack = () => {
    const trackIndex = tracklist.indexOf(currentTrack as Song)
    if (audioRef.current) {
      if (audioRef.current?.currentTime > 12.0 || trackIndex == 0) {
        rewind()
      } else {
        setCurrentTrack(tracklist[trackIndex - 1])   
      }
    }
  }

  const timeSeeked = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return
  
    const sliderWidth = e.currentTarget.clientWidth
    const clickPosition = e.clientX - e.currentTarget.getBoundingClientRect().left
    const newTime = (clickPosition / sliderWidth) * audioRef.current.duration

    audioRef.current.currentTime = newTime
  }

  const changeRepeatStatus = () => {
    setAudioPlayerState({ ...audioPlayerState, repeat: !audioPlayerState?.repeat })
  }

  return (
    <>
      {currentTrack && (
        <div className="w-full bg-slate-50 dark:bg-black border-t flex flex-col py-4 fixed bottom-0 left-0">
          <div className="w-full h-1 hover:h-[6px] transition-all bg-gray-200 dark:bg-opacity-10 cursor-pointer absolute top-0 left-0" onClick={timeSeeked}>
            <div ref={progressRef} style={{ width: `${(duration / audioRef.current?.duration!) * 100}%` }} className={`h-full bg-gradient-to-r from-sky-400 to-purple-500`} onClick={timeSeeked}></div>
          </div>
          <audio 
            ref={audioRef} 
            src={process.env.NEXT_PUBLIC_TRACK_URL + currentTrack.id + ".mp3"} 
            itemType="audio/mpeg"
            className="w-[85%] lg:w-1/3 scale-125"
          />
          <div className="flex flex-1 items-center justify-between px-5">
            <div className="sm:flex sm:items-center sm:gap-2 flex-1">
              <div className="flex items-center gap-2">
                <Disc3 className={`w-9 h-9 ${audioPlayerState?.isPlaying ? "animate-spin duration-disc-spin": null}`} />
                <Info song={currentTrack} />
              </div>
              {audioRef.current?.duration && duration ?
                <div className="hidden sm:flex sm:items-center text-black dark:text-white text-opacity-40 dark:text-opacity-40 ml-2">
                  { trackTime(duration) } 
                  <span className="w-1 mx-2">/</span>
                  { trackTime(audioRef.current?.duration!) }
                </div>
              : null}
            </div>
            <div className="mt-1 flex items-center gap-4">
              <button onClick={setPrevTrack}>
                <SkipBack className="w-8 h-8" />
              </button>
              {audioPlayerState?.isPlaying ? (
                <button onClick={() => setAudioPlayerState({ isPlaying: false })}>
                  <Pause className="w-11 h-11" />
                </button>
              ): (
                <button onClick={() => setAudioPlayerState({ isPlaying: true })}>
                  <Play className="w-11 h-11" />
                </button>
              )}
              <button onClick={setNextTrack}>
                <SkipForward className="w-8 h-8" />
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:gap-3 sm:justify-end ">
              <Volume audioRef={audioRef.current} />
              {audioPlayerState?.repeat ? (
                <button onClick={changeRepeatStatus}>
                  <Repeat1 className="w-[22px] h-[22px]" />
                </button>
              ): (
                <button onClick={changeRepeatStatus}>
                  <Repeat className="w-[22px] h-[22px] text-black dark:text-white text-opacity-40 dark:text-opacity-40" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}