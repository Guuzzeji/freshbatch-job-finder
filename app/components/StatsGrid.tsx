import { MOCK_STATS } from "@/lib/mock-data";

export default function StatsGrid() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-2.5 md:grid-cols-3">
      <div className="rounded-xl border border-[color:var(--border-light)] bg-[color:var(--cream)] px-[1.15rem] py-4">
        <div className="mb-1 font-[var(--font-dm-mono)] text-[10px] text-[color:var(--brown-mid)]">
          cookies delivered
        </div>
        <div className="text-[26px] leading-none font-black tracking-[-1px] text-[color:var(--caramel)]">
          {MOCK_STATS.totalDelivered}
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
          {MOCK_STATS.lastDelivery}
        </div>
        <div className="mt-[3px] font-[var(--font-dm-mono)] text-[10px] text-[color:var(--muted)]">
          {MOCK_STATS.lastDeliveryDetail}
        </div>
      </div>
      <div className="rounded-xl border border-[color:var(--border-light)] bg-[color:var(--cream)] px-[1.15rem] py-4">
        <div className="mb-1 font-[var(--font-dm-mono)] text-[10px] text-[color:var(--brown-mid)]">
          success rate
        </div>
        <div className="text-[26px] leading-none font-black tracking-[-1px] text-[color:var(--caramel)]">
          {MOCK_STATS.successRate}
        </div>
        <div className="mt-[3px] font-[var(--font-dm-mono)] text-[10px] text-[color:var(--muted)]">
          {MOCK_STATS.successRatePeriod}
        </div>
      </div>
    </div>
  );
}
