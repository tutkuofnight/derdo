"use client"
import Playlist from "@/components/Playlist"
import useSocket from "@/hooks/useSocket"

export default function({ songs, playlistName }: { songs: any[], playlistName: string }) { 
  const { socket } = useSocket()
  socket.connect()

  return (
    <div className="flex">
      <Playlist playlist={songs} className="flex-1" playlistName={playlistName} />
    </div>
  )
}