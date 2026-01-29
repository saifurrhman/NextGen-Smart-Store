import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, User } from 'lucide-react';
import axios from 'axios';

const AdminRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await axios.post('http://127.0.0.1:8000/api/auth/admin/register/', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: 'SUPER_ADMIN' // Backend handles this, but sending just in case
            });

            navigate('/admin/dashboard', { state: { message: 'Admin Account Created! Please Login.' } });

        } catch (err) {
            console.error("Admin Register Error:", err);
            setError(JSON.stringify(err.response?.data) || "Registration failed.");
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
                    Create Admin Account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    Setup initial Super Admin access
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
                                        <h3 className="text-sm font-medium text-red-800 break-all">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="username" type="text" required onChange={handleChange} className="focus:ring-brand-dark focus:border-brand-dark block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5" placeholder="admin" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="email" type="email" required onChange={handleChange} className="focus:ring-brand-dark focus:border-brand-dark block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5" placeholder="admin@example.com" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="password" type="password" required onChange={handleChange} className="focus:ring-brand-dark focus:border-brand-dark block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="confirmPassword" type="password" required onChange={handleChange} className="focus:ring-brand-dark focus:border-brand-dark block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5" />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark transition-all"
                            >
                                {loading ? 'Creating...' : 'Create Admin Account'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/admin/login')}
                                className="font-medium text-brand-dark hover:underline"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;
