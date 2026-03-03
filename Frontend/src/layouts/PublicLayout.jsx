import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Heart, Store, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import api from '../utils/api';

const PublicLayout = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch simple category list (id, name, slug)
                // Note: Ensure your backend has this endpoint exposed publicly
                const response = await api.get('categories/');
                setCategories(response.data.results || response.data);
            } catch (error) {
                console.error("Failed to load categories:", error);
                // Fallback to empty list, effectively showing only Home and Shop
            }
        };

        const trackTraffic = async () => {
            if (sessionStorage.getItem('traffic_logged')) return;

            const params = new URLSearchParams(window.location.search);
            let source = params.get('source');

            if (!source) {
                const referrer = document.referrer.toLowerCase();
                if (referrer.includes('google.com') || referrer.includes('bing.com')) {
                    source = 'google';
                } else if (referrer.includes('facebook.com') || referrer.includes('instagram.com')) {
                    source = 'meta';
                } else if (referrer.includes('tiktok.com')) {
                    source = 'tiktok';
                } else {
                    source = 'direct';
                }
            }

            try {
                await api.post('analytics/track_visit/', { source });
                sessionStorage.setItem('traffic_logged', 'true');
            } catch (error) {
                console.error("Failed to log traffic:", error);
            }
        };

        fetchCategories();
        trackTraffic();
    }, []);

    return (
        <div className="flex flex-col min-h-screen font-sans">
            {/* Header */}
            <header className="bg-white sticky top-0 z-50 shadow-sm">
                {/* Top Row: Logo, Search, Actions */}
                <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-8">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <Store className="text-brand fill-current" size={32} />
                        <span className="text-2xl font-bold text-brand-dark tracking-tight">NextGen<span className="text-brand">Store</span></span>
                    </Link>

                    {/* Search Bar - Centered & Wide */}
                    <div className="hidden md:flex flex-1 max-w-2xl relative">
                        <input
                            type="text"
                            placeholder="What you're looking for?"
                            className="w-full pl-5 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all text-sm"
                        />
                        <button className="absolute right-2 top-1.5 p-1.5 bg-transparent text-gray-400 hover:text-brand transition-colors">
                            <Search size={20} />
                        </button>
                    </div>

                    {/* Icons / Actions */}
                    <div className="flex items-center gap-6">
                        <Link to="/profile" className="flex flex-col items-center text-gray-500 hover:text-brand transition-colors group">
                            <User size={24} className="mb-0.5 group-hover:scale-110 transition-transform fill-current" />
                            <span className="text-[10px] font-medium uppercase tracking-wide">Account</span>
                        </Link>
                        <Link to="/wishlist" className="flex flex-col items-center text-gray-500 hover:text-brand transition-colors group">
                            <Heart size={24} className="mb-0.5 group-hover:scale-110 transition-transform fill-current" />
                            <span className="text-[10px] font-medium uppercase tracking-wide">Wishlist</span>
                        </Link>
                        <Link to="/cart" className="flex flex-col items-center text-gray-500 hover:text-brand transition-colors group relative">
                            <ShoppingCart size={24} className="mb-0.5 group-hover:scale-110 transition-transform fill-current" />
                            <span className="text-[10px] font-medium uppercase tracking-wide">Cart</span>
                            <span className="absolute -top-1 right-1 h-2 w-2 bg-functional-error rounded-full ring-2 ring-white"></span>
                        </Link>
                    </div>
                </div>

                {/* Bottom Row: Navigation Links */}
                <div className="border-t border-gray-100">
                    <div className="container mx-auto px-4">
                        <nav className="flex items-center justify-center md:justify-start gap-8 py-3 overflow-x-auto no-scrollbar">
                            <Link to="/" className="text-sm font-medium text-text-main hover:text-brand whitespace-nowrap transition-colors">Home</Link>
                            <Link to="/products" className="text-sm font-medium text-text-main hover:text-brand whitespace-nowrap transition-colors">Shop</Link>

                            {categories.map((cat) => (
                                <Link
                                    key={cat.id || cat.name}
                                    to={`/products?category=${cat.id}`}
                                    className="text-sm font-medium text-text-main hover:text-brand whitespace-nowrap transition-colors"
                                >
                                    {cat.name}
                                </Link>
                            ))}

                            <span className="flex-1"></span>
                            <Link to="/vendor/register" className="text-sm font-medium text-brand hover:text-brand-dark transition-colors">
                                Become a Seller
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 bg-gray-50">
                <Outlet />
            </main>

            {/* Footer - Light Green Theme */}
            <footer className="bg-brand-accent/20 pt-16 pb-8 border-t border-brand-accent/30">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Store className="text-brand" size={28} />
                            <span className="text-xl font-bold text-brand-dark">NextGenStore</span>
                        </div>
                        <p className="text-text-sub text-sm leading-relaxed">
                            Your one-stop shop for the future. Experience AR shopping, AI recommendations, and seamless delivery.
                        </p>
                        <div className="flex gap-4 pt-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-dark hover:bg-brand hover:text-white transition-all shadow-sm">
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Columns */}
                    <div>
                        <h4 className="font-bold text-brand-dark mb-6">Company</h4>
                        <ul className="space-y-3 text-sm text-text-sub">
                            <li><Link to="/about" className="hover:text-brand transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-brand transition-colors">Contact</Link></li>
                            <li><Link to="/careers" className="hover:text-brand transition-colors">Careers</Link></li>
                            <li><Link to="/blog" className="hover:text-brand transition-colors">Blog</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-brand-dark mb-6">Support</h4>
                        <ul className="space-y-3 text-sm text-text-sub">
                            <li><Link to="/faq" className="hover:text-brand transition-colors">FAQs</Link></li>
                            <li><Link to="/shipping" className="hover:text-brand transition-colors">Shipping Policy</Link></li>
                            <li><Link to="/returns" className="hover:text-brand transition-colors">Returns & Refunds</Link></li>
                            <li><Link to="/privacy" className="hover:text-brand transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-brand-dark mb-6">Stay Updated</h4>
                        <p className="text-text-sub text-sm mb-4">Subscribe to our newsletter for early access to new AR features.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                            />
                            <button className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="container mx-auto px-4 pt-8 border-t border-brand-accent/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-sub">
                    <p>&copy; 2026 NextGen Smart Store. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="#" className="hover:text-brand">Terms</Link>
                        <Link to="#" className="hover:text-brand">Privacy</Link>
                        <Link to="#" className="hover:text-brand">Cookies</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
