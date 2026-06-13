import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
  { q: 'How do I place an order?', a: 'Browse products, add items to cart, proceed to checkout, fill in your address and payment details, then confirm your order. You will receive a confirmation email immediately.' },
  { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD), Credit/Debit Cards (Visa, MasterCard), and bank transfers. All online payments are 100% secure and encrypted.' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3–5 business days within Pakistan. Express delivery (1–2 days) is available in major cities for an additional fee.' },
  { q: 'Do you ship internationally?', a: 'We currently ship within Pakistan only. We deliver to all major cities, towns, and regions nationwide with reliable courier partners.' },
  { q: 'Can I return a product?', a: 'Yes! We offer a 30-day hassle-free return policy. Products must be unused, in original packaging. Contact support to initiate a return.' },
  { q: 'How do I track my order?', a: 'Visit the "Track Order" page and enter your Order ID (found in your confirmation email). You will see real-time delivery status updates.' },
  { q: 'How do I become a vendor/seller?', a: 'Click "Become a Seller" in the navigation, register as a vendor, submit your business details, and our team will review your application within 24 hours.' },
  { q: 'Is my personal information safe?', a: 'Absolutely. We use industry-standard SSL encryption and never share your personal data with third parties. Read our Privacy Policy for full details.' },
  { q: 'What if I receive a damaged item?', a: 'Contact our support team within 48 hours of delivery with photos of the damage. We will arrange a free replacement or full refund immediately.' },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#f9fafb] py-12 text-gray-800">
      <div className="container mx-auto px-4 max-w-3xl">
        <nav className="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="text-emerald-600 font-bold">FAQ</span>
        </nav>
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-emerald-50 text-emerald-600 shadow-inner">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">Frequently Asked Questions</h1>
          <p className="text-gray-500">Can't find what you're looking for? <Link to="/contact" className="text-emerald-600 font-bold hover:underline ml-1">Contact us</Link></p>
        </div>

        <div className="relative mb-8">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search FAQs..."
            className="w-full px-5 py-3.5 bg-white border border-gray-250 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner" />
        </div>

        <div className="space-y-3">
          {filtered.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <span className="font-bold text-gray-850 text-sm">{faq.q}</span>
                {open === i ? <ChevronUp size={18} className="text-emerald-600 shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-gray-650 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-8 text-gray-500 font-medium">No results found for "{search}"</div>}
        </div>

        <div className="mt-12 text-center p-8 rounded-2xl bg-white border border-gray-150">
          <h3 className="font-black text-gray-900 text-xl mb-2">Still have questions?</h3>
          <p className="text-gray-500 mb-4">Our support team is available 24/7 to help you.</p>
          <Link to="/contact" className="inline-block px-8 py-3 text-white bg-emerald-500 hover:bg-emerald-600 font-black rounded-xl shadow-md transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
