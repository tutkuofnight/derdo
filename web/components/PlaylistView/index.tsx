"use client"
import { Playlist } from "@/types"
import { useState } from "react"
import ImageController from "@/components/controllers/Image"
import { Button } from "@/components/ui/button"
import ImageUpload from "@/components/ImageUpload"
import { PenLine, LoaderCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { updatePlaylist, getUserPlaylists } from "@/services/playlist"
import { useSession } from "next-auth/react"
import { playlistStore, useAtom } from "@/store"

export default function PlaylistView({ playlist }: { playlist: Playlist }){
  const [formMode, setFormMode] = useState<boolean>(false)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [image, setImage] = useState<File>()
  const [data, setData] = useState<{
    image?: string,
    name?: string,
    description?: string
  }>(playlist)

  const { toast } = useToast()
  const { data: session } = useSession()
  const [, setPlaylists] = useAtom(playlistStore)

  const activateFormMode = () => {
    setFormMode(true)
  }

  const handleChange = (key: string, data: string) => {
    setData(prevData => ({ ...prevData, [key]: data}))
  }

  const saveChanges = async () => {
    setIsUpdating(true)

    if (!data) {
      setFormMode(false)
    }

    let uploadImage: string

    try {
      if (image) {
        const formData = new FormData()
        formData.append("image", image)
        
        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_CS_URL}playlist/upload/image/${playlist.id}`, {
          method: "POST",
          body: formData
        })

        if (!uploadResponse.ok) {
          return toast({
            title: `Playlist Artwork Upload Error`,
            description: "...",
          })
        }

        const uploadedImage = await uploadResponse.json()
        if (uploadedImage.url) {
          uploadImage = uploadedImage.url
          setData(prevData => ({...prevData, image: uploadedImage.url}))
        }
      }

      const updatedData = {
        ...data,
        image: uploadImage!,
      }
      const res = await updatePlaylist(playlist.id, updatedData as Playlist)
      
      if (res) {
        const playlists = await getUserPlaylists(session?.user.id!)
        console.log(playlists)
        setPlaylists(playlists)
        setFormMode(false)
        return toast({
          title: `Playlist: ${data?.name || playlist.name} Updated Succesfully`
        })
      }
    } catch (error) {
      return toast({
        title: "Playlist can not updated :(",
        description: "" + error
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-end gap-5 mb-5">
      <div>
        {
          formMode ? <ImageUpload defaultImage={data.image} changeImage={(file) => setImage(file)} /> :
          <ImageController url={data.image} type="playlist" className="w-[200px] h-[200px]" iconSize="w-[60px] h-[60px]" /> 
        }
      </div>
      <div className="mb-3">
        { !formMode && <small className="bg-black text-white dark:bg-white dark:text-black rounded-md py-1 px-2 inline text-xs font-semibold">Playlist</small> }
        <div>
          {
            formMode ? 
              (
                <div className="mb-2">
                  <label htmlFor="name" className="text-xs">Playlist Name</label>
                  <input type="text" id="name" name="name" value={data?.name} placeholder="Playlist Name..." className="text-3xl form-input border-b p-0" onChange={(e: any) => handleChange("name", e.target.value)} /> 
                </div>
              ): (
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold my-2">{data?.name}</h1>
                  <Button variant={"ghost"} size={"icon"} className="w-[30px] h-[30px]" onClick={activateFormMode}>
                    <PenLine className="w-[30px] h-[30px]" />
                  </Button>
                </div>
              )
          }
        </div>
        <div>
          {
            formMode ? (
              <div className="mb-3">
                <label htmlFor="description" className="text-xs">Descripton</label>
                <input id="description" name="description" value={data?.description} placeholder="description..." className="form-input border-b p-0" onChange={(e: any) => handleChange("description", e.target.value)} />
              </div>
            ) :
            <p>{data?.description}</p>
          }
        </div>
        {
          formMode && <Button onClick={saveChanges} disabled={isUpdating}>
            { isUpdating ? <LoaderCircle className="animate-spin duration-700" /> : null }
            Save Changes
          </Button> 
        }
      </div>
    </div>
  )
}