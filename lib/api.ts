import axios from "axios";

import type { HintroUserId } from "@/context/AuthContext";

export const api = axios.create({
  baseURL: "https://mock-backend-hintro.vercel.app",
});

export function createApiClient(userId: HintroUserId | null) {
  return axios.create({
    baseURL: "https://mock-backend-hintro.vercel.app",
    headers: userId ? { "x-user-id": userId } : undefined,
  });
}
