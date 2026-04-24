import { Outlet } from "react-router";
import { CatalogProvider } from "./context/CatalogContext";
import { SessionProvider } from "./context/SessionContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <SessionProvider>
        <CatalogProvider>
          <main>
            <Outlet />
          </main>
        </CatalogProvider>
      </SessionProvider>
    </UserProvider>
  );
}

export default App;
