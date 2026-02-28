import React, { useState, useEffect } from 'react';
import {
    TrendingUp, TrendingDown, DollarSign, ShoppingCart,
    Users, CreditCard, ChevronDown, Download, Filter
} from 'lucide-react';
import api from '../../../utils/api';

const SalesAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [timeFilter, setTimeFilter] = useState('this_week');

    useEffect(() => {
        const fetchSalesData = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/v1/analytics/dashboard/?time_filter=${timeFilter}`);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching sales analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSalesData();
    }, [timeFilter]);

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    const overview = data?.overview || {};

    const stats = [
        {
            label: 'Total Revenue',
            value: `$${(overview.totalSales || 0).toLocaleString()}`,
            change: `${(overview.salesGrowth || 0) >= 0 ? '+' : ''}${overview.salesGrowth || 0}%`,
            isPositive: (overview.salesGrowth || 0) >= 0,
            icon: DollarSign,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            label: 'Total Orders',
            value: (overview.totalOrders || 0).toLocaleString(),
            change: `${(overview.ordersGrowth || 0) >= 0 ? '+' : ''}${overview.ordersGrowth || 0}%`,
            isPositive: (overview.ordersGrowth || 0) >= 0,
            icon: ShoppingCart,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Avg. Order Value',
            value: `$${(overview.aov || 0).toFixed(2)}`,
            change: `${(overview.aovGrowth || 0) >= 0 ? '+' : ''}${overview.aovGrowth || 0}%`,
            isPositive: (overview.aovGrowth || 0) >= 0,
            icon: CreditCard,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
        {
            label: 'Conversion Rate',
            value: `${overview.convRate || 0}%`,
            change: `${(overview.convGrowth || 0) >= 0 ? '+' : ''}${overview.convGrowth || 0}%`,
            isPositive: (overview.convGrowth || 0) >= 0,
            icon: Users,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Sales Analytics</h1>
                    <p className="text-sm text-gray-500 mt-1">Detailed breakdown of your store's sales performance.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                        >
                            <option value="this_week">This Week</option>
                            <option value="last_week">Last Week</option>
                            <option value="monthly">This Month</option>
                            <option value="yearly">This Year</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>

                    <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
                        <Download size={16} />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                <stat.icon size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                }`}>
                                {stat.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{loading ? '...' : stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Sales by Category Table */}
                <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800">Recent Transactions</h3>
                        <button className="text-sm text-emerald-600 font-medium hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data?.transactions?.map((order, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-gray-800">{order.id}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${order.status === 'Success' ? 'bg-emerald-50 text-emerald-600' :
                                                order.status === 'Pending' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-bold text-gray-800">${order.amount.toLocaleString()}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sales by Region */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-6">Sales by Region</h3>
                    <div className="space-y-6">
                        {(data?.regions || []).map((region, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-700">{region.name}</span>
                                    <span className="font-bold text-gray-800">{region.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${region.color} transition-all duration-1000`}
                                        style={{ width: `${region.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {data?.regions?.length > 0 && (
                        <div className="mt-8 p-4 bg-emerald-50 rounded-xl">
                            <p className="text-xs text-emerald-800 font-medium whitespace-normal">
                                💡 Sales in <span className="font-bold">{data.regions[0].name.split(',')[0]}</span> are leading with <span className="font-bold">{data.regions[0].value}%</span> of total volume this period.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesAnalytics;
