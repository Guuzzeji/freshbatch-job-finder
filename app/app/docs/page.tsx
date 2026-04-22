import type { Metadata } from "next";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import { TEST_PAYLOAD } from "@/lib/mock-data";

const setupSteps = [
  {
    title: "1. Open your dashboard",
    body: "Sign in with GitHub, then open the dashboard where webhook delivery settings live.",
  },
  {
    title: "2. Save your endpoint",
    body: "Paste your HTTP or HTTPS webhook URL, choose your role filters, and save settings in one action.",
  },
  {
    title: "3. Fire a test",
    body: "Send a sample job event before relying on live deliveries. If your bot or workflow handles the test payload, you are wired up.",
  },
];

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://freshbatch.dev";
const docsUrl = `${siteUrl}/docs`;

const integrationIdeas = [
  "Discord bot that formats new grad and internship posts into a private channel",
  "n8n or Make flow that filters by role, class year, or location before alerting you",
  "Python or FastAPI endpoint that stores jobs in your own database for later analysis",
];

const receiverExample = `import hmac
import hashlib
import json
from fastapi import FastAPI, Header, HTTPException

app = FastAPI()
WEBHOOK_SECRET = "replace-with-your-sign-key"

@app.post("/webhook")
async def receive_webhook(
    body: dict,
    webhook_signature: str = Header(..., alias="webhook-signature"),
):
    jobs = body.get("data", [])

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

    if not hmac.compare_digest(expected, webhook_signature):
        raise HTTPException(status_code=401, detail="Invalid signature")

    return {"ok": True, "jobs": len(jobs)}
`;

