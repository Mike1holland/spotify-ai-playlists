import type { RedisClientType } from "@redis/client";
import { createClient } from "redis";

let client: RedisClientType | null = null;
async function getRedisStore() {
  const config = getConfig();
  if (!client) {
    client = createClient(config);
    client.connect();
  }
  return client;
}

export { getRedisStore };

function getConfig() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error("REDIS_URL is not set");
  }
  return {
    url: redisUrl,
  };
}
