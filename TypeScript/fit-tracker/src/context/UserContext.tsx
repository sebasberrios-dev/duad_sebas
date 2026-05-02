import { useContext, createContext, useState } from "react";
import { Admin, Coach, User } from "../types/interfaces";

function useStoredList<T extends { id: number }>(storageKey: string) {
  const [items, setItems] = useState<T[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored) as T[];
    } catch {}
    return [];
  });

  function save(updated: T[]) {
    setItems(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }

  return {
    items,
    add: (item: T) => save([...items, item]),
    update: (item: T) => save(items.map((i) => (i.id === item.id ? item : i))),
  };
}

interface UserContextValue {
  users: User[];
  coachs: Coach[];
  admins: Admin[];
  addUser: (user: User) => void;
  addCoach: (coach: Coach) => void;
  addAdmin: (admin: Admin) => void;
  updateUser: (user: User) => void;
  updateCoach: (coach: Coach) => void;
  updateAdmin: (admin: Admin) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const userStore = useStoredList<User>("fit-tracker-users");
  const coachStore = useStoredList<Coach>("fit-tracker-coachs");
  const adminStore = useStoredList<Admin>("fit-tracker-admins");

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
