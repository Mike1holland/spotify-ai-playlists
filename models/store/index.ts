import type { RedisClientType } from "@redis/client";
import { createClient } from "redis";

let client: RedisClientType | null = null;
async function getRedisStore(): Promise<RedisStore> {
  const config = getConfig();
  if (!client) {
    client = createClient(config);
    client.connect();
  }
  return client;
}

abstract class RedisStore {
  abstract get(key: string): Promise<string | null>;
  abstract set(key: string, value: string): Promise<any>;
  abstract del(key: string): Promise<any>;
  abstract setEx(key: string, seconds: number, value: string): Promise<any>;
}

export { getRedisStore, type RedisStore };

function getConfig() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error("REDIS_URL is not set");
  }
  return {
    url: redisUrl,
  };
}
