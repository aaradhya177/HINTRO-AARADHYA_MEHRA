"use client";

import { useState, type ReactNode } from "react";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { FeedbackModalProvider } from "@/context/FeedbackModalContext";
import { UserProvider } from "@/context/UserContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <UserProvider>
      <FeedbackModalProvider>
        <div className="min-h-screen bg-[var(--color-main-bg)] text-[var(--color-main-text)]">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          <div className="min-h-screen md:ml-[220px]">
            <TopBar
              title="Dashboard"
              onMenuClick={() => setIsSidebarOpen(true)}
            />
            <main className="h-[calc(100vh-4rem)] overflow-x-hidden overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </FeedbackModalProvider>
    </UserProvider>
  );
}
