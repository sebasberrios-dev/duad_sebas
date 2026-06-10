import { Outlet } from "react-router";
import { SessionProvider } from "./context/SessionContext";
import { AppStoreProvider } from "./context/AppStore";

function App() {
  return (
    <AppStoreProvider>
      <SessionProvider>
        <Outlet />
      </SessionProvider>
    </AppStoreProvider>
  );
}

export default App;
