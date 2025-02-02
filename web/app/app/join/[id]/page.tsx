import db from "@/lib/db"
import JoinCard from "./components/JoinCard"

export async function generateMetadata({ params }: { params: Promise<{ id: string }>}) {
  const { id } = await params
  const { rows: result } = await db.query("SELECT name, image FROM users WHERE id = $1", [id])
  return {
    title: `Join ${result[0].name}'s room`,
    description: `${result[0].name} Invited you to join their room. Click here to join!`,
    openGraph: {
      images: [{
        url: "/favicon.svg",
      }],
    }
  }
}

export default async function({ params }: { params: Promise<{ id: string }>}){
  const { id } = await params
  const { rows: result } = await db.query("SELECT name, image FROM users WHERE id = $1", [id])
  const user = result[0]
  if(user) {
    return <JoinCard roomId={id} user={user} />
  }
}