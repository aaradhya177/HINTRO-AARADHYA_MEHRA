"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/context/AuthContext";
import { createApiClient } from "@/lib/api";

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
};

type DashboardData = {
  subscription?: unknown;
  usage?: unknown;
  [key: string]: unknown;
};

type UserContextValue = {
  profile: UserProfile | null;
  dashboard: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

function normalizeProfile(value: unknown): UserProfile {
  const profile = value as Partial<UserProfile> | null;

  return {
    firstName: profile?.firstName ?? "User",
    lastName: profile?.lastName ?? "",
    email: profile?.email ?? "user@hintro.ai",
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const { userId } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setDashboard(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const client = createApiClient(userId);
      const [profileResponse, dashboardResponse] = await Promise.all([
        client.get("/api/auth/profile"),
        client.get("/api/auth/dashboard"),
      ]);

      setProfile(normalizeProfile(profileResponse.data));
      setDashboard(dashboardResponse.data);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load user data.",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const value = useMemo<UserContextValue>(
    () => ({
      profile,
      dashboard,
      loading,
      error,
      refetch,
    }),
    [dashboard, error, loading, profile, refetch],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
