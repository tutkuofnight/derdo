"use client"
import { HardDriveUpload, ArrowRight } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { toast } from "sonner"

export default function UploadArea(props: { uploadedTrack: (file?: File | null) => void, className?: string }) {
  const [active, setActive] = useState<boolean>(false)
  const [file, setFile] = useState<{
    isUploaded?: boolean,
    fileName?: string,
    file?: File
  }>({})

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setActive(true)
  }
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setActive(false)
  }
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setActive(true)
  }
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setActive(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === "audio/mpeg") {
        setFile({
          isUploaded: true,
          fileName: file.name,
          file: file
        })
      } else {
        toast.error('Invalid file type. Please upload an audio/mpeg file.')
      }
    }
  }

  const handleRemoveUploadedFile = () => {
    setFile({})
  }

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === "audio/mpeg") {
        setFile({
          isUploaded: true,
          fileName: file.name,
          file: file
        })
      } else {
        toast.error("Invalid file type. Please upload an audio/mpeg file.")
      }
    }
  }

  return (
    <div className={`p-4 mt-4 w-full flex flex-col items-center justify-center gap-4 ${props.className}`}>
      <label htmlFor="selector" className="w-[80%] flex justify-center items-center">
        <input type="file" className="hidden" id="selector" onChange={handleSelectFile} />
        <div onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`${active ? "border-none bg-white bg-opacity-5 outline-2 outline-blue-400 outline-dashed" : null } w-full h-[300px] border-dashed border rounded-md flex items-center justify-center flex-col gap-2 cursor-pointer select-none`}>
          {
            file.isUploaded ? (
              <div className="flex items-center justify-center flex-col gap-2">
                <h1 className="text-xl font-semibold">{file.fileName}</h1>
                <p className="text-sm text-white">File Uploaded</p>
              </div>
            ) : (
              <>
                <HardDriveUpload className="w-[50px] h-[50px] mb-2" />
                <h1 className="text-xl font-semibold">Click or drag audio file to this area to upload</h1>
                <small className="text-gray-400">Accepting audio/mpeg files</small>
              </>
            )
          }
        </div>
      </label>
      <div className="flex items-center justify-center mt-4 gap-2">
        {file.isUploaded && (
          <Button onClick={handleRemoveUploadedFile} variant={"destructive"} className="w-full">Remove file</Button>
        )}
        <Button className="w-full" disabled={!file.isUploaded} onClick={() => props.uploadedTrack(file.file)}>
          Next 
          {file.isUploaded && <ArrowRight />}
        </Button>
      </div>
    </div>
  )
}