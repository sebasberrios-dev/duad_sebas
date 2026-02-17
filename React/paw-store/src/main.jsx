import { App } from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ProductsProvider } from './context/ProductsContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ProductsProvider>
    <App />
  </ProductsProvider>
);
