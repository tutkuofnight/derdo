"use client"
import { Music } from "lucide-react"
export default function ({ url, className }: { url?: string, className?: string }){
  if (url){
    return <img src={url} className={`rounded-md ${className}`} />
  }
  return (
    <div className={`grid place-items-center rounded-md p-2 bg-gray-200 dark:bg-white dark:bg-opacity-10 ${className}`}>
      <Music className="text-gray-600 dark:text-gray-400" />
    </div>
  )
}