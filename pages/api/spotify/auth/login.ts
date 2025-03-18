"use server";

import { spotifyStateCookie } from "@/config/cookies";
import { getClient } from "@/config/spotify";
import { createAuthorizeURL } from "@/models/spotify/auth";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = getClient();
    const { url, state } = createAuthorizeURL(client, [
      "playlist-modify-private",
      "playlist-modify-public",
      "playlist-read-private",
      "playlist-read-collaborative",
    ]);

    const { name, maxAge } = spotifyStateCookie;

    return res
      .setHeader(
        "Set-Cookie",
        `${name}=${state}; sameSite=strict; httpOnly=true; Max-Age=${maxAge}`
      )
      .redirect(url);
  } catch (error) {
    console.error(error);
    return res.redirect("/");
  }
}
