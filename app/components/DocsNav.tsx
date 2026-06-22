"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem =
  | { kind: "link"; label: string; href: string }
  | { kind: "label"; label: string };

const NAV_ITEMS: NavItem[] = [
  { kind: "link", label: "Quickstart", href: "/docs/quickstart" },
  { kind: "link", label: "Introduction", href: "/docs/introduction" },
  { kind: "label", label: "Getting Started" },
  { kind: "link", label: "Dashboard", href: "/docs/getting-started/dashboard" },
  { kind: "link", label: "Test Fire", href: "/docs/getting-started/test-fire" },
  {
    kind: "link",
    label: "Delivery Log",
    href: "/docs/getting-started/delivery-log",
  },
  { kind: "link", label: "Payload Reference", href: "/docs/payload-reference" },
  { kind: "label", label: "Signature Verification" },
  { kind: "link", label: "Overview", href: "/docs/signature-verification" },
  {
    kind: "link",
    label: "Python",
    href: "/docs/signature-verification/python",
  },
  {
    kind: "link",
    label: "TypeScript",
    href: "/docs/signature-verification/typescript",
  },
  { kind: "label", label: "Integrations" },
  { kind: "link", label: "Overview", href: "/docs/integrations" },
  { kind: "link", label: "Discord Bot", href: "/docs/integrations/discord" },
  { kind: "link", label: "FastAPI", href: "/docs/integrations/fastapi" },
  { kind: "link", label: "Express", href: "/docs/integrations/express" },
  { kind: "link", label: "n8n Workflow", href: "/docs/integrations/n8n" },
];

export default function DocsNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation navigation">
      <ul className="space-y-[2px]">
        {NAV_ITEMS.map((item, i) => {
          if (item.kind === "label") {
            return (
              <li key={`label-${i}`} className="pt-5 pb-1 first:pt-0">
                <span className="font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
                  {item.label}
                </span>
              </li>
            );
          }

          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={[
                  "block rounded-r-md py-[6px] pr-3 text-[14px] transition-colors duration-150",
                  isActive
                    ? "border-l-2 border-[color:var(--caramel)] pl-3 font-semibold text-[color:var(--brown)]"
                    : "pl-[14px] text-[color:var(--brown-mid)] hover:text-[color:var(--brown)]",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
