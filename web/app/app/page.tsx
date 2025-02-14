import SayWelcome from "@/components/SayWelcome"
import Playlist from "@/components/Playlist"
import AudioPlayerDefault from "@/components/AudioPlayer/default"
import db from "@/config/db"
import { Song } from "@/types"
import { cookies } from 'next/headers'
import AppLayout from "@/layouts/app-layout"

export default async function () {
  const cookie = await cookies()
  const id: any = cookie.get("uid")
  const { rows: songs } = await db.query(`SELECT id, name, artist, featurings, userid, imageurl, trackurl FROM songs WHERE userid = $1`, [id.value])
  const { rows: playlists } = await db.query(`SELECT * FROM playlist WHERE userid = $1`, [id.value])
  return (
    <AppLayout playlists={playlists}>
      <SayWelcome />
      <Playlist playlist={songs} />
      <AudioPlayerDefault />
    </AppLayout>
  )
}