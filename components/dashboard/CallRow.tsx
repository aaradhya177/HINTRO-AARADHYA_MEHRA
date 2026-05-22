"use client";

import { MoreVertical } from "lucide-react";

import { formatTime } from "@/lib/utils/timeFormat";

export type CallSession = {
  id?: string | number;
  client?: string;
  clientName?: string;
  description?: string;
  started_at?: string;
  startedAt?: string;
  createdAt?: string;
};

function getClientName(session: CallSession) {
  return session.clientName ?? session.client ?? "Client";
}

function getHashIndex(value: string) {
  return value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % 4;
}

const avatarClasses = [
  "bg-[var(--color-accent-red)]",
  "bg-[var(--color-accent-teal)]",
  "bg-[var(--color-accent-green)]",
  "bg-[var(--color-accent-purple)]",
];

export function CallRow({ session }: { session: CallSession }) {
  const clientName = getClientName(session);
  const avatarClass = avatarClasses[getHashIndex(clientName)];
  const startedAt = session.started_at ?? session.startedAt ?? session.createdAt;

  return (
    <div className="flex min-h-16 flex-col gap-3 rounded-lg px-3 py-3 transition-colors duration-150 hover:bg-[var(--color-card-bg)] sm:flex-row sm:items-center">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${avatarClass} text-sm font-semibold text-[var(--color-sidebar-active-text)]`}
      >
        {clientName.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1 self-stretch sm:self-auto">
        <p className="break-words text-sm font-medium text-[var(--color-main-text)]">
          {session.description ?? "Call session"}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <span
              key={index}
              className="rounded-full bg-[var(--color-card-bg)] px-2.5 py-1 text-xs font-medium text-[var(--color-muted)]"
            >
              ###
            </span>
          ))}
        </div>
      </div>

      <div className="flex min-h-11 shrink-0 items-center justify-between gap-2 text-sm text-[var(--color-muted)] sm:justify-start">
        <span>{formatTime(startedAt)}</span>
        <MoreVertical aria-hidden="true" className="h-5 w-5" />
      </div>
    </div>
  );
}
