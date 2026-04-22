import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "freshbatch docs — Signature Verification: Python",
  description:
    "Copy-paste Python code to verify Freshbatch webhook signatures using HMAC-SHA256. FastAPI example and standalone helper.",
};

const fastApiExample = `import hmac
import hashlib
import json
from fastapi import FastAPI, Header, HTTPException, Request

app = FastAPI()
WEBHOOK_SECRET = "replace-with-your-sign-key"

@app.post("/webhook")
async def receive_webhook(
    request: Request,
    webhook_signature: str = Header(..., alias="webhook-signature"),
):
    body = await request.json()
    jobs = body.get("data", [])

    # Canonicalize: sort by url, sort object keys, compact separators
    canonical = json.dumps(
        sorted(jobs, key=lambda job: job["url"]),
        sort_keys=True,
        separators=(",", ":"),
    )

    expected = hmac.new(
        WEBHOOK_SECRET.encode("utf-8"),
        canonical.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    # Constant-time compare — never use ==
    if not hmac.compare_digest(expected, webhook_signature):
        raise HTTPException(status_code=401, detail="Invalid signature")

    # Process jobs...
    return {"ok": True, "received": len(jobs)}`;

const helperExample = `import hmac
import hashlib
import json

def verify_freshbatch_signature(
    jobs: list[dict],
    secret: str,
    received: str,
) -> bool:
    """
    Returns True if the received signature matches.
    Uses constant-time comparison (hmac.compare_digest).
    """
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
    return hmac.compare_digest(expected, received)`;

export default function SignaturePythonPage() {
  return (
    <article>
      <div className="mb-3 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
        signature verification
      </div>
      <h1 className="text-[2rem] font-black tracking-[-1px] leading-tight">
        Python
      </h1>
      <p className="mt-4 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        Drop either of these into your Python HTTP framework. Both reproduce the
        exact canonicalization used by the Freshbatch publisher worker. Requires
        Python 3.8+, no extra dependencies beyond FastAPI.
      </p>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        FastAPI handler
      </h2>
      <p className="mt-2 text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
        A complete, ready-to-run endpoint. Replace{" "}
        <code className="font-[var(--font-dm-mono)] text-[13px]">
          WEBHOOK_SECRET
        </code>{" "}
        with your signing key from Dashboard Settings.
      </p>
      <div className="mt-4 overflow-x-auto rounded-[18px] border border-[color:var(--border-light)] bg-[#2E1505] p-4 font-[var(--font-dm-mono)] text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre className="whitespace-pre-wrap break-words">{fastApiExample}</pre>
      </div>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Standalone helper
      </h2>
      <p className="mt-2 text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
        Framework-agnostic function. Pass in the parsed job list, your secret,
        and the header value. Returns a boolean.
      </p>
      <div className="mt-4 overflow-x-auto rounded-[18px] border border-[color:var(--border-light)] bg-[#2E1505] p-4 font-[var(--font-dm-mono)] text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre className="whitespace-pre-wrap break-words">{helperExample}</pre>
      </div>

      <div className="mt-8 rounded-[20px] border border-[color:var(--border-light)] bg-white/80 p-5">
        <p className="text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
          See{" "}
          <Link
            href="/docs/signature-verification"
            className="font-semibold text-[color:var(--brown)] hover:underline"
          >
            Signature Verification overview
          </Link>{" "}
          for a step-by-step explanation of the canonicalization rules. For a
          TypeScript version, see{" "}
          <Link
            href="/docs/signature-verification/typescript"
            className="font-semibold text-[color:var(--brown)] hover:underline"
          >
            TypeScript
          </Link>
        </p>
      </div>
    </article>
  );
}
