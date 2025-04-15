import Client from "./client"
import AppLayout from "@/layouts/app-layout"
import { getPlaylistTracks } from "@/services/tracks"
import { getUserPlaylists } from "@/services/playlist"
import { Playlist, Song } from "@shared/types"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function PlaylistPage({ params }: { params: Promise<{ id: string }>}){
  const { id } = await params
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return (
      <div>
        You are not authenticated. Please sign in.
      </div>
    )
  }

  const userId = session.user.id;

  const playlistTracks: Song[] = await getPlaylistTracks(id)
  const playlist: Playlist[] = await getUserPlaylists(userId)

  return <AppLayout>
    <Client playlistTracks={playlistTracks} />
  </AppLayout>
}