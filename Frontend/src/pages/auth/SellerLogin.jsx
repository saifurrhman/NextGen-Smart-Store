import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Eye, EyeOff, Zap, Rocket, BarChart3, Building2 } from 'lucide-react';
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
                setError('Access Denied. Identity does not have vendor-level clearance.');
                setLoading(false);
                return;
            }
            localStorage.setItem('authToken', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/vendor/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Authentication failed. Please verify credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-5">
                <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Seller Gateway</h2>
                <p className="mt-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Authorized personnel only beyond this point</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-7">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 p-3.5">
                            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                            <span className="text-xs font-bold text-rose-600 uppercase tracking-tight">{error}</span>
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Partner Identifier</label>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-gray-300 group-focus-within/input:text-emerald-600 transition-colors" />
                            </div>
                            <input name="username" type="email" required
                                value={formData.username} onChange={handleChange}
                                className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-semibold placeholder-gray-300 text-gray-800"
                                placeholder="PARTNER@NEXTGEN.COM" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">Security Key</label>
                            <Link to="/forgot-password" state={{ role: 'seller' }} className="text-[10px] font-black text-emerald-600 hover:opacity-70 uppercase tracking-widest">Forgot?</Link>
                        </div>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-300 group-focus-within/input:text-emerald-600 transition-colors" />
                            </div>
                            <input name="password" type={showPassword ? 'text' : 'password'} required
                                value={formData.password} onChange={handleChange}
                                className="block w-full pl-11 pr-11 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-semibold placeholder-gray-300 text-gray-800"
                                placeholder="••••••••" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-300 hover:text-emerald-600 transition-colors">
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50">
                        {loading ? 'SYNCHRONIZING...' : 'LAUNCH DASHBOARD'}
                    </button>
                </form>

                <div className="mt-6 flex flex-col gap-4">
                    <div className="relative flex items-center">
                        <div className="flex-1 border-t border-gray-100" />
                        <span className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">New Seller?</span>
                        <div className="flex-1 border-t border-gray-100" />
                    </div>
                    <Link to="/seller/register" className="w-full flex justify-center items-center gap-2 py-3 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-gray-100 text-xs font-black text-gray-700 uppercase tracking-widest transition-all group">
                        <Building2 size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        Apply for Partner Account
                    </Link>
                    <div className="flex justify-center gap-6">
                        <div className="flex items-center gap-1.5 opacity-30"><BarChart3 size={11} /><span className="text-[9px] font-black uppercase tracking-tight">Global Outreach</span></div>
                        <div className="flex items-center gap-1.5 opacity-30"><Rocket size={11} /><span className="text-[9px] font-black uppercase tracking-tight">Instant Scale</span></div>
                    </div>
                    <p className="text-center text-[9px] text-gray-300 font-bold uppercase tracking-widest">Operational Integrity Protocol | AES-256</p>
                </div>
            </div>
        </div>
    );
};

export default SellerLogin;
