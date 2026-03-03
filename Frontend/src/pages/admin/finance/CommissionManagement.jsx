import React, { useState } from 'react';
import {
    Percent, DollarSign, Save, RefreshCw,
    Settings, Shield, HelpCircle, ArrowRight,
    Home, ChevronRight, CheckCircle2, AlertCircle
} from 'lucide-react';

const CommissionManagement = () => {
    const [settings, setSettings] = useState({
        standard: 10,
        premium: 5,
        electronics: 12,
        fashion: 15,
        payoutThreshold: 5000,
        autoPayout: true,
    });

    return (
        <div className="max-w-[1200px] mx-auto pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Percent size={24} className="text-emerald-500" />
                        Commission & Finance Settings
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mt-1">
                        <Home size={14} />
                        <ChevronRight size={12} />
                        <span>Finance</span>
                        <ChevronRight size={12} />
                        <span className="text-emerald-500 font-bold">Commission</span>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white font-bold rounded-xl text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100">
                    <Save size={18} /> Save All Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: General Commission */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg"><Percent size={18} /></div>
                            <h3 className="font-bold text-gray-800">Standard Commission Rates</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Default Market Rate (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={settings.standard}
                                        className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:border-emerald-500 transition-all"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Premium Seller Rate (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={settings.premium}
                                        className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:border-emerald-500 transition-all"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><Settings size={18} /></div>
                                <h3 className="font-bold text-gray-800">Category-wise Commission</h3>
                            </div>
                            <button className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:underline">+ Override Category</button>
                        </div>
                        <div className="p-6 space-y-4">
                            {[
                                { name: 'Electronics & Mobiles', rate: 12, icon: '📱' },
                                { name: 'Fashion & Apparel', rate: 15, icon: '👔' },
                                { name: 'Home Appliances', rate: 8, icon: '🏠' },
                            ].map((cat, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{cat.icon}</span>
                                        <span className="text-sm font-bold text-gray-700">{cat.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            defaultValue={cat.rate}
                                            className="w-20 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-center focus:outline-none focus:border-emerald-500"
                                        />
                                        <span className="text-xs font-bold text-gray-400">%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Payout Rules */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/10 rounded-lg border border-white/10"><DollarSign size={20} /></div>
                            <h3 className="font-bold">Payout Threshold</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Minimum Wallet Balance</span>
                                <h2 className="text-4xl font-extrabold tracking-tighter">PKR 5,000</h2>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">Vendors cannot request payout until this balance is reached in their internal wallet.</p>
                            <button className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all mt-4 border border-emerald-400/20">
                                Update Limit
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-gray-800">Auto Payouts</h4>
                            <label className="flex items-center cursor-pointer relative">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium leading-relaxed">When enabled, systems will automatically process payout requests on the 1st of every month if threshold is met.</p>
                        <div className="pt-4 border-t border-gray-50 space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50/50 p-2 rounded-lg">
                                <Shield size={14} /> Security Checks Enabled
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 bg-amber-50/50 p-2 rounded-lg">
                                <AlertCircle size={14} /> ID Verification Required
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommissionManagement;

