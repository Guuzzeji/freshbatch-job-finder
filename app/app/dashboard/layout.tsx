"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { ToastProvider } from "@/components/Toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-1 flex-col">
          <MobileNav onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
          <main className="relative flex-1 overflow-y-auto p-5 lg:ml-[200px] lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
