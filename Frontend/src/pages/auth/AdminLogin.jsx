import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', formData);
            const { token, role, user } = response.data;

            // Strict Role Check for Admin Login
            if (role !== 'SUPER_ADMIN' && role !== 'SUB_ADMIN') {
                setError("Access Denied. This portal is for Administrators only.");
                setLoading(false);
                return;
            }

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('user', JSON.stringify(user));

            navigate('/admin/dashboard');

        } catch (err) {
            console.error("Admin Login Error:", err);
            setError(err.response?.data?.non_field_errors?.[0] || "Invalid credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                        <Shield className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
                    Admin Portal
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    Restricted Access Area • Authorized Personnel Only
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-md bg-red-50 p-4 border border-red-200">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Admin ID / Username
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="focus:ring-brand-dark focus:border-brand-dark block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5"
                                    placeholder="admin@smartstore.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Secure Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="focus:ring-brand-dark focus:border-brand-dark block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark transition-all"
                            >
                                {loading ? 'Authenticating...' : 'Access Dashboard'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an admin account?{' '}
                            <button
                                onClick={() => navigate('/admin/register')}
                                className="font-medium text-brand-dark hover:underline"
                            >
                                Create Admin Account
                            </button>
                        </p>
                    </div>

                    <div className="mt-6 text-center text-xs text-gray-400">
                        <p>IP Address Logged for Security</p>
                        <p>© 2026 NextGen Smart Store</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
