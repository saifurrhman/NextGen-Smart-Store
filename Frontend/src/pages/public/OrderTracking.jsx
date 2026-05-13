import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, CheckCircle, Clock, Truck, MapPin, ShoppingBag, Home, ArrowRight, Loader } from 'lucide-react';

const EM = { p: '#10b981', d: '#059669', l: '#d1fae5', xl: '#ecfdf5' };

const STEPS = [
  { icon: ShoppingBag, label: 'Order Placed', sub: 'Your order has been received' },
  { icon: Package,     label: 'Processing',   sub: 'We are preparing your items' },
  { icon: Truck,       label: 'Shipped',       sub: 'On the way to your city' },
  { icon: MapPin,      label: 'Out for Delivery', sub: 'Your rider is near!' },
  { icon: Home,        label: 'Delivered',     sub: 'Enjoy your purchase 🎉' },
];

const DEMO = {
  'NG12345678': {
    status: 'Out for Delivery', customer: 'Ahmed Khan',
    date: 'May 9, 2026', estimated: 'May 10, 2026', items: 2,
    activeStep: 3,
    tracking: [
      { status:'Order Placed',      time:'May 9, 10:00 AM', done:true },
      { status:'Order Confirmed',   time:'May 9, 10:30 AM', done:true },
      { status:'Packed & Shipped',  time:'May 9, 2:00 PM',  done:true },
      { status:'Out for Delivery',  time:'May 10, 9:00 AM', done:true },
      { status:'Delivered',         time:'Expected by 6 PM',done:false },
    ],
  },
  'NG99887766': {
    status: 'Processing', customer: 'Sara Malik',
    date: 'May 11, 2026', estimated: 'May 13, 2026', items: 1,
    activeStep: 1,
    tracking: [
      { status:'Order Placed',      time:'May 11, 3:00 PM', done:true },
      { status:'Order Confirmed',   time:'May 11, 3:15 PM', done:true },
      { status:'Packed & Shipped',  time:'Scheduled',       done:false },
      { status:'Out for Delivery',  time:'–',               done:false },
      { status:'Delivered',         time:'–',               done:false },
    ],
  },
};

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setResult(DEMO[orderId.toUpperCase()] || 'not_found');
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div style={{ background: 'linear-gradient(135deg,#022c22,#064e3b,#065f46)' }} className="py-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '26px 26px' }} />
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-2xl"
            style={{ background: 'linear-gradient(135deg,#6ee7b7,#34d399)' }}>
            <Truck size={36} className="text-emerald-900" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-2">Real-Time Tracking</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Track Your Order</h1>
          <p className="text-emerald-200 text-base max-w-md mx-auto">Enter your order ID to see live delivery status and estimated arrival time.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl -mt-8 pb-20">

        {/* Search Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 mb-8">
          <p className="text-xs text-gray-400 mb-4 text-center">
            Try demo IDs:{' '}
            <button onClick={() => setOrderId('NG12345678')} className="font-black underline" style={{ color: EM.p }}>NG12345678</button>
            {' '}or{' '}
            <button onClick={() => setOrderId('NG99887766')} className="font-black underline" style={{ color: EM.p }}>NG99887766</button>
          </p>
          <form onSubmit={handleTrack} className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g. NG12345678)"
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm focus:outline-none transition-all"
                onFocus={e => e.target.style.borderColor = EM.p}
                onBlur={e => e.target.style.borderColor = '#f3f4f6'}
              />
            </div>
            <button type="submit" disabled={loading || !orderId.trim()}
              className="px-6 py-4 text-white font-black rounded-2xl disabled:opacity-50 shadow-lg flex items-center gap-2 hover:-translate-y-0.5 transition-all"
              style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
              {loading ? <Loader size={16} className="animate-spin" /> : <><Search size={16} /> Track</>}
            </button>
          </form>
        </div>

        {/* Not Found */}
        {result === 'not_found' && (
          <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-red-400" />
            </div>
            <h3 className="font-black text-red-700 text-lg mb-2">Order Not Found</h3>
            <p className="text-red-500 text-sm">Please double-check your order ID and try again. Order IDs start with "NG".</p>
          </div>
        )}

        {/* Result */}
        {result && result !== 'not_found' && (
          <div className="space-y-5">
            {/* Order Info Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-5 flex items-center justify-between" style={{ background: EM.xl }}>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Order ID</p>
                  <p className="text-xl font-black text-gray-900">{orderId.toUpperCase()}</p>
                  <p className="text-sm text-gray-500 mt-0.5">Customer: <strong>{result.customer}</strong></p>
                </div>
                <span className="px-4 py-2 text-white font-black text-sm rounded-2xl shadow-md"
                  style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                  {result.status}
                </span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-gray-100 text-center py-4">
                <div className="px-4"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Ordered</p><p className="font-black text-gray-900 text-sm">{result.date}</p></div>
                <div className="px-4"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Estimated</p><p className="font-black text-gray-900 text-sm">{result.estimated}</p></div>
                <div className="px-4"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Items</p><p className="font-black text-gray-900 text-sm">{result.items} Item{result.items > 1 ? 's' : ''}</p></div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-black text-gray-900 mb-6">Delivery Progress</h3>
              {/* Step Pills */}
              <div className="flex items-center mb-8 overflow-x-auto pb-2">
                {STEPS.map((step, i) => {
                  const done = i < result.activeStep;
                  const active = i === result.activeStep;
                  return (
                    <React.Fragment key={i}>
                      <div className="flex flex-col items-center shrink-0 min-w-[64px]">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-sm transition-all ${done || active ? 'text-white' : 'bg-gray-100 text-gray-400'}`}
                          style={done ? { background: 'linear-gradient(135deg,#10b981,#059669)' } : active ? { background: 'linear-gradient(135deg,#34d399,#10b981)', boxShadow: '0 0 0 4px #d1fae5' } : {}}>
                          {done ? <CheckCircle size={22} /> : <step.icon size={20} />}
                        </div>
                        <p className={`text-[9px] font-black text-center leading-tight ${done || active ? '' : 'text-gray-400'}`}
                          style={active ? { color: EM.p } : done ? { color: EM.d } : {}}>
                          {step.label}
                        </p>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className="flex-1 h-1 mx-1 rounded-full min-w-[12px]"
                          style={{ background: i < result.activeStep ? 'linear-gradient(90deg,#10b981,#34d399)' : '#f3f4f6' }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Timeline */}
              <div className="space-y-0">
                {result.tracking.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${step.done ? 'text-white shadow-md' : 'bg-gray-100 text-gray-300'}`}
                        style={step.done ? { background: 'linear-gradient(135deg,#10b981,#059669)' } : {}}>
                        {step.done ? <CheckCircle size={17} /> : <Clock size={17} />}
                      </div>
                      {i < result.tracking.length - 1 && (
                        <div className="w-0.5 h-10 mt-1 rounded-full"
                          style={{ background: step.done ? 'linear-gradient(180deg,#10b981,#d1fae5)' : '#f3f4f6' }} />
                      )}
                    </div>
                    <div className="pb-8">
                      <p className={`font-black text-sm ${step.done ? 'text-gray-900' : 'text-gray-300'}`}>{step.status}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 text-white font-black rounded-2xl shadow-xl hover:-translate-y-0.5 transition-all"
                style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                Continue Shopping <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
