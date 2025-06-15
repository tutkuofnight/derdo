"use client"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useAtom, stepsManager } from "@/store"
import { Music4, ArrowRight } from "lucide-react"
import { TrackInfo } from "@shared/types/dto"
import { cn } from "@/lib/utils"

export default function UploadInfo(props: { setInfo: (data: TrackInfo) => void, setImage: (file?: File | null) => void, className?: string }) {
  const [image, setImage] = useState<{url: string, file: File}>()
  const [steps, setSteps] = useAtom(stepsManager)

  const { register, formState: { errors }, trigger } = useFormContext()


  const handleTrackImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImage({ url, file })
    }
  }

  const handleNextAction = async () => {
    await trigger()
    if (errors.name && errors.artist) {
      return
    }
    steps && setSteps({ ...steps, currentStep: steps.currentStep + 1 })

    if (image?.file) {
      props.setImage(image?.file)
    }
  }
  
  return (
    <div className={`flex flex-col gap-5 ${props.className}`}>
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
            {image?.url ? (
              <img 
                src={image.url}
                className="w-full h-full object-cover rounded-md"
                alt="Track preview" 
              />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Music4 className="w-10 h-10" />
                <p className="font-bold">Upload ArtWork</p>
              </div>
            )}
          </div>
        </label>
        <div className="flex flex-1 flex-col gap-4 justify-center">
          <input type="text" placeholder="Track Name.." className={cn('text-3xl form-input', {
            'focus:border-red-500': errors.name
          })} {...register("name", { required: true })} />
        </div>
      </div>
      <div className="flex gap-3">
        <input type="text" placeholder="Track Artist.." required className={cn('form-input', {
          'focus:border-red-500': errors.artist
        })} {...register("artist", { required: true })} />
        <input type="text" placeholder="Featurings..." className={cn('form-input', {
          'focus:border-red-500': errors.featurings
        })} {...register("featurings")} />
      </div>
      <Button className="w-full" onClick={handleNextAction}>
        Next
        <ArrowRight />
      </Button>
    </div>
  )
}