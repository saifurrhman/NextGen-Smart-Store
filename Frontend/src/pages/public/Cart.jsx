import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, Tag, Package, AlertTriangle, ShieldCheck } from 'lucide-react';

const getMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
};

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('ng_cart') || '[]'));
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');

  const updateCart = (updated) => {
    setCart(updated);
    localStorage.setItem('ng_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQty = (idOrCartId, delta) => {
    const updated = cart.map(i => (i.cartId || i.id) === idOrCartId ? { ...i, qty: Math.max(1, i.qty + delta) } : i);
    updateCart(updated);
  };

  const removeItem = (idOrCartId) => {
    updateCart(cart.filter(i => (i.cartId || i.id) !== idOrCartId));
  };

  const subtotal = cart.reduce((s, i) => s + parseFloat(i.price) * i.qty, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'NEXTGEN10') { setDiscount(subtotal * 0.1); setCouponMsg('✅ 10% discount applied!'); }
    else if (coupon.toUpperCase() === 'FLASH20') { setDiscount(subtotal * 0.2); setCouponMsg('✅ 20% discount applied!'); }
    else { setDiscount(0); setCouponMsg('❌ Invalid coupon code.'); }
  };

  if (cart.length === 0) return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="text-center relative z-10 p-12 bg-white rounded-[3rem] shadow-sm border border-gray-150 max-w-lg w-full mx-4">
        <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 relative bg-gray-50 border border-gray-150 shadow-inner">
            <div className="absolute inset-0 rounded-full animate-ping opacity-10 bg-emerald-500" />
            <ShoppingCart size={40} className="text-gray-400 relative z-10" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 leading-relaxed font-medium">Looks like you haven't added anything to your cart yet. Discover our premium collection today.</p>
        <Link to="/products" className="group px-8 py-4 bg-emerald-500 text-white font-black rounded-2xl inline-flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:bg-emerald-600 hover:scale-105 transition-all">
          Start Shopping <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9fafb] py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      
      <div className="container mx-auto px-4 relative z-10 max-w-6xl pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
                <nav className="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-4 flex items-center gap-2">
                  <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-emerald-600">Shopping Cart</span>
                </nav>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                    Review Cart
                </h1>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 px-5 py-2.5 rounded-xl shadow-sm inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-emerald-600">{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* ── CART ITEMS ── */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {cart.map(item => {
              const img = getMediaUrl(item.image);
              return (
                <div key={item.cartId || item.id} className="group bg-white rounded-[2rem] p-4 pr-6 border border-gray-150 hover:border-gray-250 shadow-sm transition-all duration-300 flex flex-col sm:flex-row gap-6">
                  
                  {/* Image */}
                  <div className="w-full sm:w-40 h-40 rounded-[1.5rem] overflow-hidden shrink-0 bg-gray-50 relative border border-gray-150 flex items-center justify-center">
                    {img ? (
                        <img src={img} alt={item.title} className="w-full h-full object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform duration-500 p-2" />
                    ) : (
                        <Package size={32} className="text-gray-400" />
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center py-2">
                    <div className="flex justify-between items-start gap-4 mb-2">
                        <Link to={`/products/${item.id}`} className="font-bold text-gray-850 text-lg hover:text-emerald-600 transition-colors line-clamp-2">
                            {item.title}
                        </Link>
                        <button onClick={() => removeItem(item.cartId || item.id)} className="shrink-0 w-10 h-10 flex items-center justify-center text-gray-500 bg-white border border-gray-200 hover:border-red-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-md">
                            <Trash2 size={16} />
                        </button>
                    </div>

                    {(item.color || item.size) && (
                      <div className="flex items-center gap-3 mb-4">
                        {item.color && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg text-xs font-bold text-gray-550 border border-gray-200">
                                {item.color.startsWith('#') ? <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} /> : null}
                                {item.color}
                            </span>
                        )}
                        {item.size && (
                            <span className="inline-flex items-center px-3 py-1 bg-gray-50 rounded-lg text-xs font-black text-gray-550 border border-gray-200 uppercase tracking-wide">
                                Size: {item.size}
                            </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-150">
                      <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1 shadow-inner">
                        <button onClick={() => updateQty(item.cartId || item.id, -1)} className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 transition-all active:scale-95"><Minus size={14} /></button>
                        <span className="w-10 text-center font-black text-sm text-gray-800">{item.qty}</span>
                        <button onClick={() => updateQty(item.cartId || item.id, 1)} className="w-10 h-10 rounded-lg flex items-center justify-center text-white bg-emerald-500 transition-all hover:bg-emerald-600 active:scale-95 shadow-md"><Plus size={14} /></button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total</p>
                        <p className="font-black text-2xl text-gray-900">${(parseFloat(item.price) * item.qty).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 space-y-6">
                
                {/* Coupon */}
                <div className="bg-white rounded-[2rem] p-6 border border-gray-150 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                    <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-widest"><Tag size={16} className="text-emerald-600" /> Discount Code</h3>
                    <div className="flex gap-2">
                        <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="e.g. NEXTGEN10"
                        className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-200 text-gray-850 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all shadow-inner placeholder-gray-400" />
                        <button onClick={applyCoupon} className="px-6 py-3.5 text-white bg-emerald-500 hover:bg-emerald-600 font-black rounded-xl text-sm transition-all active:scale-95 shadow-md">Apply</button>
                    </div>
                    {couponMsg && <p className={`text-xs mt-3 font-bold ${couponMsg.includes('✅') ? 'text-emerald-650' : 'text-red-500'}`}>{couponMsg}</p>}
                </div>

                {/* Summary Receipt */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm relative overflow-hidden border border-gray-150">
                    <h3 className="font-black text-gray-900 text-xl mb-6 flex items-center gap-2 tracking-tight">Order Summary</h3>
                    
                    <div className="space-y-4 text-sm font-bold border-b border-gray-100 pb-6 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Subtotal</span>
                            <span className="text-gray-800">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Shipping Estimate</span>
                            <span className={`font-black ${shipping === 0 ? 'text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100' : 'text-gray-850'}`}>
                                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                            </span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between items-center text-emerald-600">
                                <span>Discount Applied</span>
                                <span className="font-black">-${discount.toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Total Amount</span>
                        </div>
                        <span className="font-black text-4xl leading-none text-gray-900">${total.toFixed(2)}</span>
                    </div>

                    <button onClick={() => navigate('/checkout')} className="group w-full py-4 bg-emerald-500 text-white hover:bg-emerald-600 font-black rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all hover:scale-[1.02] active:scale-95">
                        Proceed to Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                        <ShieldCheck size={14} className="text-emerald-600" /> Secure 256-bit SSL checkout
                    </div>
                </div>

                {subtotal < 50 && (
                    <div className="flex items-start gap-4 bg-amber-50 border border-amber-100 rounded-2xl p-5 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200">
                            <AlertTriangle size={18} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-900 font-black mb-1">Almost there for Free Shipping!</p>
                            <p className="text-xs text-gray-600 font-medium leading-relaxed">Add <strong className="text-amber-700">${(50 - subtotal).toFixed(2)}</strong> more to your cart to unlock <strong className="text-gray-950 font-bold">FREE</strong> shipping.</p>
                        </div>
                    </div>
                )}
                
                <div className="text-center pt-2">
                    <Link to="/products" className="inline-block text-xs font-black text-gray-500 hover:text-emerald-600 transition-colors uppercase tracking-widest">← Continue Shopping</Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
