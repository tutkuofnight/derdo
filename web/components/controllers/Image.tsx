"use client"
import { Music, ListMusic, FileMusic } from "lucide-react"
import { useState, useEffect } from "react"

export default function ({ url, className, iconSize, type }: { url?: string, className?: string, iconSize?: string, type: "track" | "playlist" }){
  const [icon, setIcon] = useState<React.ReactNode>()
  const iconStyles = "text-gray-600 dark:text-gray-400"
  
  useEffect(() => {
    if (type) {
      switch (type) {
        case "track":
          setIcon(<Music className={`${iconStyles} ${iconSize}`} />)
          break;
        case "playlist": 
          setIcon(<ListMusic className={`${iconStyles} ${iconSize}`} />)
          break;
        default:
          setIcon(<FileMusic className={`${iconStyles} ${iconSize}`} />)
          break;
      }
    }
  }, [type, iconStyles, iconSize])

  if (url){
    return <img src={url} className={`rounded-md object-cover ${className}`} />
  }

  return (
    <div className={`grid place-items-center rounded-md p-2 bg-gray-200 dark:bg-white dark:bg-opacity-10 ${className}`}>
      {icon}
    </div>
  )
}