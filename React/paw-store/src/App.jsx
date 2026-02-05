import { useCallback, useState, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Loading } from './components/Loading';
import { Home } from './pages/Home';
import { Maintenance } from './components/Maintenance';

const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetails'));

export function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleNavigate = useCallback((page) => {
    setCurrentPage(page);
    setSelectedProduct(null); // Limpiar producto seleccionado al cambiar de página
  }, []);

  const handleViewDetails = useCallback((product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  }, []);
  return (
    <div className="app-layout">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      <main className="app-main">
        {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
        {currentPage === 'products' && (
          <Suspense fallback={<Loading element={'catálogo'} />}>
            <Products onViewDetails={handleViewDetails} />
          </Suspense>
        )}
        {currentPage === 'product-detail' && selectedProduct && (
          <Suspense fallback={<Loading element={'detalle del producto'} />}>
            <ProductDetail
              product={selectedProduct}
              onNavigate={handleNavigate}
            />
          </Suspense>
        )}
        {currentPage === 'contact' && <Maintenance />}
      </main>

      <Footer />
    </div>
  );
}
