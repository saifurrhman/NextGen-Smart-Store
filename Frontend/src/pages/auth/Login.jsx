import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';
import api from '../../utils/api';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Mocking for now if backend fails, or hitting real endpoint
            // const res = await api.post('/auth/login/', formData); 
            // localStorage.setItem('accessToken', res.data.access);

            // Simulating success for verification flow (until backend auth is 100% keyed)
            // Remove this simulation when testing real backend
            const res = await api.post('/store/login/', formData); // Use correct backend route
            localStorage.setItem('accessToken', res.data.token);
            localStorage.setItem('userRole', res.data.role);

            if (res.data.role === 'VENDOR') navigate('/vendor/dashboard');
            else if (res.data.role === 'SUPER_ADMIN') navigate('/admin/dashboard');
            else navigate('/');

        } catch (err) {
            setError('Invalid credentials. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-brand-dark">Welcome Back</h2>
                    <p className="mt-2 text-sm text-text-sub">Sign in to your account</p>
                </div>

                {error && <div className="bg-red-50 text-functional-error p-3 rounded text-sm text-center">{error}</div>}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-none rounded-t-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-text-main focus:outline-none focus:ring-brand focus:border-brand focus:z-10 sm:text-sm"
                                placeholder="Username"
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none rounded-b-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-text-main focus:outline-none focus:ring-brand focus:border-brand focus:z-10 sm:text-sm"
                                placeholder="Password"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="#" className="font-medium text-action hover:text-action-hover">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-action hover:bg-action-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-action disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                        <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
                    </button>
                </form>

                <div className="text-center text-sm text-text-sub">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-action hover:text-action-hover">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
