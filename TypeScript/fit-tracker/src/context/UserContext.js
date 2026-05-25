import { jsx as _jsx } from "react/jsx-runtime";
import { useContext, createContext } from "react";
import { z } from "zod";
import { adminStorageSchema, coachStorageSchema, userStorageSchema, } from "./schema/user-context-schema";
import { useStoredList } from "./utils/user-context-utils";
const UserContext = createContext(null);
export function UserProvider({ children }) {
    const userStore = useStoredList("fit-tracker-users", z.array(userStorageSchema));
    const coachStore = useStoredList("fit-tracker-coachs", z.array(coachStorageSchema));
    const adminStore = useStoredList("fit-tracker-admins", z.array(adminStorageSchema));
    return (_jsx(UserContext.Provider, { value: {
            users: userStore.items,
            coachs: coachStore.items,
            admins: adminStore.items,
            addUser: userStore.add,
            addCoach: coachStore.add,
            addAdmin: adminStore.add,
            updateUser: userStore.update,
            updateCoach: coachStore.update,
            updateAdmin: adminStore.update,
        }, children: children }));
}
export function useUsers() {
    const ctx = useContext(UserContext);
    if (!ctx)
        throw new Error("useUsers must be used inside UserProvider");
    return ctx;
}
