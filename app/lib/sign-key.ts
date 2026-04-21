import { randomBytes } from "crypto";

/**
 * Generates a 64-character URL-safe alphanumeric sign key.
 * Uses 48 random bytes encoded as base64url (yields 64 chars, no +/=/chars).
 */
export function generateSignKey(): string {
  return randomBytes(48).toString("base64url");
}
