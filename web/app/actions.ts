"use server"
import db from "@/config/db"
import { Song, Playlist } from "@/types"
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
  await db.query(`INSERT INTO songs (id, name, artist, featurings, userid, imageurl, trackurl, playlistid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`, [
    data.id,
    data.name,
    data.artist,
    data.featurings,
    data.userid,
    data.imageurl,
    data.trackurl,
    data.playlistid
  ])
  return true
}

export const createPlaylist = async (userId: string, data: Playlist): Promise<boolean> => {
  await db.query(`INSERT INTO playlist (id, name, description, image, userId) VALUES ($1, $2, $3, $4, $5)`, [
    data.id,
    data.name,
    data.description,
    data.image,
    userId
  ])
  await db.query(`INSERT INTO user_playlists (userid, playlistid) VALUES ($1, $2)`, [userId, data.id])
  return true
}

export const moveTrackAnotherPlaylist = async (trackId: string, playlistId: string) => {
  await db.query(`UPDATE songs SET playlistid = $1 WHERE id = $2`, [playlistId, trackId])
  return true
}

export const deleteTrack = async (trackId: string) => {
  await db.query(`DELETE FROM songs WHERE id = $1`, [trackId])
  return true
}