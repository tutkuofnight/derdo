import Client from "./client"
import { getUserPlaylists } from "@/services/playlist"
import { Playlist } from "@shared/types"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/options"

export default async function ProfilePage(){
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return (
      <div>
        You are not authenticated. Please sign in.
      </div>
    )
  }

  const userId = session.user.id;
  
  const playlists: Playlist[] = await getUserPlaylists(userId)
  return <Client playlists={playlists} />
}