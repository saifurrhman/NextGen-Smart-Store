import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, Lock, Mail, AlertCircle, User, Phone, MapPin } from 'lucide-react';
import axios from 'axios';

const VendorRegister = () => {
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
            await axios.post('http://127.0.0.1:8000/api/auth/vendor/register/', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                address: formData.address,
                role: 'VENDOR' // Backend forces this, but sending for clarity
            });

            navigate('/vendor/login', { state: { message: 'Seller Account Created! Please Login to complete setup.' } });

        } catch (err) {
            console.error("Vendor Register Error:", err);
            setError(JSON.stringify(err.response?.data) || "Registration failed.");
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
                    Start Selling on NextGen
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Join thousands of sellers and reach millions of customers
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
                                        <h3 className="text-sm font-medium text-red-800 break-all">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Store / User Name</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="username" type="text" required onChange={handleChange} className="focus:ring-brand focus:border-brand block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3" placeholder="MyAwesomeStore" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Business Email</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="email" type="email" required onChange={handleChange} className="focus:ring-brand focus:border-brand block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3" placeholder="contact@example.com" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input name="password" type="password" required onChange={handleChange} className="focus:ring-brand focus:border-brand block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm PW</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input name="confirmPassword" type="password" required onChange={handleChange} className="focus:ring-brand focus:border-brand block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3" />
                                </div>
                            </div>
                        </div>



                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-all"
                            >
                                {loading ? 'Creating Account...' : 'Create Seller Account'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already selling with us?{' '}
                            <Link
                                to="/vendor/login"
                                className="font-medium text-brand hover:underline"
                            >
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <p className="mt-8 text-center text-xs text-gray-500">
                &copy; 2026 NextGen Smart Store. All rights reserved.
            </p>
        </div>
    );
};

export default VendorRegister;
