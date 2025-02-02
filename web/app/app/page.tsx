import Profile from "@/components/Profile"
import Playlist from "@/components/Playlist"
import AudioPlayerDefault from "@/components/AudioPlayer/default"
import db from "@/lib/db"
import { Song } from "@shared/types"
import { cookies } from 'next/headers'

export default async function () {
  const cookie = await cookies()
  // const id: any = cookie.get("uid")
  const { rows: songs } = await db.query(`SELECT id, name, artist, featurings, userId FROM songs`)
  return (
    <main>
      <Profile />
      <Playlist playlist={songs} />
      <AudioPlayerDefault />
    </main>
  )
}