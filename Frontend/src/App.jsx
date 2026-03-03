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
import DeliveryLogin from './pages/auth/DeliveryLogin';
import DeliveryRegister from './pages/auth/DeliveryRegister';
import VendorLogin from './pages/auth/VendorLogin';
import VendorRegister from './pages/auth/VendorRegister';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyOTP from './pages/auth/VerifyOTP';
import ResetPassword from './pages/auth/ResetPassword';

// Dashboard Pages
import VendorDashboard from './pages/vendor/Dashboard';
import MyVendorProducts from './pages/vendor/MyProducts';
import MyVendorOrders from './pages/vendor/MyOrders';
import MyVendorEarnings from './pages/vendor/MyEarnings';
import MyVendorSettings from './pages/vendor/ShopSettings';
import MyVendorReviews from './pages/vendor/Reviews';
import SuperAdminDashboard from './pages/admin/Dashboard';
import AdminProfile from './pages/admin/AdminProfile';
import ControlAuthority from './pages/admin/ControlAuthority';
import AcceptInvite from './pages/auth/AcceptInvite';

// Department Dashboards
import ContentDashboard from './pages/admin/content/Dashboard';
import FinanceDashboard from './pages/admin/finance/Dashboard';
import MarketingDashboard from './pages/admin/marketing/Dashboard';
import OperationsDashboard from './pages/admin/operations/Dashboard';
import SupportDashboard from './pages/admin/support/Dashboard';

// Finance Department Sub-Pages
import CommissionManagement from './pages/admin/finance/CommissionManagement';
import FinancialReports from './pages/admin/finance/FinancialReports';
import PayoutApproval from './pages/admin/finance/PayoutApproval';
import RefundProcessing from './pages/admin/finance/RefundProcessing';
import RevenueAnalytics from './pages/admin/finance/RevenueAnalytics';
import TaxManagement from './pages/admin/finance/TaxManagement';
import Transactions from './pages/admin/finance/Transactions';
import VendorPayouts from './pages/admin/finance/VendorPayouts';

// Marketing Department Sub-Pages
import Campaigns from './pages/admin/marketing/Campaigns';
import CreateCampaign from './pages/admin/marketing/CreateCampaign';
import Promotions from './pages/admin/marketing/Promotions';
import CouponManagement from './pages/admin/marketing/CouponManagement';
import CreateCoupon from './pages/admin/marketing/CreateCoupon';
import EmailMarketing from './pages/admin/marketing/EmailMarketing';
import SocialMedia from './pages/admin/marketing/SocialMedia';
import Ads from './pages/admin/marketing/Ads';
import MarketingAnalytics from './pages/admin/marketing/MarketingAnalytics';
import CustomerSegmentation from './pages/admin/marketing/CustomerSegmentation';

// Content Department Sub-Pages
import CategoryBanners from './pages/admin/content/banners/CategoryBanners';
import CreateBanner from './pages/admin/content/banners/CreateBanner';
import HeroSliders from './pages/admin/content/banners/HeroSliders';
import PromotionalBanners from './pages/admin/content/banners/PromotionalBanners';

import AllPosts from './pages/admin/content/blog/AllPosts';
import BlogCategories from './pages/admin/content/blog/BlogCategories';
import Comments from './pages/admin/content/blog/Comments';
import CreatePost from './pages/admin/content/blog/CreatePost';
import EditPost from './pages/admin/content/blog/EditPost';

import ImageManager from './pages/admin/content/media/ImageManager';
import MediaLibrary from './pages/admin/content/media/MediaLibrary';
import UploadMedia from './pages/admin/content/media/UploadMedia';
import VideoManager from './pages/admin/content/media/VideoManager';

import FooterMenu from './pages/admin/content/navigation/FooterMenu';
import HeaderMenu from './pages/admin/content/navigation/HeaderMenu';
import MobileMenu from './pages/admin/content/navigation/MobileMenu';

import AboutUsAdmin from './pages/admin/content/pages/AboutUs';
import ContactUsAdmin from './pages/admin/content/pages/ContactUs';
import FAQAdmin from './pages/admin/content/pages/FAQ';
import HomepageAdmin from './pages/admin/content/pages/Homepage';
import PrivacyPolicyAdmin from './pages/admin/content/pages/PrivacyPolicy';
import ReturnPolicyAdmin from './pages/admin/content/pages/ReturnPolicy';
import TermsConditionsAdmin from './pages/admin/content/pages/TermsConditions';

