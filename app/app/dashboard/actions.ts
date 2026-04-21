"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { webhookDb } from "@/lib/db/webhook-db";
import { generateSignKey } from "@/lib/sign-key";
import { isValidWebhookSettingsPayload } from "@/lib/webhook";
import type { Selectable } from "kysely";
import type { WebhooksLogTable } from "@/lib/db/webhook-types";
import { getRedisClient } from "@/lib/redis";

async function getAuthedUserIdOrThrow() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.id) {
    throw new Error("unauthorized");
  }
  return session.user.id;
}

export async function getWebhookSettingsForCurrentUser() {
  const userId = await getAuthedUserIdOrThrow();
  const row = await webhookDb
    .selectFrom("webhooks")
    .selectAll()
    .where("user_id", "=", userId)
    .executeTakeFirst();

  return row ?? null;
}

export async function saveWebhookSettingsAction(input: unknown) {
  const userId = await getAuthedUserIdOrThrow();
  if (!isValidWebhookSettingsPayload(input)) {
    throw new Error("invalid_payload");
  }

  const body = input;

  const existing = await webhookDb
    .selectFrom("webhooks")
    .select("id")
    .where("user_id", "=", userId)
    .executeTakeFirst();

  const persisted = existing
    ? await webhookDb
        .updateTable("webhooks")
        .set({
          hook_url: body.hookUrl.trim(),
          is_fte: body.isFte,
          is_intern: body.isIntern,
          is_active: body.isActive,
          is_markdown: body.isMarkdown,
        })
        .where("user_id", "=", userId)
        .returning([
          "id",
          "user_id",
          "hook_url",
          "is_fte",
          "is_intern",
          "is_active",
          "is_markdown",
          "sign_key",
        ])
        .executeTakeFirstOrThrow()
    : await webhookDb
        .insertInto("webhooks")
        .values({
          user_id: userId,
          hook_url: body.hookUrl.trim(),
          sign_key: generateSignKey(),
          is_fte: body.isFte,
          is_intern: body.isIntern,
          is_active: body.isActive,
          is_markdown: body.isMarkdown,
        })
        .returning([
          "id",
          "user_id",
          "hook_url",
          "is_fte",
          "is_intern",
          "is_active",
          "is_markdown",
          "sign_key",
        ])
        .executeTakeFirstOrThrow();

  revalidatePath("/dashboard");
  return persisted;
}

export async function getWebhookLogsForCurrentUser(onlyTests: boolean = false): Promise<Selectable<WebhooksLogTable>[]> {
  const userId = await getAuthedUserIdOrThrow();

  const webhook = await webhookDb
    .selectFrom("webhooks")
    .select("id")
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (!webhook) {
    return [];
  }

  let query = webhookDb
    .selectFrom("webhooks_log")
    .selectAll()
    .where("webhook_id", "=", webhook.id);

  if (onlyTests) {
    query = query.where("is_test", "=", true);
  }

  const logs = await query
    .orderBy("created_at", "desc")
    .orderBy("webhook_id", "desc")
    .limit(20)
    .execute();

  return logs;
}

export async function sendTestWebhookAction(): Promise<{ ok: boolean; code?: string; message?: string }> {
  let userId: string;
  try {
    userId = await getAuthedUserIdOrThrow();
  } catch {
    return { ok: false, code: "unauthorized", message: "please sign in" };
  }

  const webhook = await webhookDb
    .selectFrom("webhooks")
    .select(["id", "is_active", "sign_key", "hook_url"])
    .where("user_id", "=", userId)
    .executeTakeFirst();

  if (!webhook) {
    return { ok: false, code: "no_webhook", message: "configure your webhook first" };
  }

  if (!webhook.is_active) {
    return { ok: false, code: "webhook_inactive", message: "your webhook is not active" };
  }

  const payload = [
    {
      is_test: true,
      is_fte: true,
      is_intern: true,
      company_name: "Test Company",
      title: "Test Engineer",
      date_posted: 1700000000,
      url: "https://example.com/jobs/test",
      source: "test",
      degrees: [],
      sponsorship: "does not sponsor",
      locations: ["Remote"],
      category: "software-engineering",
    },
  ];

  const hookMetadata = {
    webhook_id: webhook.id,
    sign_key: webhook.sign_key,
    hook_url: webhook.hook_url,
  };
  const packageStr = `${JSON.stringify(hookMetadata)}/-/${JSON.stringify(payload)}`;

  try {
    const client = await getRedisClient();
    await client.lPush("webhook:deliver:pending", packageStr);
    return { ok: true };
  } catch (error) {
    console.error("sendTestWebhookAction error:", error);
    return { ok: false, code: "redis_error", message: "failed to queue test" };
  }
}
