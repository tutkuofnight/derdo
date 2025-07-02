"use server"

import { Song } from "@shared/types"

import { revalidatePath } from "next/cache"
import getPath from "@/utils/get-path"
import supabase from "@/lib/supabase"

export const saveTrack = async (data: Song) => {
  const { status, error } = await supabase.from("songs").insert(data)
  if (error) {
    console.log("save track error", error)
    return false
  } else if (!error && status == 200){
    revalidatePath(await getPath())
    return true
  }
}

export const getTrack = async (trackId: string) => {
  const { data, error } = await supabase.from("songs").select("*").eq("id", trackId).single()
  if (error) {
    console.log("get track error", error)
    return false
  } else {
    return data as Song
  }
}

export const getUserUploadedTracks = async (userId: string) => {
  const { data, error } = await supabase.from("songs").select("id, name, artist, featurings, imageurl, trackurl").eq("userid", userId)
  if (error) {
    console.log("get user uploaded tracks error", error)
    return []
  } else {
    return data as Song[]
  }
}

export const getPlaylistTracks = async (playlistId: string) => {
  const { data, error } = await supabase.from("songs").select("id, name, artist, featurings, imageurl, trackurl").eq("playlistid", playlistId)
  // const { rows } = await db.query(`SELECT id, name, artist, featurings, imageurl, trackurl FROM songs WHERE playlistid = $1`, [playlistId])
  // return rows
  if (error) {
    console.log("get playlist tracks error", error)
    return []
  } else {
    return data as Song[]
  }
}

export const moveTrackAnotherPlaylist = async (trackId: string, playlistId: string) => {
  await supabase.from("songs").update({ 'playlistid': playlistId }).eq("id", trackId)
}

export const updateTrack = async (trackId: string, data: Song) => {
  const { error } = await supabase.from("songs").update(data).eq("id", trackId)
  if (error) {
    console.log("update track error", error)
    return false
  } else {
    revalidatePath(await getPath())
    return true
  }
}

export const deleteTrack = async (trackId: string) => {
  await supabase.from("songs").delete().eq("id", trackId)
  revalidatePath(await getPath())
  return true
}