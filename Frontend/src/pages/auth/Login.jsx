import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, UserCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import logoDark from '../../assets/Next Gen Smart Store (Dark ).png';
import { authAPI } from '../../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const welcomeText = 'Sign in to your NextGen account';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await authAPI.login({ username: formData.username, password: formData.password });
            const { access, refresh, user } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            if (user) localStorage.setItem('user', JSON.stringify(user));
            // Redirect based on role
            const role = user?.role?.toUpperCase();
            if (role === 'ADMIN' || role === 'SUPERADMIN') navigate('/admin/dashboard');
            else if (role === 'VENDOR' || role === 'SELLER') navigate('/vendor/dashboard');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Header */}
            <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                    <img src={logoDark} alt="NextGen Logo" className="h-20 w-auto object-contain" />
                </div>
                <h2 className="text-display font-bold text-brand-dark tracking-tight">
                    Welcome Back
                </h2>
                <p className="mt-2 text-body text-text-sub font-medium">
                    {welcomeText}
                </p>
            </div>

            {/* Main Card */}
            <div className="sm:mx-auto sm:w-full sm:max-w-[480px] relative z-10">
                <div className="bg-white py-10 px-8 shadow-effect-6 rounded-card border border-white/60 backdrop-blur-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-lg bg-functional-error/5 p-4 border border-functional-error/10 flex items-center gap-3 animate-pulse">
                                <AlertCircle className="h-5 w-5 text-functional-error" />
                                <span className="text-sm font-medium text-functional-error">{error}</span>
                            </div>
                        )}

                        <div className="group">
                            <label className="block text-caption font-bold text-brand-dark mb-1.5 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <UserCircle2 className="h-5 w-5 text-gray-400 group-focus-within:text-brand transition-colors" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="email"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-bg-page/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-body font-medium placeholder-gray-400"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <div className="flex items-center justify-between mb-1.5 ml-1">
                                <label className="block text-caption font-bold text-brand-dark">Password</label>
                                <Link to="/forgot-password" state={{ role: 'customer' }} className="text-xs font-medium text-brand hover:text-brand-dark">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-brand transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-11 pr-11 py-3.5 bg-bg-page/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-body font-medium placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-effect-3 text-btn font-bold text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-brand/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-text-sub font-medium">New to NextGen?</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link
                                to="/register"
                                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-text-sub hover:bg-gray-50 hover:text-brand-dark transition-colors"
                            >
                                Create Customer Account
                            </Link>
                        </div>

                        {/* Copyright Inside Card */}
                        <p className="mt-6 text-center text-xs text-text-sub/40">
                            © 2026 NextGen Smart Store. Secure Access System.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