export const metadata: Metadata = {
  title: "freshbatch docs",
  description:
    "Quick setup and payload reference for sending fresh CS job alerts to your own webhook endpoint.",
  alternates: {
    canonical: docsUrl,
  },
  openGraph: {
    type: "article",
    locale: "en_US",
    url: docsUrl,
    siteName: "freshbatch",
    title: "freshbatch docs",
    description:
      "Quick setup and payload reference for sending fresh CS job alerts to your own webhook endpoint.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "freshbatch docs - webhook setup guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "freshbatch docs",
    description:
      "Quick setup and payload reference for sending fresh CS job alerts to your own webhook endpoint.",
    images: ["/og-image.png"],
  },
};

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[color:var(--cream)] text-[color:var(--brown)]">
      <PublicNavbar variant="docs" />

      <section className="mx-auto max-w-[1080px] px-6 py-12 max-sm:px-5 max-sm:py-10">
        <div className="mb-4 inline-flex items-center gap-[6px] rounded-full border border-[color:var(--border)] bg-white/85 px-[14px] py-1 font-[var(--font-dm-mono)] text-[11px] text-[color:var(--brown-mid)] max-sm:text-[10px]">
          <div className="motion-pulse-soft h-[7px] w-[7px] rounded-full bg-[color:var(--caramel)]" />
          quickstart docs
        </div>
        <h1 className="max-w-[760px] text-[clamp(2.2rem,6vw,4.5rem)] leading-none font-black tracking-[-2px] max-sm:tracking-[-1.4px]">
          point freshbatch at your webhook
          <br />
          <span className="italic text-[color:var(--caramel)]">
            and let the jobs come to you
          </span>
        </h1>
        <p className="mt-5 max-w-[620px] text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
          Freshbatch delivers CS job alerts to the endpoint you already use for
          bots, automations, and custom workflows. This page covers setup, the
          payload shape, and a few easy ways to plug it into your stack.
        </p>
      </section>

      <section className="mx-auto grid max-w-[1080px] gap-4 px-6 pb-6 md:grid-cols-3 max-sm:px-5">
        {setupSteps.map((step) => (
          <article
            key={step.title}
            className="rounded-[24px] border border-[color:var(--border-light)] bg-white/80 p-5 shadow-[4px_4px_0_#E8D0B0]"
          >
            <div className="mb-2 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
              setup
            </div>
            <h2 className="text-[1.2rem] font-black tracking-[-0.6px]">
              {step.title}
            </h2>
            <p className="mt-3 text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
              {step.body}
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto grid max-w-[1080px] gap-5 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] max-sm:px-5">
        <article className="rounded-[28px] border border-[color:var(--border-light)] bg-[#fffaf1] p-6 shadow-[6px_6px_0_#E8D0B0] max-sm:p-5 max-sm:shadow-[4px_4px_0_#E8D0B0]">
          <div className="mb-2 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.5px] text-[color:var(--caramel)]">
            payload
          </div>
          <h2 className="text-[1.9rem] leading-none font-black tracking-[-1px] max-sm:text-[1.65rem]">
            example event
          </h2>
          <p className="mt-3 max-w-[560px] text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
            Each delivery is plain JSON. The exact fields can evolve, but you
            can expect the event name, job details, an apply URL, and a test
            flag when you manually fire a sample event.
          </p>
          <div className="mt-5 overflow-x-hidden rounded-[18px] border border-[color:var(--border-light)] bg-[#2E1505] p-4 font-[var(--font-dm-mono)] text-[12px] leading-[1.8] text-[#FDF6EC] max-sm:p-3 max-sm:text-[9px] max-sm:leading-[1.55]">
            <pre className="w-full whitespace-pre-wrap break-all sm:break-words">
              {JSON.stringify(TEST_PAYLOAD, null, 2)}
            </pre>
          </div>
        </article>

        <article className="rounded-[28px] border border-[color:var(--border-light)] bg-white/85 p-6 max-sm:p-5">
          <div className="mb-2 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.5px] text-[color:var(--caramel)]">
            best practices
          </div>
          <h2 className="text-[1.9rem] leading-none font-black tracking-[-1px] max-sm:text-[1.65rem]">
            what your endpoint should do
          </h2>
          <div className="mt-4 space-y-3 text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
            <p>Return a fast `2xx` response once you accept the payload.</p>
            <p>Log the event body before transforming it so debugging stays easy.</p>
            <p>Handle duplicate test fires safely in case you retry during setup.</p>
            <p>Filter or enrich jobs downstream instead of depending on a rigid payload schema.</p>
          </div>
        </article>
      </section>

      <section className="mx-auto grid max-w-[1080px] gap-5 px-6 py-2 lg:grid-cols-[0.95fr_1.05fr] max-sm:px-5">
        <article className="rounded-[28px] border border-[color:var(--border-light)] bg-white/85 p-6 max-sm:p-5">
          <div className="mb-2 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.5px] text-[color:var(--caramel)]">
            signature
          </div>
          <h2 className="text-[1.9rem] leading-none font-black tracking-[-1px] max-sm:text-[1.65rem]">
            verify <code>webhook-signature</code>
          </h2>
          <div className="mt-4 space-y-3 text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
            <p>
              Freshbatch signs each delivery with HMAC-SHA256 and sends the
              hex digest in the <code>webhook-signature</code> header.
            </p>
            <p>
              Canonicalization rules match the publisher worker and mock
              receiver: take <code>body.data</code>, sort jobs by <code>url</code>,
              serialize with <code>sort_keys=True</code> and compact separators
              <code>(",", ":")</code>, then HMAC that exact UTF-8 string.
            </p>
            <p>
              Use constant-time compare for verification and return <code>401</code>
              on mismatch.
            </p>
          </div>
        </article>

        <article className="rounded-[28px] border border-[color:var(--border-light)] bg-[#fffaf1] p-6 shadow-[6px_6px_0_#E8D0B0] max-sm:p-5 max-sm:shadow-[4px_4px_0_#E8D0B0]">
          <div className="mb-2 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.5px] text-[color:var(--caramel)]">
            practical example
          </div>
          <h2 className="text-[1.9rem] leading-none font-black tracking-[-1px] max-sm:text-[1.65rem]">
            minimal Python receiver
          </h2>
          <p className="mt-3 max-w-[560px] text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
            This mirrors the same signing behavior used in the worker and in
            <code> testing/mock_webhook.py</code>. Replace the secret with your
            configured sign key.
          </p>
          <div className="mt-5 overflow-x-hidden rounded-[18px] border border-[color:var(--border-light)] bg-[#2E1505] p-4 font-[var(--font-dm-mono)] text-[12px] leading-[1.8] text-[#FDF6EC] max-sm:p-3 max-sm:text-[9px] max-sm:leading-[1.55]">
            <pre className="w-full whitespace-pre-wrap break-all sm:break-words">
              {receiverExample}
            </pre>
          </div>
        </article>
      </section>

      <section className="mx-auto grid max-w-[1080px] gap-5 px-6 py-4 lg:grid-cols-[0.95fr_1.05fr] max-sm:px-5">
        <article className="rounded-[28px] border border-[color:var(--border-light)] bg-white/80 p-6 max-sm:p-5">
          <div className="mb-2 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.5px] text-[color:var(--caramel)]">
            ideas
          </div>
          <h2 className="text-[1.9rem] leading-none font-black tracking-[-1px] max-sm:text-[1.65rem]">
            easy integrations
          </h2>
          <div className="mt-4 space-y-3 text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
            {integrationIdeas.map((idea) => (
              <p key={idea}>{idea}</p>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-[color:var(--border-light)] bg-[#F7E5C8] p-6 max-sm:p-5">
          <div className="mb-2 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.5px] text-[color:var(--caramel)]">
            test flow
          </div>
          <h2 className="text-[1.9rem] leading-none font-black tracking-[-1px] max-sm:text-[1.65rem]">
            sanity-check in under a minute
          </h2>
          <ol className="mt-4 space-y-3 text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
            <li>Open the dashboard and save your webhook settings.</li>
            <li>Open the test fire screen and preview the sample event.</li>
            <li>Send the test payload and confirm your app logs a `200 OK`.</li>
            <li>Tweak your formatter or filters, then repeat until it feels right.</li>
          </ol>
        </article>
      </section>

      <section className="px-6 py-12 text-center max-sm:px-5 max-sm:py-10">
        <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-black tracking-[-1.2px] text-[color:var(--brown)]">
          ready to bake?
        </h2>
        <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
          Start with a test event, make sure your automation likes the payload,
          then let freshbatch handle the rest.
        </p>
        <div className="mt-6 flex justify-center gap-3 max-sm:flex-col">
          <Link
            href="/dashboard"
            className="motion-transition-subtle rounded-full border border-[color:var(--border)] bg-white px-6 py-3 font-[var(--font-dm-mono)] text-xs tracking-[0.3px] text-[color:var(--brown)] no-underline hover:bg-[color:var(--cream-dark)] max-sm:w-full"
          >
            open dashboard settings
          </Link>
          <Link
            href="/dashboard/test"
            className="motion-transition-subtle rounded-full border border-[color:var(--caramel)] bg-[color:var(--caramel)] px-6 py-3 font-[var(--font-dm-mono)] text-xs tracking-[0.3px] text-white no-underline hover:bg-[color:var(--brown-mid)] max-sm:w-full"
          >
            fire a test payload
          </Link>
        </div>
      </section>
    </main>
  );
}
