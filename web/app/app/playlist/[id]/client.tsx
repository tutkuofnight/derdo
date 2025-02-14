"use client"
import { Playlist, Song } from "@/types"
import { playlistStore, useAtom } from "@/store"
import { ListMusic } from "lucide-react"
import { useEffect, useState } from "react"
import { Card } from "@/components/Track"
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
            {playlist.image ? (
              <div className="w-[200px] h-[200px]">
                <img src={playlist.image} alt={playlist.name} className="w-full h-full object-cover rounded-md" />
              </div>
            ) : (
              <div className="w-[200px] h-[200px] rounded-md grid place-items-center bg-white bg-opacity-10">
                <ListMusic className="text-dark dark:text-white w-[60px] h-[60px]" />
              </div>
            )}
            <div className="mb-3">
              <small className="bg-black text-white dark:bg-white dark:text-black rounded-lg py-1 px-2 inline text-xs font-semibold">Playlist</small>
              <h1 className="text-3xl font-bold my-2">{playlist?.name}</h1>
              <p>{playlist.description}</p>
            </div>
          </div>
          {
            tracks.length > 0 ? (
              <div>
                <p className="text-xl mb-2 font-semibold">Tracklist</p>
                {
                  tracks.map((song: Song, index: number) => (
                    <Card song={song} key={index} />
                  ))
                }
              </div>
            ) : <p>This place seems quiet...</p>
          }
        </div>
      ) : <p>Loading...</p>}

    </>
  )
}