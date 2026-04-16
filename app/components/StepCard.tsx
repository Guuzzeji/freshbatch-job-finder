interface StepCardProps {
  icon: string;
  stepNum: string;
  title: string;
  description: string;
  chips?: string[];
}

export default function StepCard({ icon, stepNum, title, description, chips }: StepCardProps) {
  return (
    <div className="rounded-2xl border border-[color:var(--border-light)] bg-white p-5">
      <div className="mb-2.5 text-[22px]">{icon}</div>
      <div className="mb-[5px] font-[var(--font-dm-mono)] text-[10px] text-[color:var(--caramel)]">
        {stepNum}
      </div>
      <div className="mb-1.5 text-[15px] font-black tracking-[-0.3px] text-[color:var(--brown)]">
        {title}
      </div>
      <div className="text-[13px] leading-6 font-normal text-[color:var(--brown-mid)]">
        {description}
      </div>
      {chips && chips.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-[5px]">
          {chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-[color:var(--border)] bg-[color:var(--cream-dark)] px-[9px] py-[3px] font-[var(--font-dm-mono)] text-[10px] text-[color:var(--brown-mid)]"
            >
              {chip}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
