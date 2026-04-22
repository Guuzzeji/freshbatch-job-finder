import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "freshbatch docs — Test Fire",
  description:
    "How to send a test webhook event from the Freshbatch dashboard and verify your endpoint receives it.",
};

export default function TestFirePage() {
  return (
    <article>
      <div className="mb-3 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
        getting started
      </div>
      <h1 className="text-[2rem] font-black tracking-[-1px] leading-tight">
        Test Fire
      </h1>
      <p className="mt-4 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        Before relying on live deliveries, send a test event to confirm your
        endpoint is reachable and handles the payload correctly.
      </p>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        What is a test event?
      </h2>
      <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        A test event has the exact same shape as a live delivery. The only
        difference is the{" "}
        <code className="font-[var(--font-dm-mono)] text-[13px]">is_test: true</code>{" "}
        flag in the payload. Use this flag to skip processing or log
        separately in your production handler.
      </p>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        How to send one
      </h2>
      <ol className="mt-3 space-y-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        <li>
          1. Make sure you have saved a webhook URL in{" "}
          <Link href="/dashboard" className="font-semibold text-[color:var(--brown)] hover:underline">
            Dashboard Settings
          </Link>.
        </li>
        <li>
          2. Navigate to{" "}
          <Link href="/dashboard/test" className="font-semibold text-[color:var(--brown)] hover:underline">
            /dashboard/test
          </Link>.
        </li>
        <li>3. Preview the sample payload shown on screen.</li>
        <li>4. Click <strong>Send Test</strong>.</li>
        <li>5. Check your server logs — you should see a POST request with a <code className="font-[var(--font-dm-mono)] text-[13px]">200 OK</code> response.</li>
      </ol>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Confirming delivery
      </h2>
      <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        After sending, check the{" "}
        <Link href="/docs/getting-started/delivery-log" className="font-semibold text-[color:var(--brown)] hover:underline">
          Delivery Log
        </Link>{" "}
        in your dashboard. The test attempt appears as the most recent row with
        the test flag marked.
      </p>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Handling <code className="font-[var(--font-dm-mono)] text-[18px]">is_test</code> in your code
      </h2>
      <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        In production, filter test events before writing to your database or
        triggering downstream actions:
      </p>
      <div className="mt-4 overflow-x-auto rounded-[18px] border border-[color:var(--border-light)] bg-[#2E1505] p-4 font-[var(--font-dm-mono)] text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre>{`# Python
for job in body["data"]:
    if job.get("is_test"):
        continue  # skip test events
    process(job)`}</pre>
      </div>
      <div className="mt-3 overflow-x-auto rounded-[18px] border border-[color:var(--border-light)] bg-[#2E1505] p-4 font-[var(--font-dm-mono)] text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre>{`// TypeScript
for (const job of req.body.data) {
  if (job.is_test) continue; // skip test events
  process(job);
}`}</pre>
      </div>

      <div className="mt-8 rounded-[20px] border border-[color:var(--border-light)] bg-white/80 p-5">
        <p className="text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
          See the{" "}
          <Link href="/docs/payload-reference" className="font-semibold text-[color:var(--brown)] hover:underline">
            Payload Reference
          </Link>{" "}
          for a full list of fields in the test event.
        </p>
      </div>
    </article>
  );
}
