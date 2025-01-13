import AudioPlayer from "@/components/AudioPlayer"

export default function({ children }: { children: React.ReactNode }){
  return (
    <main>
      {children}
      <AudioPlayer />
    </main>
  )
}