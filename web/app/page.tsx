import { AudioLines, Disc3, ListMusic, FileMusic, User, MoveRight, MoveLeft } from "lucide-react"

import Auth from "@/components/Auth"
import Header from "@/components/Header"
import Logo from "@/components/Logo"

const featuresData: any[] = [
  {
    title: "Create Playlist",
    description: "First step, create a playlist to upload your tracks.",
    icon: <ListMusic className="w-14 h-14" />,
  },
  {
    title: "Upload Tracks",
    description: "Second step, upload your tracks to your playlist.",
    icon: <FileMusic className="w-14 h-14" />,
  },
  {
    title: "Listen Together",
    description: "Listen music together with your friends in real-time.",
    icon: (
      <div className="flex items-center relative">
        <User className="w-14 h-14" />
        <div className="flex items-center gap-1 mt-6">
          <div className="flex flex-col *:-mt-6">
            <MoveLeft className="w-7 h-7 mb-2" />
            <MoveRight className="w-7 h-7 mt-2" />
          </div>
        </div>
        <User className="w-14 h-14" />
      </div>
    ),
  },
]

export default function Home() {
  return (
    <main>
      <div className="flex items-center justify-between">
        <Logo />
        <Header />
      </div>
      <section className="h-[300px] lg:h-[400px] flex justify-between relative">
        <div className="flex flex-col h-full justify-center gap-4">
          <h1 className="text-3xl lg:text-5xl font-normal flex items-center gap-2 lg:gap-6"> 
            <p>Welcome to <span className="font-logo font-normal">derdo</span></p>
            <AudioLines className="w-8 h-8 lg:w-14 lg:h-14" />
          </h1>
          <p>The platform for upload and listen music together with your friends.</p>
          <div className="flex items-center gap-2 mt-2">
            <Auth />
          </div>
        </div>
        <div className="flex h-full items-center">
          <Disc3 className="w-40 h-40 lg:w-72 lg:h-72 text-gray-100 dark:text-white dark:text-opacity-5 animate-spin duration-disc-spin absolute -z-10 top-[8px] right-[9px] lg:relative lg:top-0 lg:right-0 lg:text-black lg:dark:text-white" />
          {/* <Music4 className="lg:w-72 lg:h-72 text-blue-600 absolute right-[105px] top-[100px]" /> */}
        </div>
      </section>

      <section>
        <div className="flex flex-col items-center gap-8 rounded-md">
          <h2 className="text-3xl font-bold">The Steps Using <span className="rounded-md bg-neutral-800 font-logo font-normal">derdo</span></h2>
          <div className="flex flex-col md:flex-row w-full gap-8">
            {featuresData.map((feature, index) => (
              <div key={index} className="flex flex-col items-center justify-center w-full h-[300px] gap-6 p-4 px-8 rounded-lg bg-neutral-800/60 transition-all duration-300 hover:bg-neutral-300 hover:dark:bg-neutral-800/80">
                {feature.icon}
                <div className="flex flex-col items-center justify-center gap-2 px-4">
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-center">{feature.description}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>
    </main>
  );
}
