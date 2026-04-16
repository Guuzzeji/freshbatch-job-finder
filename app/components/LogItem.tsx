import type { LogEntry } from "@/lib/mock-data";

export default function LogItem({ entry }: { entry: LogEntry }) {
  const isOk = entry.status === "ok";

  return (
    <div className="flex items-center gap-3 rounded-[10px] border border-[color:var(--border-light)] bg-[color:var(--cream)] px-[14px] py-[10px] max-sm:flex-wrap max-sm:gap-2">
      <div
        className={`h-[7px] w-[7px] shrink-0 rounded-full ${isOk ? "bg-[color:var(--green)]" : "bg-[color:var(--caramel)]"}`}
      />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] leading-[1.2] font-bold text-[color:var(--brown)]">
          {entry.company} — {entry.role}
        </div>
        <div className="mt-px font-[var(--font-dm-mono)] text-[10px] text-[color:var(--muted)]">
          {entry.time} · {entry.type} · {entry.location}
        </div>
      </div>
      <div
        className={`shrink-0 rounded-full border px-2 py-[2px] font-[var(--font-dm-mono)] text-[10px] ${isOk ? "border-[#52B788] bg-[#E8F5EF] text-[color:var(--green)]" : "border-[color:var(--caramel-light)] bg-[#FEF3E2] text-[#8B4513]"}`}
      >
        {entry.code}
      </div>
    </div>
  );
}
