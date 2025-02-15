import db from "@/config/db"
import JoinCard from "./components/JoinCard"

const getUser = async (userId: string) => {
  "use server"
  const { rows } = await db.query(`SELECT name, image FROM users WHERE id = $1`, [userId])
  return rows[0]
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }>}) {
  const { id } = await params
  const user = await getUser(id)
  return {
    title: `Join ${user.name}'s room`,
    description: `${user.name} Invited you to join their room. Click here to join!`,
    openGraph: {
      images: [{
        url: "/favicon.svg",
      }],
    }
  }
}

export default async function({ params }: { params: Promise<{ id: string }>}){
  const { id } = await params
  const user = await getUser(id)
  
  if(user) {
    return <JoinCard roomId={id} user={user} />
  }
}