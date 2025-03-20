"use client"
import { SquarePlay } from "lucide-react"
import { Playlist } from "@/types"
import { useParams } from "next/navigation"
import ImageController from "@/components/controllers/Image"

export default function PlaylistCard({ playlist }: { playlist: Playlist }){
  const params = useParams()
  
  const playlistCardStyles = "rounded-md p-2 flex items-center gap-4 cursor-pointer hover:bg-white hover:bg-opacity-10 group"
  
  return (
    <div className={`${playlistCardStyles} ${playlist.id == params.id ? "bg-white text-black hover:bg-opacity-100" : null}`}>
      <div>
        <ImageController url={playlist.image} type="playlist" className="w-[40px] h-[40px]" iconSize="w-[20px] h-[20px]" />
      </div>
      <div className="flex justify-between items-center flex-1">
        <p className="font-medium">{playlist.name}</p>
        <SquarePlay className="invisible group-hover:visible group-hover:text-gray-500" />
      </div>
    </div>
  )
}