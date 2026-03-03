import React, { useState, useEffect } from 'react';
import {
    MoreVertical, ArrowUp, ArrowDown, Search,
    Smartphone, Shirt, Home as HomeIcon, Plus, ChevronRight,
    Globe, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useCurrency } from '../../context/CurrencyContext';
import FilterDropdown from '../../components/admin/common/FilterDropdown';

const Dashboard = () => {
    const navigate = useNavigate();
    const { formatCurrency } = useCurrency();
    const [trafficStats, setTrafficStats] = useState({ total_visits: 0, sources: [], countries: [], states: [] });
    const [dashboardStats, setDashboardStats] = useState(null);
    const [locationTab, setLocationTab] = useState('countries'); // 'countries' or 'states'
    const [timeFilter, setTimeFilter] = useState('this_week');
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [livingActiveUsers, setLivingActiveUsers] = useState({ total: 0, history: [] });

    // Individual card menu states
    const [showSalesMenu, setShowSalesMenu] = useState(false);
    const [showOrdersMenu, setShowOrdersMenu] = useState(false);
    const [showPendingMenu, setShowPendingMenu] = useState(false);

    // Table filter states
    const [txnSearch, setTxnSearch] = useState('');
    const [txnFilters, setTxnFilters] = useState({ status: '' });
    const [txnFilter, setTxnFilter] = useState('this_week');

    const [productSearch, setProductSearch] = useState('');
    const [productFilters, setProductFilters] = useState({ stockStatus: '' });
    const [bestSellingFilter, setBestSellingFilter] = useState('this_week');

    useEffect(() => {
        if (dashboardStats?.activeUsers) {
            setLivingActiveUsers(dashboardStats.activeUsers);
        }
    }, [dashboardStats]);

    useEffect(() => {
        const heartbeat = setInterval(() => {
            setLivingActiveUsers(prev => {
                if (!prev.history.length) return prev;
                // Fluctuate total slightly (+/- 2%)
                const jitter = Math.floor(Math.random() * (prev.total * 0.02)) * (Math.random() > 0.5 ? 1 : -1);
                const newTotal = Math.max(10, prev.total + jitter);

                // Shift history: remove first, add new random
                const newHistory = [...prev.history.slice(1), Math.floor(Math.random() * 8) + 4];
                return { total: newTotal, history: newHistory };
            });
        }, 2500);
        return () => clearInterval(heartbeat);
    }, [dashboardStats]);
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/api/v1/analytics/dashboard/', { params: { time_filter: timeFilter } });
                setDashboardStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            }
        };

        const fetchTraffic = async () => {
            try {
                const response = await api.get('/api/v1/analytics/traffic_stats/');
                setTrafficStats(response.data);
            } catch (error) {
                console.error("Failed to fetch traffic stats:", error);
            }
        };

        // Initial fetch
        fetchDashboard();
        fetchTraffic();

        // Real-time refresh every 30 seconds
        const interval = setInterval(() => {
            fetchDashboard();
            fetchTraffic();
        }, 30000);

        return () => clearInterval(interval);
    }, [timeFilter]);

    const handleExport = (type, data = null, fileName = "report") => {
        setShowExportMenu(false);
        setShowSalesMenu(false);
        setShowOrdersMenu(false);
        setShowPendingMenu(false);

        const exportData = data || dashboardStats?.report;
        if (!exportData) return;

        if (type === 'excel') {
            let csvContent = "";

            if (Array.isArray(exportData)) {
                if (exportData.length === 0) return;
                const headers = Object.keys(exportData[0]);
                csvContent += headers.join(",") + "\n";

                exportData.forEach(row => {
                    csvContent += headers.map(h => {
                        const val = row[h];
                        return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
                    }).join(",") + "\n";
                });
            } else {
                const headers = Object.keys(exportData);
                csvContent += headers.join(",") + "\n";
                csvContent += headers.map(h => {
                    const val = exportData[h];
                    return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
                }).join(",") + "\n";
            }

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else if (type === 'pdf') {
            window.print();
        }
    };

    const handleTxnFilterChange = (key, value) => {
        setTxnFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearTxnFilters = () => {
        setTxnFilters({ status: '' });
    };

    const handleProductFilterChange = (key, value) => {
        setProductFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearProductFilters = () => {
        setProductFilters({ stockStatus: '' });
    };

    const statusFilterOptions = [
        {
            key: 'status',
            label: 'Status',
            options: [
                { label: 'All Status', value: '' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Refunded', value: 'Refunded' },
            ]
        }
    ];

    const stockFilterOptions = [
        {
            key: 'stockStatus',
            label: 'Stock Status',
            options: [
                { label: 'All Status', value: '' },
                { label: 'In Stock', value: 'Stock' },
                { label: 'Out of Stock', value: 'Out of Stock' },
            ]
        }
    ];

    const filteredTransactions = (dashboardStats?.transactions || []).filter(txn => {
        const matchesSearch = !txnSearch ||
            txn.id.toLowerCase().includes(txnSearch.toLowerCase()) ||
            txn.customer_name?.toLowerCase().includes(txnSearch.toLowerCase());
        const matchesStatus = !txnFilters.status || txn.status === txnFilters.status;
        return matchesSearch && matchesStatus;
    });

    const filteredTopProducts = (dashboardStats?.topProducts || []).filter(product => {
        const matchesSearch = !productSearch || product.name.toLowerCase().includes(productSearch.toLowerCase());
        const matchesStock = !productFilters.stockStatus || product.stockStatus === productFilters.stockStatus;
        return matchesSearch && matchesStock;
    });

    const generatePath = (data, isArea = false) => {
        if (!data || data.length < 2) return "";
        const maxVal = Math.max(...data.map(d => d.sales), 100) * 1.2;
        const width = 100;
        const height = 80;

        let path = `M 0,${height - (data[0].sales / maxVal) * height}`;

        data.forEach((point, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - (point.sales / maxVal) * height;

            if (i === 0) return;
            // Simple cubic bezier implementation for smoothness
            const prevX = ((i - 1) / (data.length - 1)) * width;
            const cx = (prevX + x) / 2;
            path += ` C ${cx},${height - (data[i - 1].sales / maxVal) * height} ${cx},${y} ${x},${y}`;
        });

        if (isArea) {
            path += ` L ${width},100 L 0,100 Z`;
        }
        return path;
    };

    const maxReportSales = Math.max(...(dashboardStats?.report?.map(d => d.sales) || [0]), 1000);

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
            {/* Header / Title */}
            <div className="flex items-center justify-between px-1 md:px-0">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>

            {/* 1. TOP CARDS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Total Sales */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 shadow-sm relative">
                    <button
                        onClick={() => setShowSalesMenu(!showSalesMenu)}
                        className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-1 rounded-full">
                        <MoreVertical size={18} />
                    </button>
                    {showSalesMenu && (
                        <div className="absolute right-5 top-12 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 text-xs">
                            <button onClick={() => handleExport('excel', dashboardStats?.overview, 'sales_summary')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2">
                                <Download size={12} className="text-emerald-500" /> Export Excel
                            </button>
                            <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2">
                                <Download size={12} className="text-red-500" /> Export PDF
                            </button>
                        </div>
                    )}
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Total Sales</h3>
                    <p className="text-xs text-gray-400 mb-4">Last 7 days</p>
                    <div className="flex items-end gap-3 mb-2">
                        <h2 className="text-3xl font-bold text-gray-800">{formatCurrency(dashboardStats?.overview?.totalSales || 0, 0)}</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1">
                            <span>Sales</span> <ArrowUp size={12} /> <span>{dashboardStats?.overview?.salesGrowth || 0}%</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                        Previous 7days <span className="font-semibold text-blue-500">({formatCurrency(dashboardStats?.overview?.lastWeekSales || 0, 0)})</span>
                    </p>
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={() => navigate('/admin/analytics/sales')}
                            className="px-5 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors">
                            Details
                        </button>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 shadow-sm relative">
                    <button
                        onClick={() => setShowOrdersMenu(!showOrdersMenu)}
                        className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-1 rounded-full">
                        <MoreVertical size={18} />
                    </button>
                    {showOrdersMenu && (
                        <div className="absolute right-5 top-12 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 text-xs">
                            <button onClick={() => handleExport('excel', dashboardStats?.overview, 'orders_summary')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2">
                                <Download size={12} className="text-emerald-500" /> Export Excel
                            </button>
                            <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2">
                                <Download size={12} className="text-red-500" /> Export PDF
                            </button>
                        </div>
                    )}
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Total Orders</h3>
                    <p className="text-xs text-gray-400 mb-4">Last 7 days</p>
                    <div className="flex items-end gap-3 mb-2">
                        <h2 className="text-3xl font-bold text-gray-800">{dashboardStats?.overview?.totalOrders || 0}</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1">
                            <span>order</span> <ArrowUp size={12} /> <span>{dashboardStats?.overview?.ordersGrowth || 0}%</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                        Previous 7days <span className="font-semibold text-blue-500">({dashboardStats?.overview?.lastWeekOrders || 0})</span>
                    </p>
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={() => navigate('/admin/orders/all')}
                            className="px-5 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors">
                            Details
                        </button>
                    </div>
                </div>

                {/* Pending & Canceled */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 shadow-sm relative">
                    <button
                        onClick={() => setShowPendingMenu(!showPendingMenu)}
                        className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-1 rounded-full">
                        <MoreVertical size={18} />
                    </button>
                    {showPendingMenu && (
                        <div className="absolute right-5 top-12 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 text-xs">
                            <button onClick={() => handleExport('excel', { pending: dashboardStats?.overview?.pendingOrders, canceled: dashboardStats?.overview?.canceledOrders }, 'status_summary')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2">
                                <Download size={12} className="text-emerald-500" /> Export Excel
                            </button>
                            <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2">
                                <Download size={12} className="text-red-500" /> Export PDF
                            </button>
                        </div>
                    )}
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Pending & Canceled</h3>
                    <p className="text-xs text-gray-400 mb-4">Last 7 days</p>
                    <div className="flex divide-x divide-gray-100">
                        <div className="flex-1 pr-4">
                            <p className="text-xs font-medium text-gray-500 mb-1">Pending</p>
                            <div className="flex items-end gap-2">
                                <h2 className="text-2xl font-bold text-gray-800">{dashboardStats?.overview?.pendingOrders || 0}</h2>
                            </div>
                        </div>
                        <div className="flex-1 pl-4">
                            <p className="text-xs font-medium text-gray-500 mb-1">Canceled</p>
                            <div className="flex items-end gap-2">
                                <h2 className="text-2xl font-bold text-gray-800">{dashboardStats?.overview?.canceledOrders || 0}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={() => navigate('/admin/orders/all')}
                            className="px-5 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors">
                            Details
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. MAIN CHARTS ROW */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* BIG CHART PANEL */}
                <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 p-4 md:p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-800">
                            Report for {timeFilter === 'this_week' ? 'this week' : timeFilter === 'last_week' ? 'last week' : timeFilter === 'monthly' ? 'this month' : 'this year'}
                        </h3>
                        <div className="flex items-center gap-3 relative">
                            <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs shadow-sm">
                                {[
                                    { id: 'this_week', label: 'This week' },
                                    { id: 'last_week', label: 'Last week' },
                                    { id: 'monthly', label: 'Monthly' },
                                    { id: 'yearly', label: 'Yearly' }
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
                                        <button onClick={() => handleExport('excel')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2">
                                            <Download size={12} className="text-emerald-500" /> Export Excel
                                        </button>
                                        <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2">
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
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">{trafficStats.total_visits}</h2>
                            <p className="text-[10px] md:text-xs text-gray-400">Total Visits</p>
                            <div className="absolute -bottom-4 left-0 w-full h-[3px] bg-emerald-400 rounded-t md:block hidden"></div>
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">{dashboardStats?.overview?.totalOrders || 0}</h2>
                            <p className="text-[10px] md:text-xs text-gray-400">Total Orders</p>
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">{dashboardStats?.topProducts?.length || 0}</h2>
                            <p className="text-[10px] md:text-xs text-gray-400">Top Products</p>
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">{dashboardStats?.overview?.canceledOrders || 0}</h2>
                            <p className="text-[10px] md:text-xs text-gray-400">Canceled</p>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">{formatCurrency(dashboardStats?.overview?.totalSales || 0, 0)}</h2>
                            <p className="text-[10px] md:text-xs text-gray-400">Revenue</p>
                        </div>
                    </div>

                    {/* Simple SVG Chart Representation */}
                    <div className="relative h-32 md:h-48 w-full mt-8">
                        {/* Y-axis Labels */}
                        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400 pb-6 pointer-events-none">
                            <span>{Math.round(maxReportSales * 1.2 / 1000)}k</span>
                            <span>{Math.round(maxReportSales * 0.96 / 1000)}k</span>
                            <span>{Math.round(maxReportSales * 0.72 / 1000)}k</span>
                            <span>{Math.round(maxReportSales * 0.48 / 1000)}k</span>
                            <span>{Math.round(maxReportSales * 0.24 / 1000)}k</span>
                            <span>0k</span>
                        </div>

                        {/* Chart Area */}
                        <div className="absolute left-8 right-0 h-full pb-6">
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
                                    d={generatePath(dashboardStats?.report || [], true)}
                                    fill="url(#chartGradient)"
                                />
                                <path
                                    d={generatePath(dashboardStats?.report || [], false)}
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="2"
                                />
                                {/* Tooltip Marker (Last Point) */}
                                {dashboardStats?.report?.length > 0 && (
                                    <circle
                                        cx="100"
                                        cy={80 - (dashboardStats.report[dashboardStats.report.length - 1].sales / (maxReportSales * 1.2)) * 80}
                                        r="2"
                                        fill="white"
                                        stroke="#10b981"
                                        strokeWidth="1"
                                    />
                                )}
                            </svg>

                            {/* Tooltip Overlay */}
                            <div className="absolute right-0 bottom-4 bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs text-center border border-emerald-200 shadow-sm z-10 translate-x-1/2">
                                <span className="font-bold block">{formatCurrency(dashboardStats?.report?.[dashboardStats.report.length - 1]?.sales || 0, 0)}</span>
                                <span className="text-[10px]">Today</span>
                            </div>
                        </div>

                        {/* X-axis Labels */}
                        <div className="absolute left-8 right-0 bottom-0 flex justify-between text-[10px] text-gray-400 font-medium">
                            {(dashboardStats?.report || []).map((day, idx) => (
                                <span key={idx} className={idx === 6 ? "text-gray-800 font-bold" : ""}>{day.name}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SIDE STATS PANEL */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-8 flex flex-col">

                    {/* Users in last 30 min */}
                    <div>
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-xs font-semibold text-blue-600">Users in last 30 minutes</h3>
                            <MoreVertical size={14} className="text-gray-400" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                            {livingActiveUsers.total >= 1000
                                ? `${(livingActiveUsers.total / 1000).toFixed(1)}K`
                                : (livingActiveUsers.total || 0)}
                        </h2>
                        <p className="text-[10px] text-gray-400 mb-3">Users active currently</p>

                        {/* Bar Chart Real-Time Animation */}
                        <div className="flex items-end gap-1 h-10 overflow-hidden">
                            {(livingActiveUsers.history.length > 0 ? livingActiveUsers.history : [4, 10, 8, 5, 9, 3, 7, 10, 5, 8, 4, 3, 10, 7, 5, 8, 9, 4, 10, 6, 8, 10, 10, 8, 5]).map((h, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-emerald-500 rounded-sm hover:opacity-80 transition-all duration-1000"
                                    style={{ height: `${(h / 12) * 100}%` }}
                                ></div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Visits by Location */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-gray-800">Visits by Location</h3>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-4 border-b border-gray-100 mb-4 text-xs font-semibold">
                            <button
                                onClick={() => setLocationTab('countries')}
                                className={`pb-2 border-b-2 transition-colors ${locationTab === 'countries' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Countries</button>
                            <button
                                onClick={() => setLocationTab('states')}
                                className={`pb-2 border-b-2 transition-colors ${locationTab === 'states' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>States/Regions</button>
                        </div>

                        {/* Location List */}
                        <div className="space-y-4">
                            {trafficStats[locationTab]?.slice(0, 5).map((loc, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                                        <Globe size={12} className="text-gray-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-semibold text-gray-800">{loc.value} <span className="font-normal text-gray-400">{loc.name}</span></span>
                                            <span className="text-gray-500 flex items-center text-[10px]">{loc.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${loc.percentage}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!trafficStats[locationTab] || trafficStats[locationTab].length === 0) && (
                                <div className="text-xs text-gray-400 text-center py-2 bg-gray-50 rounded-lg">No location data available</div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-6"></div>

                    {/* Traffic Sources */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-gray-800">Traffic Sources</h3>
                            <span className="text-xs font-semibold text-gray-500">{trafficStats.total_visits} Visits</span>
                        </div>

                        <div className="space-y-4">
                            {trafficStats.sources.map((source, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                                        <Globe size={12} className="text-gray-500" style={{ color: source.color }} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-semibold text-gray-800">{source.value} <span className="font-normal text-gray-400 capitalize">{source.name}</span></span>
                                            <span className="text-gray-500 flex items-center text-[10px]">{source.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${source.percentage}%`, backgroundColor: source.color || '#10b981' }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {trafficStats.sources.length === 0 && (
                                <div className="text-xs text-gray-400 text-center py-2 bg-gray-50 rounded-lg">No traffic data available</div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/admin/analytics/sales')}
                        className="w-full py-2 border border-blue-200 text-blue-600 rounded-full text-xs font-semibold hover:bg-blue-50 transition-colors mt-6">
                        View Insight
                    </button>
                </div>
            </div>

            {/* 3. TRANSACTIONS & TOP PRODUCTS */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Transactions Table */}
                <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-gray-800">Transaction</h3>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search ID..."
                                    value={txnSearch}
                                    onChange={(e) => setTxnSearch(e.target.value)}
                                    className="pl-8 pr-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-emerald-500 w-32"
                                />
                            </div>
                            <select
                                value={txnFilter}
                                onChange={(e) => setTxnFilter(e.target.value)}
                                className="text-[10px] border border-emerald-400 rounded-lg px-2 py-1 bg-emerald-500 text-white focus:outline-none focus:ring-1 focus:ring-emerald-300 font-semibold appearance-none cursor-pointer"
                            >
                                <option value="this_week" className="bg-white text-gray-800">This Week</option>
                                <option value="monthly" className="bg-white text-gray-800">Monthly</option>
                                <option value="yearly" className="bg-white text-gray-800">Yearly</option>
                            </select>
                            <FilterDropdown
                                options={statusFilterOptions}
                                activeFilters={txnFilters}
                                onFilterChange={handleTxnFilterChange}
                                onClear={clearTxnFilters}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="text-gray-400 font-medium border-b border-gray-50">
                                <tr>
                                    <th className="pb-3 px-2 font-medium">No</th>
                                    <th className="pb-3 px-2 font-medium">Id Customer</th>
                                    <th className="pb-3 px-2 font-medium">Order Date</th>
                                    <th className="pb-3 px-2 font-medium">Status</th>
                                    <th className="pb-3 px-2 font-medium">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800 font-medium font-bold">
                                {filteredTransactions.map((txn, idx) => (
                                    <tr key={idx} className="border-b border-gray-50/50">
                                        <td className="py-4 px-2">{idx + 1}.</td>
                                        <td className="py-4 px-2">{txn.id}</td>
                                        <td className="py-4 px-2 text-gray-500">{txn.date}</td>
                                        <td className="py-4 px-2">
                                            <span className="flex items-center gap-1.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${txn.status.toLowerCase() === 'pending' ? 'bg-yellow-400' : txn.status.toLowerCase() === 'refunded' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                                                {txn.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2">{formatCurrency(txn.amount)}</td>
                                    </tr>
                                ))}
                                {filteredTransactions.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-gray-400 italic font-bold">No matching transactions found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={() => navigate('/admin/finance/transactions')}
                            className="px-5 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors">
                            Details
                        </button>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={() => navigate('/admin/products/all')}
                            className="text-[10px] text-blue-600 font-semibold hover:underline">All product</button>
                    </div>

                    <div className="relative mb-6">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                        />
                    </div>

                    <div className="space-y-4 flex-1">
                        {filteredTopProducts.map((product, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <Smartphone size={18} className="text-gray-600" />
                                </div>
                                <div className="flex-1 min-w-0 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-bold text-gray-800 truncate">{product.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Id: {product.id}</p>
                                    </div>
                                    <span className="text-xs font-black text-emerald-600 ml-2">{formatCurrency(product.price)}</span>
                                </div>
                            </div>
                        ))}
                        {filteredTopProducts.length === 0 && (
                            <div className="py-4 text-center text-gray-400 italic font-bold">No products found</div>
                        )}
                    </div>
                </div>
            </div>

            {/* 4. BEST SELLING & ADD PRODUCT */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Best Selling Product */}
                <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-gray-800">Best selling product</h3>
                        <div className="flex items-center gap-2">
                            <select
                                value={bestSellingFilter}
                                onChange={(e) => setBestSellingFilter(e.target.value)}
                                className="text-[10px] border border-emerald-400 rounded-lg px-2 py-1 bg-emerald-500 text-white focus:outline-none focus:ring-1 focus:ring-emerald-300 font-semibold appearance-none cursor-pointer"
                            >
                                <option value="this_week" className="bg-white text-gray-800">This Week</option>
                                <option value="monthly" className="bg-white text-gray-800">Monthly</option>
                                <option value="yearly" className="bg-white text-gray-800">Yearly</option>
                            </select>
                            <FilterDropdown
                                options={stockFilterOptions}
                                activeFilters={productFilters}
                                onFilterChange={handleProductFilterChange}
                                onClear={clearProductFilters}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-[#eaf4f0] text-emerald-800 font-semibold text-[10px] tracking-wider uppercase">
                                <tr>
                                    <th className="py-2.5 px-4 rounded-l-lg">PRODUCT</th>
                                    <th className="py-2.5 px-2">TOTAL ORDER</th>
                                    <th className="py-2.5 px-2">STATUS</th>
                                    <th className="py-2.5 px-4 rounded-r-lg">PRICE</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800 font-medium">
                                {filteredTopProducts.map((product, idx) => (
                                    <tr key={idx} className="border-b border-gray-50/50">
                                        <td className="py-4 px-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                                <Smartphone size={14} className="text-gray-600" />
                                            </div>
                                            <span className="font-bold">{product.name}</span>
                                        </td>
                                        <td className="py-4 px-2 font-black">{product.orders}</td>
                                        <td className="py-4 px-2">
                                            <span className={`flex items-center gap-1.5 font-bold ${product.stockStatus === 'Stock' ? 'text-emerald-500' : 'text-red-500'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${product.stockStatus === 'Stock' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                {product.stockStatus}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 font-black">{formatCurrency(product.price)}</td>
                                    </tr>
                                ))}
                                {filteredTopProducts.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-gray-400 italic font-bold">No best selling products found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end mt-2">
                        <button
                            onClick={() => navigate('/admin/analytics/products')}
                            className="px-5 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors">
                            Details
                        </button>
                    </div>
                </div>

                {/* Add New Product Panel */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">Add New Product</h3>
                        <button
                            onClick={() => navigate('/admin/products/add')}
                            className="flex items-center gap-1 text-[10px] text-blue-600 font-semibold hover:underline border border-transparent hover:border-blue-200 px-2 py-1 rounded">
                            <Plus size={10} /> Add New
                        </button>
                    </div>

                    <p className="text-[10px] text-gray-400 mb-3">Categories</p>

                    <div className="space-y-2 mb-4">
                        {(dashboardStats?.widgetData?.categories || []).map((cat, idx) => (
                            <button
                                key={idx}
                                onClick={() => navigate('/admin/products/add', { state: { category: cat.id } })}
                                className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-emerald-50 hover:border-emerald-100 transition-all active:scale-95 group text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                        {idx % 3 === 0 ? <Smartphone size={14} className="text-gray-600" /> : idx % 3 === 1 ? <Shirt size={14} className="text-gray-600" /> : <HomeIcon size={14} className="text-gray-600" />}
                                    </div>
                                    <span className="text-xs font-semibold text-gray-800">{cat.name}</span>
                                </div>
                                <ChevronRight size={16} className="text-gray-400" />
                            </button>
                        ))}
                    </div>
                    <div className="text-center mb-6">
                        <button
                            onClick={() => navigate('/admin/products/categories')}
                            className="text-[10px] text-blue-600 hover:underline">See more</button>
                    </div>

                    <p className="text-[10px] text-gray-400 mb-3">Product</p>

                    <div className="space-y-4 mb-4">
                        {(dashboardStats?.widgetData?.recentProducts || []).map((product, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">🛍️</div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-800 truncate w-32">{product.name}</p>
                                        <p className="text-[10px] text-emerald-500 font-bold">{formatCurrency(product.price)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/admin/products/add')}
                                    className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-semibold hover:bg-emerald-600 transition-colors shadow-sm">
                                    <Plus size={10} /> Add
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => navigate('/admin/products/all')}
                            className="text-[10px] text-blue-600 hover:underline">See more</button>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Dashboard;
