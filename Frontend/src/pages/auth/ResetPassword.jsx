import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, AlertCircle, Eye, EyeOff, Sparkles, CheckCircle2, ShieldAlert, Fingerprint } from 'lucide-react';
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
            setError('Verification failed. Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            setError('Security warning: Password must be at least 8 characters.');
            return;
        }
        setLoading(true);
        try {
            await authAPI.resetPassword({ email, new_password: password, confirm_password: confirmPassword });
            setDone(true);
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.detail || 'Protocol failure. Reset could not be completed.');
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        return (
            <div className="w-full animate-in fade-in zoom-in duration-700">
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-8">
                        <img src={logoDark} alt="NextGen Logo" className="h-20 w-auto object-contain" />
                    </div>
                    <div className="inline-flex items-center gap-2 bg-emerald-600/5 px-4 py-1.5 rounded-full border border-emerald-600/10 mb-4">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Protocol Accomplished</span>
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-none uppercase">Key Rotated</h2>
                    <p className="mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Your identity has been successfully secured</p>
                </div>

                <div className="bg-white py-12 px-8 sm:px-12 shadow-2xl shadow-emerald-600/10 rounded-[3.5rem] border border-gray-100 relative overflow-hidden text-center">
                    <div className="flex justify-center mb-8">
                        <div className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center animate-bounce">
                            <ShieldAlert className="h-12 w-12 text-emerald-600" />
                        </div>
                    </div>
                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest leading-relaxed mb-10">
                        New security credentials have been deployed. Authenticate via the portal to resume operations.
                    </p>
                    <Link
                        to="/login"
                        className="w-full flex justify-center items-center gap-3 py-5 px-6 rounded-[2rem] shadow-xl shadow-emerald-600/20 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-8 focus:ring-emerald-600/10 transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-[0.2em]"
                    >
                        Return to Secure Portal
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Sync Access</h2>
                <p className="mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Establish new operational credentials</p>
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
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">New Access Key</label>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-300 group-focus-within/input:text-emerald-600 transition-colors" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'} required
                                value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                                className="block w-full pl-14 pr-14 py-3.5 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-600/20 focus:ring-8 focus:ring-emerald-600/5 transition-all text-sm font-black placeholder-gray-300"
                                placeholder="8+ CHARACTERS"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-300 hover:text-emerald-600 transition-colors">
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Verify New Key</label>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-300 group-focus-within/input:text-emerald-600 transition-colors" />
                            </div>
                            <input
                                type={showConfirm ? 'text' : 'password'} required
                                value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                                className="block w-full pl-14 pr-14 py-3.5 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-600/20 focus:ring-8 focus:ring-emerald-600/5 transition-all text-sm font-black placeholder-gray-300"
                                placeholder="REPEAT NEW KEY"
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-300 hover:text-emerald-600 transition-colors">
                                {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] text-sm font-black text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest relative overflow-hidden group/btn"
                    >
                        {loading ? 'RE-ENCRYPTING...' : 'FINALIZE KEY ROTATION'}
                    </button>
                </form>

                <div className="mt-8 space-y-6 relative z-10">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100" />
                        </div>
                        <div className="relative flex justify-center text-[10px]">
                            <span className="px-5 bg-white text-gray-400 font-black uppercase tracking-[0.2em]">Security Status</span>
                        </div>
                    </div>

                    <div className="flex justify-center gap-6">
                        <div className="flex items-center gap-1.5 opacity-30">
                            <Fingerprint size={12} className="text-gray-900" />
                            <span className="text-[8px] font-black uppercase tracking-tighter">Biometric Lock</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-30">
                            <ShieldAlert size={12} className="text-gray-900" />
                            <span className="text-[8px] font-black uppercase tracking-tighter">Hardware Vault</span>
                        </div>
                    </div>


                    <p className="text-center text-[8px] text-gray-300 font-black uppercase tracking-[0.3em] font-mono mt-8">
                        Operational Integrity Protocol | AES-256
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
