import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "freshbatch docs — Introduction",
  description:
    "What Freshbatch is, how webhook delivery works, and what your endpoint needs to receive job alerts.",
};

export default function IntroductionPage() {
  return (
    <article>
      <div className="mb-3 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
        introduction
      </div>
      <h1 className="text-[2rem] font-black tracking-[-1px] leading-tight">
        What is Freshbatch?
      </h1>
      <p className="mt-4 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        Freshbatch is a CS job alert service that delivers new job postings
        directly to a webhook endpoint you control. Instead of checking job
        boards manually, your bot, automation, or application receives a POST
        request every time a new listing is found.
      </p>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        How delivery works
      </h2>
      <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        A publisher worker continuously monitors public job repositories. When
        new postings are detected, it collects them into a batch and POSTs a
        JSON payload to every registered endpoint. Each delivery is signed with
        HMAC-SHA256 so you can verify it came from Freshbatch.
      </p>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        When events fire
      </h2>
      <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        Deliveries are triggered by the crawler discovering new jobs — not on a
        fixed schedule. Volume depends on how active hiring is. During peak
        recruiting season you may receive multiple batches per day; during slow
        periods fewer.
      </p>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        What your endpoint needs
      </h2>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        <li>— A publicly reachable HTTP or HTTPS URL</li>
        <li>
          — Returns a{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">2xx</code>{" "}
          status code within a few seconds of receiving the request
        </li>
        <li>
          — Accepts{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">
            Content-Type: application/json
          </code>
        </li>
      </ul>
      <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        During local development, use a tunneling tool like{" "}
        <code className="font-[var(--font-dm-mono)] text-[13px]">ngrok</code> to
        expose your local server.
      </p>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Job types
      </h2>
      <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        Freshbatch delivers two job types. You choose which ones to receive in
        your dashboard settings:
      </p>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        <li>
          <strong>Full-time / New Grad (FTE)</strong> — entry-level and new grad
          roles. Payload has{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">
            is_fte: true
          </code>
          .
        </li>
        <li>
          <strong>Internships</strong> — internship and co-op positions. Payload
          has{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">
            is_intern: true
          </code>
          .
        </li>
      </ul>

      <div className="mt-10 rounded-[20px] border border-[color:var(--border-light)] bg-[#F7E5C8] p-5">
        <p className="text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
          Ready to set up your endpoint?{" "}
          <Link
            href="/docs/quickstart"
            className="font-semibold text-[color:var(--brown)] hover:underline"
          >
            Start with the Quickstart
          </Link>
        </p>
      </div>
    </article>
  );
}
