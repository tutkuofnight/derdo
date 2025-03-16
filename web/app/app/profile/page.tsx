import Client from "./client"
import { getUserPlaylists } from "@/services/playlist"
import { cookies } from 'next/headers'
import { Playlist } from "@/types"

export default async function ProfilePage(){
  const cookie = await cookies()
  const id: any = cookie.get("uid")
  
  const playlists: Playlist[] = await getUserPlaylists(id.value)
  return <Client playlists={playlists} />
}