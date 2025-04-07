'use server'

import { revalidatePath } from "next/cache"
import getPath from "@/utils/get-path"

export default async function(){
  revalidatePath(await getPath())
}