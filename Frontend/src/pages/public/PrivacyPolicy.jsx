import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-black text-gray-900 mb-3">{title}</h2>
    <div className="text-gray-600 text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  const { activeTheme } = useTheme();
  const p = themes[activeTheme] || themes.green;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1">
          <Link to="/" className="hover:text-gray-900">Home</Link><span>/</span>
          <span style={{ color: p.primary }} className="font-bold">Privacy Policy</span>
        </nav>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: p.primaryLight }}>
              <Shield size={24} style={{ color: p.primary }} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Privacy Policy</h1>
              <p className="text-xs text-gray-400">Last updated: May 2026</p>
            </div>
          </div>
          <Section title="1. Information We Collect">
            <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact our support team. This includes your name, email address, phone number, and delivery address.</p>
            <p>We also automatically collect certain information about your device and how you interact with our platform, including IP addresses, browser type, pages visited, and time spent on pages (via our self-hosted analytics system).</p>
          </Section>
          <Section title="2. How We Use Your Information">
            <p>• To process and fulfill your orders</p>
            <p>• To communicate with you about your orders and account</p>
            <p>• To send promotional offers (with your consent)</p>
            <p>• To improve our platform and user experience</p>
            <p>• To detect and prevent fraud</p>
          </Section>
          <Section title="3. Information Sharing">
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our platform, conducting our business, or serving our users.</p>
          </Section>
          <Section title="4. Data Security">
            <p>We implement industry-standard security measures including SSL encryption, secure password hashing, and regular security audits to protect your personal information from unauthorized access, alteration, or disclosure.</p>
          </Section>
          <Section title="5. Cookies">
            <p>We use cookies and similar tracking technologies to enhance your experience on our platform. You can control cookie preferences through your browser settings.</p>
          </Section>
          <Section title="6. Your Rights">
            <p>You have the right to access, update, or delete your personal information at any time. Contact us at privacy@nextgenstore.pk to exercise these rights.</p>
          </Section>
          <Section title="7. Contact Us">
            <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@nextgenstore.pk" className="font-bold" style={{ color: p.primary }}>privacy@nextgenstore.pk</a>.</p>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
