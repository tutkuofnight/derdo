"use client"

export const getVolume = (): number => {
  const volume = localStorage.getItem("vol")
  if (volume){
    return parseFloat(volume)
  }
  return 0
}

export const setVolume = (audioRef: any) => {
  if (audioRef.current) {
    localStorage.setItem("vol", audioRef.current?.volume.toString())
  }
}