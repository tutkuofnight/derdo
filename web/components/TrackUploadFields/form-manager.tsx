"use client"
import { useForm, useFormContext, FormProvider } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { PlaylistSelector, UploadArea, UploadInfo, Steps } from "@/components/TrackUploadFields"

import { useAtom, stepsManager } from "@/store"
import { Song } from "@shared/types"

import { TrackInfo } from "@shared/types/dto"
import { useState } from "react"
import { v4 } from "uuid"
import { saveTrack } from "@/services/tracks"
import { useSession } from "next-auth/react"

import { toast } from "sonner"

const uploadFormSchema = z.object({
  id: z.string().uuid(),
  name: z.string()
    .min(3, "Song name is required")
    .max(100, "Song name cannot exceed 100 characters"),
  artist: z.string()
    .min(2, "Artist is required")
    .max(50, "Artist cannot exceed 50 characters"),
  featurings: z.string()
    .min(2).optional(),
  userid: z.string().min(1, "User ID gereklidir"),
  imageurl: z.string()
    .url("URL is not valid")
    .optional()
    .or(z.literal("")),
  trackurl: z.string()
    .url("Geçerli bir track URL'i giriniz")
    .min(1, "Track URL gereklidir"),
  playlistid: z.string().uuid().optional()
})

type UploadForm = z.infer<typeof uploadFormSchema>

export default function FormManager(){
  const { data: session } = useSession()

  const [steps, setSteps] = useAtom(stepsManager)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [track, setTrack] = useState<Song>()
  
  const methods = useForm<UploadForm>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      id: v4(),
      userid: session?.user.id
    },
    mode: 'onChange'
  })
  const { handleSubmit } = methods

  const handleTrackInfo = (data: TrackInfo) => {
    setTrack((prevData) => prevData ? { ...prevData, ...data } : { ...data } as Song)
    if (steps) {
      setSteps({ ...steps, currentStep: steps.currentStep + 1 })
    }
  }

  const handleTrackArtwork = (file?: File | null) => {
    console.log(file)
    if (steps){
      setSteps({ ...steps, currentStep: steps.currentStep + 1 })
    }
    if (file) {
      setImageFile(file)
    }
  }

  const handleUploadedTrack = (file?: File | null) => {
    if (!file) return;
    setAudioFile(file)
    console.log(audioFile, file)
    if (steps) {
      setSteps({ ...steps, currentStep: steps.currentStep + 1 })
    }
  }

  const handleSelectedPlaylist = (playlistId: string) => {
    setTrack((prevData) => prevData ? { ...prevData, playlistid: playlistId } : { playlistid: playlistId } as Song)
    handleSubmit(uploadTrack)
  }

  const uploadTrack = async () => {
    if (!audioFile) {
      setIsLoading(false)
    }

    const dataId = v4()

    setTrack((prevData) => prevData ? { ...prevData, id: dataId } : { id: dataId } as Song)

    try {
      
      const audioFormData = new FormData()
      audioFormData.append("song", audioFile!)
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_CS_URL}track/upload/${dataId}`, {
        body: audioFormData,
        method: "POST",
      })

      if (res.ok) {
        const trackData = await res.json()
        
        if(imageFile) {
          const imageFormData = new FormData()
          imageFormData.append("image", imageFile!)
          
          const trackImageResponse = await fetch(`${process.env.NEXT_PUBLIC_CS_URL}track/upload/image/${dataId}`, {
            method: "POST",
            body: imageFormData
          })

          if (!trackImageResponse.ok) {
            throw new Error("Image upload failed")
          }

          const trackImageData = await trackImageResponse.json()
          setTrack((prevData) => prevData ? { ...prevData, imageurl: trackImageData.url } : { imageurl: trackImageData.url } as Song)
        }

        setTrack((prevData) => prevData ? { ...prevData, trackurl: trackData.url } : { trackurl: trackData.url } as Song)

        const dbResult = await saveTrack(track!)
        if (dbResult) {
          setImageFile(null)
          setAudioFile(null)
        }

      } else {
        toast.error('Track upload failed')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <FormProvider {...methods}>
        <Steps className="my-8" />
        <UploadInfo setInfo={handleTrackInfo} setImage={handleTrackArtwork} className={`hidden ${steps?.currentStep == 1 && "!flex"}`} />
        <UploadArea uploadedTrack={handleUploadedTrack} className={`hidden ${steps?.currentStep == 2 && "!flex"}`} />
        <PlaylistSelector selectedPlaylist={handleSelectedPlaylist} className={`hidden ${steps?.currentStep == 3 && "!flex"}`} />
      </FormProvider>
    </div>
  )
}