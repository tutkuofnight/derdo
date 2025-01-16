"use client"
import { useSession } from "next-auth/react"
export default function Welcome(){
  const { data:session } = useSession()
  return (
    <section>
      <div className="w-full flex justify-center">
        <p>Welcome</p>
        <h1>{session?.user?.name}</h1>
      </div>
    </section>
  )
}