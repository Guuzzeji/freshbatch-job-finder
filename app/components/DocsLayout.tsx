"use client";

import { useState, useEffect, useCallback } from "react";
import DocsNav from "@/components/DocsNav";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);

  const closeNav = useCallback(() => setNavOpen(false), []);

  // Close drawer on Escape key
  useEffect(() => {
    if (!navOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNav();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navOpen, closeNav]);

  return (
    <div className="mx-auto max-w-[1200px]">
      {/* Mobile menu button */}
      <div className="flex items-center border-b border-dashed border-[color:var(--border)] px-5 py-3 md:hidden">
        <button
          onClick={() => setNavOpen((prev) => !prev)}
          aria-expanded={navOpen}
          aria-controls="docs-mobile-nav"
          aria-label="Toggle documentation navigation"
          className="font-[var(--font-dm-mono)] text-[11px] text-[color:var(--brown-mid)] border border-[color:var(--border)] rounded-full px-4 py-[5px] hover:bg-[color:var(--cream-dark)] transition-colors"
        >
          {navOpen ? "✕ close" : "☰ menu"}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {navOpen && (
        <div
          id="docs-mobile-nav"
          className="border-b border-dashed border-[color:var(--border)] bg-[color:var(--cream)] px-6 py-5 md:hidden"
        >
          <DocsNav onNavigate={closeNav} />
        </div>
      )}

      {/* Desktop two-column layout */}
      <div className="md:grid md:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="hidden md:block border-r border-dashed border-[color:var(--border)] px-5 py-8 sticky top-0 h-screen overflow-y-auto">
          <DocsNav />
        </aside>

        {/* Content area */}
        <main className="min-w-0 px-8 py-10 max-w-full max-md:px-5 max-md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
