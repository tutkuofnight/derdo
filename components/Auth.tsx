"use client"
import { signIn, useSession } from "next-auth/react"
import {useRouter} from 'next/navigation'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect } from "react"

export default function Auth() {
  const router = useRouter()
  const { data:session } = useSession() 
  
  if(session && session.user) {
    router.push('/app')
  }
  
  return (
    <Button onClick={() => signIn("google")} className="z-50">
      <Image src={"/google.webp"} width={30} height={30} alt="Sign In with Google" />
      Start Sign In with Google
    </Button>
  )
}