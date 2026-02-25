import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Star } from 'lucide-react';
import logoWhite from '../assets/Next Gen Smart Store (White).png';

const AuthLayout = () => {
    const location = useLocation();
    const isSeller = location.pathname.includes('seller') || location.pathname.includes('vendor');
    const isAdmin = location.pathname.includes('admin');

    const getMarketing = () => {
        if (isAdmin) return {
            headline: 'Manage your store with full control.',
            sub: 'Access analytics, user management, product oversight, and more from the NextGen Admin Portal.',
        };
        if (isSeller) return {
            headline: 'Scale your business with AI-powered tools.',
            sub: "Join our network of premium vendors and reach millions of customers with NextGen's advanced analytics and marketing platform.",
        };
        return {
            headline: 'Experience the future of shopping.',
            sub: 'Step into the next generation. Try items in AR, get AI-curated picks, and enjoy instant delivery.',
        };
    };

    const { headline, sub } = getMarketing();

    return (
        /* h-screen + overflow-hidden on outer = both panels locked to viewport, no outer scroll */
        <div className="h-screen bg-bg-page flex font-sans text-text-main relative overflow-hidden">

            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-action/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Left Side — fixed dark panel, full height */}
            <div className="hidden lg:flex w-1/2 h-full relative flex-col justify-between p-12 overflow-hidden bg-brand-dark shrink-0">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2564&auto=format&fit=crop"
                        alt="Background"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent" />
                </div>

                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-4 group">
                        <img src={logoWhite} alt="NextGen Logo" className="h-24 w-auto object-contain group-hover:scale-105 transition-transform" />
                        <span className="text-3xl font-bold text-white tracking-tight leading-tight">NextGen<br />Smart Store</span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-4xl font-bold text-white mb-6 leading-tight">{headline}</h1>
                    <p className="text-lg text-white/80 mb-8 font-light">{sub}</p>
                    <div className="flex gap-4 flex-wrap">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
                            <ShieldCheck className="h-5 w-5 text-brand-light" />
                            <span className="text-sm font-medium text-white">Secure Platform</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
                            <Star className="h-5 w-5 text-brand-light" />
                            <span className="text-sm font-medium text-white">Top Rated</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-white/40 font-medium">
                    © 2026 NextGen Smart Store. Innovation First.
                </div>
            </div>

            {/* Right Side — scrolls internally, fills full height, no gap at bottom */}
            <div className="w-full lg:w-1/2 h-full flex flex-col items-center overflow-y-auto bg-bg-page">
                {/* Mobile Header */}
                <div className="lg:hidden w-full px-6 pt-6 pb-2 flex items-center gap-3 border-b border-gray-100 shrink-0">
                    <Link to="/" className="text-xl font-bold text-brand-dark">NextGen Smart Store</Link>
                </div>

                {/* Form centered vertically when content is short */}
                <div className="w-full max-w-xl px-5 sm:px-8 py-8 flex flex-col justify-center min-h-full">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;