import { jsx as _jsx } from "react/jsx-runtime";
import { useContext, createContext } from "react";
import { z } from "zod";
import { appUserStorageSchema } from "./schema/user-context-schema";
import { useStoredList } from "./utils/user-context-utils";
const UserContext = createContext(null);
export function UserProvider({ children }) {
    const store = useStoredList("fit-tracker-users", z.array(appUserStorageSchema));
    const users = store.items.filter((u) => u.role === "User");
    const coachs = store.items.filter((u) => u.role === "Coach");
    const admins = store.items.filter((u) => u.role === "Admin");
    return (_jsx(UserContext.Provider, { value: {
            users,
            coachs,
            admins,
            add: store.add,
            replace: store.replace,
            deleteById: store.deleteById,
            findById: store.findById,
        }, children: children }));
}
export function useUsers() {
    const ctx = useContext(UserContext);
    if (!ctx)
        throw new Error("useUsers must be used inside UserProvider");
    return ctx;
}
