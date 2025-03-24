import Client from "./client"
import AppLayout from "@/layouts/app-layout"
import { getUserPlaylists } from "@/services/playlist"
import { getPlaylistTracks } from "@/services/tracks"
import { Playlist, Song } from "@shared/types"
import { cookies } from "next/headers"

export default async function PlaylistPage({ params }: { params: Promise<{ id: string }>}){
  const { id } = await params

  const cookie = await cookies()
  const uid: any = cookie.get("uid")

  const playlistTracks: Song[] = await getPlaylistTracks(id)
  const playlist: Playlist[] = await getUserPlaylists(uid.value)

  return <AppLayout playlists={playlist}>
    <Client playlistTracks={playlistTracks} />
  </AppLayout>
}