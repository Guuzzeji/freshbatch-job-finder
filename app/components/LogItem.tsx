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

type ParsedJob = {
  company_name?: unknown;
  title?: unknown;
};

function parseJobsPayload(jobsPayload: string | null): {
  jobs: ParsedJob[];
  payloadText: string;
} | null {
  if (!jobsPayload) return null;

  try {
    const parsed: unknown = JSON.parse(jobsPayload);
    if (!Array.isArray(parsed)) return null;

    return {
      jobs: parsed as ParsedJob[],
      payloadText: JSON.stringify(parsed, null, 2),
    };
  } catch {
    // ignore parse errors
  }

  return null;
}

function getFirstJob(
  jobs: ParsedJob[],
): { company_name: string; title: string } | null {
  if (jobs.length === 0) return null;

  const firstJob = jobs[0];
  if (!firstJob || typeof firstJob !== "object") return null;

  const companyName = firstJob.company_name;
  const title = firstJob.title;

  if (typeof companyName !== "string" || typeof title !== "string") {
    return null;
  }

  return { company_name: companyName, title };
}

function formatLogDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function LogItem({
  entry,
}: {
  entry: Selectable<WebhooksLogTable>;
}) {
  const isOk = entry.success;
  const parsedPayload = parseJobsPayload(entry.jobs_payload);
  const jobCount = parsedPayload?.jobs.length ?? 0;
  const firstJob = parsedPayload ? getFirstJob(parsedPayload.jobs) : null;
  const createdAt = new Date(entry.created_at);
  const title = `${formatLogDate(createdAt)} · ${jobCount} ${jobCount === 1 ? "job" : "jobs"}`;
  const firstJobLabel = firstJob
    ? `${firstJob.company_name} - ${firstJob.title}`
    : entry.is_test
      ? "Test delivery"
      : "Live delivery";
  const statusCode = entry.status_code?.toString() ?? "timeout";
  const modeLabel = entry.is_test ? "TEST" : "LIVE";
  const relTime = formatRelativeTime(createdAt);
  const modeClass = entry.is_test
    ? "border-[color:var(--green)] bg-[color:var(--cream)] text-[color:var(--green)]"
    : "border-[color:var(--border)] bg-[color:var(--cream-dark)] text-[color:var(--brown-mid)]";

  return (
    <div className="rounded-[10px] border border-[color:var(--border-light)] bg-[color:var(--cream)] px-[14px] py-[10px]">
      <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:gap-2">
        <div
          className={`h-[7px] w-[7px] shrink-0 rounded-full ${isOk ? "bg-[color:var(--green)]" : "bg-[color:var(--caramel)]"}`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="min-w-0 truncate text-[13px] leading-[1.2] font-bold text-[color:var(--brown)]">
              {title}
            </div>
            <div
              className={`shrink-0 rounded-full border px-[7px] py-[2px] font-[var(--font-dm-mono)] text-[9px] tracking-[0.4px] ${modeClass}`}
            >
              {modeLabel}
            </div>
          </div>
          <div className="mt-px font-[var(--font-dm-mono)] text-[10px] text-[color:var(--muted)]">
            {relTime} · status {statusCode}
          </div>
        </div>
        <div
          className={`shrink-0 rounded-full border px-2 py-[2px] font-[var(--font-dm-mono)] text-[10px] ${isOk ? "border-[color:var(--green)] bg-[color:var(--cream)] text-[color:var(--green)]" : "border-[color:var(--caramel-light)] bg-[color:var(--cream-dark)] text-[color:var(--brown-mid)]"}`}
        >
          {statusCode}
        </div>
      </div>

      <details className="mt-2 rounded-[8px] border border-[color:var(--border-light)] bg-white px-3 py-2">
        <summary className="cursor-pointer list-none font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1px] text-[color:var(--brown-mid)]">
          view payload
        </summary>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-all font-[var(--font-dm-mono)] text-[10px] leading-[1.5] text-[color:var(--brown)]">
          {parsedPayload?.payloadText ??
            entry.jobs_payload ??
            "No payload available"}
        </pre>
      </details>
    </div>
  );
}
