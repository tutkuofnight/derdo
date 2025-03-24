"use client"
import { useEffect, useState } from 'react'

export default function isResponsive(){
  const [currentWidth, setCurrentWidth] = useState<number>(window.innerWidth)
  useEffect(() => {
    window.addEventListener("resize", (e) => setCurrentWidth(e.view?.innerWidth ?? window.innerWidth))
  }, [window.innerWidth])
  return currentWidth
}