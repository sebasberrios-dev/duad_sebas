import { User } from "../types/interfaces";
import { useUsers } from "./UserContext";
import { useContext, useState, createContext } from "react";
import React from "react";

interface SessionContextValue {
  currentUser: User | null;
  login: (userId: number) => void;
  logout: () => void;
  updateCurrentUser: (user: User) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { users, updateUser } = useUsers();
  const [currentUserId, setCurrentUserId] = useState<number | null>(() => {
    const stored = localStorage.getItem("fit-tracker-session");
    return stored ? Number(stored) : null;
  });

  const currentUser = users.find((u) => u.id === currentUserId) ?? null;

  function login(userId: number) {
    setCurrentUserId(userId);
    localStorage.setItem("fit-tracker-session", String(userId));
  }

  function logout() {
    setCurrentUserId(null);
    localStorage.removeItem("fit-tracker-session");
  }

  function updateCurrentUser(user: User) {
    updateUser(user);
  }

  return (
    <SessionContext.Provider
      value={{ currentUser, login, logout, updateCurrentUser }}
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
