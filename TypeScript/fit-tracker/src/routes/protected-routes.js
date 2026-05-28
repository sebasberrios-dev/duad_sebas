import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from "react-router";
import { useSession } from "../context/SessionContext";
export function AdminRoute() {
    const { currentUser, isAdmin } = useSession();
    console.log("AdminRoute →", currentUser?.role, isAdmin(currentUser));
    if (!currentUser || !isAdmin(currentUser))
        return _jsx(Navigate, { to: "/admin/login", replace: true });
    return _jsx(Outlet, {});
}
export function UserRoute() {
    const { currentUser, isUser, isAdmin } = useSession();
    if (!currentUser || !isUser(currentUser) || !isAdmin(currentUser))
        return _jsx(Navigate, { to: "/login", replace: true });
    return _jsx(Outlet, {});
}
export function CoachRoute() {
    const { currentUser, isCoach, isAdmin } = useSession();
    console.log("ddd");
    if (!currentUser || !isCoach(currentUser) || !isAdmin(currentUser))
        return _jsx(Navigate, { to: "/coach/login", replace: true });
    return _jsx(Outlet, {});
}
export function StaffRoute() {
    const { currentUser, isAdmin, isCoach } = useSession();
    if (!currentUser || !isAdmin(currentUser) || !isCoach(currentUser))
        return _jsx(Navigate, { to: "/login", replace: true });
    return _jsx(Outlet, {});
}
