import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, CheckCircle } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';

const Contact = () => {
  const { activeTheme } = useTheme();
  const p = themes[activeTheme] || themes.green;
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="py-16 text-center" style={{ background: p.primaryLight }}>
        <nav className="text-xs text-gray-500 mb-4 flex items-center justify-center gap-1">
          <Link to="/" className="hover:text-gray-900">Home</Link><span>/</span>
          <span style={{ color: p.primary }} className="font-bold">Contact Us</span>
        </nav>
        <h1 className="text-4xl font-black text-gray-900 mb-2">Get in Touch</h1>
        <p className="text-gray-500">We're here to help. Reach out anytime!</p>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Cards */}
          <div className="space-y-4">
            {[
              { icon: Phone, title: 'Phone', val: '+92 300 1234567', sub: 'Mon–Sat, 9am–6pm' },
              { icon: Mail, title: 'Email', val: 'support@nextgenstore.pk', sub: 'Reply within 24 hours' },
              { icon: MapPin, title: 'Office', val: 'Lahore, Pakistan', sub: 'DHA Phase 5, Lahore' },
              { icon: Clock, title: 'Working Hours', val: 'Mon–Sat', sub: '9:00 AM – 6:00 PM PKT' },
            ].map(({ icon: Icon, title, val, sub }, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: p.primaryLight }}>
                  <Icon size={22} style={{ color: p.primary }} />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm">{title}</p>
                  <p className="text-sm text-gray-700 font-semibold">{val}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ background: p.primary }}>
                  <CheckCircle size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Message Sent! 🎉</h3>
                <p className="text-gray-500">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 px-6 py-2 font-bold rounded-xl border-2" style={{ borderColor: p.primary, color: p.primary }}>Send Another</button>
              </div>
            ) : (
              <>
                <h2 className="font-black text-gray-900 text-2xl mb-2 flex items-center gap-2"><MessageCircle size={24} style={{ color: p.primary }} /> Send us a Message</h2>
                <p className="text-gray-500 text-sm mb-8">Fill out the form below and we'll respond as soon as possible.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    {[['name', 'Your Name', 'text'], ['email', 'Email Address', 'email']].map(([name, label, type]) => (
                      <div key={name}>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1.5">{label}</label>
                        <input required type={type} value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                          placeholder={label} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none transition-all"
                          onFocus={e => e.target.style.borderColor = p.primary} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1.5">Subject</label>
                    <input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      placeholder="How can we help?" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
                      onFocus={e => e.target.style.borderColor = p.primary} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1.5">Message</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Describe your issue or question in detail..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none"
                      onFocus={e => e.target.style.borderColor = p.primary} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </div>
                  <button type="submit" className="w-full py-3.5 text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all hover:-translate-y-0.5" style={{ background: p.primary }}>
                    <Send size={18} /> Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
