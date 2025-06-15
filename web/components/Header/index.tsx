"use client"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { ArrowRight, CloudUpload, Menu, X } from "lucide-react"
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
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

import Sidebar from "@/components/Sidebar"
import { Button } from "@/components/ui/button"
import ThemeSwithcer from "@/components/ThemeSwitcher"
import Logo from "@/components/Logo"
import isResponsive from "@/hooks/is-reponsive"
import FormManager from "../TrackUploadFields/form-manager"
import { useState } from "react"

export default function Header() {

  const { data:session, status } = useSession()
  const pathname = usePathname()
  const { push } = useRouter()
  const width = isResponsive()
  const isMobile = width < 640
  const [openUploadDrawer, setOpenUploadDrawer] = useState<boolean>(false)

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
          <Drawer open={openUploadDrawer} onOpenChange={setOpenUploadDrawer}>
            <DrawerTrigger asChild>
              <Button size={isMobile ? "icon" : "default"} className="font-bold">
                <CloudUpload />
                <span className="hidden sm:block">Upload</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[90vh]">
              <div>
                <DrawerTitle className="text-center mt-10 text-3xl">Upload Track</DrawerTitle>
                <Button variant={"ghost"} size={"icon"} className="absolute top-5 right-5" onClick={() => setOpenUploadDrawer(false)}>
                  <X />
                </Button>
              </div>
              <FormManager></FormManager>
            </DrawerContent>
          </Drawer>
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
