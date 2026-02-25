import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import logoDark from '../../assets/Next Gen Smart Store (Dark ).png';
import { authAPI } from '../../services/api';

const SellerLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await authAPI.login(formData);
            const { access, refresh, user } = response.data;
            const role = user?.role?.toUpperCase();
            if (role !== 'VENDOR' && role !== 'SELLER') {
                setError('Access Denied. This portal is for Sellers only.');
                setLoading(false);
                return;
            }
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/vendor/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Logo above form */}
            <div className="flex justify-center mb-4">
                <img src={logoDark} alt="NextGen Smart Store" className="h-32 w-auto object-contain" />
            </div>

            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
                    Seller Central
                </h2>
                <p className="mt-1 text-sm text-text-sub">Manage your store, products, and orders</p>
            </div>

            {/* Form Card */}
            <div className="bg-white py-6 px-5 sm:px-8 shadow-lg rounded-2xl border border-gray-100">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 border border-red-200 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                            <span className="text-xs font-medium text-red-600">{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1.5">Username or Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-gray-400" />
                            </div>
                            <input name="username" type="email" required value={formData.username} onChange={handleChange}
                                className="block w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm font-medium placeholder-gray-400"
                                placeholder="seller@example.com" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-brand-dark">Password</label>
                            <Link to="/forgot-password" state={{ role: 'seller' }} className="text-xs font-medium text-brand hover:text-brand-dark">Forgot password?</Link>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <input name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange}
                                className="block w-full pl-9 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm font-medium placeholder-gray-400"
                                placeholder="••••••••" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand transition-colors">
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full flex items-center justify-center py-3 px-6 rounded-xl text-sm font-bold text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-brand/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Logging in...
                            </span>
                        ) : 'Login to Seller Central'}
                    </button>
                </form>

                <div className="mt-5 text-center">
                    <p className="text-sm text-text-sub">
                        New to NextGen?{' '}
                        <Link to="/seller/register" className="font-bold text-brand hover:text-brand-dark transition-colors inline-flex items-center gap-1">
                            Register as Seller <ArrowRight className="h-3 w-3" />
                        </Link>
                    </p>
                    <p className="mt-3 text-xs text-gray-400">© 2026 NextGen Smart Store. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default SellerLogin;
