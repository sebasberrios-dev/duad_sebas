import { router } from './routes/router.jsx';
import { RouterProvider } from 'react-router';
import { AuthProvider } from './store/AuthContext.jsx';
import ReactDOM from 'react-dom/client';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
