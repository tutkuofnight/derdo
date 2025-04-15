import { getUserPlaylists } from "@/services/playlist"
import { cookies } from 'next/headers'
import { Playlist } from "@shared/types"
import Client from "./client"

export default async function Sidebar(){
  const cookie = await cookies()
  const id: any = cookie.get("uid")

  const playlists: Playlist[] = await getUserPlaylists(id.value)
  return <Client playlists={playlists} />
}