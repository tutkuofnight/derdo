import db from "@/config/db"
import Client from "./client"
import AppLayout from "@/layouts/app-layout"

export default async function PlaylistPage({ params }: { params: Promise<{ id: string }>}){
  const { id } = await params
  const { rows: playlistTracks } = await db.query(`SELECT id, name, artist, featurings, imageurl, trackurl FROM songs WHERE playlistid = $1`, [id])
  const {rows: playlist} = await db.query(`SELECT * FROM playlist WHERE id = $1`, [id])
 
  return <AppLayout playlists={playlist}>
    <Client tracks={playlistTracks} playlist={playlist[0]} />
  </AppLayout>
}