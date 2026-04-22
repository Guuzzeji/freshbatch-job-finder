import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "freshbatch docs — Delivery Log",
  description:
    "How to read the Freshbatch delivery log to confirm webhook events are reaching your endpoint.",
};

const columns = [
  { name: "Timestamp", detail: "When the delivery attempt was made (UTC)." },
  { name: "Status", detail: "HTTP status code returned by your endpoint. 2xx = success. 4xx/5xx = failed delivery." },
  { name: "Test", detail: "Marked if this was a manually triggered test event (is_test: true)." },
];

export default function DeliveryLogPage() {
  return (
    <article>
      <div className="mb-3 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
        getting started
      </div>
      <h1 className="text-[2rem] font-black tracking-[-1px] leading-tight">
        Delivery Log
      </h1>
      <p className="mt-4 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        The Delivery Log at{" "}
        <Link href="/dashboard/log" className="font-[var(--font-dm-mono)] text-[13px] text-[color:var(--brown)] hover:underline">
          /dashboard/log
        </Link>{" "}
        shows the 20 most recent delivery attempts for your endpoint. Use it to
        confirm events are arriving and to debug failures.
      </p>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        What each column means
      </h2>
      <div className="mt-4 divide-y divide-[color:var(--border-light)]">
        {columns.map((col) => (
          <div key={col.name} className="py-4">
            <h3 className="text-[1rem] font-bold">{col.name}</h3>
            <p className="mt-1 text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
              {col.detail}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Debugging failures
      </h2>
      <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        If you see a non-2xx status, common causes are:
      </p>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        <li>— <strong>401</strong>: Signature verification failed. Check your signing secret and canonicalization. See <Link href="/docs/signature-verification" className="font-semibold text-[color:var(--brown)] hover:underline">Signature Verification</Link>.</li>
        <li>— <strong>404</strong>: Your endpoint path has changed. Update it in Dashboard Settings.</li>
        <li>— <strong>500</strong>: Your server threw an exception. Check your server logs.</li>
        <li>— <strong>No entry</strong>: Your endpoint was unreachable (DNS failure, server down, or no public URL). Use ngrok during local development.</li>
      </ul>
    </article>
  );
}
