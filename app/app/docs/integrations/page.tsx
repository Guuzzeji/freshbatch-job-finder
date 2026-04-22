import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "freshbatch docs — Integrations",
  description:
    "Production-ready Freshbatch webhook receiver examples for FastAPI (Python) and Express (TypeScript).",
};

const integrations = [
  {
    href: "/docs/integrations/fastapi",
    label: "FastAPI",
    lang: "Python",
    desc: "Full receiver with signature verification, job filtering, and logging. Run with uvicorn.",
  },
  {
    href: "/docs/integrations/express",
    label: "Express",
    lang: "TypeScript",
    desc: "Full receiver with signature verification, job filtering, and logging. Run with tsx.",
  },
];

export default function IntegrationsPage() {
  return (
    <article>
      <div className="mb-3 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
        integrations
      </div>
      <h1 className="text-[2rem] font-black tracking-[-1px] leading-tight">
        Integrations
      </h1>
      <p className="mt-4 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        These examples are minimal but production-ready webhook receivers. Each
        one handles signature verification, parses the job list, and returns a
        fast 2xx. Pick the one that matches your stack.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {integrations.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[20px] border border-[color:var(--border-light)] bg-white/80 p-5 shadow-[4px_4px_0_#E8D0B0] hover:shadow-[2px_2px_0_#E8D0B0] transition-shadow no-underline"
          >
            <div className="font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
              {item.lang}
            </div>
            <div className="mt-1 text-[1.1rem] font-bold text-[color:var(--brown)]">
              {item.label}
            </div>
            <div className="mt-2 text-[13px] leading-[1.6] text-[color:var(--brown-mid)]">
              {item.desc}
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-[1.25rem] font-bold tracking-[-0.5px]">
        General best practices
      </h2>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        <li>
          — <strong>Verify the signature first</strong> before doing anything
          with the payload. Return 401 on mismatch.
        </li>
        <li>
          — <strong>Return 2xx fast.</strong> If processing takes time, enqueue
          jobs and process asynchronously.
        </li>
        <li>
          — <strong>Filter by is_test</strong> to avoid polluting your database
          during setup.
        </li>
        <li>
          — <strong>Expose locally with ngrok</strong> during development so you
          can receive real deliveries on your machine.
        </li>
      </ul>
    </article>
  );
}
