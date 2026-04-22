export interface DashboardStats {
  totalDelivered: number;
  lastDelivery: string;
  lastDeliveryDetail: string;
  successRate: string;
  successRatePeriod: string;
}

export default function StatsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-2.5 md:grid-cols-3">
      <div className="rounded-xl border border-[color:var(--border-light)] bg-[color:var(--cream)] px-[1.15rem] py-4">
        <div className="mb-1 font-[var(--font-dm-mono)] text-[10px] text-[color:var(--brown-mid)]">
          cookies delivered
        </div>
        <div className="text-[26px] leading-none font-black tracking-[-1px] text-[color:var(--caramel)]">
          {stats.totalDelivered}
        </div>
        <div className="mt-[3px] font-[var(--font-dm-mono)] text-[10px] text-[color:var(--muted)]">
          all time
        </div>
      </div>
      <div className="rounded-xl border border-[color:var(--border-light)] bg-[color:var(--cream)] px-[1.15rem] py-4">
        <div className="mb-1 font-[var(--font-dm-mono)] text-[10px] text-[color:var(--brown-mid)]">
          last delivery
        </div>
        <div className="pt-1 text-[18px] leading-none font-black tracking-[-1px] text-[color:var(--caramel)]">
          {stats.lastDelivery}
        </div>
        <div className="mt-[3px] font-[var(--font-dm-mono)] text-[10px] text-[color:var(--muted)]">
          {stats.lastDeliveryDetail}
        </div>
      </div>
      <div className="rounded-xl border border-[color:var(--border-light)] bg-[color:var(--cream)] px-[1.15rem] py-4">
        <div className="mb-1 font-[var(--font-dm-mono)] text-[10px] text-[color:var(--brown-mid)]">
          success rate
        </div>
        <div className="text-[26px] leading-none font-black tracking-[-1px] text-[color:var(--caramel)]">
          {stats.successRate}
        </div>
        <div className="mt-[3px] font-[var(--font-dm-mono)] text-[10px] text-[color:var(--muted)]">
          {stats.successRatePeriod}
        </div>
      </div>
    </div>
  );
}