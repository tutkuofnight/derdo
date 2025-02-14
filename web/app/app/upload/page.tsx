import UploadForm from "@/components/UploadForm"
import AppLayout from "@/layouts/app-layout"
import db from "@/config/db"
import { cookies } from "next/headers"

export default async function UploadPage(){
  const cookie = await cookies()
  const id: any = cookie.get("uid")
  const { rows: playlists } = await db.query(`SELECT * FROM playlist WHERE userid = $1`, [id.value]);
  return (
    <AppLayout playlists={playlists}>
      <UploadForm />
    </AppLayout>
  )
}