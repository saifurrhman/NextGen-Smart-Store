import React from 'react';
import { Megaphone, Users, DollarSign, Target, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

const data = [
    { name: 'Jan', revenue: 4000, reach: 2400 },
    { name: 'Feb', revenue: 3000, reach: 1398 },
    { name: 'Mar', revenue: 2000, reach: 9800 },
    { name: 'Apr', revenue: 2780, reach: 3908 },
    { name: 'May', revenue: 1890, reach: 4800 },
    { name: 'Jun', revenue: 2390, reach: 3800 },
    { name: 'Jul', revenue: 3490, reach: 4300 },
];

const StatCard = ({ title, value, change, trend, icon: Icon }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-brand/5 rounded-full flex items-center justify-center">
                <Icon className="text-brand" size={24} />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {change}
            </div>
        </div>
        <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-brand-dark">{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
                    <Megaphone className="text-brand" size={28} />
                    Marketing Dashboard
                </h2>
                <p className="text-gray-500 mt-1">Overview of your marketing campaigns and performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Reach"
                    value="2.4M"
                    change="+12.5%"
                    trend="up"
                    icon={Users}
                />
                <StatCard
                    title="Ad Spend"
                    value="$12,450"
                    change="-2.4%"
                    trend="down"
                    icon={DollarSign}
                />
                <StatCard
                    title="Conversion Rate"
                    value="4.8%"
                    change="+1.2%"
                    trend="up"
                    icon={Target}
                />
                <StatCard
                    title="ROI"
                    value="285%"
                    change="+14.6%"
                    trend="up"
                    icon={TrendingUp}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-brand-dark mb-4">Performance Overview</h3>
                    <div className="h-80 flex flex-col justify-end pt-4">
                        {/* Simple CSS-based Bar Chart */}
                        <div className="flex items-end justify-between h-full w-full space-x-2">
                            {data.map((item, index) => {
                                // Calculate a relative height percentage (max 100%)
                                // Max revenue is 4000
                                const hPercent = Math.max(10, (item.revenue / 4000) * 100);
                                return (
                                    <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer relative">
                                        <div className="relative w-full px-1 sm:px-2 flex flex-col justify-end h-full">
                                            {/* Tooltip on hover */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                ${item.revenue.toLocaleString()}
                                            </div>
                                            <div
                                                className="w-full bg-brand/80 hover:bg-brand transition-all rounded-t-md"
                                                style={{ height: `${hPercent}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2 font-medium">{item.name}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-brand-dark mb-4">Active Campaigns</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Summer Sale 2026', status: 'Active', reach: '45K', spend: '$1,200' },
                            { name: 'Retargeting Flow', status: 'Active', reach: '12K', spend: '$450' },
                            { name: 'Welcome Series', status: 'Active', reach: '8K', spend: '$0' },
                            { name: 'Abandoned Cart', status: 'Active', reach: '3K', spend: '$0' },
                        ].map((campaign, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                                <div>
                                    <h4 className="font-medium text-brand-dark text-sm">{campaign.name}</h4>
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 mt-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        {campaign.status}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-brand-dark text-sm">{campaign.reach}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{campaign.spend}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
