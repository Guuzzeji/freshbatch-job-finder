import LogItem from "@/components/LogItem";
import { MOCK_LOGS } from "@/lib/mock-data";

export default function DeliveryLogPage() {
  return (
    <>
      <div className="mb-6">
        <div className="mb-1 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.5px] text-[color:var(--caramel)]">
          delivery log
        </div>
        <div className="text-[26px] font-black tracking-[-1px] text-[color:var(--brown)]">
          recent deliveries
        </div>
        <div className="mt-0.5 text-[13px] italic text-[color:var(--brown-mid)]">
          every cookie we&apos;ve baked and sent your way.
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        {MOCK_LOGS.map((entry, i) => (
          <LogItem key={i} entry={entry} />
        ))}
      </div>
    </>
  );
}
