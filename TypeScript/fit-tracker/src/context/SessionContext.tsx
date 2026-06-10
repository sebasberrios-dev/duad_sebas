import { AppUser, User, Coach, Admin } from "../types/interfaces";
import { useUsers } from "./AppStore";
import { useContext, useState, createContext } from "react";
import React from "react";
import { SessionContextValue } from "./types/session-context-types";

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { replace, findById } = useUsers();
  const [currentUserId, setCurrentUserId] = useState<number | null>(() => {
    const stored = localStorage.getItem("fit-tracker-session");
    return stored ? Number(stored) : null;
  });

  const currentUser =
    currentUserId !== null ? (findById(currentUserId) ?? null) : null;

  function isUser(u: AppUser): u is User {
    return u?.role === "User";
  }
  function isCoach(u: AppUser): u is Coach {
    return u?.role === "Coach";
  }
  function isAdmin(u: AppUser): u is Admin {
    return u?.role === "Admin";
  }

  function login(userId: number) {
    setCurrentUserId(userId);
    localStorage.setItem("fit-tracker-session", String(userId));
  }

  function logout() {
    setCurrentUserId(null);
    localStorage.removeItem("fit-tracker-session");
  }

  function updateCurrentUser(user: AppUser) {
    replace(user);
  }

  return (
    <SessionContext.Provider
      value={{
        currentUser,
        login,
        logout,
        updateCurrentUser,
        isUser,
        isCoach,
        isAdmin,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}