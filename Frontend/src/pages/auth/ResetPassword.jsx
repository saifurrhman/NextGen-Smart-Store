import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import logoDark from '../../assets/Next Gen Smart Store (Dark ).png';
import { authAPI } from '../../services/api';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        setLoading(true);
        try {
            await authAPI.resetPassword({ email, new_password: password, confirm_password: confirmPassword });
            setDone(true);
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.detail || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        return (
            <div className="w-full">
                <div className="flex justify-center mb-4">
                    <img src={logoDark} alt="NextGen Smart Store" className="h-32 w-auto object-contain" />
                </div>
                <div className="bg-white py-8 px-5 sm:px-8 shadow-lg rounded-2xl border border-gray-100 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
                            <CheckCircle2 className="h-9 w-9 text-green-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-brand-dark mb-2">Password Reset!</h2>
                    <p className="text-sm text-text-sub mb-6">Your password has been updated successfully.</p>
                    <Link
                        to="/login"
                        className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand hover:bg-brand-dark transition-all"
                    >
                        Login with new password
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Logo */}
            <div className="flex justify-center mb-4">
                <img src={logoDark} alt="NextGen Smart Store" className="h-32 w-auto object-contain" />
            </div>

            {/* Header */}
            <div className="text-center mb-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
                    Set New Password
                </h2>
                <p className="mt-1 text-sm text-text-sub">
                    Choose a strong password for your account.
                </p>
            </div>

            {/* Form Card */}
            <div className="bg-white py-6 px-5 sm:px-8 shadow-lg rounded-2xl border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 border border-red-200 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                            <span className="text-xs font-medium text-red-600">{error}</span>
                        </div>
                    )}

                    {/* New Password */}
                    <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1.5">New Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError(''); }}
                                className="block w-full pl-9 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm font-medium placeholder-gray-400"
                                placeholder="Min. 8 characters"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand transition-colors">
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1.5">Confirm Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                required
                                value={confirmPassword}
                                onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                                className="block w-full pl-9 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm font-medium placeholder-gray-400"
                                placeholder="Re-enter password"
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand transition-colors">
                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
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
                                Saving...
                            </span>
                        ) : 'Reset Password'}
                    </button>
                </form>

                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <Link to="/login" className="text-sm font-medium text-text-sub hover:text-brand-dark transition-colors">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
