"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type PublicNavbarVariant = "home" | "docs" | "legal";

interface PublicNavbarProps {
  variant: PublicNavbarVariant;
}

export default function PublicNavbar({ variant }: PublicNavbarProps) {
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const brandSubline =
    variant === "docs"
      ? "docs, warm & ready"
      : variant === "legal"
        ? "legal"
        : "cs jobs, warm & ready";

  const navLinkClass =
    "motion-transition-subtle rounded-full border border-[color:var(--border)] bg-transparent px-[14px] py-[5px] font-[var(--font-dm-mono)] text-[11px] text-[color:var(--brown-mid)] hover:bg-[color:var(--cream-dark)]";
  const mobileNavLinkClass =
    "motion-transition-subtle rounded-full border border-[color:var(--border)] bg-transparent px-[14px] py-[5px] text-center font-[var(--font-dm-mono)] text-[11px] text-[color:var(--brown-mid)] hover:bg-[color:var(--cream-dark)]";

  return (
    <>
      <nav className="relative z-10 flex items-center justify-between border-b border-dashed border-[color:var(--border)] bg-[rgba(253,246,236,0.92)] px-6 py-4 backdrop-blur-[4px]">
        <Link href="/" className="no-underline">
          <div className="text-[22px] font-black tracking-[-1px] text-[color:var(--brown)]">
            fresh<span className="text-[color:var(--caramel)]">batch</span>
          </div>
          <div className="font-[var(--font-dm-mono)] text-[9px] uppercase tracking-[1px] text-[color:var(--caramel)]">
            {brandSubline}
          </div>
        </Link>

        <button
          className="flex rounded-lg border border-[color:var(--border)] px-[10px] py-[6px] text-lg text-[color:var(--brown)] sm:hidden"
          onClick={() => setNavOpen((previous) => !previous)}
          aria-label="Toggle navigation"
        >
          {navOpen ? "✕" : "☰"}
        </button>

        <div className="hidden items-center gap-[6px] sm:flex">
          {variant === "home" ? (
            <>
              <Link href="/docs" className={navLinkClass}>
                docs
              </Link>
              <Link href="https://x.com/Guuzzeji" className={navLinkClass}>
                twitter/x
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className={navLinkClass}>
                home
              </Link>
              {pathname === "/tos" ? (
                <Link href="/privacy" className={navLinkClass}>
                  Privacy
                </Link>
              ) : pathname === "/privacy" ? (
                <Link href="/tos" className={navLinkClass}>
                  Terms of Service
                </Link>
              ) : null}
            </>
          )}

          {session ? (
            <Link
              href="/dashboard"
              className="motion-transition-subtle flex items-center gap-2 rounded-full border border-[color:var(--caramel)] bg-[color:var(--caramel)] px-[14px] py-[5px] font-[var(--font-dm-mono)] text-[11px] text-white no-underline hover:bg-[color:var(--brown-mid)]"
            >
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "avatar"}
                  className="h-5 w-5 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/30 text-[10px] font-bold">
                  {(session.user.name ?? "?")[0].toUpperCase()}
                </span>
              )}
              dashboard
            </Link>
          ) : (
            <button
              onClick={() =>
                authClient.signIn.social({
                  provider: "github",
                  callbackURL: "/dashboard",
                })
              }
              className="motion-transition-subtle rounded-full border border-[color:var(--caramel)] bg-[color:var(--caramel)] px-[14px] py-[5px] font-[var(--font-dm-mono)] text-[11px] text-white hover:bg-[color:var(--brown-mid)]"
            >
              Sign In with GitHub
            </button>
          )}
        </div>
      </nav>

      {navOpen && (
        <div className="z-20 flex flex-col gap-2 border-b border-dashed border-[color:var(--border)] bg-[color:var(--cream)] px-6 py-4 sm:hidden">
          {variant === "home" ? (
            <>
              <Link
                href="/docs"
                className={mobileNavLinkClass}
                onClick={() => setNavOpen(false)}
              >
                docs
              </Link>
              <Link
                href="https://x.com/Guuzzeji"
                className={mobileNavLinkClass}
              >
                twitter/x
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/"
                className={mobileNavLinkClass}
                onClick={() => setNavOpen(false)}
              >
                home
              </Link>
              {pathname === "/tos" ? (
                <Link
                  href="/privacy"
                  className={mobileNavLinkClass}
                  onClick={() => setNavOpen(false)}
                >
                  Privacy
                </Link>
              ) : pathname === "/privacy" ? (
                <Link
                  href="/tos"
                  className={mobileNavLinkClass}
                  onClick={() => setNavOpen(false)}
                >
                  TOS
                </Link>
              ) : null}
            </>
          )}

          {session ? (
            <Link
              href="/dashboard"
              className="motion-transition-subtle rounded-full border border-[color:var(--caramel)] bg-[color:var(--caramel)] px-[14px] py-[5px] text-center font-[var(--font-dm-mono)] text-[11px] text-white no-underline hover:bg-[color:var(--brown-mid)]"
              onClick={() => setNavOpen(false)}
            >
              dashboard
            </Link>
          ) : (
            <button
              onClick={() => {
                authClient.signIn.social({
                  provider: "github",
                  callbackURL: "/dashboard",
                });
                setNavOpen(false);
              }}
              className="motion-transition-subtle w-full rounded-full border border-[color:var(--caramel)] bg-[color:var(--caramel)] px-[14px] py-[5px] text-center font-[var(--font-dm-mono)] text-[11px] text-white hover:bg-[color:var(--brown-mid)]"
            >
              Sign In with GitHub
            </button>
          )}
        </div>
      )}
    </>
  );
}
