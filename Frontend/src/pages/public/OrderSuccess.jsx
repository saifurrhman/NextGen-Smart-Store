import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, MapPin, ArrowRight } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';

const OrderSuccess = () => {
  const { activeTheme } = useTheme();
  const p = themes[activeTheme] || themes.green;
  const orderId = `NG${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl" style={{ background: p.primary }}>
          <CheckCircle size={48} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Order Placed! 🎉</h1>
        <p className="text-gray-500 mb-6">Your order has been confirmed and will be delivered soon.</p>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8 text-left space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Order ID</span>
            <span className="font-black text-sm" style={{ color: p.primary }}>#{orderId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Estimated Delivery</span>
            <span className="font-bold text-sm text-gray-900">3–5 Business Days</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Payment</span>
            <span className="font-bold text-sm text-green-600">Confirmed ✓</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Link to="/order-tracking" className="w-full py-3 font-black text-white rounded-xl flex items-center justify-center gap-2" style={{ background: p.primary }}>
            <MapPin size={18} /> Track My Order
          </Link>
          <Link to="/products" className="w-full py-3 font-black text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 flex items-center justify-center gap-2 transition-all">
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
