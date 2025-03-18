import Container from "@/ui/components/global/container";
import Button, { ButtonClass, ButtonType } from "@/ui/components/global/button";
import TextInput from "@/ui/components/global/text-input";
import { cookies } from "next/headers";
import { sessionCookie } from "@/config/cookies";
import PlaylistList from "../spotify/playlists/list";

const Home = async () => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(sessionCookie.name);

  return (
    <Container>
      <h1 className="text-6xl leading-none my-8 font-semibold text-center">
        Spotify AI Playlists
      </h1>
      {sessionId ? (
        <div className="flex flex-col items-center gap-4 w-full">
          <h2 className="text-4xl text-center w-full">Playlists</h2>
          <div className="w-full" id="playlist-root">
            <PlaylistList playlists={[]} />
          </div>
          <div>
            <p className="text-2xl text-center">
              Enter a prompt for the playlist you would like to create/update
            </p>
          </div>
          <div className="w-full">
            <TextInput autoFocus={true} />
          </div>
          <Button buttonClass={ButtonClass.Primary} text="Create Playlist" />
        </div>
      ) : (
        <Button
          buttonClass={ButtonClass.Primary}
          buttonType={ButtonType.Link}
          href="/api/spotify/auth/login"
          text="Login with Spotify"
        />
      )}
    </Container>
  );
};

export default Home;
