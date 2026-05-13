import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';

const faqs = [
  { q: 'How do I place an order?', a: 'Browse products, add items to cart, proceed to checkout, fill in your address and payment details, then confirm your order. You will receive a confirmation email immediately.' },
  { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD), Credit/Debit Cards (Visa, MasterCard), and bank transfers. All online payments are 100% secure and encrypted.' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3–5 business days within Pakistan. Express delivery (1–2 days) is available in major cities for an additional fee.' },
  { q: 'Can I return a product?', a: 'Yes! We offer a 30-day hassle-free return policy. Products must be unused, in original packaging. Contact support to initiate a return.' },
  { q: 'How do I track my order?', a: 'Visit the "Track Order" page and enter your Order ID (found in your confirmation email). You will see real-time delivery status updates.' },
  { q: 'How do I become a vendor/seller?', a: 'Click "Become a Seller" in the navigation, register as a vendor, submit your business details, and our team will review your application within 24 hours.' },
  { q: 'Is my personal information safe?', a: 'Absolutely. We use industry-standard SSL encryption and never share your personal data with third parties. Read our Privacy Policy for full details.' },
  { q: 'What if I receive a damaged item?', a: 'Contact our support team within 48 hours of delivery with photos of the damage. We will arrange a free replacement or full refund immediately.' },
];

const FAQ = () => {
  const { activeTheme } = useTheme();
  const p = themes[activeTheme] || themes.green;
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1">
          <Link to="/" className="hover:text-gray-900">Home</Link><span>/</span>
          <span style={{ color: p.primary }} className="font-bold">FAQ</span>
        </nav>
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: p.primaryLight }}>
            <HelpCircle size={32} style={{ color: p.primary }} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Frequently Asked Questions</h1>
          <p className="text-gray-500">Can't find what you're looking for? <Link to="/contact" style={{ color: p.primary }} className="font-bold hover:underline">Contact us</Link></p>
        </div>

        <div className="relative mb-8">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search FAQs..."
            className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none shadow-sm" />
        </div>

        <div className="space-y-3">
          {filtered.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <span className="font-bold text-gray-900 text-sm">{faq.q}</span>
                {open === i ? <ChevronUp size={18} style={{ color: p.primary }} className="shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-8 text-gray-400 font-medium">No results found for "{search}"</div>}
        </div>

        <div className="mt-12 text-center p-8 rounded-2xl" style={{ background: p.primaryLight }}>
          <h3 className="font-black text-gray-900 text-xl mb-2">Still have questions?</h3>
          <p className="text-gray-500 mb-4">Our support team is available 24/7 to help you.</p>
          <Link to="/contact" className="inline-block px-8 py-3 text-white font-black rounded-xl shadow-lg" style={{ background: p.primary }}>
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
