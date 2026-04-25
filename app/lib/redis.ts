import "server-only";

import { createClient } from "redis";

declare global {
  var __redisClient: ReturnType<typeof createClient> | undefined;
}

function createRedisClient() {
  const url = process.env.REDIS_URL || "redis://localhost:6379";

  if (!url) {
    throw new Error("REDIS_URL is required");
  }

  return createClient({ url });
}

const redisClient = globalThis.__redisClient ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__redisClient = redisClient;
}

export async function getRedisClient() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient;
}
