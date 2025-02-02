"use server"
import db from "@/lib/db"
import { Song } from "@shared/types"
import { cookies } from 'next/headers'

export const setCookie = async (userId: string) => {
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'uid',
    value: userId,
    httpOnly: true,
    path: '/',
  })
}

export const saveTrack = async (data: Song): Promise<boolean> => {
  await db.query(`INSERT INTO songs (id, name, artist, featurings, userId) VALUES ($1, $2, $3, $4, $5);`, [
    data.id,
    data.name,
    data.artist,
    data.featurings,
    data.userId,
  ])
  return true
}