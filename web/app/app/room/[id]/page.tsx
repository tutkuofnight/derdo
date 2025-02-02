import db from "@/lib/db"
import redis from "@/lib/redis"

import Client from "./client"
import AppLayout from "@/layouts/app-layout"
import { PlayerState, Room } from "@shared/types"

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
  const room = await redis.get(`room:${id}`)
  console.log(room, JSON.parse(room!))
  const playerState = await redis.get(`room:${id}:playerState`)

  return (
    <AppLayout>
      <Client 
        roomId={id}
        room={JSON.parse(room!) as Room} 
        playerState={JSON.parse(playerState!) as PlayerState} 
        songs={songs} 
        playlistName={`${user[0].name}'s Playlist`}
      />
    </AppLayout>
  )
}