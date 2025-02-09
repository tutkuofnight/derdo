"use client"
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { Song } from "@/types"
import { saveTrack } from "@/app/actions"
// import { UploadFormSchema } from "@/lib/schemas"
import { Music4, Upload } from "lucide-react"
import { v4 } from "uuid"

const inputStyles = "font-bold outline-none bg-transparent placeholder:text-white placeholder:text-opacity-20 py-2"

export default function UploadForm({ type }: {type?: "update" | null}) {
  const formRef = useRef<HTMLFormElement>(null)
  const imagePreviewRef = useRef<HTMLImageElement>(null)
  const [image, setImage] = useState<{ url: string, file: File }>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { data:session } = useSession()
  
  const formData = new FormData()

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return
    
    setIsSubmitting(true)
    const form: any = formRef.current

    if (!formData.has("song")) {
      setIsSubmitting(false)
      toast({
        title: "Error",
        description: "Please select a song file",
        variant: "destructive"
      })
      return
    }
    if (!image?.file) {
      toast({
        title: "Error",
        description: "Please select a track badge",
        variant: "destructive"
      })
      return
    }

    formData.append("image", image?.file!)
    // const validationResult = UploadFormSchema.parse(data)
    // console.log(validationResult)

    try {
      const dataId = v4()
      const res = await fetch(`${process.env.NEXT_PUBLIC_CS_URL}track/upload/${dataId}`, {
        body: formData.get("song"),
        method: "POST",
      })
      if (res.ok) {
        const trackData = await res.json()
        const trackImageResponse = await fetch(`${process.env.NEXT_PUBLIC_CS_URL}track/upload/image/${dataId}`, {
          method: "POST",
          body: formData.get("image")
        })
        const trackImageData = await trackImageResponse.json()
        
        const data: Song = {
          id: dataId,
          name: form.name.value.trim(),
          artist: form.artist.value.trim(),
          featurings: form.featurings.value.trim(),
          userId: session?.user.id as string,
          imageUrl: trackImageData.url ?? "",
          trackUrl: trackData.url
        }

        const dbResult = await saveTrack(data)
        if (dbResult) {
          toast({
            title: "Track Successfully Uploaded",
            description: "...",
          })
          formRef.current?.reset()
        }

      } else {
        toast({
          title: "Upload Error",
          description: "...",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      formData.append("song", file)
    }
  }
  const handleTrackImage = (e: any) => {
    const file = e.target.files[0]
    console.log(file)
    if (file) {
      formData.append("image", file)
      const url = URL.createObjectURL(file)
      setImage({url, file})
    }
  };

  useEffect(() => {
    if (imagePreviewRef.current) {
      imagePreviewRef.current.src = image?.url!
    }
  }, [imagePreviewRef.current, image?.url])

  return (
    <form className="flex flex-col gap-5" ref={formRef} onSubmit={handleFormSubmit}>
      <h1 className="text-3xl font-bold">Upload Track</h1>
      <div className="flex flex-col md:flex-row justify-center gap-10">
        <input 
          type="file"
          id="image"
          name="image"
          className="hidden"
          onChange={handleTrackImage}
          accept="image/jpeg,image/jpg,image/png,image/gif"
        />
        <label 
          htmlFor="image" 
          className="flex justify-center items-center w-[200px] h-[200px] rounded-md border border-dashed bg-white bg-opacity-5 border-white border-opacity-20 hover:border-white cursor-pointer"
        >
          <div className="flex flex-col items-center gap-5">
            <img ref={imagePreviewRef} className={`${!image?.url? "hidden" : "block"} w-full h-full object-cover rounded-md`} />
            <div className={`${!image?.url ? "flex flex-col items-center gap-4" : "hidden"}`}>
              <Music4 className="w-10 h-10" />
              <p className="font-bold">Upload Track Image</p>
            </div>
          </div>
        </label>
        <div className="flex flex-1 flex-col gap-4 justify-end">
          <input type="text" name="name" placeholder="Track Name.." required className={`text-3xl ${inputStyles}`} />
          <div className="flex gap-3">
            <input type="text" name="artist" placeholder="Track Artist.." required className={inputStyles} />
            <input type="text" name="featurings" placeholder="Featurings..." className={inputStyles} />
          </div>
        </div>
      </div>
      <Label htmlFor="track">Choose track file</Label>
      <Input 
        id="track" 
        type="file" 
        className="-mt-2 cursor-pointer" 
        onChange={handleUploadFile}
        required
        accept="audio/mpeg,audio/mp3"
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Uploading..." : "Upload"}
      </Button>
    </form>
  )
}