"use server"

import db from "@/config/db"
import { Song } from "@/types"

import { revalidatePath } from "next/cache"
import getPath from "@/utils/get-path"

export const createTrackTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS songs (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      artist VARCHAR(255) NOT NULL,
      featurings TEXT,
      userid UUID NOT NULL,
      imageurl TEXT,
      trackurl TEXT,
      playlistid UUID,
      FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (playlistid) REFERENCES playlists(id) ON DELETE CASCADE
    )
  `)
}

export const saveTrack = async (data: Song) => {
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
  revalidatePath(await getPath())
  return true
}

export const getTrack = async (trackId: string) => {
  const { rows } = await db.query(`SELECT id, name, artist, featurings, imageurl, trackurl FROM songs WHERE id = $1`, [trackId])
  return rows
}

export const getUserUploadedTracks = async (userId: string) => {
  const { rows } = await db.query(`SELECT id, name, artist, featurings, imageurl, trackurl FROM songs WHERE userid = $1`, [userId])
  return rows
}

export const getPlaylistTracks = async (playlistId: string) => {
  const { rows } = await db.query(`SELECT id, name, artist, featurings, imageurl, trackurl FROM songs WHERE playlistid = $1`, [playlistId])
  return rows
}

export const moveTrackAnotherPlaylist = async (trackId: string, playlistId: string) => {
  return await db.query(`UPDATE songs SET playlistid = $1 WHERE id = $2`, [playlistId, trackId])
}

export const updateTrack = async (trackId: string, data: Song) => {
  let keys: string[] = []
  let values: string[] = []
  let lastIndex: number = Object.keys(data).length + 1

  Object.entries(data).forEach((item, index) => {
    keys.push(`${item[0]} = $${index + 1}`)
    values.push(item[1])
  })
  await db.query(`UPDATE songs SET ${keys.join(",")} WHERE id = $${lastIndex}`, [...values, trackId])
  revalidatePath(await getPath())
  return true
}

export const deleteTrack = async (trackId: string) => {
  await db.query(`DELETE FROM songs WHERE id = $1`, [trackId])
  revalidatePath(await getPath())
  return true
}