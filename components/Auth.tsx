"use client"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Auth() {
  const { status } = useSession() 
  
  return (
    <>
      {status !== "authenticated" && (
        <Button onClick={() => signIn("google", { callbackUrl: "/app" })} className="z-50">
          <Image src={"/google.webp"} width={30} height={30} alt="Sign In with Google" />
          Start Sign In with Google
        </Button>
      )}
    </>
  )
}