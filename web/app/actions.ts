"use server"
import { cookies } from 'next/headers'

export const setCookie = async (name:string, value: string) => {
  const cookieStore = await cookies()
  cookieStore.set({
    name,
    value,
    httpOnly: true,
    path: '/',
  })
}