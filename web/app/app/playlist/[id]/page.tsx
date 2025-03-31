import Client from "./client"
import AppLayout from "@/layouts/app-layout"
import { getPlaylistTracks } from "@/services/tracks"
import { Song } from "@shared/types"

export default async function PlaylistPage({ params }: { params: Promise<{ id: string }>}){
  const { id } = await params

  const playlistTracks: Song[] = await getPlaylistTracks(id)

  return <AppLayout>
    <Client playlistTracks={playlistTracks} />
  </AppLayout>
}