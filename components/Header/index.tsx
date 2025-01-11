"use client"
import { useRouter, usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { AudioLines, CloudUpload } from "lucide-react"
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
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import UploadForm from "@/components/UploadForm"

export default function Header() {
  const { data:session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    signOut()
    router.push("/")
  }

  return (
    <>
      { !pathname.includes("/join") && (
        <header className="flex items-center justify-between w-full p-4 lg:w-[1024px] lg:mx-auto">
        <Link href="/app">
          <h1 className="text-2xl font-logo flex items-center gap-2 cursor-pointer">
            derdo
            <AudioLines className="w-6 h-6" />
          </h1>
        </Link>
        <div className="flex items-center gap-3">
          {
            status == "authenticated" ? (
              <div className="flex items-center gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="font-bold">
                      <CloudUpload />
                      Upload
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <UploadForm />
                  </DialogContent>
                </Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Image src={session.user?.image as string} alt={session.user?.name as string}  width={36} height={36} className="rounded-full" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

            ) : (
              <a href="http://" target="_blank" rel="noopener noreferrer">
                <Button variant={"outline"}>Open Source <Image src={"/heart.png"} width={16} height={16} alt="<3" /></Button>
              </a>
            )
          }
        </div>
      </header>
    )}
    </>
  )
}
