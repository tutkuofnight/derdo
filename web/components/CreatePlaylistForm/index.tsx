"use client"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import ImageUpload from "@/components/ImageUpload"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { createPlaylist } from "@/services/playlist"
import { v4 } from "uuid"
import { Playlist } from "@shared/types"
import { useRouter } from "next/navigation"

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [image, setImage] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { data:session } = useSession()
  const { push } = useRouter()

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return
    
    setIsSubmitting(true)
    const form: any = formRef.current

    try {
      const dataId = v4()
      
      // Image dosyası için FormData
      const imageFormData = new FormData()
      if (image) {
        imageFormData.append("image", image)
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_CS_URL}playlist/upload/image/${dataId}`, {
        method: "POST",
        body: imageFormData
      })

      if (!res.ok) {
        return toast({
          title: `Playlist Artwork Upload Error`,
          description: "...",
        })
      }
      const playlistImage = await res.json()
        
      const data: Playlist = {
        id: dataId,
        name: form.name.value.trim(),
        description: form.description.value.trim(),
        image: playlistImage.url,
      }

      const dbResult = await createPlaylist(session?.user.id!, data)
      if (dbResult) {
        toast({
          title: `Playlist: ${data.name} Created Successfully!`,
          description: "...",
        })
        formRef.current?.reset()
        setImage(undefined)
        return push(`/app/playlist/${dataId}`)
      }

    } catch (error) {
      console.error(error)
      toast({
        title: "Error: Create Playlist",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <form className="flex flex-col gap-5" ref={formRef} onSubmit={handleFormSubmit}>
        <div className="flex flex-col md:flex-row justify-center gap-5">
          <ImageUpload changeImage={(file: File) => setImage(file)} />
          <div className="flex flex-1 flex-col gap-4">
            <input type="text" name="name" placeholder="Playlist Name.." required className={`text-xl form-input`} />
            <textarea name="description" placeholder="Description..." className={`h-full form-input`} />
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </form>
    </div>
  )
}