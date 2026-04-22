import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "freshbatch docs — FastAPI Integration",
  description:
    "Complete FastAPI webhook receiver for Freshbatch with signature verification, job filtering, and local testing instructions.",
};

const fullExample = `# main.py
import hmac
import hashlib
import json
import logging
from fastapi import FastAPI, Header, HTTPException, Request

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
WEBHOOK_SECRET = "replace-with-your-sign-key"


def verify_signature(jobs: list[dict], secret: str, received: str) -> bool:
    canonical = json.dumps(
        sorted(jobs, key=lambda j: j["url"]),
        sort_keys=True,
        separators=(",", ":"),
    )
    expected = hmac.new(
        secret.encode("utf-8"),
        canonical.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, received)


@app.post("/webhook")
async def receive_webhook(
    request: Request,
    webhook_signature: str = Header(..., alias="webhook-signature"),
):
    body = await request.json()
    jobs: list[dict] = body.get("data", [])

    if not verify_signature(jobs, WEBHOOK_SECRET, webhook_signature):
        raise HTTPException(status_code=401, detail="Invalid signature")

    for job in jobs:
        # Skip test events in production
        if job.get("is_test"):
            logger.info("Skipping test event")
            continue

        # Filter by job type
        if job.get("is_intern"):
            logger.info("Internship: %s at %s", job.get("title"), job.get("company_name"))
        elif job.get("is_fte"):
            logger.info("FTE: %s at %s", job.get("title"), job.get("company_name"))

    return {"ok": True, "received": len(jobs)}`;

export default function IntegrationsFastApiPage() {
  return (
    <article>
      <div className="mb-3 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
        integrations
      </div>
      <h1 className="text-[2rem] font-black tracking-[-1px] leading-tight">
        FastAPI
      </h1>
      <p className="mt-4 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        A complete Python receiver using FastAPI. Handles signature
        verification, filters by job type, logs each posting, and returns a fast
        200.
      </p>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Dependencies
      </h2>
      <div className="mt-3 overflow-x-auto rounded-[18px] border border-[color:var(--border-light)] bg-[#2E1505] p-4 font-[var(--font-dm-mono)] text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre>{`pip install fastapi uvicorn`}</pre>
      </div>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        main.py
      </h2>
      <div className="mt-3 overflow-x-auto rounded-[18px] border border-[color:var(--border-light)] bg-[#2E1505] p-4 font-[var(--font-dm-mono)] text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre className="whitespace-pre-wrap break-words">{fullExample}</pre>
      </div>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Run it
      </h2>
      <div className="mt-3 overflow-x-auto rounded-[18px] border border-[color:var(--border-light)] bg-[#2E1505] p-4 font-[var(--font-dm-mono)] text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre>{`uvicorn main:app --reload --port 8000`}</pre>
      </div>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Local testing with ngrok
      </h2>
      <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        Freshbatch needs a public URL to POST to. During local development, use
        ngrok to tunnel your local server:
      </p>
      <div className="mt-3 overflow-x-auto rounded-[18px] border border-[color:var(--border-light)] bg-[#2E1505] p-4 font-[var(--font-dm-mono)] text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre>{`# In a separate terminal
ngrok http 8000

# Copy the https:// URL ngrok gives you, e.g.:
# https://abc123.ngrok-free.app/webhook
# Paste that into Dashboard Settings as your webhook URL`}</pre>
      </div>

      <div className="mt-8 rounded-[20px] border border-[color:var(--border-light)] bg-white/80 p-5">
        <p className="text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
          For signature verification details, see{" "}
          <Link
            href="/docs/signature-verification/python"
            className="font-semibold text-[color:var(--brown)] hover:underline"
          >
            Signature Verification — Python
          </Link>
        </p>
      </div>
    </article>
  );
}
