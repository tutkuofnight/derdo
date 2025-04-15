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

export default function({ listeners }: { listeners: any[] }) {
  return (
    <div className="flex flex-wrap gap-2 max-w-[250px]">
      {listeners.map(({ user }: { user: ListenerUser }, index: number) => (
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