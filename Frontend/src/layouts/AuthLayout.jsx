import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Star, Store, TrendingUp, Package, Truck, LayoutDashboard, Lock, UserCheck } from 'lucide-react';
import logoWhite from '../assets/Next Gen Smart Store (White).png';

const AuthLayout = () => {
    const location = useLocation();
    const isDelivery = location.pathname.includes('delivery');
    const isSeller = location.pathname.includes('seller') || location.pathname.includes('vendor');
    const isAdmin = location.pathname.includes('admin');

    const getTheme = () => {
        const themes = {
            admin: {
                headline: 'Command & Control.',
                sub: 'NextGen administrative interface for platform orchestration and governance.',
                badges: [{ icon: Lock, text: 'Authorized Only' }, { icon: ShieldCheck, text: 'Secure Access' }]
            },
            vendor: {
                headline: 'Enterprise Portal.',
                sub: 'Scale your logistics and supply chain with industrial-grade precision.',
                badges: [{ icon: Store, text: 'Verified Partner' }, { icon: LayoutDashboard, text: 'Enterprise Suite' }]
            },
            seller: {
                headline: 'Merchant Growth.',
                sub: 'Launch your brand to millions of users and accelerate your commerce growth.',
                badges: [{ icon: TrendingUp, text: 'Growth System' }, { icon: Star, text: 'Premium Merchant' }]
            },
            delivery: {
                headline: 'Last-Mile Unit.',
                sub: 'Operational interface for field personnel and logistics optimization.',
                badges: [{ icon: Truck, text: 'Active Dispatch' }, { icon: Package, text: 'Precision Transit' }]
            },
            default: {
                headline: 'The Next Generation.',
                sub: 'Experience the future of shopping with AR trials and AI-curated quality.',
                badges: [{ icon: ShieldCheck, text: 'Buyer Protection' }, { icon: Star, text: 'Top Rated' }]
            }
        };

        const role = isAdmin ? 'admin' :
            location.pathname.includes('vendor') ? 'vendor' :
                location.pathname.includes('seller') ? 'seller' :
                    isDelivery ? 'delivery' : 'default';

        const config = themes[role];
        return {
            ...config,
            color: 'bg-emerald-600'
        };
    };

    const { headline, sub, badges, color } = getTheme();

    return (
        <div className="h-[100dvh] bg-bg-page flex font-sans text-text-main relative overflow-hidden">

            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-action/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Left Side */}
            <div className={`hidden lg:flex w-[45%] h-full relative flex-col justify-between p-24 overflow-hidden ${color} shrink-0 transition-colors duration-1000 after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent)]`}>
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 font-black text-xl shadow-2xl">
                        N
                    </div>
                    <span className="text-xl font-black text-white tracking-tighter uppercase self-center mt-0.5">NextGen</span>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-black text-white mb-6 leading-[1.1] tracking-tighter uppercase">{headline}</h1>
                    <p className="text-lg text-white/60 mb-10 font-medium tracking-tight">{sub}</p>
                    <div className="flex gap-4 flex-wrap">
                        {badges.map((badge, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-white/5 backdrop-blur-2xl px-6 py-4 rounded-[1.5rem] border border-white/10 shadow-2xl">
                                <badge.icon className="h-5 w-5 text-white/70" />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{badge.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-xs text-white/40 font-medium">
                    © 2026 NextGen Smart Store. Innovation First.
                </div>
            </div>

            {/* ✅ FIXED: Removed inner nested div + duplicate overflow-y-auto
                Only ONE overflow-y-auto here, no scrollbar-hide needed */}
            <div className="flex-1 h-full flex items-center justify-center overflow-y-auto bg-bg-page px-6">
                <div className="w-full max-w-2xl py-12">
                    <Outlet />
                </div>
            </div>

        </div>
    );
};

export default AuthLayout;
