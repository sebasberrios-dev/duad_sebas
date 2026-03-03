import { useCallback, useState, lazy, Suspense, useEffect } from 'react';
import Navbar from './components/Static/Navbar';
import Footer from './components/Static/Footer';
import { Loading } from './components/Messages-States/Loading';
import { Home } from './pages/Home';
import { Maintenance } from './components/Messages-States/Maintenance';
import { Administration } from './pages/Administration';
import { LoginForm } from './components/Forms/LoginForm.jsx';
import { RegisterForm } from './components/Forms/RegisterForm.jsx';
import { useProductsStore } from './store/useProductsStore.jsx';
import { useAuth } from './store/AuthContext.jsx';
import {
  NoLoggedWarning,
  NoAdminWarning,
} from './components/Messages-States/Restricted.jsx';

const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetails'));

function ProtectedPage({ isLogged, onNavigate, children }) {
  if (!isLogged) return <NoLoggedWarning onNavigate={onNavigate} />;
  return children;
}

function AppLayout({
  handleNavigate,
  currentPage,
  handleViewDetails,
  selectedProduct,
  isLogged,
  isAdmin,
}) {
  return (
    <div className="app-layout">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      <main className={`app-main ${currentPage === 'home' ? 'home-main' : ''}`}>
        {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
        {currentPage === 'products' && (
          <ProtectedPage isLogged={isLogged} onNavigate={handleNavigate}>
            <Suspense fallback={<Loading element={'catálogo'} />}>
              <Products onViewDetails={handleViewDetails} />
            </Suspense>
          </ProtectedPage>
        )}
        {currentPage === 'product-detail' && selectedProduct && (
          <ProtectedPage isLogged={isLogged} onNavigate={handleNavigate}>
            <Suspense fallback={<Loading element={'detalle del producto'} />}>
              <ProductDetail
                product={selectedProduct}
                onNavigate={handleNavigate}
              />
            </Suspense>
          </ProtectedPage>
        )}
        {currentPage === 'contact' && <Maintenance />}
        {currentPage === 'admin' &&
          (isAdmin ? (
            <Administration />
          ) : isLogged ? (
            <NoAdminWarning onNavigate={handleNavigate} />
          ) : (
            <NoLoggedWarning onNavigate={handleNavigate} />
          ))}
        {currentPage === 'register' && (
          <RegisterForm onNavigate={handleNavigate} />
        )}
        {currentPage === 'login' && <LoginForm onNavigate={handleNavigate} />}
      </main>

      <Footer />
    </div>
  );
}

export function App() {
  const { fetchProducts } = useProductsStore();
  const { logout, isAdmin, isLogged } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    console.log;
  }, []);

  const handleNavigate = useCallback(
    (page) => {
      if (page === 'logout') {
        logout();
        setCurrentPage('home');
        setSelectedProduct(null);
        return;
      }
      setCurrentPage(page);
      setSelectedProduct(null);
    },
    [logout]
  );

  const handleViewDetails = useCallback((product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  }, []);

  return (
    <AppLayout
      handleNavigate={handleNavigate}
      currentPage={currentPage}
      handleViewDetails={handleViewDetails}
      selectedProduct={selectedProduct}
      isLogged={isLogged}
      isAdmin={isAdmin}
    />
  );
}
