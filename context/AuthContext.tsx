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
import { useRouter } from "next/navigation";

export type HintroUserId = "u1" | "u2";

type AuthContextValue = {
  isLoggedIn: boolean;
  userId: HintroUserId | null;
  login: (userId: HintroUserId) => void;
  logout: () => void;
};

const STORAGE_KEY = "hintro_user_id";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function isHintroUserId(value: string | null): value is HintroUserId {
  return value === "u1" || value === "u2";
}

function persistUser(userId: HintroUserId) {
  localStorage.setItem(STORAGE_KEY, userId);
  document.cookie = `${STORAGE_KEY}=${userId}; path=/; max-age=2592000; samesite=lax`;
}

function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
  document.cookie = `${STORAGE_KEY}=; path=/; max-age=0; samesite=lax`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [userId, setUserId] = useState<HintroUserId | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem(STORAGE_KEY);

    if (isHintroUserId(storedUserId)) {
      setUserId(storedUserId);
      persistUser(storedUserId);
    }
  }, []);

  const login = useCallback((nextUserId: HintroUserId) => {
    setUserId(nextUserId);
    persistUser(nextUserId);
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    clearUser();
    router.replace("/");
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoggedIn: userId !== null,
      userId,
      login,
      logout,
    }),
    [login, logout, userId],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
