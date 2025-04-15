"use client"
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Disc3 } from "lucide-react"
import { useRouter } from "next/navigation"
import useSocket from "@/hooks/useSocket"
import { useSession } from "next-auth/react"

export default function({ roomId, playlistName, user }: { roomId: string, playlistName?: string, user: any }){
  const { push } = useRouter()

  const handleJoinRoom = async () => {
    push(`/app/room/${roomId}`)
  }

  return (
    <div className="w-full h-screen fixed top-0 left-0 bg-black bg-opacity-70 z-10 grid place-items-center">
      <Card className="shadow-2xl">
        <CardHeader>
          <div className="flex flex-col items-center gap-6 relative">
            <div className="relative select-none">
              <Image src={user.image} width={40} height={40} alt={user.name} className="rounded-full absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <Disc3 className="animate-spin duration-disc-spin w-40 h-40 text-gray-300" />
            </div>
            <CardTitle>
              <p className="text-2xl">{ user.name }</p>
              <p className="text-xl">Invited you to listen: "{playlistName || `${user.name}'s Playlist`}"</p>
            </CardTitle>
          </div>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" onClick={handleJoinRoom}>Join the room</Button>
        </CardFooter>
      </Card>
    </div>
  )
}