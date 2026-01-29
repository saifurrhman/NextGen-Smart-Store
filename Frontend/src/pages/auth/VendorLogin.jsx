import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';

const VendorLogin = () => {
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

            // Strict Role Check for Vendor Login
            if (role !== 'VENDOR') {
                setError("Access Denied. This portal is for Sellers/Vendors only.");
                setLoading(false);
                return;
            }

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('user', JSON.stringify(user));

            navigate('/vendor/dashboard');

        } catch (err) {
            console.error("Vendor Login Error Full Details:", err);
            if (err.response) {
                console.error("Data:", err.response.data);
                console.error("Status:", err.response.status);
            }
            setError(typeof err.response?.data === 'string' ? err.response.data :
                err.response?.data?.non_field_errors?.[0] ||
                JSON.stringify(err.response?.data || "Invalid credentials."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-brand/10 flex items-center justify-center">
                        <Store className="h-8 w-8 text-brand" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    Seller Central
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Manage your store, products, and orders
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-lg bg-red-50 p-4 border border-red-200">
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
                                Username or Email
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
                                    className="focus:ring-brand focus:border-brand block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3"
                                    placeholder="seller@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
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
                                    className="focus:ring-brand focus:border-brand block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-brand hover:text-brand-dark">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-all items-center gap-2"
                            >
                                {loading ? 'Logging in...' : 'Login to Seller Central'}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    New to NextGen Store?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                to="/vendor/register"
                                className="w-full flex justify-center py-3 px-4 border-2 border-brand/20 rounded-lg shadow-sm text-sm font-bold text-brand bg-white hover:bg-gray-50 transition-all"
                            >
                                Register as a Seller
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-center text-xs text-gray-500">
                &copy; 2026 NextGen Smart Store. All rights reserved.
            </p>
        </div>
    );
};

export default VendorLogin;
