import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';

const ReturnPolicy = () => {
  const { activeTheme } = useTheme();
  const p = themes[activeTheme] || themes.green;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1">
          <Link to="/" className="hover:text-gray-900">Home</Link><span>/</span>
          <span style={{ color: p.primary }} className="font-bold">Return Policy</span>
        </nav>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: p.primaryLight }}>
              <RefreshCw size={24} style={{ color: p.primary }} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Return & Refund Policy</h1>
              <p className="text-xs text-gray-400">30-day hassle-free returns</p>
            </div>
          </div>

          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Clock, title: '30 Days', sub: 'Return window', color: p.primaryLight, tc: p.primary },
              { icon: CheckCircle, title: 'Free Returns', sub: 'No restocking fee', color: '#dcfce7', tc: '#16a34a' },
              { icon: RefreshCw, title: '5–7 Days', sub: 'Refund processing', color: '#dbeafe', tc: '#2563eb' },
            ].map(({ icon: Icon, title, sub, color, tc }, i) => (
              <div key={i} className="rounded-xl p-4 text-center" style={{ background: color }}>
                <Icon size={24} className="mx-auto mb-2" style={{ color: tc }} />
                <p className="font-black text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6 text-sm text-gray-600">
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-3">Eligible for Return</h2>
              {['Item received in damaged or defective condition', 'Wrong item delivered', 'Item not matching product description', 'Unopened items within 30 days of delivery'].map((i, idx) => (
                <div key={idx} className="flex items-start gap-2 mb-2">
                  <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <span>{i}</span>
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-3">Not Eligible for Return</h2>
              {['Items that have been used or worn', 'Items without original packaging', 'Perishable goods or digital products', 'Items purchased on final sale'].map((i, idx) => (
                <div key={idx} className="flex items-start gap-2 mb-2">
                  <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span>{i}</span>
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-3">How to Return</h2>
              {[
                ['Step 1', 'Contact our support team within 30 days of delivery'],
                ['Step 2', 'Provide your order ID, item details, and reason for return'],
                ['Step 3', 'We will send you a prepaid return shipping label'],
                ['Step 4', 'Pack the item securely and drop it off at any courier'],
                ['Step 5', 'Refund processed within 5–7 business days after we receive it'],
              ].map(([step, desc], idx) => (
                <div key={idx} className="flex items-start gap-3 mb-3">
                  <span className="shrink-0 w-16 font-black text-xs" style={{ color: p.primary }}>{step}:</span>
                  <span>{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl text-center" style={{ background: p.primaryLight }}>
            <p className="font-black text-gray-900 mb-2">Need help with a return?</p>
            <Link to="/contact" className="font-bold text-sm" style={{ color: p.primary }}>Contact Support →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
