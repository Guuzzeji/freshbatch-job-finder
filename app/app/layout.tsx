import type { Metadata } from "next";
import { Fraunces, DM_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
  weight: ["400", "500"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://freshbatch.tech";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "freshbatch — CS jobs, warm & ready",
    template: "%s | freshbatch",
  },
  description:
    "Deliver fresh internship and new grad jobs to your own webhook endpoint, bot, or automation the second they drop.",
  keywords: [
    "internship",
    "new grad",
    "webhook",
    "CS jobs",
    "software engineering",
  ],
  authors: [{ name: "freshbatch" }],
  creator: "freshbatch",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "freshbatch",
    title: "freshbatch — CS jobs, warm & ready",
    description:
      "Deliver fresh internship and new grad jobs to your own webhook endpoint, bot, or automation the second they drop.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "freshbatch - CS jobs delivered to your webhook",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "freshbatch — CS jobs, warm & ready",
    description:
      "Deliver fresh internship and new grad jobs to your own webhook endpoint, bot, or automation the second they drop.",
    images: ["/og-image.png"],
    creator: "@Guuzzeji",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmMono.variable}`}>
      <body className="bg-[#f5edd8] text-[color:var(--brown)]">{children}</body>
    </html>
  );
}
