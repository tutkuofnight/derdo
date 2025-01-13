import { atom } from "jotai"
import { ListenerUser, PlayerState, Song } from "@/shared/types"

export const playerState = atom<PlayerState | null>(null)

export const currentPlaying = atom<Song | null>(null)

export const search = atom<string>("")

export const roomId = atom<string | null>(null)

export const tracks = atom<Song[]>([])

export const listeners = atom<ListenerUser[]>([])
