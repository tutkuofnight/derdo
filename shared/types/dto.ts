export type UpdateSongFormDto = {
  id?: string
  name: string
  artist: string
  featurings?: string
  imageUrl?: string
  song?: string
  userId?: string
} 

export type TrackInfo = {
  name: string
  artist: string
  featurings?: string
}