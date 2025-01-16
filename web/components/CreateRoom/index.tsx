"use client"
import { Button } from "@/components/ui/button"
import { StepForward } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import useSocket from "@/hooks/useSocket"
import { Room, User, ListenerUser } from "@shared/types"

export default function CreateRoom(){
  const { data: session } = useSession()
  const { toast } = useToast()
  const { push } = useRouter()
  const { createRoom } = useSocket()

  const handleCreateRoom = () => {
    if (!session?.user) return
    const room: Room = { 
      id: session?.user.id as string,
      creator: session?.user as User
    }
    const user: ListenerUser = { 
      name: session?.user.name as string, 
      image: session?.user.image as string 
    } 
    createRoom(room, user)
    
    const link = window.location.origin + "/app/join/" + session?.user.id
    window.navigator.clipboard.writeText(link)
    toast({
      title: "Invite link copied to clipboard!",
      duration: 2000
    })
    push("/app/room/" + session?.user.id)
  }

  return (
    <Button variant={"outline"} onClick={handleCreateRoom}>
      Create Room
      <StepForward />
    </Button>
  )
}