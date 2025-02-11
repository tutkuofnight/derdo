import AudioPlayer from "@/components/AudioPlayer"
import Logo from "@/components/Logo"
import Header from "@/components/Header"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function({ children }: { children: React.ReactNode }){
  return (
    <ResizablePanelGroup direction="horizontal" className="overflow-y-hidden lg:max-w-[1366px] lg:mx-auto">
      <ResizablePanel defaultSize={20} minSize={20} maxSize={30} style={{ padding: "20px" }}>
        <div className="h-screen">
          <Logo />
          <div className="mt-4">
            <h1 className="text-sm font-bold my-3 p-1 px-2 bg-black text-white dark:bg-gray-100 dark:text-black inline-block rounded-lg">{"Your Playlists"}</h1>
            <Button variant={"secondary"} className="rounded-xl w-full">
              <Plus></Plus>
              Create Playlist
            </Button>
            <div>
              <p className="text-gray-300 py-4 text-sm px-2">No playlist founded..</p>
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75} style={{ padding: "20px" }}>
        <Header />
        {children}
        <AudioPlayer />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}