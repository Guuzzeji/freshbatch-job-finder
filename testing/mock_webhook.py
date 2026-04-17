"""
mock_webhook.py — FastAPI mock receiver for testing the webhook-publisher worker.

How the worker sends data (worker.py):
  1. Signs the payload:
       - Converts each JobInformation to a dict via to_json()
       - Sorts the list by `url`
       - json.dumps with sort_keys=True and compact separators
       - HMAC-SHA256 of that canonical string
  2. POST to hook_url with:
       Header  -> "webhook-signature": <hex-digest>
       Body    -> {"data": [job.to_json(), ...]}  # each element is a real JSON object (dict)

Run:
    uvicorn testing.mock_webhook:app --reload --port 8000
  or (from the testing/ folder):
    uvicorn mock_webhook:app --reload --port 8000
"""

import hmac
import hashlib
import json
import logging
from typing import Any

from fastapi import FastAPI, Header, HTTPException, Request
from pydantic import BaseModel

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Must match the sign_key stored in HookerInformation that the worker uses.
# Override this with the actual secret you configured for your test hook.
MOCK_SECRET = "whsec_localdev1234567890abcdefghijklmnop"

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  [%(levelname)s]  %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Mock Webhook Receiver",
    description="Receives and validates signed payloads from the webhook-publisher worker.",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# Pydantic models (mirrors JobInformation.to_json / .dump())
# ---------------------------------------------------------------------------

class JobPayload(BaseModel):
    is_test: bool
    is_fte: bool
    is_intern: bool
    repo_name: str
    company_name: str
    title: str
    date_posted: int
    url: str
    source: str
    degrees: list[str]
    sponsorship: str
    locations: list[str]
    category: str


class WebhookBody(BaseModel):
    # Each element is a real JSON object produced by JobInformation.to_json()
    data: list[JobPayload]

# ---------------------------------------------------------------------------
# Signature helpers
# ---------------------------------------------------------------------------

def _verify_signature(jobs: list[JobPayload], secret: str, received_sig: str) -> bool:
    """
    Reproduces the canonical signing used by the worker:

      1. Each job is already a parsed dict — call .model_dump() to get it.
      2. Sort the list of dicts by the `url` field.
      3. Re-serialise with sort_keys=True and compact separators — exactly
         what the worker passes to HMAC.

    This means receivers in any language can replicate the signature as long
    as they follow the same three steps.
    """
    try:
        sorted_jobs = sorted(
            [job.model_dump() for job in jobs],
            key=lambda j: j["url"],
        )
        canonical = json.dumps(sorted_jobs, sort_keys=True, separators=(",", ":"))
    except Exception as exc:
        logger.error("Failed to reconstruct canonical payload: %s", exc)
        return False

    expected = hmac.new(
        secret.encode("utf-8"),
        canonical.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    return hmac.compare_digest(expected, received_sig)

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.post("/webhook", status_code=200)
async def receive_webhook(
    request: Request,
    body: WebhookBody,
    webhook_signature: str = Header(..., alias="webhook-signature"),
):
    """
    Main endpoint the worker POSTs to.

    Validates the HMAC-SHA256 signature, then logs every job in the batch.
    Returns 200 on success, 401 if the signature is invalid, 422 on bad body.
    """
    logger.info("--- Incoming webhook (%d jobs) ---", len(body.data))
    logger.info("Received signature: %s", webhook_signature)

    if not _verify_signature(body.data, MOCK_SECRET, webhook_signature):
        logger.warning("Signature verification FAILED")
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    logger.info("Signature verification PASSED ✓")

    for idx, job in enumerate(body.data):
        logger.info(
            "  Job[%d]: company=%s | title=%s | is_fte=%s | is_intern=%s",
            idx,
            job.company_name,
            job.title,
            job.is_fte,
            job.is_intern,
        )

    return {"status": "received", "jobs_processed": len(body.data)}


@app.post("/webhook/no-verify", status_code=200)
async def receive_webhook_no_verify(body: WebhookBody):
    """
    Same endpoint but skips signature verification.
    Useful when you just want to see what the worker is sending without
    worrying about the secret matching up.
    """
    logger.info("--- Incoming webhook (NO-VERIFY, %d jobs) ---", len(body.data))

    for idx, job in enumerate(body.data):
        logger.info(
            "  Job[%d]: company=%s | title=%s",
            idx,
            job.company_name,
            job.title,
        )

    return {"status": "received_no_verify", "jobs_processed": len(body.data)}


@app.get("/health")
async def health():
    """Quick health-check so you can confirm the server is up."""
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Dev entry-point (python testing/mock_webhook.py)
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("mock_webhook:app", host="[IP_ADDRESS]", port=8000, reload=True)
