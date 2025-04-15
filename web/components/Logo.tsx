"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { AudioLines } from "lucide-react"

export default function(){
  const { status } = useSession()

  return (
    <Link href={status == "authenticated" ? "/app" : "/"}>
      <h1 className="text-2xl font-logo flex items-center gap-2 cursor-pointer">
        derdo
        <AudioLines className="w-6 h-6" />
      </h1>
    </Link>
  )
}