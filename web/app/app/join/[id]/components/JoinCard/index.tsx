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
import Link from "next/link"

export default function({ roomId, user }: { roomId: string, user: any}){
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
              <p className="text-xl">Invited you listen together!</p>
            </CardTitle>
          </div>
        </CardHeader>
        <CardFooter>
          <Link href={"/app/room/" + roomId} className="w-full">
            <Button className="w-full">Join the room</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}