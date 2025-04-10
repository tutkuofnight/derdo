import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Playlist, Song } from "@shared/types";
import { getUserUploadedTracks } from "@/services/tracks";
import { getUserPlaylists } from "@/services/playlist";
import SayWelcome from "@/components/SayWelcome";
import Tracklist from "@/components/Tracklist";
import AppLayout from "@/layouts/app-layout";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return (
      <div>
        You are not authenticated. Please sign in.
      </div>
    )
  }

  const userId = session.user.id;

  const tracks: Song[] = await getUserUploadedTracks(userId);
  const playlists: Playlist[] = await getUserPlaylists(userId);

  return (
    <AppLayout playlists={playlists}>
      <SayWelcome />
      <Tracklist tracklist={tracks} />
    </AppLayout>
  );
}
