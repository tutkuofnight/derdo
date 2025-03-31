"use client"
// import OnlineAudioPlayer from "@/components/AudioPlayer"

import Header from "@/components/Header"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Sidebar from "@/components/Sidebar"

export default function({ children }: { children: React.ReactNode }){
  return (
    <ResizablePanelGroup direction="horizontal" className="overflow-y-hidden lg:max-w-[1366px] lg:mx-auto">
      <ResizablePanel defaultSize={20} minSize={20} maxSize={30} style={{ padding: "20px" }}>
        <Sidebar />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75} style={{ padding: "20px" }}>
        <Header />
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}