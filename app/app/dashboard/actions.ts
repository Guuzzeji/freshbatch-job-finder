"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { webhookDb } from "@/lib/db/webhook-db";
import { generateSignKey } from "@/lib/sign-key";
import { isValidWebhookSettingsPayload } from "@/lib/webhook";

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
  console.log(isValidWebhookSettingsPayload(input));
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