import MetaTagsManager from './pages/admin/content/seo/MetaTagsManager';
import SitemapGenerator from './pages/admin/content/seo/SitemapGenerator';
import URLManager from './pages/admin/content/seo/URLManager';

// Import Operations Sub-Pages
import DailyOperations from './pages/admin/operations/DailyOperations';
import OrderProcessing from './pages/admin/operations/OrderProcessing';
import InventoryAlerts from './pages/admin/operations/InventoryAlerts';
import VendorSupport from './pages/admin/operations/VendorSupport';

// Import Support Sub-Pages
import AllTickets from './pages/admin/support/tickets/AllTickets';
import ActiveTickets from './pages/admin/support/tickets/ActiveTickets';
import ResolvedTickets from './pages/admin/support/tickets/ResolvedTickets';
import TicketDetail from './pages/admin/support/TicketDetail';
import AllArticles from './pages/admin/support/kb/AllArticles';
import CreateArticle from './pages/admin/support/kb/CreateArticle';
import KBCategories from './pages/admin/support/kb/Categories';
import ActiveSessions from './pages/admin/support/chat/ActiveSessions';
import ChatHistory from './pages/admin/support/chat/ChatHistory';
import AgentPerformance from './pages/admin/support/analytics/AgentPerformance';
import CustomerSatisfaction from './pages/admin/support/analytics/CustomerSatisfaction';

// Import Operations Delivery Sub-Pages
import DeliveryTracking from './pages/admin/operations/delivery/DeliveryTracking';
import DeliveryTeam from './pages/admin/operations/delivery/DeliveryTeam';
import AssignDelivery from './pages/admin/operations/delivery/AssignDelivery';
// Import Delivery Portal Pages
import DeliveryLayout from './layouts/DeliveryLayout';
import DeliveryDashboard from './pages/delivery/Dashboard';
import DeliveryTasks from './pages/delivery/Tasks';
import DeliveryHistory from './pages/delivery/History';
import DeliveryProfile from './pages/delivery/Profile';

// Import Old Super Admin Sub-Pages (now at Admin root)
import AllOrders from './pages/admin/orders/AllOrders';
import CreateOrder from './pages/admin/orders/CreateOrder';
import OrderDetails from './pages/admin/orders/OrderDetails';
import OrderReports from './pages/admin/orders/OrderReports';
import RefundsReturns from './pages/admin/orders/RefundsReturns';
import AllProducts from './pages/admin/products/AllProducts';
import AddProduct from './pages/admin/products/AddProduct';
import EditProduct from './pages/admin/products/EditProduct';
import FeaturedProducts from './pages/admin/products/FeaturedProducts';
import ProductCategories from './pages/admin/products/ProductCategories';
import ProductAttributes from './pages/admin/products/ProductAttributes';
import SizeManagement from './pages/admin/products/attributes/SizeManagement';
import ColorManagement from './pages/admin/products/attributes/ColorManagement';
import MaterialManagement from './pages/admin/products/attributes/MaterialManagement';
import BrandManagement from './pages/admin/products/attributes/BrandManagement';
import BulkImport from './pages/admin/products/BulkImport';
import AllUsers from './pages/admin/users/AllUsers';
import AdminUsers from './pages/admin/users/AdminUsers';
import RolesPermissions from './pages/admin/users/RolesPermissions.jsx';
import Customers from './pages/admin/users/Customers';
import AllVendors from './pages/admin/vendors/AllVendors';
import VendorApproval from './pages/admin/vendors/VendorApproval';
import SuVendorPayouts from './pages/admin/vendors/VendorPayouts';
import SuSalesAnalytics from './pages/admin/analytics/SalesAnalytics';
import SuProductPerformance from './pages/admin/analytics/ProductPerformance';
import PaymentGateways from './pages/admin/settings/PaymentGateways';
import TaxConfiguration from './pages/admin/settings/TaxConfiguration';
import AIAgentSettings from './pages/admin/settings/AIAgentSettings';
import PlatformSettings from './pages/admin/settings/PlatformSettings'; // Added Import
import ShippingMethods from './pages/admin/settings/ShippingMethods';
import SystemLogs from './pages/admin/settings/SystemLogs';

