import db from "@/config/db"
import JoinCard from "./join-card"

// export async function generateMetadata({ params }: { params: Promise<{ id: string }>}) {
//   const { id } = await params
//   const user = await getUser(id)
//   return {
//     title: `Join ${user.name}'s room`,
//     description: `${user.name} Invited you to join their room. Click here to join!`,
//     openGraph: {
//       images: [{
//         url: "/favicon.svg",
//       }],
//     }
//   }
// }

const getPlaylistName = async (id: string) => {
  "use server"
  const { rows } = await db.query(`SELECT name FROM playlist WHERE id = $1`, [id])
  return rows[0]
}

export default async function({ params }: { params: Promise<{ id: string }>}){
  const { id } = await params
  const res = await fetch(`${process.env.NEXT_PUBLIC_CS_URL}room/info/${id}`)
  const { room } = await res.json()
  const playlistName = await getPlaylistName(room.playlist)

  if(res.ok) {
    return <JoinCard playlistName={playlistName.name} roomId={id} user={room.creator} />
  }
}
