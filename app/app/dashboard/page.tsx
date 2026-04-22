import { headers } from "next/headers";
import StatsGrid, { type DashboardStats } from "@/components/StatsGrid";
import HookCard from "@/components/HookCard";
import { getWebhookSettingsForCurrentUser, getWebhookLogsForCurrentUser } from "@/app/dashboard/actions";

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - date.getTime());
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

function parseFirstJob(jobsPayload: string | null): { company_name: string; title: string } | null {
  if (!jobsPayload) return null;
  try {
    const parsed: unknown = JSON.parse(jobsPayload);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    const firstJob = parsed[0];
    if (!firstJob || typeof firstJob !== "object") return null;
    const companyName = (firstJob as { company_name?: unknown }).company_name;
    const title = (firstJob as { title?: unknown }).title;
    if (typeof companyName !== "string" || typeof title !== "string") return null;
    return { company_name: companyName, title };
  } catch {
    return null;
  }
}

function computeDashboardStats(logs: Awaited<ReturnType<typeof getWebhookLogsForCurrentUser>>): DashboardStats {
  const emptyStats: DashboardStats = {
    totalDelivered: 0,
    lastDelivery: "—",
    lastDeliveryDetail: "no deliveries yet",
    successRate: "—",
    successRatePeriod: "no data",
  };

  if (!logs || logs.length === 0) {
    return emptyStats;
  }

  const totalDelivered = logs.length;

  const latestLog = logs[0];
  const lastDelivery = formatRelativeTime(new Date(latestLog.created_at));
  const firstJob = parseFirstJob(latestLog.jobs_payload);
  const deliveryDetail = firstJob
    ? `${firstJob.company_name} · ${firstJob.title}`
    : latestLog.is_test
      ? "test delivery"
      : "live delivery";

  const successfulDeliveries = logs.filter((log) => log.success).length;
  const successRate = totalDelivered > 0
    ? Math.round((successfulDeliveries / totalDelivered) * 100)
    : 0;
  const successRatePeriod = `last ${totalDelivered} deliveries`;

  return {
    totalDelivered,
    lastDelivery,
    lastDeliveryDetail: deliveryDetail,
    successRate: `${successRate}%`,
    successRatePeriod: successRatePeriod,
  };
}

export default async function DashboardPage() {
  const initialWebhook = await getWebhookSettingsForCurrentUser();
  const logs = await getWebhookLogsForCurrentUser();
  const stats = computeDashboardStats(logs);

  return (
    <>
      <div className="mb-6">
        <div className="mb-1 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.5px] text-[color:var(--caramel)]">
          your kitchen
        </div>
        <div className="text-[26px] font-black tracking-[-1px] text-[color:var(--brown)]">
          delivery settings
        </div>
        <div className="mt-0.5 text-[13px] italic text-[color:var(--brown-mid)]">
          your endpoint in, fresh CS jobs out.
        </div>
      </div>

      <StatsGrid stats={stats} />
      <HookCard initialWebhook={initialWebhook} />
    </>
  );
}