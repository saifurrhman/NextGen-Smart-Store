import React, { useState, useEffect } from 'react';
import {
    MoreVertical, ArrowUp, ArrowDown, Search,
    Smartphone, Download, Users, Package, ShoppingBag, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { formatCurrency } = useCurrency();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        products: 0,
        rating: 0
    });

    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [chartData, setChartData] = useState([]);

    // UI Menu States
    const [timeFilter, setTimeFilter] = useState('this_week');
    const [showExportMenu, setShowExportMenu] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/vendors/dashboard/');
                if (response.data) {
                    setStats(response.data.stats);
                    setRecentOrders(response.data.recentOrders || []);
                    setTopProducts(response.data.topProducts || []);
                    setChartData(response.data.chart || Object.values(response.data.weeklyEarnings || {}));
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const generatePath = (data, isArea = false) => {
        if (!data || data.length < 2) return "";
        const maxVal = Math.max(...data, 100) * 1.2;
        const width = 100;
        const height = 80;

        let path = `M 0,${height - (data[0] / maxVal) * height}`;

        data.forEach((point, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - (point / maxVal) * height;

            if (i === 0) return;
            // Simple cubic bezier implementation for smoothness
            const prevX = ((i - 1) / (data.length - 1)) * width;
            const cx = (prevX + x) / 2;
            path += ` C ${cx},${height - (data[i - 1] / maxVal) * height} ${cx},${y} ${x},${y}`;
        });

        if (isArea) {
            path += ` L ${width},100 L 0,100 Z`;
        }
        return path;
    };

    const maxChartValue = Math.max(...(chartData.length ? chartData : [0]), 1000);

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
            {/* Header / Title */}
            <div className="flex items-center justify-between px-1 md:px-0">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Vendor Dashboard</h1>
            </div>

            {/* 1. TOP CARDS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Total Revenue */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 shadow-sm relative">
                    <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-1 rounded-full">
                        <MoreVertical size={18} />
                    </button>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Total Revenue</h3>
                    <p className="text-xs text-gray-400 mb-4">All time earnings</p>
                    <div className="flex items-end gap-3 mb-2">
                        <h2 className="text-3xl font-bold text-gray-800">{formatCurrency(stats.revenue, 0)}</h2>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 shadow-sm relative">
                    <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-1 rounded-full">
                        <MoreVertical size={18} />
                    </button>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Sales Volume</h3>
                    <p className="text-xs text-gray-400 mb-4">Total completed orders</p>
                    <div className="flex items-end gap-3 mb-2">
                        <h2 className="text-3xl font-bold text-gray-800">{stats.orders}</h2>
                    </div>
                </div>

                {/* Total Products */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 shadow-sm relative">
                    <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-1 rounded-full">
                        <MoreVertical size={18} />
                    </button>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Active Listings</h3>
                    <p className="text-xs text-gray-400 mb-4">Currently published</p>
                    <div className="flex items-end gap-3 mb-2">
                        <h2 className="text-3xl font-bold text-gray-800">{stats.products}</h2>
                    </div>
                </div>

                {/* Rating */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 shadow-sm relative">
                    <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-1 rounded-full">
                        <MoreVertical size={18} />
                    </button>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Average Rating</h3>
                    <p className="text-xs text-gray-400 mb-4">From customer reviews</p>
                    <div className="flex items-end gap-3 mb-2">
                        <h2 className="text-3xl font-bold text-gray-800">{stats.rating > 0 ? `${stats.rating}/5.0` : 'N/A'}</h2>
                    </div>
                </div>
            </div>

            {/* 2. MAIN CHARTS ROW */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* BIG CHART PANEL */}
                <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 p-4 md:p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-800">
                            Sales Analytics
                        </h3>
                        <div className="flex items-center gap-3 relative">
                            <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs shadow-sm">
                                {[
                                    { id: 'this_week', label: 'Past 7 Days' },
                                    { id: 'monthly', label: 'Last 30 Days' },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setTimeFilter(tab.id)}
                                        className={`px-3 py-1 font-medium border-r border-gray-200 last:border-r-0 transition-colors ${timeFilter === tab.id ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <button onClick={() => setShowExportMenu(!showExportMenu)} className="text-gray-400 hover:text-gray-800 transition-colors bg-gray-50 p-1 rounded-full">
                                    <MoreVertical size={16} />
                                </button>
                                {showExportMenu && (
                                    <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-10 text-xs">
                                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2">
                                            <Download size={12} className="text-emerald-500" /> Export Excel
                                        </button>
                                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2">
                                            <Download size={12} className="text-red-500" /> Export PDF
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chart Stats Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:gap-8 gap-4 mb-8 border-b border-gray-100 pb-4">
                        <div className="relative">
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">{formatCurrency(stats.revenue)}</h2>
                            <p className="text-[10px] md:text-xs text-gray-400">Total Revenue</p>
                            <div className="absolute -bottom-4 left-0 w-full h-[3px] bg-emerald-400 rounded-t md:block hidden"></div>
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">{stats.orders}</h2>
                            <p className="text-[10px] md:text-xs text-gray-400">Total Orders</p>
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">{topProducts.length}</h2>
                            <p className="text-[10px] md:text-xs text-gray-400">Selling Products</p>
                        </div>
                    </div>

                    {/* Simple SVG Chart Representation */}
                    <div className="relative h-32 md:h-64 w-full mt-8">
                        {/* Y-axis Labels */}
                        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400 pb-6 pointer-events-none">
                            <span>{formatCurrency(maxChartValue * 1.2, 0)}</span>
                            <span>{formatCurrency(maxChartValue * 0.96, 0)}</span>
                            <span>{formatCurrency(maxChartValue * 0.72, 0)}</span>
                            <span>{formatCurrency(maxChartValue * 0.48, 0)}</span>
                            <span>{formatCurrency(maxChartValue * 0.24, 0)}</span>
                            <span>$0</span>
                        </div>

                        {/* Chart Area */}
                        <div className="absolute left-14 right-0 h-full pb-6">
                            {/* Grid Lines */}
                            <div className="w-full h-full flex flex-col justify-between">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="w-full border-b border-gray-50"></div>
                                ))}
                            </div>

                            {/* SVG Line & Area Fill */}
                            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d={generatePath(chartData.length ? chartData : [0, 0, 0, 0, 0, 0, 0], true)}
                                    fill="url(#chartGradient)"
                                />
                                <path
                                    d={generatePath(chartData.length ? chartData : [0, 0, 0, 0, 0, 0, 0], false)}
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="2"
                                />
                                {/* Tooltip Marker (Last Point) */}
                                {chartData.length > 0 && (
                                    <circle
                                        cx="100"
                                        cy={80 - (chartData[chartData.length - 1] / (maxChartValue * 1.2)) * 80}
                                        r="2"
                                        fill="white"
                                        stroke="#10b981"
                                        strokeWidth="1"
                                    />
                                )}
                            </svg>
                        </div>

                        {/* X-axis Labels */}
                        <div className="absolute left-14 right-0 bottom-0 flex justify-between text-[10px] text-gray-400 font-medium">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                                <span key={idx} className={idx === 6 ? "text-gray-800 font-bold" : ""}>{day}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">Top Selling Products</h3>
                        <button
                            onClick={() => navigate('/vendor/products')}
                            className="text-[10px] text-blue-600 font-semibold hover:underline">All Products</button>
                    </div>

                    <div className="space-y-4 flex-1">
                        {topProducts.map((product, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <Smartphone size={18} className="text-gray-600" />
                                </div>
                                <div className="flex-1 min-w-0 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-bold text-gray-800 truncate uppercase mt-0.5">{product.name}</p>
                                        <p className="text-[10px] text-emerald-600 font-bold tracking-widest">{product.sales} Sales • {product.stock} Stock</p>
                                    </div>
                                    <span className="text-xs font-black text-emerald-600 ml-2">{formatCurrency(product.sales * 100)}</span>
                                </div>
                            </div>
                        ))}
                        {topProducts.length === 0 && (
                            <div className="py-4 text-center text-gray-400 italic font-bold">No products found</div>
                        )}
                    </div>
                    <div className="flex justify-end mt-2 pt-4 border-t border-gray-50">
                        <button
                            onClick={() => navigate('/vendor/products')}
                            className="w-full py-2 border border-emerald-200 text-emerald-600 rounded-full text-xs font-semibold hover:bg-emerald-50 transition-colors">
                            Inventory Management
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. RECENT ORDERS TABLE */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-gray-800">Recent Orders</h3>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Orders..."
                                className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 w-48"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="text-gray-400 font-medium border-b border-gray-50">
                            <tr>
                                <th className="pb-3 px-2 font-medium">Order ID</th>
                                <th className="pb-3 px-2 font-medium">Customer Details</th>
                                <th className="pb-3 px-2 font-medium">Items</th>
                                <th className="pb-3 px-2 font-medium">Total Value</th>
                                <th className="pb-3 px-2 font-medium">Status</th>
                                <th className="pb-3 px-2 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {recentOrders.map((order, idx) => (
                                <tr key={idx} className="border-b border-gray-50/50 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-2 font-bold uppercase">#{order.id.slice(-8)}</td>
                                    <td className="py-4 px-2">
                                        <p className="font-bold">{order.customer}</p>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase">{order.type} SHIPMENT</p>
                                    </td>
                                    <td className="py-4 px-2 flex items-center gap-1"><Package size={14} className="text-gray-400" /> {order.items}</td>
                                    <td className="py-4 px-2 font-bold">{formatCurrency(order.total, 0)}</td>
                                    <td className="py-4 px-2">
                                        <span className="flex items-center gap-1.5 font-bold">
                                            <span className={`w-1.5 h-1.5 rounded-full ${order.status.toLowerCase() === 'pending' ? 'bg-yellow-400' : order.status.toLowerCase() === 'refunded' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-2 text-gray-500 font-bold">{order.date}</td>
                                </tr>
                            ))}
                            {recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-gray-400 italic font-bold">No recent orders generated yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => navigate('/vendor/orders')}
                        className="px-5 py-2 text-xs font-medium text-emerald-600 border border-emerald-200 rounded-full hover:bg-emerald-50 transition-colors">
                        View All Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
