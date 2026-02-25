import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import logoDark from '../../assets/Next Gen Smart Store (Dark ).png';
import { authAPI } from '../../services/api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const role = location.state?.role || 'customer';

    const loginUrl = { admin: '/admin/login', seller: '/seller/login', customer: '/login' };
    const loginLink = loginUrl[role] || '/login';

    const roleBadgeMap = { admin: '🔐 Admin Portal', seller: '🏪 Seller Portal', customer: '👤 Customer' };

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authAPI.sendOTP({ email: email.trim().toLowerCase(), purpose: 'password_reset' });
            navigate('/verify-otp', {
                state: { email: email.trim().toLowerCase(), purpose: 'password_reset', role }
            });
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.detail ||
                'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-center mb-4">
                <img src={logoDark} alt="NextGen Smart Store" className="h-32 w-auto object-contain" />
            </div>

            {/* Role Badge */}
            <div className="flex justify-center mb-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand/10 text-brand border border-brand/20">
                    {roleBadgeMap[role] || '👤 Customer'}
                </span>
            </div>

            <div className="text-center mb-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
                    Forgot Password?
                </h2>
                <p className="mt-1 text-sm text-text-sub">
                    Enter your email — we'll send a 6-digit code instantly.
                </p>
            </div>

            <div className="bg-white py-6 px-5 sm:px-8 shadow-lg rounded-2xl border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 border border-red-200 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                            <span className="text-xs font-medium text-red-600">{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1.5">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                className="block w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm font-medium placeholder-gray-400"
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-brand/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Sending Code...
                            </span>
                        ) : 'Send Verification Code'}
                    </button>
                </form>

                <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                    <Link
                        to={loginLink}
                        className="text-sm font-medium text-brand hover:text-brand-dark transition-colors flex items-center justify-center gap-1.5"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
