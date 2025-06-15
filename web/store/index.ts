import { atom, useAtom } from "jotai"
import { ListenerUser, PlayerState, Song, Playlist } from "@shared/types"

const playerState = atom<PlayerState | null>(null)
const currentPlaying = atom<Song | null>(null)
const search = atom<string>("")
const roomId = atom<string | null>(null)
const tracks = atom<Song[]>([])
const listeners = atom<ListenerUser[]>([])
const playlistStore = atom<Playlist[]>([])

const stepsManager = atom<{
  currentStep: number
  totalSteps: string[]
} | null>({
  currentStep: 1,
  totalSteps: ["Enter Track Info", "Upload Track", "Select Playlist"]
})

 

export {
  playerState,
  currentPlaying,
  search,
  roomId,
  tracks,
  listeners,
  playlistStore,
  stepsManager,
  useAtom
}