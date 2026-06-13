import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-800">
      {/* Hero */}
      <div className="py-16 text-center bg-white border-b border-gray-150 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
        <nav className="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-4 flex items-center justify-center gap-2 relative z-10">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="text-emerald-600 font-bold">Contact Us</span>
        </nav>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2 relative z-10">Get in Touch</h1>
        <p className="text-gray-500 relative z-10">We're here to help. Reach out anytime!</p>
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
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-150 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-emerald-55 border border-emerald-100 text-emerald-600">
                   <Icon size={22} />
                 </div>
                 <div>
                   <p className="font-black text-gray-900 text-sm">{title}</p>
                   <p className="text-sm text-gray-755 font-semibold">{val}</p>
                   <p className="text-xs text-gray-400">{sub}</p>
                 </div>
              </div>
            ))}
            {/* Map Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-150 overflow-hidden">
              <p className="font-black text-gray-900 text-sm mb-3">Our Location</p>
              <div className="rounded-xl overflow-hidden h-[180px] border border-gray-100 relative">
                <iframe 
                  title="NextGen Store Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.7753237199465!2d74.3813955!3d31.4746205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919060ab5083f25%3A0xe9ab2c0022f42a78!2sDHA%20Phase%205%2C%20Lahore%2C%20Pakistan!5e0!3m2!1sen!2s!4v1718300000000!5m2!1sen!2s" 
                  className="absolute inset-0 w-full h-full border-0" 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-150">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg bg-emerald-500 text-white">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Message Sent! 🎉</h3>
                <p className="text-gray-500">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 px-6 py-2 font-bold rounded-xl border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 transition-colors">Send Another</button>
              </div>
            ) : (
              <>
                <h2 className="font-black text-gray-900 text-2xl mb-2 flex items-center gap-2"><MessageCircle size={24} className="text-emerald-600" /> Send us a Message</h2>
                <p className="text-gray-500 text-sm mb-8">Fill out the form below and we'll respond as soon as possible.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[['name', 'Your Name', 'text'], ['email', 'Email Address', 'email']].map(([name, label, type]) => (
                      <div key={name}>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1.5">{label}</label>
                        <input required type={type} value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                          placeholder={label} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1.5">Subject</label>
                    <input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      placeholder="How can we help?" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1.5">Message</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Describe your issue or question in detail..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors resize-none" />
                  </div>
                  <button type="submit" className="w-full py-3.5 text-white bg-emerald-500 hover:bg-emerald-600 font-black rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:-translate-y-0.5 shadow-emerald-500/15">
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
