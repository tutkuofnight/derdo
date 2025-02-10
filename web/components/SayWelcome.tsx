"use client"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
export default function Welcome(){
  const { data:session } = useSession()
  const [message, setMessage] = useState<string>("Welcome")
  
  useEffect(() => {
    const hours = new Date().getHours()
    if (hours < 12) {
      setMessage("Good Morning")
    } else if (hours > 18) {
      setMessage("Good Evening")
    }
  }, [])

  return (
    <section>
      <div className="w-full flex flex-col pb-[32px]">
        <p className="opacity-80">{message},</p>
        <h1 className="text-4xl font-bold">{session?.user?.name}</h1>
      </div>
    </section>
  )
}