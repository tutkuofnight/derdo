"use client"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { createPlaylist } from "@/app/actions"
import { ListMusic } from "lucide-react"
import { v4 } from "uuid"
import { Playlist } from "@/types"

const inputStyles = "w-full font-bold outline-none bg-transparent py-2"

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [image, setImage] = useState<{ url: string, file: File }>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { data:session } = useSession()

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
        imageFormData.append("image", image.file)
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_CS_URL}playlist/upload/image/${dataId}`, {
        method: "POST",
        body: imageFormData
      })

      if (!res.ok) {
        throw new Error("Image upload failed")
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

  const handleTrackImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImage({url, file})
    }
  }

  return (
    <div className="w-full">
      <form className="flex flex-col gap-5" ref={formRef} onSubmit={handleFormSubmit}>
        <div className="flex flex-col md:flex-row justify-center gap-5">
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
              {image?.url ? (
                <img 
                  src={image.url}
                  className="w-full h-full object-cover rounded-md"
                  alt="Track preview" 
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <ListMusic className="w-10 h-10" />
                  <p className="font-bold">Select Playlist Image</p>
                </div>
              )}
            </div>
          </label>
          <div className="flex flex-1 flex-col gap-4">
            <input type="text" name="name" placeholder="Playlist Name.." required className={`text-xl ${inputStyles}`} />
            <textarea name="description" placeholder="Description..." className={`h-full ${inputStyles}`} />
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </form>
    </div>
  )
}