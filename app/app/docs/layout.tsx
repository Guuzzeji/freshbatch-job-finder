import type { Metadata } from "next";
import PublicNavbar from "@/components/PublicNavbar";
import DocsLayout from "@/components/DocsLayout";

const docsTitle = "freshbatch docs";
const docsDescription =
  "Setup guides, payload reference, and signature verification for Freshbatch webhook delivery.";

export const metadata: Metadata = {
  title: docsTitle,
  description: docsDescription,
  openGraph: {
    type: "website",
    title: docsTitle,
    description: docsDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "freshbatch docs - webhook setup and verification guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: docsTitle,
    description: docsDescription,
    images: ["/og-image.png"],
    creator: "@freshbatch",
  },
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
