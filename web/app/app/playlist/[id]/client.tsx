"use client"
import { Playlist, Song } from "@shared/types"
import { playlistStore, useAtom } from "@/store"
import { useEffect, useState } from "react"
import Tracklist from "@/components/Tracklist"
import PlaylistView from "@/components/PlaylistView"
import { useParams } from "next/navigation"

export default function PlaylistPageClient({ playlistTracks }: { playlistTracks: Song[] }){
  const params = useParams()
  const [playlists,] = useAtom(playlistStore)
  
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [activePlaylist, setActivePlaylist] = useState<Playlist>()

  useEffect(() => {
    const findedPlaylist = playlists.find((item: Playlist) => item.id == params?.id)
    if (!findedPlaylist) {
      // return alert("playlist not found :(")
      return
    }
    setActivePlaylist(findedPlaylist)
    setIsLoading(false)
  }, [])

  return (
    <>
      {!isLoading ? (
        <div>
          <PlaylistView playlist={activePlaylist!} />
          <Tracklist playlist={playlistTracks} playlistId={activePlaylist?.name} />
        </div>
      ) : <p>Loading...</p>}
    </>
  )
}