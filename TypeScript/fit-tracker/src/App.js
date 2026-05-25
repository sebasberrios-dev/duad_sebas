import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet } from "react-router";
import { CatalogProvider } from "./context/CatalogContext";
import { SessionProvider } from "./context/SessionContext";
import { UserProvider } from "./context/UserContext";
function App() {
    return (_jsx(UserProvider, { children: _jsx(SessionProvider, { children: _jsx(CatalogProvider, { children: _jsx(Outlet, {}) }) }) }));
}
export default App;
