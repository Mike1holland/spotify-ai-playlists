import SpotifyWebApi from "spotify-web-api-node";

function getConfig() {
  if (!process.env.SPOTIFY_CLIENT_ID) {
    throw new Error("SPOTIFY_CLIENT_ID is not set");
  }
  if (!process.env.SPOTIFY_CLIENT_SECRET) {
    throw new Error("SPOTIFY_CLIENT_SECRET is not set");
  }
  if (!process.env.SPOTIFY_REDIRECT_URI) {
    throw new Error("SPOTIFY_REDIRECT_URI is not set");
  }
  if (!process.env.VERCEL_URL) {
    throw new Error("VERCEL_URL is not set");
  }
  if (!process.env.VERCEL_ENV) {
    throw new Error("VERCEL_ENV is not set");
  }

  const protocol = process.env.VERCEL_ENV === "development" ? "http" : "https";

  return {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: `${protocol}://${process.env.VERCEL_URL}${process.env.SPOTIFY_REDIRECT_URI}`,
  };
}

let client: SpotifyWebApi | null = null;
function getClient(auth?: { accessToken: string; refreshToken: string }) {
  const config = getConfig();
  if (!client) {
    client = new SpotifyWebApi(config);
  }
  if (auth) {
    client.setAccessToken(auth.accessToken);
    client.setRefreshToken(auth.refreshToken);
  }
  return client;
}

export { getClient };
