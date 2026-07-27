import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getUser } from "@/lib/auth";

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
  }, []);

  const clearUser = useCallback(() => {
    setUserState(null);
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
