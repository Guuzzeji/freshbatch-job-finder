import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export interface WebhooksTable {
  id: Generated<number>;
  user_id: string;
  hook_url: string;
  sign_key: string;
  is_fte: boolean;
  is_intern: boolean;
  is_active: boolean;
  is_markdown: boolean;
}

export interface WebhooksLogTable {
  webhook_id: number;
  created_at: ColumnType<Date, string | undefined, never>;
  success: boolean;
  error_message: string | null;
  status_code: number | null;
  jobs_payload: string | null;
  is_test: boolean;
}

export interface WebhookDatabase {
  webhooks: WebhooksTable;
  webhooks_log: WebhooksLogTable;
}

export type WebhookRow = Selectable<WebhooksTable>;
export type NewWebhookRow = Insertable<WebhooksTable>;
export type WebhookRowUpdate = Updateable<WebhooksTable>;
