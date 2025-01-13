"use client"
import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { Song } from "@/types"
import { saveTrack } from "@/app/actions"
import { UploadFormSchema } from "@/lib/schemas"

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null)
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

    // const validationResult = UploadFormSchema.parse(data)
    // console.log(validationResult)

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_CS_URL + "track/upload", {
        body: formData,
        method: "POST",
      })
      const uploadResult = await res.json()
      if (res.ok) {
        const data: Song = {
          id: uploadResult.id,
          name: form.name.value.trim(),
          artist: form.artist.value.trim(),
          featurings: form.featurings.value.trim(),
          userId: session?.user.id as string
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

  return (
    <form className="flex flex-col gap-4" ref={formRef} onSubmit={handleFormSubmit}>
      <h1 className="text-3xl font-bold">Upload Track</h1>
      <Input type="text" name="name" placeholder="Track Name.." required />
      <div className="flex gap-3">
        <Input type="text" name="artist" placeholder="Track Artist.." required />
        <Input type="text" name="featurings" placeholder="Featurings..." />
      </div>
      <Label htmlFor="track">Click here and upload track</Label>
      <Input 
        id="track" 
        type="file" 
        className="-mt-2" 
        onChange={handleUploadFile}
        required
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Uploading..." : "Submit Form"}
      </Button>
    </form>
  )
}