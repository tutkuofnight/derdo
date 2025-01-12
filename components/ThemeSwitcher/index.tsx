"use client"

import { useTheme } from "next-themes"
import { MoonStar, SunMedium } from "lucide-react"
import { Button } from "../ui/button"

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <Button size={"icon"} variant={"outline"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? <MoonStar className="w-6 h-6" /> : <SunMedium className="w-6 h-6" />}
    </Button>
  )
}