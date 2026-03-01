import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, UserCircle2, Eye, EyeOff, ShieldCheck, Terminal } from 'lucide-react';
import logoDark from '../../assets/Next Gen Smart Store (Dark ).png';
import { authAPI } from '../../services/api';

const AdminLogin = () => {
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
            if (role !== 'ADMIN' && role !== 'SUPERADMIN' && role !== 'SUPER_ADMIN' && role !== 'SUB_ADMIN') {
                setError('Access Denied. Unauthorized authorization level detected.');
                setLoading(false);
                return;
            }
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('role', role);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Authentication failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Admin Terminal</h2>
                <p className="mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Authorized personnel only beyond this point</p>
            </div>

            {/* Main Card */}
            <div className="bg-white/80 backdrop-blur-xl py-7 px-8 sm:px-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[2rem] border border-white/20 relative overflow-hidden group">

                <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-3xl bg-rose-50 p-5 border border-rose-100 flex items-center gap-4 animate-in shake duration-500">
                            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                            <span className="text-xs font-black text-rose-600 uppercase tracking-tight leading-relaxed">{error}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Admin Identifier</label>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <UserCircle2 className="h-5 w-5 text-gray-300 group-focus-within/input:text-emerald-600 transition-colors" />
                            </div>
                            <input
                                name="username" type="email" required
                                value={formData.username} onChange={handleChange}
                                className="block w-full pl-14 pr-6 py-3.5 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-600/20 focus:ring-8 focus:ring-emerald-600/5 transition-all text-sm font-black placeholder-gray-300"
                                placeholder="ADMIN@NEXTGEN.COM"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Security Key</label>
                            <Link to="/forgot-password" state={{ role: 'admin' }} className="text-[10px] font-black text-emerald-600 hover:opacity-70 uppercase tracking-widest">Forgot?</Link>
                        </div>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-300 group-focus-within/input:text-emerald-600 transition-colors" />
                            </div>
                            <input
                                name="password" type={showPassword ? 'text' : 'password'} required
                                value={formData.password} onChange={handleChange}
                                className="block w-full pl-14 pr-14 py-3.5 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-600/20 focus:ring-8 focus:ring-emerald-600/5 transition-all text-sm font-black placeholder-gray-300"
                                placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-300 hover:text-gray-900 transition-colors">
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] text-sm font-black text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest relative overflow-hidden group/btn"
                    >
                        {loading ? 'AUTHORIZING...' : 'INITIALIZE SESSION'}
                    </button>
                </form>

                <div className="mt-8 space-y-6 relative z-10">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100" />
                        </div>
                        <div className="relative flex justify-center text-[10px]">
                            <span className="px-5 bg-white text-gray-400 font-black uppercase tracking-[0.2em]">New Administrator?</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link to="/admin/register" className="w-full inline-flex justify-center items-center gap-3 py-3.5 px-6 border border-gray-100 rounded-[2rem] bg-white text-[10px] font-black text-gray-900 hover:bg-gray-50 transition-all uppercase tracking-widest group/reg">
                            <Terminal size={14} className="group-hover:translate-x-1 transition-transform" />
                            Request System Access
                        </Link>
                    </div>


                    <p className="text-center text-[8px] text-gray-300 font-black uppercase tracking-[0.3em] font-mono mt-8">
                        Hardware Encrypted | Session Logged
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
