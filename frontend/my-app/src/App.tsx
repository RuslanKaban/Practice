import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import Home from "./pages/home/Home";
import Categories from "./pages/categories/Categories";
import Products from "./pages/products/Products";
import CategoryPage from './components/Category/Category';
import ProductPage from './components/product/ProductPage';
import DiscountedProducts from './pages/sales/DiscountProducts';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/cart/CartPage';
import NotFound from './pages/notFound/NotFound';


const App: React.FC = () => {
  return (
    <Router>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id" element={<CategoryPage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/sales" element={<DiscountedProducts />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </CartProvider>
    </Router>
  );
};

export default App;
