import { createBrowserRouter } from 'react-router';
import { App } from '../App.jsx';
import { ProtectedRoute } from './protected.jsx';
import { Home } from '../pages/Home.jsx';
import { LoginForm } from '../components/Forms/LoginForm.jsx';
import { RegisterForm } from '../components/Forms/RegisterForm.jsx';
import { Maintenance } from '../components/Messages-States/Maintenance.jsx';
import { PageNotFound } from '../components/Messages-States/PageNotFound.jsx';
import {
  NoLoggedWarning,
  NoAdminWarning,
} from '../components/Messages-States/Restricted.jsx';
import Product from '../pages/Products.jsx';
import ProductDetail from '../pages/ProductDetails.jsx';
import Administration from '../pages/Administration.jsx';
import ShoppingCart from '../pages/BuyingProcess/ShoppingCart.jsx';
import PurchaseInfoForm from '../components/Forms/PurchaseInfoForm.jsx';
import PurchaseFinished from '../pages/BuyingProcess/PurchaseFinished.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <PageNotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <LoginForm /> },
      { path: 'register', element: <RegisterForm /> },
      { path: 'contact', element: <Maintenance /> },
      { path: 'no-access/unauthenticated', element: <NoLoggedWarning /> },
      { path: 'no-access/unauthorized', element: <NoAdminWarning /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'products', element: <Product /> },
          { path: 'products/:id', element: <ProductDetail /> },
          { path: 'cart', element: <ShoppingCart /> },
          { path: 'checkout', element: <PurchaseInfoForm /> },
          { path: 'purchase-finished', element: <PurchaseFinished /> },
        ],
      },
      {
        element: <ProtectedRoute requireAdmin={true} />,
        path: 'admin',
        children: [
          { path: 'products', element: <Administration /> },
          { path: 'products/edit/:id', element: <Administration /> },
        ],
      },
    ],
  },
]);
