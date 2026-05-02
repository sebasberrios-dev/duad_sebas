import { AppUser, User, Coach, Admin } from "../types/interfaces";
import { useUsers } from "./UserContext";
import { useContext, useState, createContext } from "react";
import React from "react";

interface SessionContextValue {
  currentUser: AppUser | null;
  login: (userId: number) => void;
  logout: () => void;
  updateCurrentUser: (user: AppUser) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { users, coachs, admins, updateUser, updateCoach, updateAdmin } =
    useUsers();
  const [currentUserId, setCurrentUserId] = useState<number | null>(() => {
    const stored = localStorage.getItem("fit-tracker-session");
    return stored ? Number(stored) : null;
  });

  const allUsers: AppUser[] = [...users, ...coachs, ...admins];
  const currentUser = allUsers.find((u) => u.id === currentUserId) ?? null;

  function login(userId: number) {
    setCurrentUserId(userId);
    localStorage.setItem("fit-tracker-session", String(userId));
  }

  function logout() {
    setCurrentUserId(null);
    localStorage.removeItem("fit-tracker-session");
  }

  function updateCurrentUser(user: AppUser) {
    if (user.role === "User") updateUser(user as User);
    else if (user.role === "Coach") updateCoach(user as Coach);
    else updateAdmin(user as Admin);
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
