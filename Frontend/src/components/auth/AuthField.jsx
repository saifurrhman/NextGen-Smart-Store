import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthField = ({
    label,
    name,
    type = 'text',
    placeholder,
    icon: Icon,
    required = false,
    value,
    onChange,
    passwordToggle,
    showPw,
    onToggle,
    className = "",
    forgotPasswordLink,
    forgotPasswordState
}) => {
    // Generate a unique ID based on the name to link label and input
    const fieldId = `auth-field-${name}`;

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <div className="flex justify-between items-center ml-1">
                <label
                    htmlFor={fieldId}
                    className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] cursor-pointer hover:text-emerald-600 transition-colors"
                >
                    {label}
                </label>
                {forgotPasswordLink && (
                    <Link
                        to={forgotPasswordLink}
                        state={forgotPasswordState}
                        className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest"
                    >
                        Forgot Password?
                    </Link>
                )}
            </div>
            <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {Icon && <Icon className="h-4 w-4 text-gray-300 group-focus-within/input:text-emerald-600 transition-colors" />}
                </div>
                <input
                    id={fieldId}
                    name={name}
                    type={passwordToggle ? (showPw ? 'text' : 'password') : type}
                    required={required}
                    value={value}
                    onChange={onChange}
                    className="block w-full pl-11 pr-9 py-3.5 bg-gray-50 border border-transparent rounded-[1.25rem] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 transition-all text-sm font-semibold placeholder-gray-400/50 text-gray-800 shadow-sm group-focus-within/input:shadow-md"
                    placeholder={placeholder}
                />
                {passwordToggle && (
                    <button
                        type="button"
                        onClick={onToggle}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-300 hover:text-emerald-600 transition-colors"
                    >
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AuthField;
