"use client";

import type { LucideIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName: string;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName,
}: StatCardProps) {
  return (
    <article className="flex min-h-24 flex-col items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-main-bg)] p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:flex-row sm:items-center sm:gap-4">
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[var(--color-sidebar-active-text)]",
          iconClassName,
        )}
      >
        <Icon aria-hidden="true" className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-[var(--color-muted)]">{label}</p>
        <p className="mt-1 break-words text-xl font-semibold text-[var(--color-main-text)]">
          {value}
        </p>
      </div>
    </article>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-main-bg)] p-4 shadow-sm">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}
