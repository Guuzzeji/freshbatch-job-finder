import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "freshbatch docs — Signature Verification: TypeScript",
  description:
    "Copy-paste TypeScript code to verify Freshbatch webhook signatures using HMAC-SHA256. Express handler and standalone helper.",
};

const expressExample = `import express, { Request, Response } from "express";
import { createHmac, timingSafeEqual } from "crypto";

const app = express();
app.use(express.json());

const WEBHOOK_SECRET = "replace-with-your-sign-key";

app.post("/webhook", (req: Request, res: Response) => {
  const receivedSig = req.headers["webhook-signature"] as string | undefined;
  if (!receivedSig) {
    return res.status(401).json({ error: "Missing signature" });
  }

  const jobs: Record<string, unknown>[] = req.body?.data ?? [];

  // Canonicalize: sort by url, sort object keys, compact JSON
  const sorted = [...jobs]
    .sort((a, b) => (String(a.url) < String(b.url) ? -1 : 1))
    .map(sortObjectKeys);
  const canonical = JSON.stringify(sorted);

  const expected = createHmac("sha256", WEBHOOK_SECRET)
    .update(canonical, "utf8")
    .digest("hex");

  // Constant-time compare — never use ===
  try {
    const safe = timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(receivedSig, "hex"),
    );
    if (!safe) return res.status(401).json({ error: "Invalid signature" });
  } catch {
    // timingSafeEqual throws if buffers differ in length (malformed input)
    return res.status(401).json({ error: "Invalid signature" });
  }

  // Process jobs...
  return res.json({ ok: true, received: jobs.length });
});

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

app.listen(3000, () => console.log("Listening on :3000"));`;

const helperExample = `import { createHmac, timingSafeEqual } from "crypto";

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

/**
 * Returns true if the received signature matches the expected digest.
 * Uses constant-time comparison (timingSafeEqual).
 * Requires Node.js 18+ or Bun.
 */
export function verifyFreshbatchSignature(
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
}`;

export default function SignatureTypescriptPage() {
  return (
    <article>
      <div className="mb-3 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
        signature verification
      </div>
      <h1 className="text-[2rem] font-black tracking-[-1px] leading-tight">
        TypeScript
      </h1>
      <p className="mt-4 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        Drop either of these into your TypeScript server. Uses only Node.js
        built-in{" "}
        <code className="font-[var(--font-dm-mono)] text-[13px]">crypto</code> —
        no extra dependencies. Requires Node.js 18+ or Bun.
      </p>

      <div className="mt-4 rounded-[16px] border border-[color:var(--border-light)] bg-[#F7E5C8] px-5 py-4">
        <p className="text-[13px] leading-[1.7] text-[color:var(--brown-mid)]">
          <strong>Important:</strong> The{" "}
          <code className="font-[var(--font-dm-mono)] text-[12px]">
            sortObjectKeys
          </code>{" "}
          helper is required. Without it, your JSON serialization will not match
          Python&apos;s{" "}
          <code className="font-[var(--font-dm-mono)] text-[12px]">
            sort_keys=True
          </code>{" "}
          and your HMAC digest will differ.
        </p>
      </div>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Express handler
      </h2>
      <p className="mt-2 text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
        A complete, ready-to-run endpoint. Replace{" "}
        <code className="font-[var(--font-dm-mono)] text-[13px]">
          WEBHOOK_SECRET
        </code>{" "}
        with your signing key.
      </p>
      <div className="mt-4 overflow-x-auto rounded-[18px] border border-[color:var(--border-light)] bg-[#2E1505] p-4 font-[var(--font-dm-mono)] text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre className="whitespace-pre-wrap break-words">{expressExample}</pre>
      </div>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Standalone helper
      </h2>
      <p className="mt-2 text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
        Framework-agnostic function. Pass the parsed job list, your secret, and
        the header value. Returns a boolean.
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
          for canonicalization rules. For Python, see{" "}
          <Link
            href="/docs/signature-verification/python"
            className="font-semibold text-[color:var(--brown)] hover:underline"
          >
            Python
          </Link>
        </p>
      </div>
    </article>
  );
}
