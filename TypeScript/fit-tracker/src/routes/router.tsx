import { createBrowserRouter, RouteObject } from "react-router";
import App from "../App";
import RegisterCatalogExercise from "../pages/Admin/RegisterCatalogExercise";
import RegisterUser from "../pages/Auth/RegisterUser";
import LoginUser from "../pages/Auth/LoginUser";
import RegisterRoutine from "../pages/RegisterRoutine/RegisterRoutine";
import RegisterCoach from "../pages/Auth/CoachRegister";
import LoginCoach from "../pages/Auth/CoachLogin";
import RegisterAdmin from "../pages/Auth/AdminRegister";
import LoginAdmin from "../pages/Auth/AdminLogin";
import CoachView from "../pages/CoachView/CoachView";
import AssignCoach from "../pages/Admin/AssignCoach";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register",
        element: <RegisterUser />,
      },
      {
        path: "login",
        element: <LoginUser />,
      },
      {
        path: "coach/register",
        element: <RegisterCoach />,
      },
      {
        path: "coach/login",
        element: <LoginCoach />,
      },
      {
        path: "admin/register",
        element: <RegisterAdmin />,
      },
      {
        path: "admin/login",
        element: <LoginAdmin />,
      },
      {
        path: "/routine",
        element: <RegisterRoutine />,
      },
      {
        path: "admin/exercise",
        element: <RegisterCatalogExercise />,
      },
      {
        path: "coach/my_clients",
        element: <CoachView />,
      },
      {
        path: "admin/assign_coach",
        element: <AssignCoach />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
