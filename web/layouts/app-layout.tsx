"use client"
// import OnlineAudioPlayer from "@/components/AudioPlayer"
import DefaultAudioPlayer from "@/components/AudioPlayer/default"

import Header from "@/components/Header"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Sidebar from "@/components/Sidebar"
import { Playlist } from "@/types"
import { playlistStore, useAtom } from "@/store"
import { useMemo, useEffect } from "react"

export default function({ playlists, children }: { playlists?: Playlist[], children: React.ReactNode }){
  const [ playlist, setPlaylist ] = useAtom(playlistStore)

  if (playlists && playlists.length > 0) {
    setPlaylist(playlists)
  }

  const memoizedSidebar = useMemo(() => {
    return <Sidebar />
  }, [playlist])

  return (
    <ResizablePanelGroup direction="horizontal" className="overflow-y-hidden lg:max-w-[1366px] lg:mx-auto">
      <ResizablePanel defaultSize={20} minSize={20} maxSize={30} style={{ padding: "20px" }}>
        {memoizedSidebar}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75} style={{ padding: "20px" }}>
        <Header />
        {children}
        <DefaultAudioPlayer />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}