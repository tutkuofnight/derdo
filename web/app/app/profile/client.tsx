"use client"

import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from 'react'
import { User } from '@shared/types'
import AppLayout from '@/layouts/app-layout'
import ImageUpload from '@/components/ImageUpload'
import { Playlist } from '@shared/types'
import { updateUser } from '@/services/users'
import { useToast } from "@/hooks/use-toast"

export default function Profile({ playlists }: { playlists: Playlist[] }) {
  const { data: session } = useSession()
  const [userData, setUserData] = useState<User>()
  const { toast } = useToast()
  const formData = new FormData()

  useEffect(() => {
    setUserData(session?.user as User)
  }, [session?.user])

  const changeImage = (file: File) => {
    formData.append('image', file)
  }
  
  const changeName = (e: any) => {
    setUserData({...userData, name: e.target.value} as User)
  }

  const saveChanges = async () => {
    if (!formData.get('image')) {
      const user = await updateUser(session?.user.id!, { name: userData?.name } as User)
      if (user) {
        return toast({
          title: "Profile Updated",
          description: "Profile has been updated successfully",
        })
      } else {
        return toast({
          title: "Error",
          description: "An error occurred while updating profile",
          variant: "destructive"
        })
      }
    } else {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CS_URL}user/upload/image/${session?.user.id}`, {
        body: formData,
        method: "POST",
      })
      if (res.ok) {
        const data = await res.json()
        const user = await updateUser(session?.user.id!, { name: userData?.name, image: data.url } as User)
        if (user) {
          return toast({
            title: "Profile Updated",
            description: "Profile has been updated successfully",
          })
        } else {
          return toast({
            title: "Error",
            description: "An error occurred while updating profile",
            variant: "destructive"
          })
        }
      } else {
        return toast({
          title: "Error",
          description: "An error occurred while updating profile",
          variant: "destructive"
        })
      }
    }
  }

  return (
    <AppLayout playlists={playlists}>
      <div className='flex flex-col items-center justify-center h-1/2'>
        <div className='flex flex-col gap-14'>
          <h1 className='font-bold text-2xl justify-self-start'>Profile</h1>
          <div className='flex flex-col md:flex-row items-center gap-14'>
            <div className='flex flex-col items-center'>
              { userData?.image ? <ImageUpload changeImage={changeImage} variant="circle" text="Select Profile Image" defaultImage={userData.image!} /> : <div className='w-[200px] h-[200px] grid place-items-center border rounded-full'>Loading...</div>}
            </div>
            <div>
              <Label htmlFor="name">
                Profile Name
                <Input id='name' value={userData?.name || ''} onChange={changeName} className='mt-1' />
              </Label>
            </div>
          </div>
          <Button onClick={saveChanges}>Save Changes</Button>
        </div>
      </div>
    </AppLayout>
  )
}