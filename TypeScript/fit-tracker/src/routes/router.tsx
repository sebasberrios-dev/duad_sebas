import { createBrowserRouter, RouteObject } from "react-router";
import App from "../App";
import RegisterExercise from "../pages/RegisterExercise/RegisterExercise";
import RegisterCatalogExercise from "../pages/Admin/RegisterCatalogExercise/RegisterCatalogExercise";
import RegisterUser from "../pages/User/RegisterUser";
import LoginUser from "../pages/User/LoginUser";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <RegisterUser />,
      },
      {
        path: "login",
        element: <LoginUser />,
      },
      {
        path: "/exercise",
        element: <RegisterExercise />,
      },
      {
        path: "admin/exercise",
        element: <RegisterCatalogExercise />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
