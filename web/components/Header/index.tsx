"use client"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { ArrowRight, CloudUpload } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import ThemeSwithcer from "@/components/ThemeSwitcher"

export default function Header() {
  const { data:session, status } = useSession()
  const pathname = usePathname()

  const headerButtons = () => {
    if (status == "authenticated" && pathname == "/") {
      return (
        <Link href="/app">
          <Button className="font-bold">
            Go to Dashboard
            <ArrowRight />
          </Button>
        </Link>
      )
    }
    else if (status == "authenticated") {
      return (
        <div className="flex items-center gap-4">
          <Link href="/app/upload">
            <Button className="font-bold">
              <CloudUpload />
              Upload
            </Button>
          </Link>
          <ThemeSwithcer />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Image src={session.user?.image as string} alt={session.user?.name as string}  width={36} height={36} className="rounded-full" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    } else {
      return (
        <a href="http://" target="_blank" rel="noopener noreferrer">
          <Button variant={"outline"}>Open Source <Image src={"/heart.png"} width={16} height={16} alt="<3" /></Button>
        </a>
      )
    }
  }

  return (
    <>
      { !pathname.includes("/join") && (
        <header className="flex items-center justify-end w-full">
          <div className="flex items-center gap-3">
            { headerButtons() }
          </div>
        </header>
      )}
    </>
  )
}
