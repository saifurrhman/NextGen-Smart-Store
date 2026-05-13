import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-black text-gray-900 mb-3">{title}</h2>
    <div className="text-gray-600 text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

const TermsConditions = () => {
  const { activeTheme } = useTheme();
  const p = themes[activeTheme] || themes.green;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1">
          <Link to="/" className="hover:text-gray-900">Home</Link><span>/</span>
          <span style={{ color: p.primary }} className="font-bold">Terms & Conditions</span>
        </nav>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: p.primaryLight }}>
              <FileText size={24} style={{ color: p.primary }} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Terms & Conditions</h1>
              <p className="text-xs text-gray-400">Last updated: May 2026</p>
            </div>
          </div>
          <Section title="1. Acceptance of Terms">
            <p>By accessing and using NextGen Smart Store, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform.</p>
          </Section>
          <Section title="2. User Accounts">
            <p>• You must be at least 18 years old to create an account</p>
            <p>• You are responsible for maintaining the confidentiality of your account credentials</p>
            <p>• You agree to provide accurate and complete information</p>
            <p>• We reserve the right to suspend or terminate accounts that violate these terms</p>
          </Section>
          <Section title="3. Product Listings & Orders">
            <p>All product prices are in USD unless otherwise specified. We reserve the right to modify prices at any time. Orders are confirmed only after payment verification. We reserve the right to cancel orders due to pricing errors, stock unavailability, or suspected fraud.</p>
          </Section>
          <Section title="4. Vendor Responsibilities">
            <p>Vendors must provide accurate product descriptions and images. Vendors are responsible for fulfilling orders on time. Fraudulent listings or misrepresentation will result in immediate account suspension.</p>
          </Section>
          <Section title="5. Intellectual Property">
            <p>All content on this platform, including logos, text, images, and software, is the property of NextGen Smart Store and is protected by intellectual property laws.</p>
          </Section>
          <Section title="6. Limitation of Liability">
            <p>NextGen Smart Store shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our platform or services.</p>
          </Section>
          <Section title="7. Governing Law">
            <p>These terms are governed by the laws of Pakistan. Any disputes shall be resolved in the courts of Lahore, Pakistan.</p>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
