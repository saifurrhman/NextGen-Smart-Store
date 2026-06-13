import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Zap, Award, ShoppingBag, Globe } from 'lucide-react';

const About = () => {
  const stats = [
    { val: '50K+', label: 'Happy Customers' },
    { val: '2K+', label: 'Products Listed' },
    { val: '500+', label: 'Active Vendors' },
    { val: '99.9%', label: 'Uptime' },
  ];

  const team = [
    { name: 'Saif Ur Rehman', role: 'Full Stack Developer & Project Lead', img: 'https://ui-avatars.com/api/?name=Saif+Ur+Rehman&background=22c55e&color=fff&size=200' },
    { name: 'Project Supervisor', role: 'Faculty Supervisor', img: 'https://ui-avatars.com/api/?name=Supervisor&background=3b82f6&color=fff&size=200' },
    { name: 'NextGen Team', role: 'Development Team', img: 'https://ui-avatars.com/api/?name=NextGen&background=8b5cf6&color=fff&size=200' },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-800">
      {/* Hero */}
      <div className="py-20 text-center relative overflow-hidden bg-white border-b border-gray-150">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative container mx-auto px-4">
          <span className="inline-block px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-black uppercase tracking-wider text-emerald-600 mb-4">🏪 Our Story</span>
          <h1 className="text-5xl font-black text-gray-900 mb-4">About NextGen Store</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">Pakistan's most innovative e-commerce platform, built as a Final Year Project to demonstrate the future of B2B and B2C commerce with AI and AR technology.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-12 border-b border-gray-150">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-black mb-1 text-emerald-600">{s.val}</p>
              <p className="text-sm text-gray-550 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="py-16 container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Target, title: 'Our Mission', desc: 'To democratize e-commerce in Pakistan by providing vendors and customers with powerful, easy-to-use tools for buying and selling online.' },
            { icon: Zap, title: 'Our Vision', desc: 'To become Pakistan\'s #1 B2B+B2C platform by leveraging AI, AR technology, and seamless UX to transform how people shop.' },
            { icon: Award, title: 'Our Values', desc: 'Transparency, innovation, customer-first thinking, and empowering local businesses to grow through technology.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-emerald-55 border border-emerald-100 text-emerald-600">
                <Icon size={26} />
              </div>
              <h3 className="font-black text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* About Content */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-150 mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-4">What is NextGen Smart Store?</h2>
          <div className="text-gray-655 leading-relaxed space-y-4 text-sm">
            <p>NextGen Smart Store is a comprehensive e-commerce ecosystem designed as a Final Year Project (FYP) for Computer Science. It combines a beautiful public-facing store with a powerful admin panel, vendor management system, and advanced analytics.</p>
            <p>The platform supports both <strong>B2C (Business-to-Consumer)</strong> transactions where regular customers shop online, and <strong>B2B (Business-to-Business)</strong> wholesale ordering where vendors can place bulk orders directly from the admin catalog.</p>
            <p>Built with modern technologies including React.js, Django REST Framework, and MongoDB, the platform includes 20+ modules covering products, orders, finance, marketing, support, AI automation, and more.</p>
          </div>
        </div>

        {/* Team */}
        <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Meet the Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 text-center">
              <img src={member.img} alt={member.name} className="w-20 h-20 rounded-full mx-auto mb-4 shadow-lg object-cover" />
              <h3 className="font-black text-gray-900">{member.name}</h3>
              <p className="text-sm font-semibold text-emerald-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 text-center bg-white border-t border-gray-150 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-gradient-to-tr from-emerald-500/10 to-transparent pointer-events-none" />
        <h2 className="text-3xl font-black text-gray-900 mb-4">Ready to Start Shopping?</h2>
        <p className="text-gray-500 mb-8">Join thousands of satisfied customers on NextGen Store.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/products" className="px-8 py-3.5 text-white bg-emerald-500 hover:bg-emerald-600 font-black rounded-xl shadow-md transition-colors">Browse Products</Link>
          <Link to="/vendor/register" className="px-8 py-3.5 font-black rounded-xl border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-55 transition-colors">Become a Seller</Link>
        </div>
      </div>
    </div>
  );
};

export default About;
