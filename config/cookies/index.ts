const spotifyStateCookie = {
  name: "spotify_auth_state",
  maxAge: 60,
};

const sessionCookie = {
  name: "session_id",
  maxAge: 60 * 60 * 24 * 7,
};

export { spotifyStateCookie, sessionCookie };
