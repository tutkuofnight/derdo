"use client"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
export default function(){
  const { data: session } = useSession()

  return (
    <div className="flex items-center gap-5 mb-8">
      <div className="flex-1">
        <small className="text-lg ">Welcome</small>
        <p className="text-5xl font-bold">{session?.user?.name}</p>
      </div>
    </div>
  )
}