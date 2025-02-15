"use client"
import { Playlist, Song } from "@/types"
import { playlistStore, useAtom } from "@/store"
import { useEffect, useState } from "react"
import PlaylistComponent from "@/components/Playlist"
import ImageController from "@/components/controllers/Image"

export default function PlaylistPageClient({ tracks, playlist }: { tracks: Song[], playlist: Playlist }){
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [playlists,] = useAtom(playlistStore)

  useEffect(() => {
    const findedPlaylist = playlists.find((item: Playlist) => item.id == playlist?.id)
    if (!findedPlaylist) {
      // return alert("playlist not found :(")
    }
    setIsLoading(false)
  }, [])

  return (
    <>
      {!isLoading ? (
        <div className="">
          <div className="flex items-end gap-5 mb-5">
            <div>
              <ImageController url={playlist.image} type="playlist" className="w-[200px] h-[200px]" iconSize="w-[60px] h-[60px]" />
            </div>
            <div className="mb-3">
              <small className="bg-black text-white dark:bg-white dark:text-black rounded-lg py-1 px-2 inline text-xs font-semibold">Playlist</small>
              <h1 className="text-3xl font-bold my-2">{playlist?.name}</h1>
              <p>{playlist.description}</p>
            </div>
          </div>
          <PlaylistComponent playlist={tracks} />
        </div>
      ) : <p>Loading...</p>}

    </>
  )
}