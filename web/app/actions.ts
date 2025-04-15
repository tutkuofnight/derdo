"use server"
import { cookies } from 'next/headers'

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const setCookie = async (name:string, value: string) => {
  const cookieStore = await cookies()
  cookieStore.set({
    name,
    value,
    httpOnly: true,
    path: '/',
  })
}

export const getSession = async () => {
  const session = await getServerSession(authOptions)
  return session
}