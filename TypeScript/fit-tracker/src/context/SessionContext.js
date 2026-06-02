import { jsx as _jsx } from "react/jsx-runtime";
import { useUsers } from "./UserContext";
import { useContext, useState, createContext } from "react";
const SessionContext = createContext(null);
export function SessionProvider({ children }) {
    const { replace, findById } = useUsers();
    const [currentUserId, setCurrentUserId] = useState(() => {
        const stored = localStorage.getItem("fit-tracker-session");
        return stored ? Number(stored) : null;
    });
    const currentUser = currentUserId !== null ? (findById(currentUserId) ?? null) : null;
    function isUser(u) {
        return u?.role === "User";
    }
    function isCoach(u) {
        return u?.role === "Coach";
    }
    function isAdmin(u) {
        return u?.role === "Admin";
    }
    function login(userId) {
        setCurrentUserId(userId);
        localStorage.setItem("fit-tracker-session", String(userId));
    }
    function logout() {
        setCurrentUserId(null);
        localStorage.removeItem("fit-tracker-session");
    }
    function updateCurrentUser(user) {
        replace(user);
    }
    return (_jsx(SessionContext.Provider, { value: {
            currentUser,
            login,
            logout,
            updateCurrentUser,
            isUser,
            isCoach,
            isAdmin,
        }, children: children }));
}
export function useSession() {
    const ctx = useContext(SessionContext);
    if (!ctx)
        throw new Error("useSession must be used inside SessionProvider");
    return ctx;
}
