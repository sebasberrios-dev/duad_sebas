import { createBrowserRouter, RouteObject } from "react-router";
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
import SystemDashboard from "../pages/Dashboard/SystemDashboard";
import MyRoutines from "../pages/MyRoutines/MyRoutines";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      // Auth routes (no sidebar)
      {
        path: "login",
        element: <LoginUser />,
      },
      {
        path: "register",
        element: <RegisterUser />,
      },
      {
        path: "coach/login",
        element: <LoginCoach />,
      },
      {
        path: "coach/register",
        element: <RegisterCoach />,
      },
      {
        path: "admin/login",
        element: <LoginAdmin />,
      },
      {
        path: "admin/register",
        element: <RegisterAdmin />,
      },

      // Dashboard (with sidebar)
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          { index: true, element: <SystemDashboard /> },
          { path: "admin/register_exercise", element: <RegisterCatalogExercise /> },
          { path: "admin/assign_coach", element: <AssignCoach /> },
          { path: "catalog", element: <Catalog /> },
          { path: "routine", element: <RegisterRoutine /> },
          { path: "my_routines", element: <MyRoutines /> },
          { path: "coach/my_clients", element: <CoachView /> },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
