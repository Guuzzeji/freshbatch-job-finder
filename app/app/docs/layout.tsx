import type { Metadata } from "next";
import PublicNavbar from "@/components/PublicNavbar";
import DocsLayout from "@/components/DocsLayout";

export const metadata: Metadata = {
  title: "freshbatch docs",
  description:
    "Setup guides, payload reference, and signature verification for Freshbatch webhook delivery.",
};

export default function DocsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[color:var(--cream)] text-[color:var(--brown)]">
      <PublicNavbar variant="docs" />
      <DocsLayout>{children}</DocsLayout>
    </div>
  );
}
