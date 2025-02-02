"use client"
import { Button } from "@/components/ui/button"
import { Loader2, StepForward } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import useSocket from "@/hooks/useSocket"
import { Room, User } from "@shared/types"
import { useState } from "react"

export default function CreateRoom(){
  const { data: session } = useSession()
  const { toast } = useToast()
  const { push } = useRouter()
  const { createRoom, socket } = useSocket()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // const savedRoom = async (roomId: string) => {
  //   "use server"
  //   return await redis.get(`room:${roomId}`)
  // }

  const handleCreateRoom = () => {
    if (!session?.user) return

    const room: Room = { 
      id: session?.user.id as string,
      creator: session?.user as User
    }
    createRoom(room)
    setIsLoading(true)

    socket.on("room-created", (status) => {
      if (status === "OK") {
        setIsLoading(false)
        const link = window.location.origin + "/app/join/" + session?.user.id
        window.navigator.clipboard.writeText(link)
        toast({
          title: "Invite link copied to clipboard!",
          duration: 2000
        })
        push("/app/room/" + session?.user.id)
      }
    })
  }

  return (
    <Button variant={"outline"} onClick={handleCreateRoom} disabled={isLoading}>
      Create Room
      { isLoading ? <Loader2 className="animate-spin" /> : <StepForward /> }
    </Button>
  )
}