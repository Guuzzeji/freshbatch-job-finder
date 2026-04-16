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

export const metadata: Metadata = {
  title: "freshbatch — CS jobs, warm & ready",
  description:
    "Deliver fresh internship and new grad jobs to your own webhook endpoint, bot, or automation the second they drop.",
  keywords: ["internship", "new grad", "webhook", "CS jobs", "software engineering"],
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
