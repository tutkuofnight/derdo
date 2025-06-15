import AppLayout from "@/layouts/app-layout"

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/options"
import { Playlist } from "@shared/types"

import { getUserPlaylists } from "@/services/playlist"

import FormManager from "../../../components/TrackUploadFields/form-manager";

export default async function UploadPage(){
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
  
  return (
    <AppLayout playlists={playlists}>
      <FormManager />
    </AppLayout>
  )
}