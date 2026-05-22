"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart2, CalendarDays, Clock, Zap } from "lucide-react";

import { RecentCalls } from "@/components/dashboard/RecentCalls";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { createApiClient } from "@/lib/api";
import { formatDuration, formatRelativeDate } from "@/lib/utils/timeFormat";

type CallStats = {
  totalSessions?: number;
  averageDuration?: number;
  totalAIInteractions?: number;
  lastSession?: unknown[];
};

function normalizeStats(value: unknown): CallStats {
  const record = value as Record<string, unknown> | null;
  const wrapped =
    record?.stats && typeof record.stats === "object"
      ? (record.stats as Record<string, unknown>)
      : record;

  return {
    totalSessions: Number(wrapped?.totalSessions ?? 0),
    averageDuration: Number(wrapped?.averageDuration ?? 0),
    totalAIInteractions: Number(wrapped?.totalAIInteractions ?? 0),
    lastSession: Array.isArray(wrapped?.lastSession) ? wrapped.lastSession : [],
  };
}

function getLastSessionDate(lastSession: unknown[] | undefined) {
  const firstSession = lastSession?.[0];

  if (!firstSession) {
    return null;
  }

  if (typeof firstSession === "string" || firstSession instanceof Date) {
    return firstSession;
  }

  if (typeof firstSession === "object") {
    const record = firstSession as Record<string, unknown>;
    const dateValue =
      record.createdAt ?? record.started_at ?? record.startedAt ?? record.date;

    return typeof dateValue === "string" ? dateValue : null;
  }

  return null;
}

export default function DashboardPage() {
  const { userId } = useAuth();
  const { profile } = useUser();
  const [stats, setStats] = useState<CallStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [relativeDateTick, setRelativeDateTick] = useState(0);

  useEffect(() => {
    if (!userId) {
      setStats(null);
      return;
    }

    let isMounted = true;

    async function fetchStats() {
      setLoadingStats(true);
      setStatsError(null);

      try {
        const client = createApiClient(userId);
        const response = await client.get("/api/call-sessions/stats");

        if (isMounted) {
          setStats(normalizeStats(response.data));
        }
      } catch (fetchError) {
        if (isMounted) {
          setStatsError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load call stats.",
          );
        }
      } finally {
        if (isMounted) {
          setLoadingStats(false);
        }
      }
    }

    void fetchStats();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const lastSessionDate = getLastSessionDate(stats?.lastSession);

  useEffect(() => {
    if (!lastSessionDate) {
      return;
    }

    const interval = window.setInterval(() => {
      setRelativeDateTick((tick) => tick + 1);
    }, 60_000);

    return () => window.clearInterval(interval);
  }, [lastSessionDate]);

  const statCards = useMemo(
    () => [
      {
        label: "Total Sessions",
        value: stats?.totalSessions ?? 0,
        icon: BarChart2,
        iconClassName:
          "bg-gradient-to-br from-[var(--color-accent-red)] to-[var(--color-accent-purple)]",
      },
      {
        label: "Average Duration",
        value: formatDuration(stats?.averageDuration),
        icon: Clock,
        iconClassName: "bg-[var(--color-accent-teal)]",
      },
      {
        label: "AI Used",
        value: `${stats?.totalAIInteractions ?? 0} times`,
        icon: Zap,
        iconClassName: "bg-[var(--color-accent-green)]",
      },
      {
        label: "Last Session",
        value: formatRelativeDate(lastSessionDate),
        icon: CalendarDays,
        iconClassName: "bg-[var(--color-accent-purple)]",
      },
    ],
    [lastSessionDate, relativeDateTick, stats],
  );

  return (
    <div className="page-enter space-y-6 overflow-x-hidden">
      <section className="flex flex-col justify-between gap-4 rounded-xl bg-[var(--color-card-bg)] p-5 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-[var(--color-main-text)]">
            Hi, {profile?.firstName ?? "there"} {"\uD83D\uDC4B"} Welcome to
            Hintro
          </h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Ready to make your next call smarter?
          </p>
        </div>
        <Button className="min-h-11 rounded-lg px-5">Start Now Call</Button>
      </section>

      <section>
        {statsError ? (
          <p className="mb-3 rounded-lg border border-[var(--color-border)] p-3 text-sm text-[var(--color-accent-red)]">
            {statsError}
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {loadingStats
            ? Array.from({ length: 4 }).map((_, index) => (
                <StatCardSkeleton key={index} />
              ))
            : statCards.map((card) => <StatCard key={card.label} {...card} />)}
        </div>
      </section>

      <RecentCalls />
    </div>
  );
}
