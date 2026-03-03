import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingBag,
    Users,
    Package,
    ArrowUpRight,
    MoreHorizontal,
    Clock,
    CheckCircle2,
    Search
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatusCard = ({ title, value, change, isPositive, icon: Icon, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 transition-colors`}>
                <Icon size={22} className={color.replace('bg-', 'text-')} />
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {change}
            </div>
        </div>
        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 tracking-tight">{value}</h3>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        revenue: '$12,450.80',
        orders: '142',
        products: '48',
        rating: '4.8/5'
    });

    const recentOrders = [
        { id: '#ORD-7721', customer: 'Alex Rivera', product: 'Premium Headphones', amount: '$299.00', status: 'Processing', time: '2 mins ago' },
        { id: '#ORD-7720', customer: 'Sarah Chen', product: 'Wireless Mouse', amount: '$49.00', status: 'Shipped', time: '15 mins ago' },
        { id: '#ORD-7719', customer: 'Marco V.', product: 'Mechanical Keyboard', amount: '$159.00', status: 'Delivered', time: '1 hour ago' },
        { id: '#ORD-7718', customer: 'Elena G.', product: 'USB-C Hub', amount: '$89.00', status: 'Pending', time: '3 hours ago' },
    ];

    const topProducts = [
        { name: 'Ultra-Slim Laptop', sales: 42, revenue: '$54,600', stock: 12 },
        { name: 'Noise-Cancel Headphones', sales: 38, revenue: '$11,400', stock: 5 },
        { name: '4K Pro Monitor', sales: 29, revenue: '$23,200', stock: 8 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight uppercase">Merchant Overview</h1>
                    <p className="text-sm text-gray-500 font-medium">Monitoring storefront performance and fulfillment status.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2.5 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all border border-gray-100">Export Report</button>
                    <button className="px-4 py-2.5 bg-emerald-600 text-[10px] font-bold text-white uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">Live Sync</button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatusCard title="Total Revenue" value={stats.revenue} change="+12.5%" isPositive={true} icon={DollarSign} color="bg-emerald-500" />
                <StatusCard title="Sales Volume" value={stats.orders} change="+8.2%" isPositive={true} icon={ShoppingBag} color="bg-blue-500" />
                <StatusCard title="Active Listings" value={stats.products} change="-2.4%" isPositive={false} icon={Package} color="bg-orange-500" />
                <StatusCard title="Customer Rating" value={stats.rating} change="+0.3%" isPositive={true} icon={Users} color="bg-purple-500" />
            </div>

            {/* Analytics & Orders Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart Simulation */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-1">Sales Projections</h3>
                            <p className="text-xs text-secondary font-medium">Growth trajectory for the current quarter</p>
                        </div>
                        <select className="bg-gray-50 border-none text-[10px] font-bold uppercase tracking-widest rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>

                    {/* SVG Chart Placeholder */}
                    <div className="flex-1 min-h-[300px] w-full relative flex items-end gap-2 group">
                        {[40, 65, 45, 85, 55, 95, 75, 50, 80, 60, 90, 70].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                                <div
                                    className="w-full bg-emerald-100 rounded-lg relative overflow-hidden transition-all duration-700 ease-out group-hover/bar:bg-emerald-500"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 blur-xl pointer-events-none" />
                                </div>
                                <span className="text-[8px] font-bold text-gray-300 uppercase">D-{12 - i}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Column: Top Products */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm"
                >
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6 pb-4 border-b border-gray-50">Top Velocity Products</h3>
                    <div className="space-y-6">
                        {topProducts.map((product, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-800 truncate uppercase mt-0.5">{product.name}</p>
                                        <p className="text-[10px] text-emerald-600 font-bold tracking-widest">{product.sales} Sales • {product.stock} Stock</p>
                                    </div>
                                </div>
                                <ArrowUpRight size={14} className="text-gray-300 group-hover:text-emerald-500 transition-transform group-hover:translate-x-0.5" />
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-3 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-gray-100">
                        View Inventory Report
                    </button>
                </motion.div>
            </div>

            {/* Recent Orders Table */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
                <div className="p-6 md:p-8 flex items-center justify-between gap-4 bg-white">
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Recent Fulfillment Tasks</h3>
                        <p className="text-xs text-secondary mt-1">Real-time order stream from across the network</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"><Search size={18} /></button>
                        <button className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"><MoreHorizontal size={18} /></button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-y border-gray-100">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Order ID</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Customer Identity</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Item Group</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Value</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentOrders.map((order, i) => (
                                <tr key={i} className="hover:bg-neutral-50/50 transition-colors group cursor-pointer">
                                    <td className="px-8 py-5 text-xs font-bold text-emerald-600 tracking-wider font-mono uppercase">{order.id}</td>
                                    <td className="px-8 py-5 text-xs font-bold text-gray-800 truncate uppercase mt-0.5">{order.customer}</td>
                                    <td className="px-8 py-5">
                                        <span className="text-xs font-bold text-gray-500 truncate uppercase mt-0.5">{order.product}</span>
                                    </td>
                                    <td className="px-8 py-5 text-xs font-bold text-gray-800">{order.amount}</td>
                                    <td className="px-8 py-5">
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit ${order.status === 'Shipped' || order.status === 'Delivered'
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : order.status === 'Processing'
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'bg-rose-50 text-rose-600'
                                            }`}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{order.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Clock size={12} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{order.time}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
