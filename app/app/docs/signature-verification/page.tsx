import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "freshbatch docs — Signature Verification",
  description:
    "How Freshbatch signs webhook deliveries with HMAC-SHA256 and how to verify the signature in your endpoint.",
};

export default function SignatureVerificationPage() {
  return (
    <article>
      <div className="mb-3 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
        signature verification
      </div>
      <h1 className="text-[2rem] font-black tracking-[-1px] leading-tight">
        Verify Webhook-Signature
      </h1>
      <p className="mt-4 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        Every delivery includes a{" "}
        <code className="font-[var(--font-dm-mono)] text-[13px]">
          webhook-signature
        </code>{" "}
        header containing an HMAC-SHA256 hex digest. Verify it before processing
        the payload to confirm the request came from Freshbatch and was not
        tampered with.
      </p>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Algorithm
      </h2>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        <li>
          — <strong>Algorithm:</strong> HMAC-SHA256
        </li>
        <li>
          — <strong>Header name:</strong>{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">
            webhook-signature
          </code>
        </li>
        <li>
          — <strong>Encoding:</strong> lowercase hex digest
        </li>
        <li>
          — <strong>What is signed:</strong> the{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">data</code>{" "}
          array from the request body — NOT the full body
        </li>
      </ul>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Canonicalization rules
      </h2>
      <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        To reproduce the exact byte string that was signed, follow these steps
        in order. Deviation in any step will produce a different digest and
        cause verification to fail.
      </p>
      <ol className="mt-4 space-y-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        <li>
          <strong>1. Extract</strong> — take{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">
            body.data
          </code>{" "}
          as the list of job objects.
        </li>
        <li>
          <strong>2. Sort by URL</strong> — sort the list ascending by each
          job&apos;s{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">url</code>{" "}
          field (string comparison).
        </li>
        <li>
          <strong>3. Sort object keys</strong> — within every job object, sort
          keys alphabetically (equivalent to Python&apos;s{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">
            sort_keys=True
          </code>
          ).
        </li>
        <li>
          <strong>4. Serialize compactly</strong> — serialize with no spaces:{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">
            separators=(&quot;,&quot;, &quot;:&quot;)
          </code>{" "}
          in Python,{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">
            JSON.stringify
          </code>{" "}
          without indent in TypeScript (default behavior).
        </li>
        <li>
          <strong>5. UTF-8 encode</strong> — encode the resulting string as
          UTF-8 bytes.
        </li>
        <li>
          <strong>6. HMAC-SHA256</strong> — compute HMAC-SHA256 of those bytes
          using your signing secret (also UTF-8 encoded). Take the hex digest.
        </li>
      </ol>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Verification rules
      </h2>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        <li>
          — Use <strong>constant-time comparison</strong> (
          <code className="font-[var(--font-dm-mono)] text-[13px]">
            hmac.compare_digest
          </code>{" "}
          in Python,{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">
            crypto.timingSafeEqual
          </code>{" "}
          in Node/Bun). Never use{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">==</code> or{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">===</code> —
          timing attacks are real.
        </li>
        <li>
          — Return{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">401</code> on
          mismatch. Do not process the payload.
        </li>
        <li>
          — Return{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">401</code> if
          the header is missing entirely.
        </li>
      </ul>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/docs/signature-verification/python"
          className="rounded-[20px] border border-[color:var(--border-light)] bg-white/80 p-5 shadow-[4px_4px_0_#E8D0B0] hover:shadow-[2px_2px_0_#E8D0B0] transition-shadow no-underline"
        >
          <div className="font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
            example
          </div>
          <div className="mt-1 text-[1rem] font-bold text-[color:var(--brown)]">
            Python
          </div>
          <div className="mt-1 text-[13px] text-[color:var(--brown-mid)]">
            FastAPI handler + standalone helper
          </div>
        </Link>
        <Link
          href="/docs/signature-verification/typescript"
          className="rounded-[20px] border border-[color:var(--border-light)] bg-white/80 p-5 shadow-[4px_4px_0_#E8D0B0] hover:shadow-[2px_2px_0_#E8D0B0] transition-shadow no-underline"
        >
          <div className="font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
            example
          </div>
          <div className="mt-1 text-[1rem] font-bold text-[color:var(--brown)]">
            TypeScript
          </div>
          <div className="mt-1 text-[13px] text-[color:var(--brown-mid)]">
            Express handler + standalone helper
          </div>
        </Link>
      </div>
    </article>
  );
}
