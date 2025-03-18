"use server";

import { spotifyStateCookie } from "@/config/cookies";
import { getClient } from "@/config/spotify";
import type { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const client = getClient();
  const { code, state } = req.query;

  if (!code || !state || Array.isArray(code) || Array.isArray(state)) {
    console.error("missing code or state");
    return res.redirect("/");
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get(spotifyStateCookie.name);
  cookieStore.delete(spotifyStateCookie.name);

  if (!storedState) {
    console.error("missing stored state");
    return res.redirect("/");
  }

  if (state !== storedState.value) {
    console.error("state mismatch");
    return res.redirect("/");
  }
}
