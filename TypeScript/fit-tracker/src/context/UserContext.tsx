import { useContext, createContext, useState } from "react";
import { User } from "../types/interfaces";

const STORAGE_KEY = "fit-tracker-users";

function loadUsers(): User[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as User[];
  } catch {}
  return [];
}

function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

interface UserContextValue {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(loadUsers);

  function addUser(user: User) {
    const updated = [...users, user];
    setUsers(updated);
    saveUsers(updated);
  }

  function updateUser(user: User) {
    const updated = users.map((u) => (u.id === user.id ? user : u));
    setUsers(updated);
    saveUsers(updated);
  }

  return (
    <UserContext.Provider value={{ users, addUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUsers must be used inside UserProvider");
  return ctx;
}
