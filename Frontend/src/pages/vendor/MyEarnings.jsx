import React, { useState } from 'react';
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    DollarSign,
    TrendingUp,
    Calendar,
    Search,
    Download,
    Filter,
    Clock,
    CheckCircle2,
    ChevronRight,
    CreditCard,
    PieChart
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatMini = ({ label, value, icon: Icon, color }) => (
    <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
            <Icon size={18} />
        </div>
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-lg font-black text-gray-900 tracking-tighter">{value}</p>
        </div>
    </div>
);

const MyEarnings = () => {
    const transactions = [
        { id: '#TRX-9942', type: 'Payout', amount: '-$1,200.00', status: 'Completed', date: 'Mar 01, 2026', method: 'Bank Transfer' },
        { id: '#TRX-9941', type: 'Order Earned', amount: '+$259.00', status: 'Completed', date: 'Feb 28, 2026', method: 'Sale #ORD-8821' },
        { id: '#TRX-9940', type: 'Order Earned', amount: '+$59.00', status: 'Processing', date: 'Feb 28, 2026', method: 'Sale #ORD-8820' },
        { id: '#TRX-9939', type: 'Payout', amount: '-$850.00', status: 'Pending', date: 'Feb 26, 2026', method: 'PayPal' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Financial Overview Header */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Vault Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 bg-gray-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-gray-200"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-12">
                            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
                                <Wallet size={24} className="text-emerald-400" />
                            </div>
                            <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest text-emerald-400">Merchant Vault</div>
                        </div>

                        <div className="mb-12">
                            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2">Available for Payout</p>
                            <h2 className="text-5xl font-black tracking-tighter">$8,450.20</h2>
                        </div>

                        <div className="mt-auto flex gap-3">
                            <button className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-gray-900 text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98]">Request Payout</button>
                            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all active:scale-[0.98]">
                                <ArrowRight size={20} className="text-white" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Secondary Metrics */}
                <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatMini label="Pending Clearance" value="$1,240.00" icon={Clock} color="bg-amber-500" />
                        <StatMini label="Lifetime Earned" value="$42,890.50" icon={TrendingUp} color="bg-emerald-500" />
                        <StatMini label="Next Payout Date" value="Mar 15, 2026" icon={Calendar} color="bg-blue-500" />
                        <StatMini label="Active Promos" value="4 Live" icon={PieChart} color="bg-purple-500" />
                    </div>

                    {/* Mini Analytics Preview */}
                    <div className="flex-1 bg-white rounded-3xl border border-gray-100 p-6 flex items-center justify-between group cursor-pointer hover:border-emerald-200 transition-all shadow-sm">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 group-hover:scale-110 transition-transform">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-1">Weekly Growth</h3>
                                <p className="text-xs text-secondary font-medium">+14.2% increase from previous billing cycle</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            </div>

            {/* Transaction Ledger */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
                <div className="p-8 flex items-center justify-between gap-4 border-b border-gray-50">
                    <div>
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-[0.2em]">Transaction Ledger</h3>
                        <p className="text-xs text-secondary font-medium mt-1">Granular financial audit logs across the network</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest rounded-xl hover:text-emerald-600 transition-all border border-gray-100">
                            <Download size={14} /> Export CSV
                        </button>
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Search Hash ID..."
                                className="bg-gray-50 border border-transparent rounded-xl py-2 pl-9 pr-4 text-[10px] font-bold focus:outline-none focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-500/5 transition-all w-48"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Ledger ID</th>
                                <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Activity Class</th>
                                <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Channel / Method</th>
                                <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Net Change</th>
                                <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Operation Status</th>
                                <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.map((trx, i) => (
                                <tr key={trx.id} className="hover:bg-neutral-50/50 transition-colors group cursor-pointer">
                                    <td className="px-8 py-6 text-xs font-bold text-emerald-600 tracking-wider font-mono uppercase">{trx.id}</td>
                                    <td className="px-8 py-6 text-xs font-extrabold text-gray-800 uppercase tracking-tight">{trx.type}</td>
                                    <td className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{trx.method}</td>
                                    <td className={`px-8 py-6 text-sm font-black tracking-tighter ${trx.amount.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {trx.amount}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${trx.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                            {trx.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{trx.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
                    <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                        View Complete Financial Archives <ChevronRight size={14} />
                    </button>
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">Encrypted Ledger Access Level 5</p>
                </div>
            </motion.div>
        </div>
    );
};

// Simple ArrowRight icon placeholder since it's missing from imports
const ArrowRight = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
);

export default MyEarnings;
