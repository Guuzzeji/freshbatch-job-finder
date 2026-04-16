"use client";

interface MobileNavProps {
  onMenuToggle: () => void;
}

export default function MobileNav({ onMenuToggle }: MobileNavProps) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-dashed border-[color:var(--border)] bg-[color:var(--cream)] px-4 py-3 lg:hidden">
      <div className="text-base font-black tracking-[-0.5px] text-[color:var(--brown)]">
        fresh<span className="text-[color:var(--caramel)]">batch</span>
      </div>
      <button
        className="flex items-center justify-center rounded-lg border border-[color:var(--border)] px-[10px] py-[6px] text-lg text-[color:var(--brown)] transition hover:bg-[color:var(--cream-dark)]"
        onClick={onMenuToggle}
        aria-label="Toggle menu"
      >
        ☰
      </button>
    </div>
  );
}
