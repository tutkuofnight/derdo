import SayWelcome from "@/components/SayWelcome"
import PlaylistComponent from "@/components/Tracklist"
import AppLayout from "@/layouts/app-layout"

import { Playlist, Song } from "@shared/types"
import { cookies } from 'next/headers'

import { getUserUploadedTracks } from "@/services/tracks"
import { getUserPlaylists } from "@/services/playlist"

export default async function () {
  const cookie = await cookies()
  const id: any = cookie.get("uid")

  const tracks: Song[] = await getUserUploadedTracks(id.value)
  const playlists: Playlist[] = await getUserPlaylists(id.value)

  return (
    <AppLayout playlists={playlists}>
      <SayWelcome />
      <PlaylistComponent playlist={tracks} />
    </AppLayout>
  )
}