import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Zap, Award, ShoppingBag, Globe } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';

const About = () => {
  const { activeTheme } = useTheme();
  const p = themes[activeTheme] || themes.green;

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="py-20 text-center relative overflow-hidden" style={{ background: p.primaryLight }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, black 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative container mx-auto px-4">
          <span className="inline-block px-4 py-1.5 bg-white rounded-full text-xs font-black uppercase tracking-wider shadow-sm mb-4" style={{ color: p.primary }}>🏪 Our Story</span>
          <h1 className="text-5xl font-black text-gray-900 mb-4">About NextGen Store</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">Pakistan's most innovative e-commerce platform, built as a Final Year Project to demonstrate the future of B2B and B2C commerce with AI and AR technology.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-black mb-1" style={{ color: p.primary }}>{s.val}</p>
              <p className="text-sm text-gray-500 font-semibold">{s.label}</p>
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
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: p.primaryLight }}>
                <Icon size={26} style={{ color: p.primary }} />
              </div>
              <h3 className="font-black text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* About Content */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-4">What is NextGen Smart Store?</h2>
          <div className="text-gray-600 leading-relaxed space-y-4 text-sm">
            <p>NextGen Smart Store is a comprehensive e-commerce ecosystem designed as a Final Year Project (FYP) for Computer Science. It combines a beautiful public-facing store with a powerful admin panel, vendor management system, and advanced analytics.</p>
            <p>The platform supports both <strong>B2C (Business-to-Consumer)</strong> transactions where regular customers shop online, and <strong>B2B (Business-to-Business)</strong> wholesale ordering where vendors can place bulk orders directly from the admin catalog.</p>
            <p>Built with modern technologies including React.js, Django REST Framework, and MongoDB, the platform includes 20+ modules covering products, orders, finance, marketing, support, AI automation, and more.</p>
          </div>
        </div>

        {/* Team */}
        <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Meet the Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <img src={member.img} alt={member.name} className="w-20 h-20 rounded-full mx-auto mb-4 shadow-lg" />
              <h3 className="font-black text-gray-900">{member.name}</h3>
              <p className="text-sm font-medium" style={{ color: p.primary }}>{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 text-center" style={{ background: p.primaryLight }}>
        <h2 className="text-3xl font-black text-gray-900 mb-4">Ready to Start Shopping?</h2>
        <p className="text-gray-500 mb-8">Join thousands of satisfied customers on NextGen Store.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/products" className="px-8 py-3.5 text-white font-black rounded-xl shadow-lg" style={{ background: p.primary }}>Browse Products</Link>
          <Link to="/vendor/register" className="px-8 py-3.5 font-black rounded-xl border-2" style={{ borderColor: p.primary, color: p.primary }}>Become a Seller</Link>
        </div>
      </div>
    </div>
  );
};

export default About;
