"use client"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ListenerUser } from "@shared/types"

import useSocket from "@/hooks/useSocket"
import { useState, useEffect } from "react"
import { roomStore } from "@/store"
import { useAtom } from "jotai"

export default function() {
  const [listenerUsers, setListenerUsers] = useState<ListenerUser[]>([])
  const { socket } = useSocket()
  const [room,] = useAtom(roomStore)
  
  useEffect(() => {
    socket.on("room-users", (users: ListenerUser[]) => {
      setListenerUsers([...users])
    })
  }, [room?.id])

  return (
    <div className="flex flex-wrap gap-2 max-w-[250px]">
      {listenerUsers.map((user: ListenerUser, index: number) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger>
              <Avatar>
                <AvatarImage src={user?.image} alt={user?.name} />
                <AvatarFallback>{ user?.name[0].toUpperCase() }</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user?.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}