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
    Search,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';

const StatusCard = ({ title, value, change, isPositive, icon: Icon, colorName = "emerald" }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group relative overflow-hidden"
    >
        <div className={`absolute top-0 right-0 w-24 h-24 bg-${colorName}-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110`} />

        <div className="flex justify-between items-start mb-6 relative z-10">
            <div className={`p-3 rounded-2xl bg-${colorName}-50 text-${colorName}-600`}>
                <Icon size={22} strokeWidth={2.5} />
            </div>
            {change && (
                <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                    {isPositive ? <TrendingUp size={10} strokeWidth={3} /> : <TrendingDown size={10} strokeWidth={3} />}
                    {change}
                </div>
            )}
        </div>
        <div className="relative z-10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1.5">{title}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{value}</h3>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const { formatCurrency } = useCurrency();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        revenue: 0,
        orders: '0',
        products: '0',
        rating: 0
    });

    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/vendors/dashboard/');
                if (response.data) {
                    setStats(response.data.stats);
                    setRecentOrders(response.data.recentOrders || []);
                    setTopProducts(response.data.topProducts || []);
                    setChartData(response.data.chart || []);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

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
                <StatusCard title="Total Revenue" value={formatCurrency(stats.revenue)} icon={DollarSign} colorName="emerald" />
                <StatusCard title="Sales Volume" value={stats.orders} icon={ShoppingBag} colorName="blue" />
                <StatusCard title="Active Listings" value={stats.products} icon={Package} colorName="orange" />
                <StatusCard title="Customer Rating" value={stats.rating > 0 ? `${stats.rating}/5` : 'No reviews'} icon={Users} colorName="purple" />
            </div>

            {/* Analytics & Orders Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart Simulation */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col h-full relative overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div>
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-[0.2em] mb-1">Sales Projections</h3>
                            <p className="text-xs text-gray-400 font-medium">Growth trajectory for the current quarter</p>
                        </div>
                        <select className="bg-gray-50 border-none text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>

                    {/* SVG Chart Placeholder */}
                    <div className="flex-1 min-h-[300px] w-full relative flex items-end gap-3 group px-4 pb-8">
                        {(chartData.length > 0 ? chartData : [20, 40, 30, 70, 50, 80, 60, 90, 70, 100, 80, 95]).map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar h-full justify-end">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max(8, height)}%` }}
                                    transition={{ duration: 1, delay: i * 0.05, ease: "circOut" }}
                                    className="w-full bg-emerald-500/10 rounded-2xl relative overflow-hidden transition-all duration-500 group-hover/bar:bg-emerald-500 group-hover/bar:shadow-lg group-hover/bar:shadow-emerald-500/20"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                                </motion.div>
                                <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest group-hover/bar:text-emerald-500 transition-colors">D-{chartData.length - i}</span>
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
                        {topProducts.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-xs font-bold uppercase tracking-widest">No product sales yet</div>
                        ) : (
                            topProducts.map((product, i) => (
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
                            ))
                        )}
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
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">No recent orders found</td>
                                </tr>
                            ) : (
                                recentOrders.map((order, i) => (
                                    <tr key={i} className="hover:bg-neutral-50/50 transition-colors group cursor-pointer">
                                        <td className="px-8 py-5 text-xs font-bold text-emerald-600 tracking-wider font-mono uppercase">{order.id}</td>
                                        <td className="px-8 py-5 text-xs font-bold text-gray-800 truncate uppercase mt-0.5">{order.customer}</td>
                                        <td className="px-8 py-5">
                                            <span className="text-xs font-bold text-gray-500 truncate uppercase mt-0.5">{order.product}</span>
                                        </td>
                                        <td className="px-8 py-5 text-xs font-bold text-gray-800">{formatCurrency(order.amount)}</td>
                                        <td className="px-8 py-5">
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit ${order.status === 'Shipped' || order.status === 'Delivered'
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : order.status === 'Processing'
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : order.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
