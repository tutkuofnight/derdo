import { z } from "zod"
import { Song } from "@shared/types"

export const UploadFormSchema: z.ZodSchema<Song> = z.object({
  id: z.string().uuid(),
  name: z.string(),
  artist: z.string(),
  featurings: z.string(),
  userid: z.string(),
  trackurl: z.string(),
  imageurl: z.string(),
})