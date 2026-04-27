export type WebhookSettingsPayload = {
  hookUrl: string;
  isFte: boolean;
  isIntern: boolean;
  isActive: boolean;
  isMarkdown: boolean;
};

export function isValidWebhookEndpoint(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function isValidWebhookSettingsPayload(
  value: unknown,
): value is WebhookSettingsPayload {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.hookUrl === "string" &&
    isValidWebhookEndpoint(v.hookUrl) &&
    typeof v.isFte === "boolean" &&
    typeof v.isIntern === "boolean" &&
    typeof v.isActive === "boolean" &&
    typeof v.isMarkdown === "boolean" &&
    (v.isFte || v.isIntern)
  );
}
