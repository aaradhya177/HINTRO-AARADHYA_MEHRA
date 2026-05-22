"use client";

import { useState } from "react";
import { ChevronDown, LogOut, Menu, Play } from "lucide-react";
import { toast } from "sonner";

import { LogoutModal } from "@/components/LogoutModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type HintroUserId, useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

type TopBarProps = {
  title: string;
  onMenuClick: () => void;
};

export function TopBar({ title, onMenuClick }: TopBarProps) {
  const { userId, login } = useAuth();
  const { profile } = useUser();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const firstName = profile?.firstName ?? "User";
  const fullName =
    `${profile?.firstName ?? "User"} ${profile?.lastName ?? ""}`.trim();
  const email = profile?.email ?? "user@hintro.ai";

  function switchUser(nextUserId: HintroUserId) {
    if (nextUserId === userId) {
      return;
    }

    login(nextUserId);
    toast.success(
      nextUserId === "u1"
        ? "Switched to User 1 (empty)"
        : "Switched to User 2 (active)",
    );
  }

  return (
    <>
      <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-main-bg)] px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden"
            aria-label="Open sidebar"
            onClick={onMenuClick}
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </Button>
          <h1 className="truncate text-xl font-semibold text-[var(--color-main-text)]">
            {title}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex rounded-full bg-[var(--color-card-bg)] p-1">
            {(["u1", "u2"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => switchUser(option)}
                className={cn(
                  "min-h-9 rounded-full px-3 py-1 text-xs font-semibold uppercase text-[var(--color-muted)] transition-colors",
                  userId === option &&
                    "bg-[var(--color-sidebar-active-bg)] text-[var(--color-sidebar-active-text)]",
                )}
              >
                {option}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" className="hidden gap-2 sm:inline-flex">
            <Play aria-hidden="true" className="h-4 w-4" />
            Watch Tutorial
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex min-h-11 items-center gap-2 rounded-full p-1 transition-colors hover:bg-[var(--color-card-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent-teal)] text-sm font-bold text-[var(--color-sidebar-active-text)]">
                  {firstName.charAt(0).toUpperCase()}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className="h-4 w-4 text-[var(--color-muted)]"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-2 py-1.5">
                <p className="truncate text-sm font-bold text-[var(--color-main-text)]">
                  {fullName}
                </p>
                <p className="truncate text-xs text-[var(--color-muted)]">
                  {email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-[var(--color-accent-red)] focus:text-[var(--color-accent-red)]"
                onSelect={() => setIsLogoutOpen(true)}
              >
                <LogOut aria-hidden="true" className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <LogoutModal open={isLogoutOpen} onOpenChange={setIsLogoutOpen} />
    </>
  );
}
