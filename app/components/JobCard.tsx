import type { Job } from "@/lib/mock-data";

export default function JobCard({ job }: { job: Job }) {
  const typeLabel = job.type === "intern" ? "internship" : "new grad";
  const isRemote = job.loc === "Remote";
  const tagBase =
    "inline-block rounded-full border px-[9px] py-[3px] font-[var(--font-dm-mono)] text-[10px]";
  const typeTagClass =
    job.type === "intern"
      ? "border-[#f5a623] bg-[#FEF3E2] text-[#8B4513]"
      : "border-[#52B788] bg-[#E8F5EF] text-[color:var(--green)]";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[color:var(--border-light)] bg-white px-[1.15rem] py-4 animate-[popin_0.35s_ease]">
      <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-[color:var(--caramel)]" />

      <div className="mb-0.5 text-[13px] font-bold text-[color:var(--brown)]">
        {job.co}
      </div>
      <div className="mb-2 text-[15px] leading-[1.2] font-black tracking-[-0.3px] text-[color:var(--chip)]">
        {job.role}
      </div>

      <div className="mb-2.5 flex flex-wrap gap-[5px]">
        <span className={`${tagBase} ${typeTagClass}`}>{typeLabel}</span>
        <span className={`${tagBase} border-[color:var(--border)] bg-[color:var(--cream-dark)] text-[color:var(--brown)]`}>
          {job.pay}
        </span>
        {isRemote && (
          <span className={`${tagBase} border-[#C084FC] bg-[#F0EAF8] text-[#5E3A8C]`}>
            remote
          </span>
        )}
      </div>

      <div className="mt-1 flex justify-between border-t border-dashed border-[color:var(--border-light)] pt-2 font-[var(--font-dm-mono)] text-[10px] text-[color:var(--muted)]">
        <span>📍 {job.loc}</span>
        <span>{"{ JSON }"}</span>
        <span>{job.ago}</span>
      </div>
    </div>
  );
}
