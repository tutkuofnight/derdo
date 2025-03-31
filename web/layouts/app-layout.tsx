"use client"

import Header from "@/components/Header"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Sidebar from "@/components/Sidebar"

import { Playlist } from "@shared/types"
import { playlistStore, useAtom } from "@/store"
import { useMemo, useEffect } from "react"

export default function AppLayout({ playlists, children }: { playlists?: Playlist[], children: React.ReactNode }) {
  const [playlist, setPlaylist] = useAtom(playlistStore);

  useEffect(() => {
    if (playlists && playlists.length > 0) {
      setPlaylist(playlists);
    }
  }, [playlists]);

  const memoizedSidebar = useMemo(() => {
    return <Sidebar />;
  }, [playlist]);

  return (
    <ResizablePanelGroup direction="horizontal" className="overflow-y-hidden lg:max-w-[1366px] lg:mx-auto">
      <ResizablePanel defaultSize={20} minSize={20} maxSize={30} style={{ padding: "20px" }} className="hidden md:block">
        {memoizedSidebar}
      </ResizablePanel>
      <ResizableHandle className="hidden md:block" />
      <ResizablePanel defaultSize={75} style={{ padding: "20px" }}>
        <Header />
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}