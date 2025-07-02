"use server"

import { User } from "@shared/types"

import { revalidatePath } from "next/cache"
import getPath from "@/utils/get-path"
import supabase from "@/lib/supabase"

export const getUser = async (userId: string) => {
  const { error, data } = await supabase.from("users").select("*").eq("id", userId).single()
  if (error) {
    console.log("get user error", error)
    return {}
  } else { 
    return data as User
  }
}

export const updateUser = async (userId: string, data: User) => {
  const { error, status } = await supabase.from("users").update(data).eq("id", userId)
  if (error) {
    console.log("update user error", error)
    return false
  } else if (!error && status == 200) {
    revalidatePath(await getPath())
    return true
  }
}