import { Profile } from "../../web/node_modules/next-auth"

export type UploadForm = {
    name: string
    artist: string
    featurings: string
    song: File
}
export type Song = { 
    id: string
    name: string
    artist: string
    featurings: string
    song?: string
    userid: string
    imageurl?: string
    trackurl: string
    playlistid?: string
}

export type PlayerState = {
    isPlaying?: boolean | null
    currentTime?: number
    duration?: number
    repeat?: boolean
}

export type VolumeStorage = {
    prev: string | number
    current: string | number
}

export type Playlist = {
    id: string
    name: string
    description?: string
    image?: string
}

export type UpdateUser = {
    id: string
    name: string
    image: File
}

export type User = {
    id: string
    name: string
    email: string
    image: string
    playlistId?: string
}

export type ListenerUser = {
    id: string
    name: string
    image: string
}

export interface ExtendedProfile extends Profile {
    picture?: string
}

export type Room = {
    id: string,
    playlist: Playlist
    currentTrack: Song
    users: ListenerUser[]
    playerState: PlayerState
}