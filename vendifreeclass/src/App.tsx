/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProductDetails from './pages/ProductDetails';
import CreateListing from './pages/CreateListing';
import PromoteListing from './pages/PromoteListing';
import Plans from './pages/Plans';
import Store from './pages/Store';
import MyListings from './pages/MyListings';
import Notifications from './pages/Notifications';
import Favorites from './pages/Favorites';
import Community from './pages/Community';
import Profile from './pages/Profile';
import SellerProfile from './pages/SellerProfile';
import EditProfile from './pages/EditProfile';
import AmbassadorDashboard from './pages/AmbassadorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminModeration from './pages/AdminModeration';
import AdminSettings from './pages/AdminSettings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import CookiePolicy from './pages/CookiePolicy';
import Sidebar from './components/Sidebar';
import CookieBanner from './components/CookieBanner';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { ToastProvider } from './contexts/ToastContext';

import { AdminProvider } from './contexts/AdminContext';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="flex">
      {!isAuthPage && <Sidebar />}
      <div className={`flex-1 transition-[padding] duration-300 ${!isAuthPage ? 'lg:pl-64' : ''}`}>
        <CookieBanner />
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Routes location={location}>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Main App Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/sell" element={<CreateListing />} />
            <Route path="/promote" element={<PromoteListing />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/store/:userId" element={<Store />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/seller/:id" element={<SellerProfile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/ambassador" element={<AmbassadorDashboard />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/cookies" element={<CookiePolicy />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/moderation" element={<AdminModeration />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CurrencyProvider>
          <FavoritesProvider>
            <AdminProvider>
              <SettingsProvider>
                <BrowserRouter>
                  <AppContent />
                </BrowserRouter>
              </SettingsProvider>
            </AdminProvider>
          </FavoritesProvider>
        </CurrencyProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
