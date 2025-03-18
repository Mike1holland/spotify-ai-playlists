"use server";

import { spotifyStateCookie, sessionCookie } from "@/config/cookies";
import { updateSession } from "@/config/session";
import { getClient } from "@/config/spotify";
import { getRedisStore } from "@/config/store";
import { authorizationCodeGrant } from "@/models/spotify/auth";
import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = getClient();
    const { code, state } = req.query;
    const cookies = req.cookies;

    if (!code || !state || Array.isArray(code) || Array.isArray(state)) {
      console.error("missing code or state");
      res.redirect("/");
      return;
    }

    const storedState = cookies[spotifyStateCookie.name];

    if (!storedState) {
      console.error("missing stored state");
      res.redirect("/");
      return;
    }

    if (state !== storedState) {
      console.error("state mismatch");
      res.redirect("/");
      return;
    }

    const { access_token, refresh_token, expires_in, scope } =
      await authorizationCodeGrant(client, code, storedState, state);

    const redisStore = await getRedisStore();
    const sessionId = randomUUID();
    await updateSession(
      sessionId,
      {
        spotifyAccessToken: access_token,
        spotifyRefreshToken: refresh_token,
        spotifyExpiresIn: expires_in,
        spotifyScope: scope,
        spotifyValidUntil: Date.now() + expires_in * 1000,
      },
      redisStore
    );

    const { name, maxAge } = sessionCookie;

    res
      .setHeader(
        "Set-Cookie",
        cookie.serialize(name, sessionId, {
          maxAge,
        })
      )
      .redirect("/");
  } catch (e) {
    console.error(e);
    res.redirect("/");
  }
}
