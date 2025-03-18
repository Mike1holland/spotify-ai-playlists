import type SpotifyWebApi from "spotify-web-api-node";

function createAuthorizeURL(client: SpotifyWebApi, scopes: string[]) {
  const state = crypto.randomUUID();

  return {
    url: client.createAuthorizeURL(scopes, state),
    state,
  };
}

async function authorizationCodeGrant(
  client: SpotifyWebApi,
  code: string,
  storedState: string,
  returnedState: string
) {
  if (storedState !== returnedState) {
    throw new Error("state mismatch");
  }

  const data = await client.authorizationCodeGrant(code);

  return {
    access_token: data.body.access_token,
    refresh_token: data.body.refresh_token,
    expires_in: data.body.expires_in,
    scope: data.body.scope,
  };
}

export { createAuthorizeURL, authorizationCodeGrant };
