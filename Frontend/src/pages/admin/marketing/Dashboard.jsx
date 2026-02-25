import React from 'react';
import { Megaphone, Tag, Mail, BarChart3, Gift, Users, TrendingUp, ArrowUpRight } from 'lucide-react';

const stats = [
    { label: 'Active Campaigns', value: '4', icon: Megaphone, change: '2 running' },
    { label: 'Coupons Active', value: '12', icon: Tag, change: '248 used' },
    { label: 'Email Subscribers', value: '3,450', icon: Mail, change: '+120 this week' },
    { label: 'Conversion Rate', value: '4.8%', icon: BarChart3, change: '+0.5% vs last month' },
];

const campaigns = [
    { name: 'Summer Sale 2026', status: 'Active', reach: '12,400', conversions: '342', revenue: 'PKR 85,000' },
    { name: 'New Arrivals Promo', status: 'Active', reach: '8,200', conversions: '189', revenue: 'PKR 45,600' },
    { name: 'Flash Friday', status: 'Scheduled', reach: '—', conversions: '—', revenue: '—' },
    { name: 'Eid Collection', status: 'Draft', reach: '—', conversions: '—', revenue: '—' },
];

const MarketingDashboard = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                    <Megaphone size={22} className="text-brand" />
                    Marketing Dashboard
                </h2>
                <p className="text-sm text-gray-500 mt-1">Campaigns, coupons & promotions</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-3">
                                <Icon size={20} className="text-brand" />
                            </div>
                            <p className="text-2xl font-bold text-brand-dark">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <p className="text-xs text-brand mt-1">{stat.change}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                    { label: 'Create Coupon', desc: 'New discount code', icon: Tag },
                    { label: 'Email Campaign', desc: 'Send to subscribers', icon: Mail },
                    { label: 'New Promotion', desc: 'Set up a deal', icon: Gift },
                ].map((action) => {
                    const Icon = action.icon;
                    return (
                        <button key={action.label} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand/30 transition-all text-left group">
                            <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center group-hover:bg-brand transition-colors">
                                <Icon size={20} className="text-brand group-hover:text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-brand-dark">{action.label}</p>
                                <p className="text-xs text-gray-400">{action.desc}</p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Campaigns Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-brand-dark">Campaigns</h3>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">Campaign</th>
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">Status</th>
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">Reach</th>
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">Conversions</th>
                            <th className="text-right px-5 py-2.5 font-semibold text-gray-500">Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map((c) => (
                            <tr key={c.name} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 py-3 font-medium text-gray-700">{c.name}</td>
                                <td className="px-5 py-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.status === 'Active' ? 'bg-green-50 text-green-600' :
                                            c.status === 'Scheduled' ? 'bg-blue-50 text-blue-600' :
                                                'bg-gray-100 text-gray-500'
                                        }`}>{c.status}</span>
                                </td>
                                <td className="px-5 py-3 text-gray-600">{c.reach}</td>
                                <td className="px-5 py-3 text-gray-600">{c.conversions}</td>
                                <td className="px-5 py-3 text-right font-semibold text-brand-dark">{c.revenue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MarketingDashboard;
