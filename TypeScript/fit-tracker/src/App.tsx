import { Outlet } from "react-router";
import { CatalogProvider } from "./context/CatalogContext";
import { RoutineProvider } from "./context/RoutineContext";
import { SessionProvider } from "./context/SessionContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <RoutineProvider>
        <SessionProvider>
          <CatalogProvider>
            <Outlet />
          </CatalogProvider>
        </SessionProvider>
      </RoutineProvider>
    </UserProvider>
  );
}

export default App;
