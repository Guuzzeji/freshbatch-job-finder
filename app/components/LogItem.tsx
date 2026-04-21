import type { Selectable } from "kysely";
import type { WebhooksLogTable } from "@/lib/db/webhook-types";

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = Math.max(0, now - date.getTime());
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

function parseFirstJob(
  jobsPayload: string | null,
): { company_name: string; title: string } | null {
  if (!jobsPayload) return null;
  try {
    const parsed: unknown = JSON.parse(jobsPayload);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;

    const firstJob = parsed[0];
    if (!firstJob || typeof firstJob !== "object") return null;

    const companyName = (firstJob as { company_name?: unknown }).company_name;
    const title = (firstJob as { title?: unknown }).title;

    if (typeof companyName !== "string" || typeof title !== "string") {
      return null;
    }

    return { company_name: companyName, title };
  } catch {
    // ignore parse errors
  }
  return null;
}

export default function LogItem({
  entry,
}: {
  entry: Selectable<WebhooksLogTable>;
}) {
  const isOk = entry.success;
  const job = parseFirstJob(entry.jobs_payload);
  const title = job ? `${job.company_name} — ${job.title}` : "Test Delivery";
  const statusCode = entry.status_code?.toString() ?? "timeout";
  const label = entry.is_test ? "test" : "live";
  const relTime = formatRelativeTime(new Date(entry.created_at));

  return (
    <div className="flex items-center gap-3 rounded-[10px] border border-[color:var(--border-light)] bg-[color:var(--cream)] px-[14px] py-[10px] max-sm:flex-wrap max-sm:gap-2">
      <div
        className={`h-[7px] w-[7px] shrink-0 rounded-full ${isOk ? "bg-[color:var(--green)]" : "bg-[color:var(--caramel)]"}`}
      />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] leading-[1.2] font-bold text-[color:var(--brown)]">
          {title}
        </div>
        <div className="mt-px font-[var(--font-dm-mono)] text-[10px] text-[color:var(--muted)]">
          {relTime} · {statusCode} · {label}
        </div>
      </div>
      <div
        className={`shrink-0 rounded-full border px-2 py-[2px] font-[var(--font-dm-mono)] text-[10px] ${isOk ? "border-[#52B788] bg-[#E8F5EF] text-[color:var(--green)]" : "border-[color:var(--caramel-light)] bg-[#FEF3E2] text-[#8B4513]"}`}
      >
        {statusCode}
      </div>
    </div>
  );
}