// AI & Automation Sub-Pages
import AIDashboard from './pages/admin/ai/Dashboard';
import ChatbotSetup from './pages/admin/ai/ChatbotSetup';
import Integrations from './pages/admin/ai/Integrations';

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
          <Route path="/delivery/login" element={<DeliveryLogin />} />
          <Route path="/delivery/register" element={<DeliveryRegister />} />
          {/* Vendor Auth */}
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/vendor/register" element={<VendorRegister />} />
          {/* Forgot Password & OTP */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Redirects for common missing routes */}
        <Route path="/profile" element={<Navigate to="/customer/profile" replace />} />

        {/* Vendor Dashboard Routes (Protected) */}
        <Route path="/vendor" element={<VendorLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="products" element={<MyVendorProducts />} />
          <Route path="orders" element={<MyVendorOrders />} />
          <Route path="earnings" element={<MyVendorEarnings />} />
          <Route path="reviews" element={<MyVendorReviews />} />
          <Route path="settings" element={<MyVendorSettings />} />
        </Route>

        {/* Delivery Portal Routes */}
        <Route path="/delivery" element={<DeliveryLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DeliveryDashboard />} />
          <Route path="tasks" element={<DeliveryTasks />} />
          <Route path="history" element={<DeliveryHistory />} />
          <Route path="profile" element={<DeliveryProfile />} />
        </Route>

        {/* Admin Routes (Protected) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="su" element={<SuperAdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="control-authority" element={<ControlAuthority />} />

          {/* Department Routes */}
          <Route path="content" element={<ContentDashboard />} />
          <Route path="finance" element={<FinanceDashboard />} />
          <Route path="marketing" element={<MarketingDashboard />} />
          <Route path="operations" element={<OperationsDashboard />} />
          <Route path="support" element={<SupportDashboard />} />

          {/* Finance Department Sub-Routes */}
          <Route path="finance/revenue" element={<RevenueAnalytics />} />
          <Route path="finance/reports" element={<FinancialReports />} />
          <Route path="finance/transactions" element={<Transactions />} />
          <Route path="finance/refunds" element={<RefundProcessing />} />
          <Route path="finance/tax" element={<TaxManagement />} />
          <Route path="finance/payouts/vendors" element={<VendorPayouts />} />
          <Route path="finance/payouts/approval" element={<PayoutApproval />} />
          <Route path="finance/payouts/commission" element={<CommissionManagement />} />

          {/* Marketing Department Sub-Routes */}
          <Route path="marketing/campaigns" element={<Campaigns />} />
          <Route path="marketing/campaigns/create" element={<CreateCampaign />} />
          <Route path="marketing/promotions" element={<Promotions />} />
          <Route path="marketing/coupons" element={<CouponManagement />} />
          <Route path="marketing/coupons/create" element={<CreateCoupon />} />
          <Route path="marketing/email" element={<EmailMarketing />} />
          <Route path="marketing/social" element={<SocialMedia />} />
          <Route path="marketing/ads" element={<Ads />} />
          <Route path="marketing/analytics" element={<MarketingAnalytics />} />
          <Route path="marketing/segmentation" element={<CustomerSegmentation />} />

          {/* Core Admin Sub-Routes */}
          <Route path="orders/all" element={<AllOrders />} />
          <Route path="orders/create" element={<CreateOrder />} />
          <Route path="orders/details" element={<OrderDetails />} />
          <Route path="orders/reports" element={<OrderReports />} />
          <Route path="orders/refunds" element={<RefundsReturns />} />
          <Route path="products/all" element={<AllProducts />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="products/featured" element={<FeaturedProducts />} />
          <Route path="products/categories" element={<ProductCategories />} />
          <Route path="products/attributes" element={<ProductAttributes />} />
          <Route path="products/attributes/size" element={<SizeManagement />} />
          <Route path="products/attributes/color" element={<ColorManagement />} />
          <Route path="products/attributes/material" element={<MaterialManagement />} />
          <Route path="products/attributes/brand" element={<BrandManagement />} />
          <Route path="products/import" element={<BulkImport />} />
          <Route path="users/all" element={<AllUsers />} />
          <Route path="users/admins" element={<AdminUsers />} />
          <Route path="users/roles" element={<RolesPermissions />} />
          <Route path="users/customers" element={<Customers />} />
          <Route path="vendors/all" element={<AllVendors />} />
          <Route path="vendors/approval" element={<VendorApproval />} />
          <Route path="vendors/payouts" element={<SuVendorPayouts />} />
          <Route path="analytics/sales" element={<SuSalesAnalytics />} />
          <Route path="analytics/products" element={<SuProductPerformance />} />
          <Route path="settings" element={<PlatformSettings />} />
          <Route path="settings/payment" element={<PaymentGateways />} />
          <Route path="settings/tax" element={<TaxConfiguration />} />
          <Route path="settings/shipping" element={<ShippingMethods />} />
          <Route path="settings/logs" element={<SystemLogs />} />
          <Route path="settings/ai-automation" element={<AIAgentSettings />} />

          {/* AI & Automation Portal Routes */}
          <Route path="ai/dashboard" element={<AIDashboard />} />
          <Route path="ai/chatbot" element={<ChatbotSetup />} />
          <Route path="ai/integrations" element={<Integrations />} />

          {/* Operations Department Sub-Routes */}
          <Route path="operations/delivery/daily" element={<DailyOperations />} />
          <Route path="operations/delivery/tracking" element={<DeliveryTracking />} />
          <Route path="operations/delivery/team" element={<DeliveryTeam />} />
          <Route path="operations/delivery/assign" element={<AssignDelivery />} />
          <Route path="operations/delivery/processing" element={<OrderProcessing />} />
          <Route path="operations/delivery/inventory" element={<InventoryAlerts />} />
          <Route path="operations/analytics/vendors" element={<VendorSupport />} />

          {/* Support Department Sub-Routes */}
          <Route path="support/tickets/all" element={<AllTickets />} />
          <Route path="support/tickets/active" element={<ActiveTickets />} />
          <Route path="support/tickets/resolved" element={<ResolvedTickets />} />
          <Route path="support/tickets/detail/:id" element={<TicketDetail />} />
          <Route path="support/kb/articles" element={<AllArticles />} />
          <Route path="support/kb/create" element={<CreateArticle />} />
          <Route path="support/kb/categories" element={<KBCategories />} />
          <Route path="support/chat/active" element={<ActiveSessions />} />
          <Route path="support/chat/history" element={<ChatHistory />} />
          <Route path="support/analytics/performance" element={<AgentPerformance />} />
          <Route path="support/analytics/satisfaction" element={<CustomerSatisfaction />} />

          {/* Content Department Sub-Routes */}
          <Route path="content/banners/hero-sliders" element={<HeroSliders />} />
          <Route path="content/banners/promotional" element={<PromotionalBanners />} />
          <Route path="content/banners/category" element={<CategoryBanners />} />
          <Route path="content/banners/create" element={<CreateBanner />} />

          <Route path="content/blog/posts" element={<AllPosts />} />
          <Route path="content/blog/create" element={<CreatePost />} />
          <Route path="content/blog/edit/:id" element={<EditPost />} />
          <Route path="content/blog/categories" element={<BlogCategories />} />
          <Route path="content/blog/comments" element={<Comments />} />

          <Route path="content/media/library" element={<MediaLibrary />} />
          <Route path="content/media/upload" element={<UploadMedia />} />
          <Route path="content/media/images" element={<ImageManager />} />
          <Route path="content/media/videos" element={<VideoManager />} />

          <Route path="content/pages/homepage" element={<HomepageAdmin />} />
          <Route path="content/pages/about" element={<AboutUsAdmin />} />
          <Route path="content/pages/contact" element={<ContactUsAdmin />} />
          <Route path="content/pages/faq" element={<FAQAdmin />} />
          <Route path="content/pages/privacy" element={<PrivacyPolicyAdmin />} />
          <Route path="content/pages/terms" element={<TermsConditionsAdmin />} />
          <Route path="content/pages/returns" element={<ReturnPolicyAdmin />} />

          <Route path="content/navigation/header" element={<HeaderMenu />} />
          <Route path="content/navigation/footer" element={<FooterMenu />} />
          <Route path="content/navigation/mobile" element={<MobileMenu />} />

          <Route path="content/seo/meta-tags" element={<MetaTagsManager />} />
          <Route path="content/seo/sitemap" element={<SitemapGenerator />} />
          <Route path="content/seo/urls" element={<URLManager />} />
        </Route>

        {/* Accept Invite (public route) */}
        <Route path="/admin/accept-invite/:token" element={<AcceptInvite />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
