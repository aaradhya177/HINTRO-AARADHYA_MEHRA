"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { createApiClient } from "@/lib/api";
import { formatDateHeader } from "@/lib/utils/timeFormat";
import { CallRow, type CallSession } from "./CallRow";

function getSessions(value: unknown): CallSession[] {
  if (Array.isArray(value)) {
    return value as CallSession[];
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const wrapped =
      record.callSessions ?? record.sessions ?? record.data ?? record.results;

    if (Array.isArray(wrapped)) {
      return wrapped as CallSession[];
    }
  }

  return [];
}

function getSessionDate(session: CallSession) {
  return session.createdAt ?? session.started_at ?? session.startedAt ?? "";
}

function getDateKey(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "unknown";
  }

  return date.toISOString().slice(0, 10);
}

export function RecentCalls() {
  const { userId } = useAuth();
  const [sessions, setSessions] = useState<CallSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setSessions([]);
      return;
    }

    let isMounted = true;

    async function fetchSessions() {
      setLoading(true);
      setError(null);

      try {
        const client = createApiClient(userId);
        const response = await client.get("/api/call-sessions", {
          params: { limit: 10 },
        });

        if (isMounted) {
          setSessions(getSessions(response.data));
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load recent calls.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void fetchSessions();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const groupedSessions = useMemo(() => {
    return sessions.reduce<Record<string, CallSession[]>>((groups, session) => {
      const dateValue = getSessionDate(session);
      const key = getDateKey(dateValue);

      groups[key] = [...(groups[key] ?? []), session];
      return groups;
    }, {});
  }, [sessions]);

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-main-bg)] p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[var(--color-main-text)]">
          Recent Calls
        </h2>
        {error ? (
          <span className="text-sm text-[var(--color-accent-red)]">{error}</span>
        ) : null}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 rounded-lg px-3 py-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-5 w-1/2" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center px-4 py-10 text-center">
          <CalendarX
            aria-hidden="true"
            className="h-10 w-10 text-[var(--color-muted)]"
          />
          <h3 className="mt-4 font-medium text-[var(--color-main-text)]">
            No Recent Calls
          </h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-[var(--color-muted)]">
            Connect your Google Calendar to see upcoming meetings, get reminders,
            and join calls directly from Hintro.
          </p>
          <Button variant="outline" className="mt-5 rounded-lg">
            Start a Call
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSessions).map(([dateKey, dateSessions]) => (
            <div key={dateKey}>
              <h3 className="mb-2 px-3 text-sm font-semibold text-[var(--color-main-text)]">
                {formatDateHeader(getSessionDate(dateSessions[0]))}
              </h3>
              <div className="space-y-1">
                {dateSessions.map((session, index) => (
                  <CallRow
                    key={session.id ?? `${dateKey}-${index}`}
                    session={session}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
