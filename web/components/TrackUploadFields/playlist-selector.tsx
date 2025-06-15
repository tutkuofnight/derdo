"use client"
import { Plus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAtom, playlistStore } from "@/store"
import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle
} from "@/components/ui/dialog"
import PlaylistForm from "@/components/CreatePlaylistForm"

export default function PlaylistSelector(props: { selectedPlaylist: (playlistId: string) => void, className?: string }) {
  const [ playlists, ] = useAtom(playlistStore)
  const [playlistId, setPlaylistId] = useState<string | null>(null)
  return (
    <div className={`w-[%80] flex flex-col items-center justify-center gap-4 ${props.className}`}>
      <div className="w-full">
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            className={`w-full mb-2 p-2 font-semibold flex items-center justify-start gap-4 rounded-md bg-opacity-5 transition-colors 
            hover:bg-black
            hover:text-white
            hover:dark:bg-white
            hover:dark:text-black
            ${playlistId === playlist.id && "bg-black text-white dark:bg-white dark:text-black"}`}
            onClick={() => {
              setPlaylistId(playlist.id)
            }}>
            <img className="w-[40px] h-[40px] rounded-md object-cover" src={playlist.image} alt={playlist.name} />
            {playlist.name}
          </button>
        ))}
      </div>
      <small className="font-bold">OR</small>
      <Dialog>
        <DialogTrigger className="w-full" asChild={true}>
          <Button variant={"secondary"} className="w-full">
            <Plus></Plus>
            Create New Playlist
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Create Playlist</DialogTitle>
          <PlaylistForm redirect={false} />
        </DialogContent>
      </Dialog>
      <Button className="w-full mt-4" disabled={!playlistId} onClick={() => props.selectedPlaylist(playlistId || "")}>
        Finish The Upload
        {playlistId && <ArrowRight /> }
      </Button>
    </div>
  )
}