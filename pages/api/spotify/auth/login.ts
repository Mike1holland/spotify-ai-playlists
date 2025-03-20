"use server";

import { spotifyStateCookie } from "@/config/cookies";
import { getClient } from "@/config/spotify";
import { createAuthorizeURL } from "@/models/spotify/auth";
import cookie from "cookie";
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

    res
      .setHeader(
        "Set-Cookie",
        cookie.serialize(name, state, {
          maxAge,
          sameSite: "strict",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
        })
      )
      .redirect(url);
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
}
