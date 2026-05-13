import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart, User, Search, Heart, Store, Facebook, Twitter,
  Instagram, Linkedin, Menu, X, Mic, MicOff, ChevronDown,
  Phone, Mail, MapPin, Zap, Tag, Grid3X3, MessageSquare, ChevronRight, Apple, Play
} from 'lucide-react';
import api from '../utils/api';
import useVoiceCommand from '../hooks/useVoiceCommand';

const P = { primary: '#10b981', dark: '#059669', light: '#d1fae5', xlight: '#ecfdf5' };

const getMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
};

const NAV_LINKS = [
  { path: '/categories', label: 'Categories', icon: Grid3X3 },
  { path: '/products', label: 'Shop', icon: Tag },
  { path: '/products?sale=true', label: 'Deals', icon: Zap },
  { path: '/contact', label: 'Contact', icon: MessageSquare },
];

export default function PublicLayout() {
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const catRef = useRef(null);

  const handleVoiceSearch = (q) => { setSearchQuery(q); navigate(`/products?search=${encodeURIComponent(q)}`); };
  const { isListening, transcript, supported, startListening, stopListening } = useVoiceCommand(handleVoiceSearch);

  useEffect(() => {
    api.get('categories/').then(r => setCategories((r.data.results || r.data).filter(c => c.is_active))).catch(() => {});

    const updateCounts = () => {
      const cart = JSON.parse(localStorage.getItem('ng_cart') || '[]');
      setCartCount(cart.reduce((s, i) => s + i.qty, 0));
      setWishlistCount(JSON.parse(localStorage.getItem('ng_wishlist') || '[]').length);
    };
    updateCounts();

    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('cartUpdated', updateCounts);
    window.addEventListener('wishlistUpdated', updateCounts);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('cartUpdated', updateCounts); window.removeEventListener('wishlistUpdated', updateCounts); };
  }, []);

  useEffect(() => { if (transcript) setSearchQuery(transcript); }, [transcript]);
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#050810] text-gray-200">

      {/* ── Main Header ── */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0f1d]/95 backdrop-blur-xl shadow-lg shadow-black/40 border-b border-gray-800 py-3'
          : 'bg-[#0a0f1d] border-b border-gray-800 py-4'
      }`}>

        <div className="container mx-auto px-4 flex flex-col gap-4 lg:gap-0">
          
          {/* Top Row */}
          <div className="flex items-center gap-6 justify-between lg:justify-start">

            {/* Mobile Toggle */}
            <button className="lg:hidden p-2 rounded-xl hover:bg-gray-800 text-gray-400 transition-all" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group w-auto lg:w-48">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
                style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                <Store size={20} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-black text-white leading-none tracking-tight">
                  NextGen<span style={{ color: P.primary }}>Store</span>
                </span>
              </div>
            </Link>

            {/* Search Bar - Much wider now */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-3xl relative mx-auto">
              <div className={`relative flex-1 flex items-center transition-all duration-200 ${searchFocused ? 'scale-[1.01]' : ''}`}>
                <Search size={18} className="absolute left-5 text-gray-500 z-10 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder={isListening ? '🎤 Listening...' : 'Search for products, brands, or categories...'}
                  className="w-full pl-14 pr-24 py-3.5 bg-[#111827] border-2 rounded-full text-sm text-white placeholder-gray-500 outline-none transition-all shadow-inner"
                  style={{ borderColor: searchFocused ? P.primary : '#1f2937' }}
                />
                <div className="absolute right-2 flex items-center gap-1">
                  {supported && (
                    <button type="button" onClick={isListening ? stopListening : startListening}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                      style={{ background: isListening ? '#ef4444' : 'rgba(16,185,129,0.1)', color: isListening ? '#fff' : P.primary }}
                      title={isListening ? 'Stop' : 'Voice search'}>
                      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>
                  )}
                  <button type="submit"
                    className="px-5 py-2 text-white text-xs font-black rounded-full transition-all hover:opacity-90 shadow-lg hover:shadow-emerald-500/20"
                    style={{ background: P.primary }}>
                    Search
                  </button>
                </div>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-2 lg:gap-4 shrink-0 w-auto lg:w-48 justify-end">
              <Link to="/wishlist" className="relative p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-all group">
                <Heart size={22} className="group-hover:scale-110 transition-transform" style={{ fill: wishlistCount > 0 ? P.primary : 'none', color: wishlistCount > 0 ? P.primary : '' }} />
                {wishlistCount > 0 && <span className="absolute top-0 right-0 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-[#0a0f1d]">{wishlistCount}</span>}
              </Link>
              <Link to="/cart" className="relative p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-all group">
                <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                {cartCount > 0 && <span className="absolute top-0 right-0 min-w-[18px] h-[18px] text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-[#0a0f1d]" style={{ background: P.primary }}>{cartCount}</span>}
              </Link>
              <Link to="/customer/login" className="p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-all group">
                <User size={22} className="group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Bottom Row: Minimal Navigation */}
          <div className="hidden lg:flex items-center justify-center gap-8 mt-2">
            
            {/* Mega Menu Dropdown */}
            <div className="relative" ref={catRef} onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
              <button className="flex items-center gap-1.5 py-1 text-sm font-semibold transition-colors hover:text-emerald-400"
                style={{ color: catOpen ? P.primary : '#d1d5db' }}>
                <Menu size={16} /> All Categories <ChevronDown size={14} className={`transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 mt-4 w-[600px] bg-[#0f172a] rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-800 p-6 z-50 animate-fade-in grid grid-cols-2 gap-4">
                  {categories.slice(0, 10).map((cat, i) => {
                    const img = getMediaUrl(cat.icon) || getMediaUrl(cat.image);
                    return (
                      <Link key={cat.id || i} to={`/products?category=${cat.slug}`} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-800 transition-colors group" onClick={() => setCatOpen(false)}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black overflow-hidden shrink-0 bg-gray-900 border border-gray-800">
                          {img ? <img src={img} alt={cat.name} className="w-full h-full object-contain p-2" /> : cat.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <span className="font-bold text-gray-200 group-hover:text-emerald-400 block">{cat.name}</span>
                        </div>
                      </Link>
                    );
                  })}
                  <div className="col-span-2 mt-2 pt-4 border-t border-gray-800 text-center">
                    <Link to="/categories" className="inline-flex items-center gap-2 text-sm font-black text-emerald-400 hover:text-emerald-300" onClick={() => setCatOpen(false)}>
                      View All Categories <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Standard Links */}
            {NAV_LINKS.filter(l=>l.path!=='/categories').map(({ path, label }) => (
              <Link key={path} to={path} className="text-sm font-semibold text-gray-300 hover:text-emerald-400 transition-colors tracking-wide">
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-800 bg-[#0a0f1d] shadow-2xl mt-4">
            <div className="p-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 text-white rounded-xl text-sm outline-none" />
                </div>
                <button type="submit" className="px-5 py-3 text-white text-sm font-black rounded-xl" style={{ background: P.primary }}>Search</button>
              </form>
            </div>
            <div className="px-4 pb-4 space-y-2">
              {NAV_LINKS.map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold bg-gray-900/50 hover:bg-gray-800 transition-colors text-gray-300">
                  <Icon size={18} className="text-emerald-500" /> {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {isListening && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-emerald-500 text-white rounded-full shadow-[0_0_30px_rgba(16,185,129,0.5)]">
          <Mic size={16} className="text-white animate-pulse" />
          <span className="text-sm font-bold">{transcript || 'Listening...'}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#0a0f1d] border-t border-gray-800 pt-16 pb-8 text-gray-400">
        <div className="container mx-auto px-4">
          
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            
            {/* Brand & Contact */}
            <div className="lg:col-span-2 space-y-6">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
                  <Store size={20} className="text-white" />
                </div>
                <span className="text-2xl font-black text-white">NextGen<span className="text-emerald-400">Store</span></span>
              </Link>
              <p className="text-sm leading-relaxed text-gray-500 max-w-sm">
                NextGen Smart Store provides a premium, AI-driven shopping experience. From electronics to fashion, discover the latest trends with unmatched delivery speeds.
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3"><Phone size={16} className="text-emerald-500" /><span className="text-gray-300">+92 300 1234567</span></div>
                <div className="flex items-center gap-3"><Mail size={16} className="text-emerald-500" /><span className="text-gray-300">support@nextgenstore.pk</span></div>
                <div className="flex items-center gap-3"><MapPin size={16} className="text-emerald-500" /><span className="text-gray-300">Lahore, Pakistan</span></div>
              </div>
            </div>

            {/* Links 1 */}
            <div>
              <h4 className="text-white font-black uppercase text-xs tracking-widest mb-6">Company</h4>
              <ul className="space-y-4 text-sm">
                {[['About Us', '/about'], ['Careers', '#'], ['Our Blog', '/blog'], ['Contact Us', '/contact']].map(([l, p]) => (
                  <li key={p}><Link to={p} className="hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 text-emerald-500 transition-opacity -ml-3" /> {l}</Link></li>
                ))}
              </ul>
            </div>

            {/* Links 2 */}
            <div>
              <h4 className="text-white font-black uppercase text-xs tracking-widest mb-6">Support</h4>
              <ul className="space-y-4 text-sm">
                {[['Track Order', '/order-tracking'], ['Shipping Policy', '/shipping-policy'], ['Return Policy', '/return-policy'], ['FAQs', '/faq']].map(([l, p]) => (
                  <li key={p}><Link to={p} className="hover:text-emerald-400 transition-colors flex items-center gap-2 group"><ChevronRight size={12} className="opacity-0 group-hover:opacity-100 text-emerald-500 transition-opacity -ml-3" /> {l}</Link></li>
                ))}
              </ul>
            </div>

            {/* App & Social */}
            <div>
              <h4 className="text-white font-black uppercase text-xs tracking-widest mb-6">Get The App</h4>
              <div className="flex flex-col gap-3 mb-8">
                <a href="#" className="flex items-center gap-3 bg-gray-900 border border-gray-800 hover:border-emerald-500 rounded-xl px-4 py-2.5 transition-all group">
                  <Apple size={24} className="text-white group-hover:text-emerald-400" />
                  <div>
                    <p className="text-[9px] uppercase font-bold text-gray-500 leading-none">Download on the</p>
                    <p className="text-sm font-black text-white leading-tight">App Store</p>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-3 bg-gray-900 border border-gray-800 hover:border-emerald-500 rounded-xl px-4 py-2.5 transition-all group">
                  <Play size={24} className="text-white group-hover:text-emerald-400" />
                  <div>
                    <p className="text-[9px] uppercase font-bold text-gray-500 leading-none">Get it on</p>
                    <p className="text-sm font-black text-white leading-tight">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-gray-600 font-semibold">© 2026 NextGen Smart Store. All rights reserved.</p>
            
            {/* Payment Icons */}
            <div className="flex gap-2">
              <div className="w-10 h-6 bg-gray-900 rounded border border-gray-800 flex items-center justify-center text-[10px] font-black text-gray-500">VISA</div>
              <div className="w-10 h-6 bg-gray-900 rounded border border-gray-800 flex items-center justify-center text-[10px] font-black text-gray-500">MC</div>
              <div className="w-10 h-6 bg-gray-900 rounded border border-gray-800 flex items-center justify-center text-[10px] font-black text-gray-500">PP</div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:bg-emerald-500 hover:text-white hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all text-gray-500">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
