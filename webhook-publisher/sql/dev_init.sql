CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id     BIGINT UNIQUE NOT NULL,   -- GitHub's numeric user ID
  username      VARCHAR(255),             -- github login handle
  email         VARCHAR(255),             -- may be null if user hides it
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS webhooks (
    id          BIGINT PRIMARY KEY INCREMENT BY 1,
    user_id     UUID NOT NULL,
    hook_url    TEXT NOT NULL,
    sign_key    TEXT NOT NULL,
    is_fte      BOOLEAN NOT NULL DEFAULT TRUE,
    is_intern   BOOLEAN NOT NULL DEFAULT FALSE,
    is_active   BOOLEAN NOT NULL DEFAULT FALSE,
    is_markdown BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS webhooks_log (
  webhook_id      BIGINT REFERENCES webhooks (id),
  created_at      TIMESTAMPTZ DEFAULT now(),
  success         BOOLEAN NOT NULL DEFAULT FALSE,
  error_message   TEXT DEFAULT NULL,
  status_code     INTEGER DEFAULT NULL
  jobs_payload    TEXT DEFAULT NULL
  is_test         BOOLEAN NOT NULL DEFAULT FALSE
)

CREATE INDEX IF NOT EXISTS idx_webhooks_log_webhook_id ON webhooks_log (webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks (user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_is_active ON webhooks (is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_github_id ON users (github_id);
CREATE INDEX IF NOT EXISTS idk_webhooks_is_fte ON webhooks (is_fte) WHERE is_fte = TRUE;
CREATE INDEX IF NOT EXISTS idx_webhooks_is_intern ON webhooks (is_intern) WHERE is_intern = TRUE;
