import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { CartDrawer } from './components/cart/CartDrawer';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AccountPage } from './pages/AccountPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PolicyPage } from './pages/PolicyPage';

import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCategories } from './pages/admin/AdminCategories';

// Scroll to top automatically when route changes
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Main Public Storefront Layout
const StorefrontLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9F1] pb-16 sm:pb-0">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <MobileBottomNav />
      <CartDrawer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              
              {/* Storefront Routes */}
              <Route
                path="/"
                element={
                  <StorefrontLayout>
                    <HomePage />
                  </StorefrontLayout>
                }
              />
              <Route
                path="/shop"
                element={
                  <StorefrontLayout>
                    <ShopPage />
                  </StorefrontLayout>
                }
              />
              <Route
                path="/product/:slug"
                element={
                  <StorefrontLayout>
                    <ProductDetailPage />
                  </StorefrontLayout>
                }
              />
              <Route
                path="/cart"
                element={
                  <StorefrontLayout>
                    <CartPage />
                  </StorefrontLayout>
                }
              />
              <Route
                path="/checkout"
                element={
                  <StorefrontLayout>
                    <CheckoutPage />
                  </StorefrontLayout>
                }
              />
              <Route
                path="/order-confirmation/:orderRef"
                element={
                  <StorefrontLayout>
                    <OrderConfirmationPage />
                  </StorefrontLayout>
                }
              />
              <Route
                path="/account"
                element={
                  <StorefrontLayout>
                    <AccountPage />
                  </StorefrontLayout>
                }
              />
              <Route
                path="/login"
                element={
                  <StorefrontLayout>
                    <LoginPage />
                  </StorefrontLayout>
                }
              />
              <Route
                path="/register"
                element={
                  <StorefrontLayout>
                    <RegisterPage />
                  </StorefrontLayout>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <StorefrontLayout>
                    <WishlistPage />
                  </StorefrontLayout>
                }
              />
              <Route
                path="/about"
                element={
                  <StorefrontLayout>
                    <AboutPage />
                  </StorefrontLayout>
                }
              />
              <Route
                path="/contact"
                element={
                  <StorefrontLayout>
                    <ContactPage />
                  </StorefrontLayout>
                }
              />
              <Route
                path="/policies"
                element={
                  <StorefrontLayout>
                    <PolicyPage />
                  </StorefrontLayout>
                }
              />

              {/* Admin Protected Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="categories" element={<AdminCategories />} />
              </Route>

              {/* Fallback */}
              <Route
                path="*"
                element={
                  <StorefrontLayout>
                    <div className="py-24 text-center">
                      <h1 className="font-serif text-3xl text-[#282323]">Page Not Found</h1>
                      <p className="text-xs text-[#716963] mt-2">
                        The requested page does not exist.
                      </p>
                    </div>
                  </StorefrontLayout>
                }
              />

            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};
