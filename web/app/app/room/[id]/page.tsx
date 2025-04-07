import db from "@/config/db"

import Client from "./client"
import AppLayout from "@/layouts/app-layout"
import { getPlaylist } from "@/services/playlist"
import { Playlist } from "@shared/types"

// export async function generateMetadata({ params }: { params: Promise<{ id: string }>}) {
//   const { id } = await params
//   const { rows: result } = await db.query("SELECT name FROM users WHERE id = $1", [id])
//   return {
//     title: `${result[0].name}'s Playlist | derdo`,
//   }
// }


export default async function({ params } : { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_CS_URL}room/info/${id}`)
  const { room } = await res.json()

  const playlist: Playlist = await getPlaylist(room.playlist, room.creator.id)

  const { rows: songs } = await db.query(`SELECT id, name, artist, featurings FROM songs WHERE ${playlist.id == room.creator.id ? "userid = $1" : "playlistid = $1"}`, [room.playlist])
  return (
    <AppLayout>
      <Client roomId={id} songs={songs} playlist={playlist} />
    </AppLayout>
  )
}