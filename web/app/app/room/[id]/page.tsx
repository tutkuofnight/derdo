import db from "@/config/db"

import Client from "./client"
import AppLayout from "@/layouts/app-layout"

export async function generateMetadata({ params }: { params: Promise<{ id: string }>}) {
  const { id } = await params
  const { rows: result } = await db.query("SELECT name, image FROM users WHERE id = $1", [id])
  return {
    title: `${result[0].name}'s Playlist | derdo`,
  }
}


export default async function({ params } : { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { rows: songs } = await db.query("SELECT id, name, artist, featurings, userId FROM songs")
  const { rows: user } = await db.query(`SELECT name FROM users WHERE id = $1`, [id])
  
  return (
    <AppLayout>
      <Client roomId={id} songs={songs} playlistName={`${user[0].name}'s Playlist`} />
    </AppLayout>
  )
}