"use client"

export const getVolume = () => {
  const volume = localStorage.getItem("vol")
  if (volume){
    return parseFloat(volume)
  }
}

export const setVolume = (audioRef: any) => {
  if (audioRef.current) {
    localStorage.setItem("vol", audioRef.current?.volume.toString())
  }
}