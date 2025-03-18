import { getSession } from "@/config/session";
import { getClient } from "@/config/spotify";
import { getRedisStore } from "@/config/store";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sessionId = req.cookies.session_id;
    if (!sessionId) {
      res.redirect("/");
      return;
    }
    const redisStore = await getRedisStore();
    const session = await getSession(sessionId, redisStore);
    if (!session || !session.data) {
      return res.redirect("/");
      return;
    }
    const client = getClient({
      accessToken: session.data.spotifyAccessToken,
      refreshToken: session.data.spotifyAccessToken,
    });

    const { limit, offset } = req.query;

    const reqLimit = Number(limit);
    const reqOffset = Number(offset);

    if (isNaN(reqLimit) || isNaN(reqOffset)) {
      res.status(400).json({
        error: "Invalid limit or offset",
      });
      return;
    }

    const {
      body: { items, next, total },
    } = await client.getUserPlaylists({
      limit: reqLimit,
      offset: reqOffset,
    });

    res.json({
      items,
      next,
      total,
    });
  } catch (e) {
    console.error(e);
    res.redirect("/");
  }
}
