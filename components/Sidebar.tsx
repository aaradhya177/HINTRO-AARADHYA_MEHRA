"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  History,
  Info,
  LayoutDashboard,
  MessageCircle,
  MessageSquare,
  Phone,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useFeedbackModal } from "@/context/FeedbackModalContext";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  hasInfo?: boolean;
  opensFeedback?: boolean;
};

const primaryItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Call Insights", href: "/dashboard/call-insights", icon: Phone },
  {
    label: "Knowledge Base",
    href: "/dashboard/knowledge-base",
    icon: BookOpen,
    hasInfo: true,
  },
  {
    label: "Prompts",
    href: "/dashboard/prompts",
    icon: MessageSquare,
    hasInfo: true,
  },
  {
    label: "Boxy Controls",
    href: "/dashboard/boxy-controls",
    icon: Settings,
    hasInfo: true,
  },
];

const bottomItems: NavItem[] = [
  { label: "Feedback History", href: "/dashboard/feedback-history", icon: History },
  {
    label: "Feedback",
    href: "/dashboard/feedback",
    icon: MessageCircle,
    opensFeedback: true,
  },
];

function SidebarNavItem({
  item,
  onClick,
}: {
  item: NavItem;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const { openFeedbackModal } = useFeedbackModal();
  const Icon = item.icon;
  const isActive = pathname === item.href;
  const itemClassName = cn(
    "flex min-h-11 w-full items-center gap-3 border-l-[3px] border-l-transparent px-4 py-3 text-left text-sm font-medium text-[var(--color-sidebar-text)] transition-colors duration-150 hover:bg-[var(--color-sidebar-active-bg)] hover:text-[var(--color-sidebar-active-text)]",
    isActive &&
      "border-l-[var(--color-accent-teal)] bg-[var(--color-sidebar-active-bg)] text-[var(--color-sidebar-active-text)]",
  );
  const content = (
    <>
      <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.hasInfo ? (
        <Info
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 text-[var(--color-sidebar-text)]"
        />
      ) : null}
    </>
  );

  if (item.opensFeedback) {
    return (
      <button
        type="button"
        className={itemClassName}
        onClick={() => {
          openFeedbackModal();
          onClick?.();
        }}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={itemClassName}
    >
      {content}
    </Link>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <aside className="flex h-full w-[220px] flex-col bg-[var(--color-sidebar-bg)] py-5">
      <div className="mb-8 flex items-center justify-between px-5">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="text-xl font-bold text-[var(--color-sidebar-active-text)]"
        >
          Hintro
        </Link>
        {onClose ? (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="rounded-md p-1 text-[var(--color-sidebar-text)] hover:text-[var(--color-sidebar-active-text)] md:hidden"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <nav className="space-y-1">
        {primaryItems.map((item) => (
          <SidebarNavItem key={item.href} item={item} onClick={onClose} />
        ))}
      </nav>

      <div className="flex-1" />

      <nav className="space-y-1">
        {bottomItems.map((item) => (
          <SidebarNavItem key={item.href} item={item} onClick={onClose} />
        ))}
      </nav>

      <div className="px-4 pt-5">
        <button className="w-full rounded-full bg-[var(--color-upgrade-btn)] py-2 text-sm font-semibold text-[var(--color-sidebar-active-text)] ring-1 ring-[var(--color-sidebar-active-bg)] transition-opacity hover:opacity-90">
          Upgrade
        </button>
      </div>
    </aside>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <div className="fixed inset-y-0 left-0 z-30 hidden md:block">
        <SidebarContent />
      </div>

      <button
        type="button"
        aria-label="Close sidebar overlay"
        className={cn(
          "fixed inset-0 z-40 bg-[var(--color-main-text)]/50 transition-opacity duration-300 ease-in-out md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 shadow-xl transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-[220px]",
        )}
      >
        <SidebarContent onClose={onClose} />
      </div>
    </>
  );
}
