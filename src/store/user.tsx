import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getUser, saveSession, getToken } from "@/lib/auth";

export interface User {
  name?: string;
  email?: string;
  [key: string]: unknown;
}

interface UserContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);
  const queryClient = useQueryClient();
  const wasAuthenticated = useRef(false);

  // Clear the React Query cache when the user logs out
  useEffect(() => {
    if (wasAuthenticated.current && !user) {
      queryClient.clear();
    }
    wasAuthenticated.current = !!user;
  }, [user, queryClient]);

  // Load user from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const loadedUser = getUser<User>();
      if (loadedUser) {
        setUserState(loadedUser);
      }
    } catch { /* ignore */ }
    setHasLoadedFromStorage(true);
  }, []);

  const setUser = useCallback((userData: User | null) => {
    setUserState(userData);
    if (userData) {
      saveSession(getToken() || "", userData);
    }
  }, []);

  const clearUser = useCallback(() => {
    setUserState(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("bm_auth_token");
      window.localStorage.removeItem("bm_user");
    }
  }, []);

  const value = useMemo<UserContextValue>(() => ({
    user,
    setUser,
    clearUser,
    isAuthenticated: !!user,
  }), [user, setUser, clearUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
