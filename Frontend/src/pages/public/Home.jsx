import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ShoppingCart, Heart, Star, TrendingUp, Zap, Eye,
  ChevronLeft, ChevronRight, Package, CheckCircle2, Truck,
  Shirt, Footprints, Watch, Laptop, Home as HomeIcon, Dumbbell, BookOpen, Gem,
  BadgePercent
} from 'lucide-react';
import api from '../../utils/api';

// Countdown timer hook
function useCountdown(targetHour = 23, targetMin = 59) {
  const getTime = () => {
    const now = new Date();
    const end = new Date(); end.setHours(targetHour, targetMin, 59, 0);
    const diff = Math.max(0, end - now);
    return { h: String(Math.floor(diff/3600000)).padStart(2,'0'), m: String(Math.floor((diff%3600000)/60000)).padStart(2,'0'), s: String(Math.floor((diff%60000)/1000)).padStart(2,'0') };
  };
  const [t, setT] = useState(getTime);
  useEffect(() => { const id = setInterval(() => setT(getTime()), 1000); return () => clearInterval(id); }, []);
  return t;
}

const FALLBACK_CATS = [
  { name:'Fashion', slug:'fashion', Icon: Shirt },
  { name:'Footwear', slug:'footwear', Icon: Footprints },
  { name:'Electronics', slug:'electronics', Icon: Laptop },
  { name:'Accessories', slug:'accessories', Icon: Watch },
  { name:'Jewellery', slug:'jewellery', Icon: Gem },
  { name:'Sports', slug:'sports', Icon: Dumbbell },
  { name:'Home Decor', slug:'home-decor', Icon: HomeIcon },
  { name:'Books', slug:'books', Icon: BookOpen },
];

const toUrl = u => !u ? null : u.startsWith('http') ? u : `http://localhost:8000/media/${u.replace(/^\//, '')}`;

