import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import VendorLayout from './layouts/VendorLayout';
import AuthLayout from './layouts/AuthLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Shop from './pages/public/Shop';
import ProductListing from './pages/public/ProductListing';
import ProductDetail from './pages/public/ProductDetail';
import Cart from './pages/public/Cart';
import Checkout from './pages/public/Checkout';
import OrderSuccess from './pages/public/OrderSuccess';
import NotFound from './pages/public/NotFound';
import Brands from './pages/public/Brands';
import FAQ from './pages/public/FAQ';
import Blog from './pages/public/Blog';
import BlogDetail from './pages/public/BlogDetail';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsConditions from './pages/public/TermsConditions';
import ReturnPolicy from './pages/public/ReturnPolicy';

// Customer Pages
import MyOrders from './pages/customer/MyOrders';
import OrderTracking from './pages/customer/OrderTracking';
import MyProfile from './pages/customer/MyProfile';
import MyWishlist from './pages/customer/MyWishlist';
import MyAddresses from './pages/customer/MyAddresses';
import MyReviews from './pages/customer/MyReviews';
import AccountSettings from './pages/customer/AccountSettings';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLogin from './pages/auth/AdminLogin';
import AdminRegister from './pages/auth/AdminRegister';
import SellerLogin from './pages/auth/SellerLogin';
import SellerRegister from './pages/auth/SellerRegister';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyOTP from './pages/auth/VerifyOTP';
import ResetPassword from './pages/auth/ResetPassword';

// Dashboard Pages
import VendorDashboard from './pages/vendor/Dashboard';
import SuperAdminDashboard from './pages/admin/super_admin/Dashboard';
import AdminProfile from './pages/admin/super_admin/AdminProfile';
import ControlAuthority from './pages/admin/super_admin/ControlAuthority';
import AcceptInvite from './pages/auth/AcceptInvite';

// Department Dashboards
import ContentDashboard from './pages/admin/content/Dashboard';
import FinanceDashboard from './pages/admin/finance/Dashboard';
import MarketingDashboard from './pages/admin/marketing/Dashboard';
import OperationsDashboard from './pages/admin/operations/Dashboard';
import SupportDashboard from './pages/admin/support/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="products" element={<ProductListing />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="brands" element={<Brands />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />

          {/* Content Pages */}
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogDetail />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-conditions" element={<TermsConditions />} />
          <Route path="return-policy" element={<ReturnPolicy />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Customer Dashboard Routes (Protected) */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route path="orders" element={<MyOrders />} />
          <Route path="tracking" element={<OrderTracking />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="wishlist" element={<MyWishlist />} />
          <Route path="addresses" element={<MyAddresses />} />
          <Route path="reviews" element={<MyReviews />} />
          <Route path="settings" element={<AccountSettings />} />
        </Route>

        {/* Auth Routes wrapped in AuthLayout */}
        <Route element={<AuthLayout />}>
          {/* Customer Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/customer/profile/login" element={<Login />} />
          <Route path="/customer/profile/signup" element={<Register />} />
          {/* Admin Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          {/* Seller Auth */}
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/register" element={<SellerRegister />} />
          {/* Forgot Password & OTP */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* Legacy aliases */}
          <Route path="/vendor/login" element={<SellerLogin />} />
          <Route path="/vendor/register" element={<SellerRegister />} />
        </Route>

        {/* Redirects for common missing routes */}
        <Route path="/profile" element={<Navigate to="/customer/profile" replace />} />

        {/* Vendor Dashboard Routes (Protected) */}
        <Route path="/vendor" element={<VendorLayout />}>
          <Route path="dashboard" element={<VendorDashboard />} />
          {/* Add more vendor routes here later */}
        </Route>

        {/* Admin Routes (Protected) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="control-authority" element={<ControlAuthority />} />

          {/* Department Routes */}
          <Route path="content" element={<ContentDashboard />} />
          <Route path="finance" element={<FinanceDashboard />} />
          <Route path="marketing" element={<MarketingDashboard />} />
          <Route path="operations" element={<OperationsDashboard />} />
          <Route path="support" element={<SupportDashboard />} />
        </Route>

        {/* Accept Invite (public route) */}
        <Route path="/admin/accept-invite/:token" element={<AcceptInvite />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
