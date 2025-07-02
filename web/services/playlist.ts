"use server"

import { Playlist } from "@shared/types"
import { revalidatePath } from "next/cache"
import getPath from "@/utils/get-path"
import supabase from "@/lib/supabase"

export const createPlaylist = async (userId: string, data: Playlist) => {
  const { status, error } = await supabase.from('playlist').insert({ ...data, "userid": userId })
  if (!error && status == 200) {
    return true
  } else {
    return error
  }
}

export const getUserPlaylists = async (userId: string) => {
  const { data, error } = await supabase.from('playlist').select("*").eq("userid", userId)
  if (error) {
    console.log('user playlist fetching error', error)
    return []
  } else {
    return data as Playlist[]
  }
}

export const getPlaylist = async (playlistId: string, userId: string) => {
  const { data, error } = await supabase
    .from("playlist")
    .select("*")
    .eq("id", playlistId)
    .eq("userId", userId)
    .single()
  if (error) {
    console.log('playlist fetching error', error)
    return error
  } else {
    return data as Playlist
  }
}

export const updatePlaylist = async (playlistId: string, data: Playlist) => {
  const { error } = await supabase
  .from('playlist')
  .update(data)
  .eq('id', playlistId)
  if (error) {
    console.log("playlist update error", error)
    return error
  } else {
    revalidatePath(await getPath())
    return true
  }
}

export const removePlaylist = async (playlistId: string) => {
  const response = await supabase
  .from('playlist')
  .delete()
  .eq('id', playlistId)
  if (response) {
    revalidatePath("/app")
    return true
  }
}