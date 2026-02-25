import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Building2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import logoDark from '../../assets/Next Gen Smart Store (Dark ).png';
import { authAPI } from '../../services/api';

const SellerRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ storeName: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        setLoading(true);
        try {
            // Step 1: Send OTP — account created only after verification
            await authAPI.sendOTP({
                email: formData.email.trim().toLowerCase(),
                purpose: 'register',
            });
            navigate('/verify-otp', {
                state: {
                    email: formData.email.trim().toLowerCase(),
                    purpose: 'register',
                    role: 'seller',
                    formData: {
                        username: formData.storeName,
                        email: formData.email.trim().toLowerCase(),
                        password: formData.password,
                        role: 'VENDOR',
                    },
                }
            });
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.detail ||
                err.response?.data?.email?.[0] ||
                'Registration failed. Please try again.'
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

            <div className="text-center mb-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
                    Create Seller Account
                </h2>
                <p className="mt-1 text-sm text-text-sub">Start selling on NextGen Smart Store</p>
            </div>

            <div className="bg-white py-6 px-5 sm:px-8 shadow-lg rounded-2xl border border-gray-100">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 border border-red-200 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                            <span className="text-xs font-medium text-red-600">{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1.5">Store / User Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building2 className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text" name="storeName" required
                                value={formData.storeName} onChange={handleChange}
                                className="block w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm font-medium placeholder-gray-400"
                                placeholder="Your store or brand name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1.5">Business Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="email" name="email" required
                                value={formData.email} onChange={handleChange}
                                className="block w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm font-medium placeholder-gray-400"
                                placeholder="business@email.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-brand-dark mb-1.5">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'} name="password" required
                                    value={formData.password} onChange={handleChange}
                                    className="block w-full pl-9 pr-9 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm font-medium placeholder-gray-400"
                                    placeholder="Min 8 chars"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-brand-dark mb-1.5">Confirm PW</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type={showConfirm ? 'text' : 'password'} name="confirmPassword" required
                                    value={formData.confirmPassword} onChange={handleChange}
                                    className="block w-full pl-9 pr-9 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm font-medium placeholder-gray-400"
                                    placeholder="Repeat password"
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    {showConfirm ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
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
                        ) : 'Create Seller Account'}
                    </button>
                </form>

                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <p className="text-sm text-text-sub">
                        Already have a seller account?{' '}
                        <Link to="/seller/login" className="font-semibold text-brand hover:text-brand-dark transition-colors">
                            Login as Seller →
                        </Link>
                    </p>
                    <p className="mt-2 text-xs text-gray-400">© 2026 NextGen Smart Store. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default SellerRegister;
