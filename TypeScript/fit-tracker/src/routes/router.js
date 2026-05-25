import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { createBrowserRouter } from "react-router";
import App from "../App";
import RegisterCatalogExercise from "../pages/Admin/RegisterCatalogExercise";
import RegisterUser from "../pages/Auth/RegisterUser";
import LoginUser from "../pages/Auth/LoginUser";
import RegisterRoutine from "../pages/RegisterRoutine/RegisterRoutine";
import RegisterCoach from "../pages/Auth/CoachRegister";
import LoginCoach from "../pages/Auth/CoachLogin";
import RegisterAdmin from "../pages/Admin/Auth/AdminRegister";
import LoginAdmin from "../pages/Admin/Auth/AdminLogin";
import CoachView from "../pages/CoachView/CoachView";
import AssignCoach from "../pages/Admin/AssignCoach";
import Catalog from "../pages/Catalog/Catalog";
import Dashboard from "../pages/Dashboard/Dashboard";
const routes = [
    {
        path: "/",
        element: _jsx(App, {}),
        children: [
            // Auth routes (no sidebar)
            {
                path: "login",
                element: _jsx(LoginUser, {}),
            },
            {
                path: "register",
                element: _jsx(RegisterUser, {}),
            },
            {
                path: "coach/login",
                element: _jsx(LoginCoach, {}),
            },
            {
                path: "coach/register",
                element: _jsx(RegisterCoach, {}),
            },
            {
                path: "admin/login",
                element: _jsx(LoginAdmin, {}),
            },
            {
                path: "admin/register",
                element: _jsx(RegisterAdmin, {}),
            },
            // Dashboard (with sidebar)
            {
                path: "dashboard",
                element: _jsx(Dashboard, {}),
                children: [
                    // User
                    {
                        path: "routine",
                        element: _jsx(RegisterRoutine, {}),
                    },
                    {
                        path: "my_routines",
                        element: _jsx(_Fragment, {}), // placeholder
                    },
                    // Admin
                    {
                        path: "admin/register_exercise",
                        element: _jsx(RegisterCatalogExercise, {}),
                    },
                    {
                        path: "admin/assign_coach",
                        element: _jsx(AssignCoach, {}),
                    },
                    // Coach
                    {
                        path: "coach/my_clients",
                        element: _jsx(CoachView, {}),
                    },
                    // All roles
                    {
                        path: "catalog",
                        element: _jsx(Catalog, {}),
                    },
                ],
            },
        ],
    },
];
export const router = createBrowserRouter(routes);
