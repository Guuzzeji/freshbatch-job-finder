import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "freshbatch docs — Express Integration",
  description:
    "Complete Express/TypeScript webhook receiver for Freshbatch with signature verification, job filtering, and local testing instructions.",
};

const fullExample = `// server.ts
import express, { Request, Response } from "express";
import { createHmac, timingSafeEqual } from "crypto";

const app = express();
app.use(express.json());

const WEBHOOK_SECRET = "replace-with-your-sign-key";

// Recursively sort object keys — replicates Python's sort_keys=True
function sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortObjectKeys);
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, sortObjectKeys(v)]),
    );
  }
  return obj;
}

function verifySignature(
  jobs: Record<string, unknown>[],
  secret: string,
  received: string,
): boolean {
  const sorted = [...jobs]
    .sort((a, b) => (String(a.url) < String(b.url) ? -1 : 1))
    .map(sortObjectKeys);
  const canonical = JSON.stringify(sorted);
  const expected = createHmac("sha256", secret)
    .update(canonical, "utf8")
    .digest("hex");
  try {
    return timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(received, "hex"),
    );
  } catch {
    return false;
  }
}

app.post("/webhook", (req: Request, res: Response) => {
  const receivedSig = req.headers["webhook-signature"] as string | undefined;
  if (!receivedSig) {
    return res.status(401).json({ error: "Missing signature" });
  }

  const jobs: Record<string, unknown>[] = req.body?.data ?? [];

  if (!verifySignature(jobs, WEBHOOK_SECRET, receivedSig)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  for (const job of jobs) {
    // Skip test events in production
    if (job.is_test) {
      console.log("Skipping test event");
      continue;
    }

    // Filter by job type
    if (job.is_intern) {
      console.log(\`Internship: \${job.title} at \${job.company_name}\`);
    } else if (job.is_fte) {
      console.log(\`FTE: \${job.title} at \${job.company_name}\`);
    }
  }

  return res.json({ ok: true, received: jobs.length });
});

app.listen(3000, () => console.log("Listening on :3000"));`;

export default function IntegrationsExpressPage() {
  return (
    <article>
      <div className="mb-3 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
        integrations
      </div>
      <h1 className="text-[2rem] font-black tracking-[-1px] leading-tight">
        Express
      </h1>
      <p className="mt-4 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        A complete TypeScript receiver using Express. Handles signature
        verification, filters by job type, logs each posting, and returns a fast
        200.
      </p>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Dependencies
      </h2>
      <div className="mt-3 overflow-x-auto rounded-[18px] border border-[color:var(--border-light)] bg-[#2E1505] p-4 font-[var(--font-dm-mono)] text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre>{`npm install express
npm install -D @types/express tsx typescript`}</pre>
      </div>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        server.ts
      </h2>
      <div className="mt-3 overflow-x-auto rounded-[18px] border border-[color:var(--border-light)] bg-[#2E1505] p-4 font-[var(--font-dm-mono)] text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre className="whitespace-pre-wrap break-words">{fullExample}</pre>
      </div>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Run it
      </h2>
      <div className="mt-3 overflow-x-auto rounded-[18px] border border-[color:var(--border-light)] bg-[#2E1505] p-4 font-[var(--font-dm-mono)] text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre>{`npx tsx server.ts`}</pre>
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
ngrok http 3000

# Copy the https:// URL ngrok gives you, e.g.:
# https://abc123.ngrok-free.app/webhook
# Paste that into Dashboard Settings as your webhook URL`}</pre>
      </div>

      <div className="mt-8 rounded-[20px] border border-[color:var(--border-light)] bg-white/80 p-5">
        <p className="text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
          For signature verification details, see{" "}
          <Link
            href="/docs/signature-verification/typescript"
            className="font-semibold text-[color:var(--brown)] hover:underline"
          >
            Signature Verification — TypeScript
          </Link>
        </p>
      </div>
    </article>
  );
}
