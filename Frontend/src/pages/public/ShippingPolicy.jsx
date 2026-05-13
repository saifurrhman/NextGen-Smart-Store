import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clock, Package, MapPin } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';

const ShippingPolicy = () => {
  const { activeTheme } = useTheme();
  const p = themes[activeTheme] || themes.green;

  const methods = [
    { name: 'Standard Delivery', time: '3–5 Business Days', price: '$5.99', free: 'Free on orders over $50', icon: '🚚' },
    { name: 'Express Delivery', time: '1–2 Business Days', price: '$12.99', free: 'Available in major cities', icon: '⚡' },
    { name: 'Same Day Delivery', time: 'Order before 12 PM', price: '$19.99', free: 'Lahore, Karachi, Islamabad only', icon: '🏃' },
    { name: 'International', time: '7–14 Business Days', price: 'Varies', free: 'Calculated at checkout', icon: '✈️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1">
          <Link to="/" className="hover:text-gray-900">Home</Link><span>/</span>
          <span style={{ color: p.primary }} className="font-bold">Shipping Policy</span>
        </nav>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: p.primaryLight }}>
              <Truck size={24} style={{ color: p.primary }} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Shipping Policy</h1>
              <p className="text-xs text-gray-400">Fast, reliable delivery across Pakistan</p>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            {methods.map((m, i) => (
              <div key={i} className="flex items-center gap-5 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
                <span className="text-3xl">{m.icon}</span>
                <div className="flex-1">
                  <h3 className="font-black text-gray-900">{m.name}</h3>
                  <p className="text-sm text-gray-500">{m.free}</p>
                </div>
                <div className="text-right">
                  <p className="font-black" style={{ color: p.primary }}>{m.price}</p>
                  <p className="text-xs text-gray-400">{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6 text-sm text-gray-600">
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-3">Processing Time</h2>
              <p>Orders are typically processed within 24–48 hours after payment confirmation. Orders placed on weekends or public holidays will be processed on the next business day.</p>
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-3">Order Tracking</h2>
              <p>Once your order is shipped, you will receive an email with a tracking number. You can track your order in real-time on our <Link to="/order-tracking" style={{ color: p.primary }} className="font-bold hover:underline">Order Tracking</Link> page.</p>
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-3">Delivery Areas</h2>
              <p>We deliver to all major cities in Pakistan including Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, and 500+ other cities. International shipping is available to select countries.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
