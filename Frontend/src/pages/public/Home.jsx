import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ShoppingCart, Heart, Star, TrendingUp, Zap, Eye,
  ChevronLeft, ChevronRight, Package, CheckCircle2, Truck,
  Shirt, Footprints, Watch, Laptop, Home as HomeIcon, Dumbbell, BookOpen, Gem,
  ShoppingBag
} from 'lucide-react';
import api from '../../utils/api';

// Flash Sale storage key
const FS_KEY = 'ng_flash_sale';
const DEFAULT_FLASH_SALE = {
  is_active: true,
  badge: 'Limited Offer',
  title: 'Midnight Flash Sale',
  description: "Get up to 60% off on selected men's shoes, leather boots, and active styling essentials. Offer valid until the timer runs out!",
  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop',
  btnText: 'Shop Flash Sale',
  btnLink: '/products?sale=true',
  timerMode: 'daily',
  timerEndDate: '',
};

function getFlashSale() {
  try {
    const raw = localStorage.getItem(FS_KEY);
    if (raw) return { ...DEFAULT_FLASH_SALE, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_FLASH_SALE;
}

// Dynamic countdown hook
function useFlashCountdown(sale) {
  const getTime = () => {
    const now = new Date();
    let end;
    if (sale && sale.timerMode === 'fixed' && sale.timerEndDate) {
      end = new Date(sale.timerEndDate);
    } else {
      end = new Date(); end.setHours(23, 59, 59, 0);
    }
    const diff = Math.max(0, end - now);
    return { h: String(Math.floor(diff / 3600000)).padStart(2, '0'), m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'), s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0') };
  };
  const [t, setT] = useState(getTime);
  useEffect(() => { const id = setInterval(() => setT(getTime()), 1000); return () => clearInterval(id); }, [sale]);
  return t;
}

// Trusted Brands helpers
const BRANDS_LS_KEY = 'ng_trusted_brands';
const DEFAULT_BRANDS = [
  { id: 'b1', name: 'Apple',   displayName: 'Apple',   logoUrl: '', fontStyle: 'font-bold tracking-tight text-lg',        is_active: true },
  { id: 'b2', name: 'Samsung', displayName: 'SAMSUNG', logoUrl: '', fontStyle: 'font-black tracking-[0.15em] text-base',  is_active: true },
  { id: 'b3', name: 'Sony',    displayName: 'SONY',    logoUrl: '', fontStyle: 'font-black tracking-[0.2em] text-lg',    is_active: true },
  { id: 'b4', name: 'Nike',    displayName: 'NIKE',    logoUrl: '', fontStyle: 'font-black italic tracking-widest text-base', is_active: true },
  { id: 'b5', name: 'Adidas',  displayName: 'adidas',  logoUrl: '', fontStyle: 'font-bold text-sm lowercase',             is_active: true },
  { id: 'b6', name: 'Rolex',   displayName: 'ROLEX',   logoUrl: '', fontStyle: 'tracking-[0.2em] text-xs font-bold',      is_active: true },
];

function getStoredBrands() {
  try { const r = localStorage.getItem(BRANDS_LS_KEY); if (r) return JSON.parse(r); } catch {}
  return DEFAULT_BRANDS;
}
function getBrandsTitle() { return localStorage.getItem('ng_brands_title') || 'Trusted by world-class brands'; }
function getBrandsVisible() { return localStorage.getItem('ng_brands_visible') !== 'false'; }

const NL_KEY = 'ng_newsletter';
const DEFAULT_NL = {
  is_active: true,
  heading: 'Stay in the Loop',
  description: 'Get exclusive deals, early access to new drops, and style tips — delivered straight to your inbox every week.',
  btnText: 'Subscribe',
  placeholder: 'Enter your email...',
  badges: ['No spam', 'Unsubscribe anytime', 'Weekly drops'],
};

const TESTIMONIALS_KEY = 'ng_testimonials';
const TESTIMONIALS_SETTINGS_KEY = 'ng_testimonials_settings';

const DEFAULT_TESTIMONIALS_SETTINGS = {
  is_active: true,
  badge: 'Testimonials',
  heading: "Don't Just Take Our Word",
  subtext: '4.9/5 from 50,000+ reviews'
};

const DEFAULT_TESTIMONIALS = [
  { id: 't1', text: "Absolutely phenomenal shoes! The leather feels extremely premium and the fit is perfect.", name: "David Jenkins", role: "Verified Buyer", img: "https://i.pravatar.cc/100?img=8", rating: 5, is_active: true },
  { id: 't2', text: "Clean, modern sneakers. Extremely comfortable all day. Excellent quality!", name: "Michael Chang", role: "Sneaker Enthusiast", img: "https://i.pravatar.cc/100?img=11", rating: 5, is_active: true },
  { id: 't3', text: "Customer service is top-notch. Resolved my sizing question in minutes.", name: "Marcus Watson", role: "Verified Buyer", img: "https://i.pravatar.cc/100?img=12", rating: 5, is_active: true },
  { id: 't4', text: "Best boots I've ever owned. Worth every penny. Will buy again.", name: "James Porter", role: "Repeat Customer", img: "https://i.pravatar.cc/100?img=14", rating: 5, is_active: true },
  { id: 't5', text: "Fast shipping, beautiful packaging, and the jacket is stunning.", name: "Amir Hassan", role: "Verified Buyer", img: "https://i.pravatar.cc/100?img=15", rating: 5, is_active: true },
  { id: 't6', text: "Great variety and prices. My go-to store for all menswear.", name: "Ryan Brooks", role: "Loyal Member", img: "https://i.pravatar.cc/100?img=33", rating: 5, is_active: true },
];

function getNewsletter() {
  try {
    const r = localStorage.getItem(NL_KEY);
    if (r) return { ...DEFAULT_NL, ...JSON.parse(r) };
  } catch {}
  return DEFAULT_NL;
}

function getTestimonials() {
  try {
    const r = localStorage.getItem(TESTIMONIALS_KEY);
    if (r) return JSON.parse(r);
  } catch {}
  return DEFAULT_TESTIMONIALS;
}

function getTestimonialsSettings() {
  try {
    const r = localStorage.getItem(TESTIMONIALS_SETTINGS_KEY);
    if (r) return { ...DEFAULT_TESTIMONIALS_SETTINGS, ...JSON.parse(r) };
  } catch {}
  return DEFAULT_TESTIMONIALS_SETTINGS;
}

const cleanProductData = (p) => {
  if (!p) return p;
  const t = (p.title || '').toLowerCase();
  const c = (p.category_name || '').toLowerCase();
  
  if (t.includes('drone') || t.includes('camera') || t.includes('phone') || t.includes('laptop') || t.includes('desk mat') || t.includes('deskmat') || t.includes('aura rgb') || c.includes('peripheral') || c.includes('peripherals')) {
    return {
      ...p,
      title: "Premium Men's Leather Sneakers",
      category_name: "Footwear",
      price: "129.99",
      main_image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      description: "Classic court-inspired sneakers with sleek details and an ultra-cushioned insole for maximum comfort."
    };
  }
  if (t.includes('bitcoin') || t.includes('cipher') || t.includes('hardware wallet')) {
    return {
      ...p,
      title: "Premium Leather Bi-Fold Wallet",
      category_name: "Accessories",
      price: "45.00",
      main_image: "https://images.unsplash.com/photo-1627124118304-729478f5ea0f?w=800&auto=format&fit=crop&q=80",
      description: "Crafted from genuine full-grain leather, featuring multi-card slots, a spacious cash pocket, and RFID-blocking protection."
    };
  }
  if (t.includes('smart bulb') || t.includes('bulb') || t.includes('luminous') || c.includes('gadgets')) {
    return {
      ...p,
      title: "Classic Knit Crewneck Sweater",
      category_name: "Outerwear",
      price: "65.00",
      discount_price: "39.00",
      main_image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80",
      description: "Super soft, mid-weight cotton knit sweater designed to keep you warm and comfortable in a refined classic profile."
    };
  }
  if (t.includes('power bank') || t.includes('powerbank') || t.includes('zenith')) {
    return {
      ...p,
      title: "Minimalist Canvas Backpack",
      category_name: "Accessories",
      price: "75.00",
      main_image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      description: "Built for daily utility. High-density canvas backpack with a dedicated padded 15\" laptop sleeve and quick-access pockets."
    };
  }
  if (t.includes('fitness tracker') || t.includes('pulse') || t.includes('tracker') || c.includes('wearables')) {
    return {
      ...p,
      title: "Active Performance Sports Cap",
      category_name: "Accessories",
      price: "29.99",
      discount_price: "19.99",
      main_image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80",
      description: "Lightweight, breathable athletic cap with moisture-wicking technology and an adjustable strap for an optimized fit."
    };
  }
  return p;
};

const DEFAULT_SLIDES = [
  {
    id: 'default-1',
    badge: "Men's Style Collection 2026",
    title: "Experience Premium Men's Shoes & Wear",
    subtitle: "Discover high-quality men's footwear, classic boots, outerwear, and activewear curated for the modern lifestyle. Styled for distinction and fit.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
    btnText: "Shop Collection",
    btnLink: "/products",
    theme: "emerald"
  },
  {
    id: 'default-2',
    badge: "Special Flash Deal",
    title: "Step Up Your Game With Performance Wear",
    subtitle: "Engineered for maximum comfort, durability, and breathability. Gear up with the finest jackets, shoes, and activewear designed to elevate your training.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    btnText: "Explore Sale",
    btnLink: "/products?sale=true",
    theme: "amber"
  },
  {
    id: 'default-3',
    badge: "New Arrivals",
    title: "Minimalist Modern Jackets & Apparel",
    subtitle: "Uncompromising quality. Crafted with windproof fabrics and premium insulation, our new garments collection keeps you warm while maintaining a sleek profile.",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80",
    btnText: "New Arrivals",
    btnLink: "/products",
    theme: "blue"
  }
];

const getThemeClasses = (theme) => {
  const themes = {
    emerald: {
      bgGradient: "from-emerald-50 via-teal-50/20 to-white",
      badgeBg: "bg-emerald-50 border-emerald-100 text-emerald-700",
      btnBg: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20",
      glowBg: "bg-emerald-500/5",
      badgeIconColor: "text-emerald-600",
      badgeIconBg: "bg-emerald-500/10"
    },
    amber: {
      bgGradient: "from-amber-50 via-orange-50/20 to-white",
      badgeBg: "bg-amber-50 border-amber-100 text-amber-700",
      btnBg: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20",
      glowBg: "bg-amber-500/5",
      badgeIconColor: "text-amber-600",
      badgeIconBg: "bg-amber-500/10"
    },
    blue: {
      bgGradient: "from-blue-50 via-indigo-50/20 to-white",
      badgeBg: "bg-blue-50 border-blue-100 text-blue-700",
      btnBg: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/20",
      glowBg: "bg-blue-500/5",
      badgeIconColor: "text-blue-600",
      badgeIconBg: "bg-blue-500/10"
    },
    rose: {
      bgGradient: "from-rose-50 via-red-50/20 to-white",
      badgeBg: "bg-rose-50 border-rose-100 text-rose-700",
      btnBg: "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20",
      glowBg: "bg-rose-500/5",
      badgeIconColor: "text-rose-600",
      badgeIconBg: "bg-rose-500/10"
    },
    dark: {
      bgGradient: "from-gray-100 via-gray-50/50 to-white",
      badgeBg: "bg-gray-150 border-gray-200 text-gray-800",
      btnBg: "bg-gray-900 hover:bg-gray-800 shadow-gray-900/20",
      glowBg: "bg-gray-900/5",
      badgeIconColor: "text-gray-600",
      badgeIconBg: "bg-gray-950/10"
    }
  };
  return themes[theme] || themes.emerald;
};


const FALLBACK_CATS = [
  { name: "Men's Shoes", slug: "mens-shoes", Icon: Footprints },
  { name: "Sneakers", slug: "sneakers", Icon: Footprints },
  { name: "Men's Apparel", slug: "mens-apparel", Icon: Shirt },
  { name: "Outerwear", slug: "outerwear", Icon: Shirt },
  { name: "Activewear", slug: "activewear", Icon: Dumbbell },
  { name: "Leather Boots", slug: "leather-boots", Icon: Footprints },
  { name: "Accessories", slug: "accessories", Icon: Watch },
  { name: "New Arrivals", slug: "new-arrivals", Icon: ShoppingBag },
];

const toUrl = u => !u ? null : u.startsWith('http') ? u : `http://localhost:8000/media/${u.replace(/^\//, '')}`;

const isValidIconUrl = (val) => {
  if (!val) return false;
  if (val.length <= 4) return false;
  return val.includes('.') || val.includes('/') || val.startsWith('http');
};

const getCategoryIcon = (slug, name) => {
  const s = (slug || '').toLowerCase();
  const n = (name || '').toLowerCase();
  
  if (s.includes('outerwear') || n.includes('outerwear') || s.includes('jacket') || n.includes('jacket') || s.includes('knitwear') || n.includes('knitwear') || s === 'ou') return Shirt;
  if (s.includes('footwear') || n.includes('footwear') || s.includes('shoe') || n.includes('shoe') || s.includes('feet') || n.includes('feet') || s === 'fo') return Footprints;
  if (s.includes('watch') || n.includes('watch') || s.includes('accessory') || n.includes('accessory') || s.includes('accessories') || s === 'ac') return Watch;
  if (s.includes('jewel') || n.includes('jewel') || s.includes('gem') || n.includes('gem') || s.includes('fashion') || n.includes('fashion') || s.includes('beauty') || n.includes('beauty') || s === 'wo') return Gem;
  if (s.includes('sport') || n.includes('sport') || s.includes('fitness') || n.includes('fitness') || s.includes('activewear') || n.includes('activewear') || s.includes('gym') || n.includes('gym')) return Dumbbell;
  if (s === 'me' || s.includes('men')) return Shirt;
  return ShoppingBag;
};

const ProductImage = ({ src, alt, className, size = 48 }) => {
  const [error, setError] = useState(false);
  if (error || !src) return <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400"><Package size={size} /></div>;
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};

const Card = ({ product }) => {
  const [w, setW] = useState(false);
  
  let img = toUrl(product.main_image) || toUrl(product.images?.[0]?.image);
  if (product.title && (product.title.toLowerCase().includes('drone') || product.title.toLowerCase().includes('camera'))) {
    img = "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop";
  }

  const addCart = e => {
    e.preventDefault();
    const c = JSON.parse(localStorage.getItem('ng_cart') || '[]');
    const i = c.findIndex(x => x.id === product.id);
    i >= 0 ? c[i].qty++ : c.push({ id: product.id, title: product.title, price: product.price, image: img, qty: 1 });
    localStorage.setItem('ng_cart', JSON.stringify(c));
    window.dispatchEvent(new Event('cartUpdated'));
  };
  
  const toggleW = e => {
    e.preventDefault();
    const wl = JSON.parse(localStorage.getItem('ng_wishlist') || '[]');
    const upd = wl.find(x => x.id === product.id) ? wl.filter(x => x.id !== product.id) : [...wl, { id: product.id, title: product.title, price: product.price, image: img }];
    localStorage.setItem('ng_wishlist', JSON.stringify(upd));
    setW(!w); window.dispatchEvent(new Event('wishlistUpdated'));
  };

  const priceVal = parseFloat(product.price);
  const discountVal = product.discount_price ? parseFloat(product.discount_price) : null;
  const displayOriginalPrice = discountVal ? priceVal : priceVal * 1.25;
  const displaySalePrice = discountVal ? discountVal : priceVal;

  return (
    <Link to={`/products/${product.id}`} className="group relative bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:border-emerald-500/35 hover:shadow-[0_20px_40px_rgba(16,185,129,0.08)] hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      
      {/* Image Area */}
      <div className="relative h-64 bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
        <ProductImage src={img} alt={product.title} size={48} className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-700 ease-out" />
        
        {/* Badges */}
        <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-md z-10">
          SALE
        </span>
        
        {/* Hover Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 z-10">
          <button onClick={toggleW} className="w-10 h-10 bg-white border border-gray-200 hover:border-red-500 hover:bg-red-50 rounded-full flex items-center justify-center shadow-md transition-colors">
            <Heart size={16} fill={w ? '#ef4444' : 'none'} className={w ? "text-red-500" : "text-gray-400"} />
          </button>
          <div className="w-10 h-10 bg-white border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 rounded-full flex items-center justify-center shadow-md transition-colors text-gray-400 hover:text-emerald-500">
            <Eye size={16} />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{product.category_name || "Men's Style"}</p>
          <div className="flex items-center gap-1">
            <Star size={10} fill="#f59e0b" stroke="#f59e0b" />
            <span className="text-[10px] font-bold text-gray-500">4.8</span>
          </div>
        </div>
        
        <h3 className="font-bold text-gray-800 text-[15px] leading-snug line-clamp-2 mb-4 flex-1 group-hover:text-emerald-600 transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[11px] text-gray-400 line-through mb-0.5">${displayOriginalPrice.toFixed(2)}</span>
            <span className="text-xl font-black text-gray-900">${displaySalePrice.toFixed(2)}</span>
          </div>
          
          <button onClick={addCart} className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 hover:scale-105 transition-all shadow-md">
            <ShoppingCart size={18} fill="currentColor" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flashSale, setFlashSale] = useState(getFlashSale);
  const countdown = useFlashCountdown(flashSale);
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [brands, setBrands] = useState(getStoredBrands);
  const [brandsTitle, setBrandsTitle] = useState(getBrandsTitle);
  const [brandsVisible, setBrandsVisible] = useState(getBrandsVisible);
  const [newsletter, setNewsletter] = useState(getNewsletter);
  const [testimonials, setTestimonials] = useState(getTestimonials);
  const [testimonialsSettings, setTestimonialsSettings] = useState(getTestimonialsSettings);
  const activeReviews = testimonials.filter(r => r.is_active);

  useEffect(() => {
    const localSliders = JSON.parse(localStorage.getItem('ng_hero_sliders') || '[]');
    if (localSliders.length > 0) {
      setSlides(localSliders.filter(s => s.is_active !== false));
    } else {
      setSlides(DEFAULT_SLIDES);
    }
  }, []);

  // Listen for flash sale updates from admin panel
  useEffect(() => {
    const onUpdate = () => setFlashSale(getFlashSale());
    window.addEventListener('flashSaleUpdated', onUpdate);
    return () => window.removeEventListener('flashSaleUpdated', onUpdate);
  }, []);

  // Listen for brands updates from admin panel
  useEffect(() => {
    const onBrandsUpdate = () => {
      setBrands(getStoredBrands());
      setBrandsTitle(getBrandsTitle());
      setBrandsVisible(getBrandsVisible());
    };
    window.addEventListener('brandsUpdated', onBrandsUpdate);
    return () => window.removeEventListener('brandsUpdated', onBrandsUpdate);
  }, []);

  useEffect(() => {
    const onNLUpdate = () => setNewsletter(getNewsletter());
    window.addEventListener('newsletterUpdated', onNLUpdate);
    return () => window.removeEventListener('newsletterUpdated', onNLUpdate);
  }, []);

  useEffect(() => {
    const onTestimonialsUpdate = () => {
      setTestimonials(getTestimonials());
      setTestimonialsSettings(getTestimonialsSettings());
    };
    window.addEventListener('testimonialsUpdated', onTestimonialsUpdate);
    return () => window.removeEventListener('testimonialsUpdated', onTestimonialsUpdate);
  }, []);

  // Auto‑play the hero slider (left → right)
  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 5000); // change every 5 seconds
      return () => clearInterval(interval);
    }
  }, [slides]);

  useEffect(() => {
    (async () => {
      try {
        const [pr, cr] = await Promise.all([api.get('products/?page_size=12'), api.get('categories/')]);
        
        // Filter and clean tech/electronics titles using global helper
        const cleanedProducts = (pr.data.results || pr.data).map(cleanProductData);
        setProducts(cleanedProducts);
        
        // Deduplicate categories by normalized name and filter out tech & female categories
        const uniqueCats = [];
        const catNames = new Set();
        const activeCategories = (cr.data.results || cr.data).filter(c => c.is_active);
        for (const cat of activeCategories) {
          const normName = cat.name.trim().toLowerCase();
          const isInvalid = normName.includes('electronic') || normName.includes('laptop') || normName.includes('phone') || normName.includes('female') || normName.includes('women');
          if (!catNames.has(normName) && !isInvalid) {
            catNames.add(normName);
            uniqueCats.push(cat);
          }
        }
        setCats(uniqueCats);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="bg-[#f9fafb] min-h-screen text-gray-800">

      {/* 1. HERO SECTION (Dynamic Slider) */}
      <section className="relative pt-8 pb-16 overflow-hidden border-b border-gray-100 bg-white min-h-[620px] lg:min-h-[660px] flex items-center group/hero">
        {slides.length === 0 ? (
          <div className="container mx-auto px-4 text-center py-20">
            <p className="text-gray-400 text-lg">No slides loaded.</p>
          </div>
        ) : (
          (() => {
            const slide = slides[currentSlide];
            if (!slide) return null;
            const theme = getThemeClasses(slide.theme);
            return (
              <div
                key={slide.id || currentSlide}
                className="w-full relative animate-in fade-in slide-in-from-left-4 duration-500"
              >
                {/* Deep Glow Background matching the slide's theme */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-[120px] rounded-full pointer-events-none transition-colors duration-700 ${theme.glowBg}`} />
                
                {/* Slide Background Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient} opacity-40 pointer-events-none`} />

                <div className="container mx-auto px-16 sm:px-20 lg:px-24 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Left: Typography & CTA */}
                  <div className="space-y-8 py-4">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-all ${theme.badgeBg}`}>
                      <span className="flex h-2 w-2 rounded-full bg-current animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider">{slide.badge}</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-black text-gray-900 leading-[1.15] tracking-tight">
                      {slide.title}
                    </h1>
                    
                    <p className="text-base sm:text-lg text-gray-600 max-w-lg leading-relaxed">
                      {slide.subtitle}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <Link to={slide.btnLink || "/products"} className={`px-8 py-4 text-white font-black rounded-2xl transition-all duration-300 shadow-lg hover:scale-[1.02] active:scale-100 ${theme.btnBg}`}>
                        {slide.btnText || "Shop Now"}
                      </Link>
                      <Link to="/categories" className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-colors shadow-sm hover:scale-[1.02] active:scale-100">
                        Explore Categories
                      </Link>
                    </div>
                    
                    {/* Customer Reviews Badge (static, kept for design) */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-150">
                      <div className="flex -space-x-3">
                        {['https://i.pravatar.cc/100?img=1','https://i.pravatar.cc/100?img=2','https://i.pravatar.cc/100?img=3','https://i.pravatar.cc/100?img=4'].map((img, i) => (
                          <img key={i} src={img} alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" />
                        ))}
                      </div>
                      <div>
                        <div className="flex items-center gap-1 mb-0.5">
                          {[1,2,3,4,5].map(s=><Star key={s} size={12} fill="#f59e0b" stroke="#f59e0b"/>)}
                          <span className="text-xs font-bold text-gray-800 ml-1">4.9/5</span>
                        </div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">From 50K+ Happy Customers</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right: Large Hero Image with Floating Badges */}
                  <div className="relative py-4">
                    {/* Single premium rounded container containing the image directly */}
                    <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-gray-50 rounded-[3rem] border border-gray-150 overflow-hidden shadow-xl flex items-center justify-center">
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                      
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        )}

        {/* Slider Navigation Arrows (shown on hover of the section) */}
        {slides.length > 1 && (
          <>
            <button 
              onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white border border-gray-255 text-gray-600 hover:text-emerald-600 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all opacity-0 group-hover/hero:opacity-100 cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white border border-gray-255 text-gray-600 hover:text-emerald-600 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all opacity-0 group-hover/hero:opacity-100 cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Slider Dots indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  i === currentSlide ? 'w-6 h-2 bg-emerald-500' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
                title={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

        {/* 4. TRENDING PRODUCTS */}
        <section className="py-16 bg-gray-50 border-y border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-emerald-600 text-[11px] font-black uppercase tracking-widest mb-3 block">Top Picks</span>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Trending Now</h2>
              </div>
              <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors">
                View All Products <ArrowRight size={16}/>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? Array(4).fill(null).map((_,i)=><div key={i} className="h-[400px] rounded-[1.5rem] bg-white border border-gray-150 animate-pulse"/>)
              : products.slice(0,4).map(p=><Card key={p.id} product={p}/>)}
            </div>
          </div>
        </section>
      {/* 3. CATEGORIES — Smooth RTL Marquee */}
      <section className="py-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-emerald-600 text-[11px] font-black uppercase tracking-widest mb-3 block">Collections</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">Shop by Category</h2>
            <p className="text-gray-500 text-sm font-medium max-w-md mx-auto">Explore our wide range of premium collections.</p>
          </div>
        </div>

        {/* Marquee wrapper */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[#f9fafb] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#f9fafb] to-transparent z-10 pointer-events-none" />

          <div
            className="flex items-center gap-5 w-max py-2"
            style={{ animation: 'marquee-rtl 35s linear infinite' }}
            onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
            onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
          >
            {(() => {
              const dbCats = cats.slice(0,8);
              const uniqueFallback = FALLBACK_CATS.filter(fc => !dbCats.some(dc => dc.slug === fc.slug || dc.name.toLowerCase() === fc.name.toLowerCase()));
              const shown = dbCats.length >= 8 ? dbCats : [...dbCats, ...uniqueFallback.slice(0, 8-dbCats.length)];
              // Triple for seamless loop
              const looped = [...shown, ...shown, ...shown];
              return looped.map((cat, idx) => {
                const img = !cat.Icon && isValidIconUrl(cat.icon || cat.image) ? (toUrl(cat.icon)||toUrl(cat.image)) : null;
                const Icon = cat.Icon || getCategoryIcon(cat.slug, cat.name);
                return (
                  <Link key={`${cat.slug||idx}-${idx}`} to={`/products?category=${cat.slug}`} className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 hover:border-emerald-500/35 hover:shadow-lg hover:-translate-y-1 transition-all duration-400 shadow-sm flex-shrink-0 w-[120px]">
                    <div className="w-10 h-10 mb-2 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:text-emerald-600 transition-colors">
                      {img ? <img src={img} alt={cat.name} className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100" /> :
                       Icon ? <Icon size={18} className="text-gray-400 group-hover:text-emerald-500" /> :
                       <span className="font-black text-xs text-gray-400 group-hover:text-emerald-500">{cat.name.slice(0,2).toUpperCase()}</span>}
                    </div>
                    <p className="font-bold text-[11px] text-gray-600 group-hover:text-emerald-600 transition-colors text-center">{cat.name}</p>
                  </Link>
                );
              });
            })()}
          </div>

          <style>{`
            @keyframes marquee-rtl {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-33.333%); }
            }
          `}</style>
        </div>
      </section>

      {/* 5. FLASH SALE BANNER — Admin Controlled */}
      {flashSale.is_active !== false && (
      <section className="py-20 relative overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 border-y border-emerald-100">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #10b981 0%, transparent 70%)' }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-white/95 backdrop-blur-xl border border-emerald-100/50 rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl">
            <div className="max-w-xl text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-lg mb-4 border border-red-200">
                {flashSale.badge || 'Limited Offer'}
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{flashSale.title}</h2>
              <p className="text-gray-600 mb-8">{flashSale.description}</p>
              
              <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
                {[countdown.h, countdown.m, countdown.s].map((v,i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300">
                      <span className="text-2xl font-black text-emerald-600 font-mono tracking-tight">{v}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mt-2">{['Hours','Mins','Secs'][i]}</span>
                  </div>
                ))}
              </div>
              
              <Link to={flashSale.btnLink || '/products?sale=true'} className="inline-flex px-8 py-4 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-500/20">
                {flashSale.btnText || 'Shop Flash Sale'}
              </Link>
            </div>
            
            {flashSale.image && (
            <div className="hidden md:block w-1/3 relative">
              <div className="absolute inset-0 bg-emerald-500/10 blur-[60px] rounded-full" />
              <img src={flashSale.image} alt={flashSale.title} className="relative z-10 w-full object-contain filter drop-shadow-lg" />
            </div>
            )}
          </div>
        </div>
      </section>
      )}

      {/* TRUSTED BRANDS — Admin Controlled — Smooth Marquee */}
      {brandsVisible !== false && brands.filter(b => b.is_active).length > 0 && (() => {
        const activeBrands = brands.filter(b => b.is_active);
        // Duplicate brands enough times to ensure seamless loop
        const loopedBrands = [...activeBrands, ...activeBrands, ...activeBrands];
        return (
        <section className="py-10 border-b border-gray-100 bg-white overflow-hidden">
          <div className="px-4 mb-6">
            <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {brandsTitle}
            </p>
          </div>
          {/* Marquee wrapper */}
          <div className="relative w-full overflow-hidden">
            {/* Left fade */}
            <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {/* Scrolling track */}
            <div
              className="flex items-center gap-16 w-max"
              style={{
                animation: 'marquee-ltr 28s linear infinite',
              }}
              onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
              onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
            >
              {loopedBrands.map((brand, idx) => (
                <div
                  key={`${brand.id}-${idx}`}
                  className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors duration-300 cursor-pointer select-none flex-shrink-0"
                >
                  {brand.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="h-8 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity duration-300"
                    />
                  ) : (
                    <span className={`${brand.fontStyle} leading-none whitespace-nowrap`}>
                      {brand.displayName}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Keyframe injection */}
            <style>{`
              @keyframes marquee-ltr {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-33.333%); }
              }
            `}</style>
          </div>
        </section>
        );
      })()}

      {/* 6. BEST SELLERS */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-emerald-600 text-[11px] font-black uppercase tracking-widest mb-3 block">Most Loved</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Best Sellers</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? Array(4).fill(null).map((_,i)=><div key={i} className="h-[400px] rounded-[1.5rem] bg-white border border-gray-150 animate-pulse"/>)
            : products.slice(4,8).map(p=><Card key={p.id} product={p}/>)}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS — Smooth RTL Marquee */}
      {testimonialsSettings.is_active && activeReviews.length > 0 && (
        <section className="py-16 bg-gray-50 border-y border-gray-100 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <span className="text-emerald-600 text-[11px] font-black uppercase tracking-widest mb-3 block">{testimonialsSettings.badge}</span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3">{testimonialsSettings.heading}</h2>
              <div className="flex justify-center items-center gap-2">
                <div className="flex gap-0.5">{[1,2,3,4,5].map(s=><Star key={s} size={14} fill="#10b981" stroke="#10b981"/>)}</div>
                <span className="text-gray-500 font-bold text-xs">{testimonialsSettings.subtext}</span>
              </div>
            </div>
          </div>

          {/* Marquee */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

            <div
              className="flex items-stretch gap-5 w-max"
              style={{ animation: 'marquee-reviews 40s linear infinite' }}
              onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
              onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
            >
              {[...Array(3)].flatMap((_, loop) => activeReviews.map((review, i) => (
                <div key={`${loop}-${review.id || i}`} className="bg-white border border-gray-100 px-5 py-4 rounded-2xl hover:border-emerald-500/30 hover:shadow-md transition-all flex-shrink-0 w-[280px] flex flex-col">
                  <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(s=><Star key={s} size={11} fill={s <= review.rating ? "#f59e0b" : "#e5e7eb"} stroke={s <= review.rating ? "#f59e0b" : "#e5e7eb"}/>)}</div>
                  <p className="text-gray-600 text-xs leading-relaxed mb-3 flex-1 line-clamp-3">"{review.text}"</p>
                  <div className="flex items-center gap-2.5 mt-auto pt-2 border-t border-gray-50">
                    <img src={review.img || 'https://i.pravatar.cc/100?img=1'} alt={review.name} className="w-8 h-8 rounded-full object-cover shadow-sm" />
                    <div>
                      <p className="text-gray-800 font-bold text-xs">{review.name}</p>
                      <p className="text-emerald-600 text-[9px] font-black uppercase tracking-widest">{review.role}</p>
                    </div>
                  </div>
                </div>
              )))}
            </div>

            <style>{`
              @keyframes marquee-reviews {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-33.333%); }
              }
            `}</style>
          </div>
        </section>
      )}

      {/* 8. NEWSLETTER — Premium Design */}
      {newsletter.is_active && (
        <section className="py-20 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 pointer-events-none" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto">
              {/* Glass card */}
              <div className="relative rounded-[2.5rem] p-8 md:p-14 bg-white/80 backdrop-blur-xl border border-emerald-100/60 shadow-[0_20px_60px_rgba(16,185,129,0.08)]">
                {/* Decorative corner glow */}
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-emerald-400/15 to-transparent rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Zap size={24} className="text-white" fill="white" />
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
                    {newsletter.heading}
                  </h2>
                  <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                    {newsletter.description}
                  </p>

                  {/* Form */}
                  <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6" onSubmit={e => { e.preventDefault(); const btn = e.target.querySelector('button'); btn.textContent = '✓ Subscribed!'; btn.classList.add('bg-green-500'); setTimeout(() => { btn.textContent = newsletter.btnText || 'Subscribe'; btn.classList.remove('bg-green-500'); }, 3000); }}>
                    <div className="relative flex-1">
                      <input
                        type="email"
                        placeholder={newsletter.placeholder || "Enter your email..."}
                        required
                        className="w-full pl-5 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-7 py-3.5 font-black rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-100 text-sm"
                    >
                      {newsletter.btnText}
                    </button>
                  </form>

                  {/* Trust badges */}
                  {newsletter.badges && newsletter.badges.length > 0 && (
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                      {newsletter.badges.map((b, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-gray-400">
                          <CheckCircle2 size={12} className="text-emerald-500" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
