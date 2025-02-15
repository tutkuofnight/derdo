import UploadForm from "@/components/UploadForm"
import AppLayout from "@/layouts/app-layout"

import { cookies } from "next/headers"
import { Playlist } from "@/types"

import { getUserPlaylists } from "@/services/playlist"

export default async function UploadPage(){
  const cookie = await cookies()
  const id: any = cookie.get("uid")
  
  const playlists: Playlist[] = await getUserPlaylists(id.value)
  
  return (
    <AppLayout playlists={playlists}>
      <UploadForm />
    </AppLayout>
  )
}