"use server"

import db from "@/config/db"
import { Playlist } from "@/types"
import { revalidatePath } from "next/cache"
import getPath from "@/utils/get-path"

export const createPlaylistTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS playlists (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      image TEXT,
      userId UUID NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `)
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
  revalidatePath(await getPath())
  return true
}

export const getUserPlaylists = async (userId: string) => {
  const { rows } = await db.query(`SELECT * FROM playlist WHERE userid = $1`, [userId])
  return rows
}

export const getPlaylist = async (playlistId: string, userId: string) => {
  const { rows } = await db.query(`SELECT * FROM playlist WHERE id = $1 AND userid = $2`, [playlistId, userId])
  return rows
}

export const updatePlaylist = async (playlistId: string, data: Playlist) => {
  let keys: string[] = []
  let values: string[] = []
  let lastIndex: number = Object.keys(data).length + 1

  Object.entries(data).forEach((item, index) => {
    keys.push(`${item[0]} = $${index + 1}`)
    values.push(item[1])
  })
  const { fields } = await db.query(`UPDATE playlist SET ${keys.join(",")} WHERE id = $${lastIndex}`, [...values, playlistId])
  revalidatePath(await getPath())
  return fields
}

export const removePlaylist = async (playlistId: string) => {
  return await db.query(`DELETE FROM playlist WHERE id = $1`, [playlistId])
}