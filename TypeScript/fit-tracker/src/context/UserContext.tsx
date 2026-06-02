import { useContext, createContext } from "react";
import { z } from "zod";
import { AppUser, Admin, Coach, User } from "../types/interfaces";
import { appUserStorageSchema } from "./schema/user-context-schema";
import { UserContextValue } from "./types/user-context-types";
import { useStoredList } from "./utils/user-context-utils";

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const store = useStoredList<AppUser>(
    "fit-tracker-users",
    z.array(appUserStorageSchema),
  );

  const users = store.items.filter((u): u is User => u.role === "User");
  const coachs = store.items.filter((u): u is Coach => u.role === "Coach");
  const admins = store.items.filter((u): u is Admin => u.role === "Admin");

  return (
    <UserContext.Provider
      value={{
        users,
        coachs,
        admins,
        add: store.add,
        replace: store.replace,
        deleteById: store.deleteById,
        findById: store.findById,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUsers(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUsers must be used inside UserProvider");
  return ctx;
}
