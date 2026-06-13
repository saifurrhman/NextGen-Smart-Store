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
    if (e) e.preventDefault();
    const updated = wishlist.filter(i => i.id !== id);
    setWishlist(updated);
    localStorage.setItem('ng_wishlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  const addToCart = (item, e) => {
    if (e) e.preventDefault();
    const cart = JSON.parse(localStorage.getItem('ng_cart') || '[]');
    const idx = cart.findIndex(i => i.id === item.id);
    if (idx >= 0) cart[idx].qty += 1; else cart.push({ ...item, qty: 1 });
    localStorage.setItem('ng_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    // remove(item.id); // Optional: remove from wishlist after adding to cart
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] py-12 relative overflow-hidden text-gray-800">
      {/* Background aesthetics */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl pb-24">
        {/* Header */}
        <nav className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-4 flex items-center gap-2">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <span className="w-1 h-1 rounded-full bg-gray-305" />
          <span className="text-emerald-600">Wishlist</span>
        </nav>

        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-4">
            Saved Items
            <span className="flex items-center justify-center px-4 py-1.5 rounded-full text-lg font-black shadow-inner bg-white border border-gray-200 text-emerald-600">
              {wishlist.length}
            </span>
          </h1>
          {wishlist.length > 0 && (
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-black text-gray-500 hover:text-emerald-600 transition-colors uppercase tracking-widest bg-white border border-gray-200 px-6 py-3.5 rounded-xl shadow-sm">
              Continue Shopping <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="flex items-center justify-center py-20 relative">
            <div className="text-center relative z-10 p-12 bg-white rounded-[3rem] shadow-sm border border-gray-150 max-w-lg w-full animate-in fade-in slide-in-from-bottom-8">
              <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner relative bg-gray-50 border border-gray-150">
                <div className="absolute inset-0 rounded-full animate-ping opacity-10 bg-rose-500" />
                <Heart size={48} className="text-rose-500 relative z-10 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse" fill="#f43f5e" />
              </div>
              <h3 className="font-black text-gray-900 text-3xl mb-4 tracking-tight">Nothing to love yet?</h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-8">Your wishlist is currently empty. Start browsing our collection and save your favorite items here for later.</p>
              <Link to="/products" className="group px-8 py-4 text-white bg-emerald-500 hover:bg-emerald-600 font-black rounded-2xl inline-flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all hover:scale-105 active:scale-95">
                <Sparkles size={18} /> Discover Products <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map(item => {
              const img = getMediaUrl(item.image);
              return (
                <Link to={`/products/${item.id}`} key={item.id} className="group relative bg-white rounded-[1.5rem] overflow-hidden border border-gray-100 hover:border-emerald-500/35 hover:shadow-[0_20px_40px_rgba(16,185,129,0.08)] hover:-translate-y-2 transition-all duration-550 flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.03)] animate-in fade-in slide-in-from-bottom-4">

                  {/* Image Section */}
                  <div className="relative h-64 bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
                    {img ? (
                      <img src={img} alt={item.title} className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <Package size={48} className="text-gray-400" />
                    )}

                    {/* Floating Remove Button */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 z-20">
                      <button onClick={(e) => remove(item.id, e)} className="w-10 h-10 bg-white border border-gray-200 hover:border-red-500 hover:bg-red-50 rounded-full flex items-center justify-center shadow-md transition-colors text-red-500">
                        <Trash2 size={16} />
                      </button>
                      <div className="w-10 h-10 bg-white border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 rounded-full flex items-center justify-center shadow-md transition-colors text-gray-400 hover:text-emerald-500">
                        <Eye size={16} />
                      </div>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="p-5 flex flex-col flex-1 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{item.category_name || 'Saved Item'}</p>
                      <div className="flex items-center gap-1">
                        <Star size={10} fill="#f59e0b" stroke="#f59e0b" />
                        <span className="text-[10px] font-bold text-gray-500">4.8</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-800 text-[15px] leading-snug line-clamp-2 mb-4 flex-1 group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </h3>

                    <div className="flex items-end justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xl font-black text-gray-900">${parseFloat(item.price || 0).toFixed(2)}</span>
                      </div>
                      <button onClick={(e) => addToCart(item, e)} className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 hover:scale-105 transition-all shadow-md z-20">
                        <ShoppingCart size={18} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Recommended Section */}
        <div className="mt-20 border-t border-gray-150 pt-16">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles size={20} className="text-emerald-500" />
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recommended For You</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 'rec1',
                title: "Premium Men's Leather Sneakers",
                price: "129.99",
                category_name: "Footwear",
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
              },
              {
                id: 'rec2',
                title: "Classic Knit Crewneck Sweater",
                price: "65.00",
                category_name: "Outerwear",
                image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80",
              },
              {
                id: 'rec3',
                title: "Premium Leather Bi-Fold Wallet",
                price: "45.00",
                category_name: "Accessories",
                image: "https://images.unsplash.com/photo-1627124118304-729478f5ea0f?w=800&auto=format&fit=crop&q=80",
              },
              {
                id: 'rec4',
                title: "Minimalist Canvas Backpack",
                price: "75.00",
                category_name: "Accessories",
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
              }
            ].map(product => (
              <Link to={`/products/${product.id}`} key={product.id} className="group relative bg-white rounded-[1.5rem] overflow-hidden border border-gray-100 hover:border-emerald-500/35 hover:shadow-[0_20px_40px_rgba(16,185,129,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                <div className="relative h-60 bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-md z-10">HOT</span>
                </div>
                <div className="p-5 flex flex-col flex-1 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{product.category_name}</p>
                    <div className="flex items-center gap-1">
                      <Star size={10} fill="#f59e0b" stroke="#f59e0b" />
                      <span className="text-[10px] font-bold text-gray-500">4.9</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 text-[14px] leading-snug line-clamp-2 mb-4 flex-1 group-hover:text-emerald-600 transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-end justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-gray-900">${product.price}</span>
                    </div>
                    <button type="button" onClick={(e) => {
                      e.preventDefault();
                      const cart = JSON.parse(localStorage.getItem('ng_cart') || '[]');
                      const idx = cart.findIndex(i => i.id === product.id);
                      if (idx >= 0) cart[idx].qty += 1; else cart.push({ ...product, qty: 1 });
                      localStorage.setItem('ng_cart', JSON.stringify(cart));
                      window.dispatchEvent(new Event('cartUpdated'));
                    }} className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 hover:scale-105 transition-all shadow-md z-20">
                      <ShoppingCart size={16} fill="currentColor" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Wishlist;
