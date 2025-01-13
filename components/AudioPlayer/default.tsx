"use client"
import { useEffect, useRef, useState } from "react"
import { getVolume, setVolume } from "./functions"
import { useAtom } from "jotai"
import { currentPlaying, tracks, playerState } from "@/store"
import { Song } from "@/shared/types"

export default function () {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTrack, setCurrentTrack] = useAtom(currentPlaying)
  const [audioPlayerState, setAudioPlayerState] = useAtom(playerState)
  const [tracklist,] = useAtom(tracks)

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleLoadedMetadata = () => {
        audio.play();
      };

      const volume = getVolume();
      if (typeof volume === 'number' && isFinite(volume)) {
        audio.volume = volume;
      }

      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener("ended", () => setNextTrack())
      audio.addEventListener("pause", () => setAudioPlayerState({ isPlaying: false }))
      audio.addEventListener("play", () => setAudioPlayerState({ isPlaying: true }))
      audio.addEventListener("volumechange", () => setVolume(audioRef))
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
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

  return (
    <>
      {currentTrack && (
        <div className="w-full p-4 py-5 bg-slate-50 dark:bg-black border-t flex items-center justify-center gap-64 fixed bottom-0 left-0">
          {currentTrack && (
            <audio 
              ref={audioRef} 
              controls 
              src={process.env.NEXT_PUBLIC_TRACK_URL + currentTrack.id + ".mp3"} 
              itemType="audio/mpeg"
              className="w-[85%] lg:w-1/3 scale-125"
            />
          )}
        </div>
      )}
    </>
  );
}