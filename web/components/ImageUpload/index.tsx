"use client"
import { useEffect, useState } from "react"
import { ImageUp } from "lucide-react"

export default function ImageUpload(props: { changeImage: (file: File) => void, text?: string, defaultImage?: string, variant?: "rounded" | "circle" }) {
  const [image, setImage] = useState<{ url: string, file?: File }>()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImage({url, file})
      props.changeImage(file)
    }
  }

  useEffect(() => {
    if (props.defaultImage) {
      setImage({ url: props.defaultImage })
    }
  }, [])

  const variantStyles = () => {
    switch (props.variant) {
      case "rounded":
        return "rounded-md"
      case "circle":
        return "rounded-full"
      default:
        return "rounded-md"
    }
  } 

  return (
    <>
      <input
        type="file"
        id="image"
        name="image"
        className="hidden"
        onChange={handleChange}
        accept="image/jpeg,image/jpg,image/png,image/gif"
      />
      <label
        htmlFor="image"
        className={`flex justify-center items-center w-[200px] h-[200px] border border-dashed bg-white bg-opacity-5 border-white border-opacity-20 hover:border-white cursor-pointer ${variantStyles()}`}
      >
        <div className="flex flex-col items-center gap-5">
          {image?.url ? (
            <img
              src={image.url}
              className={`w-full h-full object-cover ${variantStyles()}`}
              alt="Track preview"
            />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <ImageUp className="w-10 h-10" />
              <p className="font-bold">{props.text ?? "Select ArtWork"}</p>
            </div>
          )}
        </div>
      </label>
    </>
  )
}
