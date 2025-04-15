"use client"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { ArrowRight, CloudUpload, Menu } from "lucide-react"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"

import Sidebar from "@/components/Sidebar"
import { Button } from "@/components/ui/button"
import ThemeSwithcer from "@/components/ThemeSwitcher"
import Logo from "@/components/Logo"
import isResponsive from "@/hooks/is-reponsive"

export default function Header() {
  const { data:session, status } = useSession()
  const pathname = usePathname()
  const { push } = useRouter()
  const width = isResponsive()
  const isMobile = width < 640
  
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
            <Button size={isMobile ? "icon" : "default"} className="font-bold">
              <CloudUpload />
              <span className="hidden sm:block">Upload</span>
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
              <DropdownMenuItem onClick={() => push("/app/profile")}>Profile</DropdownMenuItem>
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
        <header className="flex items-center justify-between md:justify-end w-full">
          <div className="md:hidden flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button size={'icon'} variant={'ghost'}>
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side={"left"} className="w-[300px] p-5">
                <Sidebar />
              </SheetContent>
            </Sheet>
            <Logo />
          </div>
          <div className="flex items-center gap-3">
            { headerButtons() }
          </div>
        </header>
      )}
    </>
  )
}
