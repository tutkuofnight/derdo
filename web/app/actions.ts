"use server"
import db from "@/config/db"
import { Song } from "@/types"
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
  await db.query(`INSERT INTO songs (id, name, artist, featurings, userid, imageurl, trackurl) VALUES ($1, $2, $3, $4, $5, $6, $7);`, [
    data.id,
    data.name,
    data.artist,
    data.featurings,
    data.userid,
    data.imageurl,
    data.trackurl
  ])
  return true
}