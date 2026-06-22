"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <footer className="border-t border-dashed border-[color:var(--border)] bg-[color:var(--cream)]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6 max-sm:flex-col max-sm:gap-3 max-sm:text-center">
        <span className="text-[18px] font-black tracking-[-1px] text-[color:var(--brown)]">
          fresh<span className="text-[color:var(--caramel)]">batch</span>
        </span>
        <div className="flex items-center gap-4 font-[var(--font-dm-mono)] text-[11px] text-[color:var(--muted)]">
          <Link
            href="/tos"
            className="transition-colors hover:text-[color:var(--brown)]"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="transition-colors hover:text-[color:var(--brown)]"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
