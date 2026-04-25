import "server-only";

import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { WebhookDatabase } from "./webhook-types";

declare global {
  var __webhookDb: Kysely<WebhookDatabase> | undefined;
}

function createWebhookDb() {
  const connectionString =
    process.env.DATABASE_WEBHOOK_URL ||
    "postgres://postgres:password@localhost:5432/webhook_db";

  if (!connectionString) {
    throw new Error("DATABASE_WEBHOOK_URL is required");
  }

  return new Kysely<WebhookDatabase>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString,
        max: Number(process.env.WEBHOOK_DB_POOL_MAX ?? 10),
      }),
    }),
  });
}

export const webhookDb = globalThis.__webhookDb ?? createWebhookDb();

if (process.env.NODE_ENV !== "production") {
  globalThis.__webhookDb = webhookDb;
}
