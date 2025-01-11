import { z } from "zod"
import { Song } from "@/types"

export const UploadFormSchema: z.ZodSchema<Song> = z.object({
  id: z.string().uuid(),
  name: z.string(),
  artist: z.string(),
  featurings: z.string(),
  userId: z.string()
})