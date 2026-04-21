"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-client";

interface SidebarUser {
  name: string | null;
  email: string;
  image?: string | null | undefined;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: SidebarUser;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "my hook", icon: "🍪" },
  { href: "/dashboard/test", label: "test fire", icon: "🧪" },
  { href: "/dashboard/log", label: "delivery log", icon: "📋" },
];

export default function Sidebar({ isOpen, onClose, user }: SidebarProps) {
  const pathname = usePathname();

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <>
      <div
        className={`fixed inset-0 z-[25] bg-[rgba(46,21,5,0.4)] backdrop-blur-[2px] transition lg:hidden ${isOpen ? "block" : "hidden"}`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[200px] min-w-[200px] flex-col gap-1 overflow-y-auto border-r border-dashed border-[color:var(--border)] bg-[color:var(--cream)] px-4 py-5 transition-transform duration-300 ease-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Link
          href="/"
          className="mb-5 border-b border-dashed border-[color:var(--border)] pb-4 text-base font-black tracking-[-0.5px] text-[color:var(--brown)] no-underline"
        >
          fresh<span className="text-[color:var(--caramel)]">batch</span>
        </Link>

        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-[10px] py-[7px] font-[var(--font-dm-mono)] text-[11px] no-underline transition hover:bg-[color:var(--cream-dark)] ${isActive ? "bg-[color:var(--cream-dark)] font-medium text-[color:var(--brown)]" : "text-[color:var(--brown-mid)]"}`}
              onClick={onClose}
            >
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        <div className="mt-auto border-t border-dashed border-[color:var(--border)] pt-4">
          <div className="flex items-center gap-2 font-[var(--font-dm-mono)] text-[10px] text-[color:var(--brown-mid)]">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name ?? "avatar"}
                className="h-7 w-7 shrink-0 rounded-full object-cover border border-[color:var(--border)]"
              />
            ) : (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--cream-dark)] text-[11px] font-bold text-[color:var(--brown)]">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <div className="truncate font-medium text-[color:var(--brown-mid)]">
                {user.name ?? user.email}
              </div>
              <button
                onClick={() =>
                  signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        window.location.href = "/";
                      },
                    },
                  })
                }
                className="text-[color:var(--muted)] hover:text-[color:var(--caramel)] transition-colors cursor-pointer"
              >
                sign out
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