/* ─── Modern Deep Product Card ─── */
const Card = ({ product }) => {
  const [w, setW] = useState(false);
  const img = toUrl(product.main_image) || toUrl(product.images?.[0]?.image);
  
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

  return (
    <Link to={`/products/${product.id}`} className="group relative bg-[#0f172a] rounded-[1.5rem] overflow-hidden border border-gray-800 hover:border-emerald-500/50 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.2)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
      
      {/* Image Area */}
      <div className="relative h-64 bg-gradient-to-br from-[#1e293b] to-[#0f172a] flex items-center justify-center p-6 overflow-hidden">
        {img ? <img src={img} alt={product.title} className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" />
          : <Package size={48} className="text-gray-700" />}
        
        {/* Badges */}
        {product.discount_price && (
          <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            SALE
          </span>
        )}
        
        {/* Hover Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <button onClick={toggleW} className="w-10 h-10 bg-gray-900/80 backdrop-blur-md border border-gray-700 hover:border-red-500 hover:bg-red-500/10 rounded-full flex items-center justify-center shadow-lg transition-colors">
            <Heart size={16} fill={w ? '#ef4444' : 'none'} className={w ? "text-red-500" : "text-gray-400"} />
          </button>
          <div className="w-10 h-10 bg-gray-900/80 backdrop-blur-md border border-gray-700 hover:border-white hover:bg-white/10 rounded-full flex items-center justify-center shadow-lg transition-colors text-gray-400 hover:text-white">
            <Eye size={16} />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1 border-t border-gray-800/50">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{product.category_name || 'Category'}</p>
          <div className="flex items-center gap-1">
            <Star size={10} fill="#f59e0b" stroke="#f59e0b" />
            <span className="text-[10px] font-bold text-gray-400">4.8</span>
          </div>
        </div>
        
        <h3 className="font-bold text-white text-[15px] leading-snug line-clamp-2 mb-4 flex-1 group-hover:text-emerald-400 transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            {product.discount_price ? (
              <>
                <span className="text-[11px] text-gray-500 line-through mb-0.5">${parseFloat(product.price).toFixed(2)}</span>
                <span className="text-xl font-black text-white">${parseFloat(product.discount_price).toFixed(2)}</span>
              </>
            ) : (
              <span className="text-xl font-black text-white">${parseFloat(product.price).toFixed(2)}</span>
            )}
          </div>
          
          <button onClick={addCart} className="w-11 h-11 rounded-xl bg-emerald-500 text-[#050810] flex items-center justify-center hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
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
  const countdown = useCountdown();

  useEffect(() => {
    (async () => {
      try {
        const [pr, cr] = await Promise.all([api.get('products/?page_size=12'), api.get('categories/')]);
        setProducts(pr.data.results || pr.data);
        setCats((cr.data.results || cr.data).filter(c => c.is_active));
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="bg-[#050810] min-h-screen">

      {/* 1. HERO SECTION (Upgraded) */}
      <section className="relative pt-8 pb-16 overflow-hidden border-b border-gray-900">
        {/* Deep Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Typography & CTA */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">NextGen Spring 2026</span>
            </div>
            
            <h1 className="text-5xl lg:text-[64px] font-black text-white leading-[1.1] tracking-tight">
              Experience The Future of <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Smart Shopping.</span>
            </h1>
            
            <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
              Discover premium electronics, fashion, and lifestyle products curated for the modern shopper. Enjoy AI-driven recommendations and lightning-fast delivery.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/products" className="px-8 py-4 bg-emerald-500 text-[#050810] font-black rounded-2xl hover:bg-emerald-400 transition-colors shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                Shop Collection
              </Link>
              <Link to="/categories" className="px-8 py-4 bg-gray-900 border border-gray-700 text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors">
                Explore Categories
              </Link>
            </div>
            
            {/* Customer Avatars */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-800/50">
              <div className="flex -space-x-3">
                {['https://i.pravatar.cc/100?img=1','https://i.pravatar.cc/100?img=2','https://i.pravatar.cc/100?img=3','https://i.pravatar.cc/100?img=4'].map((img, i) => (
                  <img key={i} src={img} alt="User" className="w-10 h-10 rounded-full border-2 border-[#050810] object-cover" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[1,2,3,4,5].map(s=><Star key={s} size={12} fill="#f59e0b" stroke="#f59e0b"/>)}
                  <span className="text-xs font-bold text-white ml-1">4.9/5</span>
                </div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">From 50K+ Customers</p>
              </div>
            </div>
          </div>
          
          {/* Right: Large Hero Image with Floating Badges */}
          <div className="relative">
            {/* The main image container */}
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-gradient-to-tr from-gray-900 to-gray-800 rounded-[3rem] border border-gray-700 overflow-hidden shadow-2xl flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=800&auto=format&fit=crop&q=80" alt="Hero Product" className="w-[80%] h-[80%] object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-110 hover:scale-105 transition-transform duration-700" />
            </div>
            
            {/* Floating Badges */}
            <div className="absolute top-10 -left-6 bg-gray-900/90 backdrop-blur-md border border-gray-700 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce-slow">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Truck size={16}/></div>
              <div><p className="text-white text-sm font-black">Free Shipping</p><p className="text-[10px] text-gray-400 uppercase tracking-widest">Global</p></div>
            </div>
            
            <div className="absolute bottom-16 -right-6 bg-gray-900/90 backdrop-blur-md border border-gray-700 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce-slow" style={{animationDelay: '1s'}}>
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400"><Zap size={16}/></div>
              <div><p className="text-white text-sm font-black">Up to 50% Off</p><p className="text-[10px] text-gray-400 uppercase tracking-widest">Sale Ends Soon</p></div>
            </div>
          </div>
          
        </div>
      </section>

      {/* 2. TRUSTED BRANDS */}
      <section className="py-10 border-b border-gray-900 overflow-hidden bg-[#0a0f1d]">
        <div className="container mx-auto px-4">
          <p className="text-center text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Trusted by world-class brands</p>
          <div className="flex items-center justify-center flex-wrap gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Dummy Brands using typography since we don't have SVG logos */}
            {['SONY', 'APPLE', 'SAMSUNG', 'NIKE', 'ADIDAS', 'ROLEX'].map(brand => (
              <span key={brand} className="text-2xl md:text-3xl font-black text-white tracking-tighter">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Shop by Category</h2>
            <p className="text-gray-500 text-sm">Explore our wide range of premium collections.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {loading ? Array(8).fill(null).map((_,i)=><div key={i} className="h-32 rounded-2xl bg-gray-900 border border-gray-800 animate-pulse"/>) : (() => {
              const dbCats = cats.slice(0,8);
              const shown = dbCats.length >= 8 ? dbCats : [...dbCats, ...FALLBACK_CATS.slice(0, 8-dbCats.length)];
              return shown.map((cat,i) => {
                const img = !cat.Icon ? (toUrl(cat.icon)||toUrl(cat.image)) : null;
                const Icon = cat.Icon || null;
                return (
                  <Link key={cat.slug||i} to={`/products?category=${cat.slug}`}
                    className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-[#0a0f1d] border border-gray-800 hover:border-emerald-500/50 hover:bg-gray-900 transition-all duration-300">
                    <div className="w-12 h-12 mb-3 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                      {img ? <img src={img} alt={cat.name} className="w-6 h-6 object-contain filter drop-shadow-md brightness-0 invert opacity-60 group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-0"/> :
                       Icon ? <Icon size={20} className="text-gray-400 group-hover:text-emerald-400"/> :
                       <span className="font-black text-sm text-gray-400 group-hover:text-emerald-400">{cat.name.slice(0,2).toUpperCase()}</span>}
                    </div>
                    <p className="font-bold text-xs text-gray-400 group-hover:text-white transition-colors">{cat.name}</p>
                  </Link>
                );
              });
            })()}
          </div>
        </div>
      </section>

      {/* 4. TRENDING PRODUCTS */}
      <section className="py-16 bg-[#0a0f1d] border-y border-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2 block">Top Picks</span>
              <h2 className="text-3xl md:text-4xl font-black text-white">Trending Now</h2>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-emerald-400 transition-colors">
              View All Products <ArrowRight size={16}/>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? Array(4).fill(null).map((_,i)=><div key={i} className="h-[400px] rounded-[1.5rem] bg-gray-800 animate-pulse"/>)
            : products.slice(0,4).map(p=><Card key={p.id} product={p}/>)}
          </div>
        </div>
      </section>

      {/* 5. FLASH SALE BANNER */}
      <section className="py-20 relative overflow-hidden bg-gray-900 border-y border-gray-800">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #10b981 0%, transparent 70%)' }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-[#050810]/80 backdrop-blur-xl border border-gray-700 rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
            <div className="max-w-xl text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-lg mb-4 border border-red-500/30">Limited Offer</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Midnight Flash Sale</h2>
              <p className="text-gray-400 mb-8">Get up to 60% off on selected electronics and accessories. Offer valid until the timer runs out!</p>
              
              <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
                {[countdown.h, countdown.m, countdown.s].map((v,i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-900 border border-gray-700 rounded-xl flex items-center justify-center shadow-inner">
                      <span className="text-2xl font-black text-white">{v}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">{['Hours','Mins','Secs'][i]}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/products?sale=true" className="inline-flex px-8 py-4 bg-white text-gray-900 font-black rounded-xl hover:bg-gray-200 transition-colors shadow-lg">
                Shop Flash Sale
              </Link>
            </div>
            
            <div className="hidden md:block w-1/3 relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full" />
              <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80" alt="Sale" className="relative z-10 w-full object-contain filter drop-shadow-2xl mix-blend-screen" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. BEST SELLERS */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2 block">Most Loved</span>
            <h2 className="text-3xl md:text-4xl font-black text-white">Best Sellers</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? Array(4).fill(null).map((_,i)=><div key={i} className="h-[400px] rounded-[1.5rem] bg-gray-800 animate-pulse"/>)
            : products.slice(4,8).map(p=><Card key={p.id} product={p}/>)}
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS (Trust Building) */}
      <section className="py-20 bg-[#0a0f1d] border-y border-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Don't Just Take Our Word</h2>
            <div className="flex justify-center items-center gap-2">
              <div className="flex gap-1">{[1,2,3,4,5].map(s=><Star key={s} size={16} fill="#10b981" stroke="#10b981"/>)}</div>
              <span className="text-gray-400 font-bold">4.9/5 from 50,000+ reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: "Absolutely phenomenal experience. The shipping was incredibly fast and the product quality exceeded my expectations.", name: "Sarah Jenkins", role: "Verified Buyer", img: "https://i.pravatar.cc/100?img=5" },
              { text: "I've shopped at many places, but the UI and ease of use here are unmatched. Highly recommend to everyone.", name: "Michael Chang", role: "Tech Enthusiast", img: "https://i.pravatar.cc/100?img=11" },
              { text: "Customer service is top-notch. I had an issue with sizing and they resolved it within minutes. Customer for life!", name: "Emma Watson", role: "Verified Buyer", img: "https://i.pravatar.cc/100?img=9" }
            ].map((review, i) => (
              <div key={i} className="bg-[#050810] border border-gray-800 p-8 rounded-[2rem] hover:border-gray-700 transition-colors">
                <div className="flex gap-1 mb-6">{[1,2,3,4,5].map(s=><Star key={s} size={14} fill="#f59e0b" stroke="#f59e0b"/>)}</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-8">"{review.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="text-white font-bold text-sm">{review.name}</p>
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER (Refined) */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-[3rem] p-10 md:p-16 relative overflow-hidden border border-gray-800 bg-[#0a0f1d]">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
            
            <div className="relative z-10 text-center max-w-xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Stay in the Loop</h2>
              <p className="text-gray-400 text-sm md:text-base mb-10">Subscribe to get exclusive deals, early access to new collections, and weekly drops delivered straight to your inbox.</p>
              
              <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={e=>e.preventDefault()}>
                <input type="email" placeholder="Enter your email address..."
                  className="flex-1 px-6 py-4 rounded-2xl bg-[#050810] border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"/>
                <button type="submit" className="px-8 py-4 font-black rounded-2xl text-[#050810] bg-emerald-500 hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  Subscribe
                </button>
              </form>
              <p className="text-[10px] text-gray-600 mt-4 font-bold uppercase tracking-widest">We never share your email with third parties.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
