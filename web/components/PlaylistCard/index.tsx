"use client"
import { SquarePlay, ListMusic } from "lucide-react"
import { Playlist } from "@/types"
import { useParams } from "next/navigation"

export default function PlaylistCard({ playlist }: { playlist: Playlist }){
  const params = useParams()
  console.log(`params: ` + params.id)
  const playlistCardStyles = "rounded-lg py-2 px-4 flex items-center gap-4 cursor-pointer hover:bg-white hover:bg-opacity-10 group"
  return (
    <div className={`${playlistCardStyles} ${playlist.id == params.id ? "bg-white text-black hover:bg-opacity-100" : null}`}>
      <div>
        {playlist.image ? (
          <img src={playlist.image} alt={playlist.name} className="w-[40px] h-[40px] object-cover rounded-md" />
        ): (
          <div className="w-[40px] h-[40px] bg-white bg-opacity-10 grid place-items-center rounded-md">
            <ListMusic className="text-dark dark:text-white w-[20px] h-[20px]" />
          </div>
        )}
      </div>
      <div className="flex justify-between items-center flex-1">
        <p className="font-medium">{playlist.name}</p>
        <SquarePlay className="invisible group-hover:visible group-hover:text-gray-500" />
      </div>
    </div>
  )
}