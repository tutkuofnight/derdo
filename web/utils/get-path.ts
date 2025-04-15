'use server'

// Get Your App Current Full Pathname

import { headers } from 'next/headers'

export default async function(){
  const headersList = await headers()
  const referer = headersList.get('referer') || ''
  
  const url = new URL(referer)
  return url.pathname
}