CREATE TABLE IF NOT EXISTS webhooks (
    id UUID     PRIMARY KEY,
    hook_url    TEXT NOT NULL,
    sign_key    TEXT NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    is_markdown BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id     BIGINT UNIQUE NOT NULL,   -- GitHub's numeric user ID
  username      VARCHAR(255),             -- github login handle
  email         VARCHAR(255),             -- may be null if user hides it
  avatar_url    TEXT,
  webhook_id    UUID REFERENCES webhooks(id),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhooks_is_active ON webhooks (is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_github_id ON users (github_id);
