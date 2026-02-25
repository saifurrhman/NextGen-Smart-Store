import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import logoDark from '../../assets/Next Gen Smart Store (Dark ).png';
import { authAPI } from '../../services/api';

const RESEND_COOLDOWN = 60;

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, purpose, formData, role } = location.state || {};

    // Role-based URL mapping
    const loginUrl = { admin: '/admin/login', seller: '/seller/login', customer: '/login' };
    const registerUrl = { admin: '/admin/register', seller: '/seller/register', customer: '/register' };
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
                setSuccess('Account created! Redirecting to login...');
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

    const roleBadgeMap = { admin: '🔐 Admin Portal', seller: '🏪 Seller Portal', customer: '👤 Customer' };
    const purposeLabel = purpose === 'register' ? 'Verify your account' : 'Verify your identity';
    const purposeSub = purpose === 'register'
        ? 'Enter the code we sent to complete your registration.'
        : 'Enter the code we sent to reset your password.';

    return (
        <div className="w-full">
            <div className="flex justify-center mb-4">
                <img src={logoDark} alt="NextGen Smart Store" className="h-32 w-auto object-contain" />
            </div>

            {/* Role Badge */}
            <div className="flex justify-center mb-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand/10 text-brand border border-brand/20">
                    {roleBadgeMap[resolvedRole] || '👤 Customer'}
                </span>
            </div>

            <div className="text-center mb-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">{purposeLabel}</h2>
                <p className="mt-1 text-sm text-text-sub">{purposeSub}</p>
                {email && <p className="mt-1 text-xs font-semibold text-brand">{email}</p>}
            </div>

            <div className="bg-white py-6 px-5 sm:px-8 shadow-lg rounded-2xl border border-gray-100">
                {error && (
                    <div className="rounded-lg bg-red-50 p-3 border border-red-200 flex items-start gap-2 mb-4">
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        <span className="text-xs font-medium text-red-600">{error}</span>
                    </div>
                )}
                {success && (
                    <div className="rounded-lg bg-green-50 p-3 border border-green-200 flex items-start gap-2 mb-4">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-xs font-medium text-green-600">{success}</span>
                    </div>
                )}

                {/* 6 OTP Boxes */}
                <div className="flex justify-center gap-2 sm:gap-3 mb-6" onPaste={handlePaste}>
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
                            className={`w-11 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-brand/20
                                ${digit ? 'border-brand bg-brand/5 text-brand-dark' : 'border-gray-200 bg-gray-50 text-brand-dark'}
                                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => handleVerify(null)}
                    disabled={loading || digits.some(d => !d)}
                    className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-brand/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed mb-4"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Verifying...
                        </span>
                    ) : 'Verify Code'}
                </button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendCooldown > 0 || resending}
                        className="text-sm font-medium text-brand hover:text-brand-dark transition-colors flex items-center justify-center gap-1.5 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
                        {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : resending ? 'Sending...' : 'Resend code'}
                    </button>
                </div>

                {/* Back link — role-specific */}
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <Link
                        to={purpose === 'register' ? registerLink : loginLink}
                        className="text-sm font-medium text-text-sub hover:text-brand-dark transition-colors flex items-center justify-center gap-1.5"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {purpose === 'register' ? 'Back to Register' : 'Back to Login'}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
