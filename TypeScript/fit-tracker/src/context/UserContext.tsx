import { useContext, createContext } from "react";
import { z } from "zod";
import { Admin, Coach, User } from "../types/interfaces";
import {
  adminStorageSchema,
  coachStorageSchema,
  userStorageSchema,
} from "./schema/user-context-schema";
import { UserContextValue } from "./types/user-context-types";
import { useStoredList } from "./utils/user-context-utils";

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const userStore = useStoredList<User>(
    "fit-tracker-users",
    z.array(userStorageSchema),
  );
  const coachStore = useStoredList<Coach>(
    "fit-tracker-coachs",
    z.array(coachStorageSchema),
  );
  const adminStore = useStoredList<Admin>(
    "fit-tracker-admins",
    z.array(adminStorageSchema),
  );

  return (
    <UserContext.Provider
      value={{
        users: userStore.items,
        coachs: coachStore.items,
        admins: adminStore.items,
        addUser: userStore.add,
        addCoach: coachStore.add,
        addAdmin: adminStore.add,
        updateUser: userStore.update,
        updateCoach: coachStore.update,
        updateAdmin: adminStore.update,
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
