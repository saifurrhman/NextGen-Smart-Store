import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Store } from 'lucide-react';
import api from '../../utils/api';

const Signup = () => {
    const [isVendor, setIsVendor] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const endpoint = isVendor ? '/vendors/register/' : '/auth/register/';

        try {
            // await api.post(endpoint, formData); 
            // navigate('/login');

            // Simulating Backend route for now
            console.log(`Registering as ${isVendor ? 'Vendor' : 'User'}`, formData);
            navigate('/customer/login');
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-brand-dark">Create Account</h2>

                    <div className="flex justify-center mt-4 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setIsVendor(false)}
                            className={`flex-1 py-1 text-sm font-medium rounded-md transition-all ${!isVendor ? 'bg-white shadow text-brand-dark' : 'text-gray-500 hover:text-brand-dark'}`}
                        >
                            Customer
                        </button>
                        <button
                            onClick={() => setIsVendor(true)}
                            className={`flex-1 py-1 text-sm font-medium rounded-md transition-all ${isVendor ? 'bg-white shadow text-brand-dark' : 'text-gray-500 hover:text-brand-dark'}`}
                        >
                            Become a Vendor
                        </button>
                    </div>
                </div>

                {error && <div className="text-functional-error text-sm text-center">{error}</div>}

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                            placeholder="Username"
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="email"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                            placeholder="Email Address"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="password"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                            placeholder="Password"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {isVendor && (
                        <div className="bg-brand-accent p-3 rounded-lg flex gap-3 items-start text-sm text-brand-dark">
                            <Store className="shrink-0 mt-0.5" size={18} />
                            <p>As a vendor, you'll need to submit your store details for approval after registration.</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-action hover:bg-action-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-action mt-6"
                    >
                        {loading ? 'Creating Account...' : (isVendor ? 'Register Your Store' : 'Sign Up')}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/customer/login" className="font-medium text-action hover:text-action-hover">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
