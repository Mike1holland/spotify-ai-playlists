"use server";

import { spotifyStateCookie } from "@/config/cookies";
import { getClient } from "@/config/spotify";
import { createAuthorizeURL } from "@/models/spotify/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = getClient();
  const { url, state } = createAuthorizeURL(client, [
    "playlist-modify-private",
    "playlist-modify-public",
    "playlist-read-private",
    "playlist-read-collaborative",
  ]);

  const cookieStore = await cookies();
  const { name, maxAge } = spotifyStateCookie;
  cookieStore.set(name, state, {
    maxAge,
  });

  return res.redirect(url);
}
