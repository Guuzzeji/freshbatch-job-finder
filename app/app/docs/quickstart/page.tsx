import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "freshbatch docs — Quickstart",
  description:
    "Get your first webhook event in under 5 minutes. Sign in, configure your endpoint, fire a test.",
};

const steps = [
  {
    number: "01",
    title: "Sign in",
    body: "Go to the dashboard and sign in with your GitHub account. That's the only account type supported.",
    action: { label: "Open dashboard ", href: "/dashboard" },
  },
  {
    number: "02",
    title: "Paste your endpoint",
    body: "In Settings, enter your HTTP or HTTPS webhook URL. Toggle which job types you want (FTE, Intern). Hit Save Settings.",
    action: {
      label: "Dashboard guide ",
      href: "/docs/getting-started/dashboard",
    },
  },
  {
    number: "03",
    title: "Fire a test event",
    body: "Go to the Test Fire page and send a sample payload. Confirm your server logs a 200 OK. The payload has is_test: true so you can filter it out in production.",
    action: {
      label: "Test fire guide ",
      href: "/docs/getting-started/test-fire",
    },
  },
  {
    number: "04",
    title: "Verify the signature",
    body: "Each delivery includes a webhook-signature header. Verify it with HMAC-SHA256 before trusting the payload.",
    action: { label: "Signature guide ", href: "/docs/signature-verification" },
  },
];

const nextLinks = [
  { label: "Introduction — how Freshbatch works", href: "/docs/introduction" },
  {
    label: "Payload Reference — every field explained",
    href: "/docs/payload-reference",
  },
  {
    label: "Signature Verification — Python",
    href: "/docs/signature-verification/python",
  },
  {
    label: "Signature Verification — TypeScript",
    href: "/docs/signature-verification/typescript",
  },
  {
    label: "Integrations — FastAPI receiver",
    href: "/docs/integrations/fastapi",
  },
  {
    label: "Integrations — Express receiver",
    href: "/docs/integrations/express",
  },
];

export default function QuickstartPage() {
  return (
    <article>
      <div className="mb-3 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
        quickstart
      </div>
      <h1 className="text-[2rem] font-black tracking-[-1px] leading-tight">
        Zero to webhook in 5 minutes
      </h1>
      <p className="mt-4 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        This guide gets you from a fresh sign-up to receiving real job events at
        your endpoint. Each step links to a deeper reference if you need it.
      </p>

      <div className="mt-8 space-y-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-[20px] border border-[color:var(--border-light)] bg-white/80 p-5 shadow-[4px_4px_0_#E8D0B0]"
          >
            <div className="mb-1 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
              step {step.number}
            </div>
            <h2 className="text-[1.1rem] font-bold tracking-[-0.4px]">
              {step.title}
            </h2>
            <p className="mt-2 text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
              {step.body}
            </p>
            <Link
              href={step.action.href}
              className="mt-3 inline-block font-[var(--font-dm-mono)] text-[11px] text-[color:var(--caramel)] hover:underline"
            >
              {step.action.label}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-[1.1rem] font-bold tracking-[-0.4px]">
          What&apos;s next?
        </h2>
        <ul className="mt-4 space-y-2">
          {nextLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[14px] text-[color:var(--brown-mid)] hover:text-[color:var(--brown)] hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
