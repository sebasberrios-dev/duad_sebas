import { router } from './routes/router.jsx';
import { RouterProvider } from 'react-router';
import { AuthProvider } from './store/AuthContext.jsx';
import { CartProvider } from './store/CartContext.jsx';
import ReactDOM from 'react-dom/client';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </AuthProvider>
);
