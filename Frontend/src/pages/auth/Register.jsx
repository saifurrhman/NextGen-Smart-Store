import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, Mail, Lock, User, Phone, MapPin, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: ''
    });
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
            await axios.post('http://127.0.0.1:8000/api/auth/register/', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                address: formData.address
            });

            // On success, redirect to login
            navigate('/login', { state: { message: 'Account created successfully! Please login.' } });

        } catch (err) {
            console.error("Registration Error:", err);
            setError(JSON.stringify(err.response?.data) || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-text-main">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-xl bg-brand/10 flex items-center justify-center">
                        <Store className="h-8 w-8 text-brand fill-current" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-h2 font-bold text-brand-dark tracking-tight">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-text-sub">
                    Join NextGen Smart Store today
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-effect-3 sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-md bg-functional-error/10 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-functional-error" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-functional-error break-all">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-brand-dark">Username</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="username" type="text" required onChange={handleChange} className="focus:ring-brand focus:border-brand block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5" placeholder="johndoe" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-brand-dark">Email</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="email" type="email" required onChange={handleChange} className="focus:ring-brand focus:border-brand block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5" placeholder="john@example.com" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-brand-dark">Phone</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input name="phone" type="text" onChange={handleChange} className="focus:ring-brand focus:border-brand block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5" placeholder="+123..." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-dark">Address</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input name="address" type="text" onChange={handleChange} className="focus:ring-brand focus:border-brand block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5" placeholder="City, Country" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-brand-dark">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="password" type="password" required onChange={handleChange} className="focus:ring-brand focus:border-brand block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5" placeholder="••••••••" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-brand-dark">Confirm Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="confirmPassword" type="password" required onChange={handleChange} className="focus:ring-brand focus:border-brand block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5" placeholder="••••••••" />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-text-sub">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-brand hover:text-brand-dark">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
