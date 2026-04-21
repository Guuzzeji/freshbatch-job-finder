-- Create two dedicated databases: one for webhook data, one for GitHub auth accounts
CREATE DATABASE webhook_db;
CREATE DATABASE auth_db;

-- Switch to the webhook DB and create the same webhook-related tables there
\connect webhook_db


CREATE TABLE IF NOT EXISTS webhooks (
    id          BIGSERIAL PRIMARY KEY,
    user_id     TEXT NOT NULL, -- NOTE: Use better auth user.id (user table get id type of text)
    hook_url    TEXT NOT NULL,
    sign_key    TEXT NOT NULL,
    is_fte      BOOLEAN NOT NULL DEFAULT TRUE,
    is_intern   BOOLEAN NOT NULL DEFAULT FALSE,
    is_active   BOOLEAN NOT NULL DEFAULT FALSE,
    is_markdown BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS webhooks_log (
  webhook_id      INT REFERENCES webhooks (id),
  created_at      TIMESTAMPTZ DEFAULT now(),
  success         BOOLEAN NOT NULL DEFAULT FALSE,
  error_message   TEXT DEFAULT NULL,
  status_code     INTEGER DEFAULT NULL,
  jobs_payload    TEXT DEFAULT NULL,
  is_test         BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_webhooks_log_webhook_id ON webhooks_log (webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_is_active ON webhooks (is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_webhooks_is_fte ON webhooks (is_fte) WHERE is_fte = TRUE;
CREATE INDEX IF NOT EXISTS idx_webhooks_is_intern ON webhooks (is_intern) WHERE is_intern = TRUE;

