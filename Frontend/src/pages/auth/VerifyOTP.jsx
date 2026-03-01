import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ArrowLeft, RefreshCw, KeyRound, ShieldCheck, Fingerprint } from 'lucide-react';
import logoDark from '../../assets/Next Gen Smart Store (Dark ).png';
import { authAPI } from '../../services/api';

const RESEND_COOLDOWN = 60;

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, purpose, formData, role } = location.state || {};

    const loginUrl = { admin: '/admin/login', seller: '/seller/login', customer: '/login', delivery: '/login' };
    const registerUrl = { admin: '/admin/register', seller: '/seller/register', customer: '/register', delivery: '/delivery/register' };
    const resolvedRole = role || 'customer';
    const loginLink = loginUrl[resolvedRole] || '/login';
    const registerLink = registerUrl[resolvedRole] || '/register';

    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const [resending, setResending] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (!email || !purpose) navigate('/login', { replace: true });
    }, [email, purpose, navigate]);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleDigitChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newDigits = [...digits];
        newDigits[index] = value.slice(-1);
        setDigits(newDigits);
        setError('');
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
        if (value && index === 5 && newDigits.every(d => d)) handleVerify(newDigits.join(''));
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus();
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setDigits(pasted.split(''));
            inputRefs.current[5]?.focus();
            handleVerify(pasted);
        }
    };

    const handleVerify = async (codeOverride) => {
        const code = codeOverride || digits.join('');
        if (code.length !== 6) { setError('Please enter the complete 6-digit code.'); return; }
        setLoading(true);
        setError('');
        try {
            await authAPI.verifyOTP({ email, code, purpose });
            if (purpose === 'register') {
                await authAPI.registerWithOTP({ ...formData, email, code });
                setSuccess('Identity Secured. Redirecting to Portal...');
                setTimeout(() => navigate(loginLink, { replace: true }), 1500);
            } else {
                navigate('/reset-password', { state: { email, code, role: resolvedRole }, replace: true });
            }
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.detail || 'Invalid or expired code.');
            setDigits(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError('');
        try {
            await authAPI.sendOTP({ email, purpose });
            setResendCooldown(RESEND_COOLDOWN);
            setDigits(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to resend code.');
        } finally {
            setResending(false);
        }
    };

    const roleBadgeMap = { admin: 'Admin Security Control', seller: 'Partner Identity Check', customer: 'Customer Access Check', delivery: 'Squad Identity Check' };
    const purposeLabel = purpose === 'register' ? 'Verify Account' : 'Verify Identity';

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Identity Verification</h2>
                <p className="mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Multi-factor authorization required</p>
            </div>

            {/* Main Card */}
            <div className="bg-white/80 backdrop-blur-xl py-7 px-8 sm:px-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[2rem] border border-white/20 relative overflow-hidden group">

                <div className="relative z-10 space-y-8">
                    {error && (
                        <div className="rounded-3xl bg-rose-50 p-5 border border-rose-100 flex items-center gap-4 animate-in shake duration-500">
                            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                            <span className="text-xs font-black text-rose-600 uppercase tracking-tight leading-relaxed">{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="rounded-3xl bg-emerald-50 p-5 border border-emerald-100 flex items-center gap-4 animate-in fade-in zoom-in duration-500">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                            <span className="text-xs font-black text-emerald-600 uppercase tracking-tight leading-relaxed">{success}</span>
                        </div>
                    )}

                    {/* OTP Boxes */}
                    <div className="flex justify-center gap-3 sm:gap-4" onPaste={handlePaste}>
                        {digits.map((digit, i) => (
                            <input
                                key={i}
                                ref={el => inputRefs.current[i] = el}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleDigitChange(i, e.target.value)}
                                onKeyDown={e => handleKeyDown(i, e)}
                                className={`w-12 h-16 sm:w-14 sm:h-20 text-center text-2xl font-black rounded-2xl border-2 transition-all focus:outline-none focus:ring-8 focus:ring-emerald-600/5
                                    ${digit ? 'border-emerald-600 bg-emerald-600/5 text-gray-900 shadow-lg shadow-emerald-600/10' : 'border-gray-100 bg-gray-50 text-gray-400'}
                                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] text-sm font-black text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest relative overflow-hidden group/btn"
                    >
                        {loading ? 'AUTHENTICATING...' : 'AUTHORIZE ACCESS'}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resendCooldown > 0 || resending}
                            className="w-full h-16 flex items-center justify-center gap-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group/btn relative overflow-hidden"
                        >
                            <RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
                            {resendCooldown > 0 ? `Retry in ${resendCooldown}S` : resending ? 'Transmitting...' : 'Request New Token'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 space-y-6 relative z-10">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100" />
                        </div>
                        <div className="relative flex justify-center text-[10px]">
                            <span className="px-5 bg-white text-gray-400 font-black uppercase tracking-[0.2em]">Wrong Channel?</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link to={purpose === 'register' ? registerLink : loginLink} className="w-full inline-flex justify-center items-center gap-3 py-4.5 px-6 border border-gray-100 rounded-[2rem] bg-white text-[10px] font-black text-gray-900 hover:bg-gray-50 transition-all uppercase tracking-widest group/reg">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Return to Initial Step
                        </Link>
                    </div>


                    <div className="flex justify-center gap-6 mt-8">
                        <div className="flex items-center gap-1.5 opacity-30">
                            <Fingerprint size={12} className="text-gray-900" />
                            <span className="text-[8px] font-black uppercase tracking-tighter">Secure Link</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-30">
                            <KeyRound size={12} className="text-gray-900" />
                            <span className="text-[8px] font-black uppercase tracking-tighter">Encrypted</span>
                        </div>
                    </div>

                    <p className="text-center text-[8px] text-gray-300 font-black uppercase tracking-[0.3em] font-mono mt-8">
                        Verification Protocol | SHA-256
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
