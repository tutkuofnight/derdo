"use client"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Logo from "@/components/Logo"
import PlaylistForm from "@/components/CreatePlaylistForm"
import { Plus, LibraryBig } from "lucide-react"
import { Playlist } from "@/types"
import PlaylistCard from "../PlaylistCard"
import Link from "next/link"
export default function Sidebar({ playlists }: { playlists: Playlist[] }){
  return (
    <div className="h-screen">
      <Logo />
      <div className="mt-4">
        <h1 className="inline-flex items-center gap-2 text-sm font-bold my-3 p-1 px-2 bg-black text-white dark:bg-gray-100 dark:text-black rounded-lg">
          <LibraryBig className="w-[20px] h-[20px]" />
          {"Library"}
        </h1>
        <Dialog>
          <DialogTrigger className="w-full">
            <Button variant={"secondary"} className="rounded-xl w-full">
              <Plus></Plus>
              Create Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Create Playlist</DialogTitle>
            <PlaylistForm />
          </DialogContent>
        </Dialog>
        <div className="mt-3">
          {
            playlists ? playlists.map((playlist: Playlist, index: number) => (
              <Link href={`/app/playlist/${playlist.id}`} key={index}>
                <PlaylistCard playlist={playlist} />
              </Link>
            )) : <p className="text-gray-300 py-4 text-sm px-2">No playlist founded..</p>
          }
        </div>
      </div>
    </div>
  )
}