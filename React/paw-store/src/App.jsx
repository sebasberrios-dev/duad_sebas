import { Outlet } from 'react-router';
import Navbar from './components/Static/Navbar';
import Footer from './components/Static/Footer';

export function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
