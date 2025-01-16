import { atom } from "jotai"
import { ListenerUser, PlayerState, Song, Room } from "@shared/types"

export const playerState = atom<PlayerState | null>(null)

export const currentPlaying = atom<Song | null>(null)

export const search = atom<string>("")

export const tracks = atom<Song[]>([])

export const listeners = atom<ListenerUser[]>([])

export const roomStore = atom<Room>()