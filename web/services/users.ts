"use server"

import db from "@/config/db"
import { User } from "@/types"

export const getUser = async () => {
  return await db.query(``)
}

export const updateUser = async (userId: string, data: User) => {
  await db.query(`UPDATE users SET name = $1 WHERE id = $2`, [data.name, userId])
  return true
}