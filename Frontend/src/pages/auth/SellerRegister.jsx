import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Building2, AlertCircle, Eye, EyeOff, Rocket, BarChart3, Zap, ArrowRight } from 'lucide-react';
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
            setError('Verification failed. Passwords do not match.');
            return;
        }
        if (formData.password.length < 8) {
            setError('Security warning: Password must be at least 8 characters.');
            return;
        }
        setLoading(true);
        try {
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
            console.error('Seller Registration Error:', err);
            if (!err.response) {
                setError('Network Error: Cannot connect to the server. Please check if the backend is running at http://localhost:8000');
            } else {
                setError(
                    err.response?.data?.error ||
                    err.response?.data?.detail ||
                    err.response?.data?.email?.[0] ||
                    'Registration failed. Please check your business details.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const Field = ({ label, name, type = 'text', placeholder, icon: Icon, required = false, passwordToggle, showPw, onToggle }) => (
        <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">{label}</label>
            <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon className="h-4 w-4 text-gray-300 group-focus-within/input:text-emerald-600 transition-colors" />
                </div>
                <input name={name} type={passwordToggle ? (showPw ? 'text' : 'password') : type} required={required}
                    value={formData[name]} onChange={handleChange}
                    className="block w-full pl-11 pr-9 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-semibold placeholder-gray-300 text-gray-800"
                    placeholder={placeholder} />
                {passwordToggle && (
                    <button type="button" onClick={onToggle} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-300 hover:text-emerald-600 transition-colors">
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-5">
                <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Seller Marketplace Join</h2>
                <p className="mt-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Connect your brand to the next generation</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-7">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 p-3.5">
                            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                            <span className="text-xs font-bold text-rose-600 uppercase tracking-tight">{error}</span>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Brand / Store Name" name="storeName" placeholder="STORE_ID" icon={Building2} required />
                        <Field label="Business Email" name="email" type="email" placeholder="PARTNER@EMAIL.COM" icon={Mail} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Access Key" name="password" placeholder="8+ CHARS" icon={Lock} required
                            passwordToggle showPw={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                        <Field label="Verify Key" name="confirmPassword" placeholder="REPEAT" icon={Lock} required
                            passwordToggle showPw={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50">
                        {loading ? 'INITIALIZING...' : 'AUTHORIZE PARTNERSHIP'}
                    </button>
                </form>

                <div className="mt-5 flex flex-col gap-3">
                    <div className="relative flex items-center">
                        <div className="flex-1 border-t border-gray-100" />
                        <span className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Already A Partner?</span>
                        <div className="flex-1 border-t border-gray-100" />
                    </div>
                    <Link to="/seller/login" className="w-full flex justify-center items-center gap-2 py-3 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-gray-100 text-xs font-black text-gray-700 uppercase tracking-widest transition-all group">
                        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        Partner Portal Login
                    </Link>
                    <div className="flex justify-center gap-6">
                        <div className="flex items-center gap-1.5 opacity-30">
                            <BarChart3 size={11} /><span className="text-[9px] font-black uppercase tracking-tight">Global Outreach</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-30">
                            <Rocket size={11} /><span className="text-[9px] font-black uppercase tracking-tight">Instant Scale</span>
                        </div>
                    </div>
                    <p className="text-center text-[9px] text-gray-300 font-bold uppercase tracking-widest">Operational Integrity Protocol | AES-256</p>
                </div>
            </div>
        </div>
    );
};

export default SellerRegister;
