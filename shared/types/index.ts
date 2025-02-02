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
    userId: string
}
export type PlayerState = {
    currentTrack?: Song
    isPlaying?: boolean | null
    duration?: number | null
    currentTime?: number
}

export type Playlist = {
    id: string
    name: string
    songlist?: Song[]
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
    socketId?: string
    name: string
    image: string
}

export type Room = {
    id: string,
    playlistId?: string
    currentTrack?: Song
    playerState?: PlayerState
    creator: User
}

export type RoomUsers = {
    roomId: string
    users: ListenerUser[]
}