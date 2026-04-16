import StatsGrid from "@/components/StatsGrid";
import HookCard from "@/components/HookCard";

export default function DashboardPage() {
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

      <StatsGrid />
      <HookCard />
    </>
  );
}
