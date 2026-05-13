import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight, Sparkles, Package, Star, Eye } from 'lucide-react';

const getMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
};

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('ng_wishlist') || '[]'));

  const remove = (id, e) => {
    if(e) e.preventDefault();
    const updated = wishlist.filter(i => i.id !== id);
    setWishlist(updated);
    localStorage.setItem('ng_wishlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  const addToCart = (item, e) => {
    if(e) e.preventDefault();
    const cart = JSON.parse(localStorage.getItem('ng_cart') || '[]');
    const idx = cart.findIndex(i => i.id === item.id);
    if (idx >= 0) cart[idx].qty += 1; else cart.push({ ...item, qty: 1 });
    localStorage.setItem('ng_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    // remove(item.id); // Optional: remove from wishlist after adding to cart
  };

  return (
    <div className="min-h-screen bg-[#050810] py-12 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl pb-24">
        {/* Header */}
        <nav className="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-4 flex items-center gap-2">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <span className="w-1 h-1 rounded-full bg-gray-700" />
            <span className="text-emerald-500">Wishlist</span>
        </nav>
        
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                Saved Items 
                <span className="flex items-center justify-center px-4 py-1.5 rounded-full text-lg font-black shadow-inner bg-gray-900 border border-gray-800 text-emerald-400">
                    {wishlist.length}
                </span>
            </h1>
            {wishlist.length > 0 && (
                <Link to="/products" className="inline-flex items-center gap-2 text-sm font-black text-gray-500 hover:text-white transition-colors uppercase tracking-widest bg-gray-900 border border-gray-800 px-6 py-3.5 rounded-xl shadow-lg">
                    Continue Shopping <ArrowRight size={16} />
                </Link>
            )}
        </div>

        {wishlist.length === 0 ? (
          <div className="flex items-center justify-center py-20 relative">
            <div className="text-center relative z-10 p-12 bg-[#0a0f1d] rounded-[3rem] shadow-2xl border border-gray-800 max-w-lg w-full animate-in fade-in slide-in-from-bottom-8">
                <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner relative bg-gray-900 border border-gray-800">
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-rose-500" />
                    <Heart size={48} className="text-rose-500 relative z-10 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse" fill="#f43f5e" />
                </div>
                <h3 className="font-black text-white text-3xl mb-4 tracking-tight">Nothing to love yet?</h3>
                <p className="text-gray-400 font-medium leading-relaxed mb-8">Your wishlist is currently empty. Start browsing our collection and save your favorite items here for later.</p>
                <Link to="/products" className="group px-8 py-4 text-[#050810] bg-emerald-500 hover:bg-emerald-400 font-black rounded-2xl inline-flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95">
                    <Sparkles size={18} /> Discover Products <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map(item => {
              const img = getMediaUrl(item.image);
              return (
                <Link to={`/products/${item.id}`} key={item.id} className="group relative bg-[#0f172a] rounded-[1.5rem] overflow-hidden border border-gray-800 hover:border-emerald-500/50 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.2)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
                  
                  {/* Image Section */}
                  <div className="relative h-64 bg-gradient-to-br from-[#1e293b] to-[#0f172a] flex items-center justify-center p-6 overflow-hidden">
                    {img ? (
                        <img src={img} alt={item.title} className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <Package size={48} className="text-gray-700" />
                    )}
                    
                    {/* Floating Remove Button */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 z-20">
                        <button onClick={(e) => remove(item.id, e)} className="w-10 h-10 bg-gray-900/80 backdrop-blur-md border border-gray-700 hover:border-red-500 hover:bg-red-500/10 rounded-full flex items-center justify-center shadow-lg transition-colors text-red-500">
                            <Trash2 size={16} />
                        </button>
                        <div className="w-10 h-10 bg-gray-900/80 backdrop-blur-md border border-gray-700 hover:border-white hover:bg-white/10 rounded-full flex items-center justify-center shadow-lg transition-colors text-gray-400 hover:text-white">
                            <Eye size={16} />
                        </div>
                    </div>
                  </div>
                  
                  {/* Details Section */}
                  <div className="p-5 flex flex-col flex-1 border-t border-gray-800/50">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{item.category_name || 'Saved Item'}</p>
                        <div className="flex items-center gap-1">
                            <Star size={10} fill="#f59e0b" stroke="#f59e0b" />
                            <span className="text-[10px] font-bold text-gray-400">4.8</span>
                        </div>
                    </div>

                    <h3 className="font-bold text-white text-[15px] leading-snug line-clamp-2 mb-4 flex-1 group-hover:text-emerald-400 transition-colors">
                        {item.title}
                    </h3>
                    
                    <div className="flex items-end justify-between mt-auto">
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-white">${parseFloat(item.price || 0).toFixed(2)}</span>
                        </div>
                        <button onClick={(e) => addToCart(item, e)} className="w-11 h-11 rounded-xl bg-emerald-500 text-[#050810] flex items-center justify-center hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] z-20">
                            <ShoppingCart size={18} fill="currentColor" />
                        </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
