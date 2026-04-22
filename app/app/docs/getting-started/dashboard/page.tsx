import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "freshbatch docs — Dashboard",
  description:
    "Reference for the Freshbatch dashboard settings page: webhook URL, delivery toggles, and save behavior.",
};

const fields = [
  {
    name: "Webhook URL",
    detail:
      "Paste your HTTP or HTTPS endpoint here. Validated client-side before save. Must be a fully-qualified URL (e.g. https://myapp.com/webhook).",
  },
  {
    name: "Delivery Active",
    detail:
      "Master on/off toggle. Turning this off pauses all deliveries without deleting your endpoint. Turn it back on to resume.",
  },
  {
    name: "Internships",
    detail:
      "Receive internship and co-op job postings. Payloads will have is_intern: true.",
  },
  {
    name: "New Grad Roles",
    detail:
      "Receive full-time and new grad job postings. Payloads will have is_fte: true.",
  },
  {
    name: "Save Settings",
    detail:
      "Persists all fields atomically in one action. Inline success or error feedback appears after the request completes. Changes take effect on the next delivery cycle.",
  },
];

export default function DashboardGuidePage() {
  return (
    <article>
      <div className="mb-3 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
        getting started
      </div>
      <h1 className="text-[2rem] font-black tracking-[-1px] leading-tight">
        Dashboard Settings
      </h1>
      <p className="mt-4 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        The Settings page at{" "}
        <Link
          href="/dashboard"
          className="font-[var(--font-dm-mono)] text-[13px] text-[color:var(--brown)] hover:underline"
        >
          /dashboard
        </Link>{" "}
        is where you configure your webhook endpoint and choose which job types
        to receive. Here is what each control does.
      </p>

      <div className="mt-8 divide-y divide-[color:var(--border-light)]">
        {fields.map((field) => (
          <div key={field.name} className="py-5">
            <h2 className="text-[1rem] font-bold tracking-[-0.3px]">
              {field.name}
            </h2>
            <p className="mt-2 text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
              {field.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[20px] border border-[color:var(--border-light)] bg-white/80 p-5">
        <p className="text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
          After saving, go to{" "}
          <Link
            href="/docs/getting-started/test-fire"
            className="font-semibold text-[color:var(--brown)] hover:underline"
          >
            Test Fire
          </Link>{" "}
          to verify your endpoint is reachable before live deliveries begin.
        </p>
      </div>
    </article>
  );
}
