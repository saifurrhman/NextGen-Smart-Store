import React, { useState, useEffect } from 'react';
import { BarChart2, Search, Filter, Download, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import api from '../../../utils/api';

const OrderReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderStats, setOrderStats] = useState({
        last7: { total: 0, revenue: 0, avg: 0, returns: 0, trend: 'Stable' },
        last30: { total: 0, revenue: 0, avg: 0, returns: 0, trend: 'Stable' }
    });
    const [rangeFilter, setRangeFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [showExport, setShowExport] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await api.get('/api/v1/orders/');
                const orders = response.data;
                setReports(orders);
                calculateStats(orders);
            } catch (error) {
                console.error("Failed to fetch order reports:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const calculateStats = (orders) => {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const calc = (daysOrders) => {
            const total = daysOrders.length;
            const revenue = daysOrders.reduce((acc, o) => acc + parseFloat(o.total_amount || 0), 0);
            const avg = total > 0 ? (revenue / total) : 0;
            return { total, revenue, avg, returns: 0, trend: 'Up' };
        };

        setOrderStats({
            last7: calc(orders.filter(o => new Date(o.created_at) >= sevenDaysAgo)),
            last30: calc(orders.filter(o => new Date(o.created_at) >= thirtyDaysAgo))
        });
    };
    return (
        <div className="space-y-6">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <BarChart2 size={22} className="text-brand" />
                        Order Reports
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and view your order reports</p>
                </div>
                {!false && (
                    <div className="flex items-center gap-2 relative">
                        <div className="relative">
                            <button
                                onClick={() => setShowExport(!showExport)}
                                className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <Download size={16} />
                                Export
                            </button>
                            {showExport && (
                                <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-xl z-50 py-2">
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 font-semibold transition-colors">Export as Excel</button>
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 font-semibold transition-colors">Export as PDF</button>
                                </div>
                            )}
                        </div>
                        <button className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors shadow-sm">
                            <Plus size={16} />
                            Create New
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Toolbar */}
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search in Order Reports..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all shadow-sm"
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors w-full sm:w-auto shadow-sm"
                        >
                            <Filter size={16} />
                            Filters
                        </button>
                        {showFilters && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl z-50 py-2">
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 font-semibold transition-colors">Weekly Report</button>
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 font-semibold transition-colors">Monthly Report</button>
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 font-semibold transition-colors">Yearly Report</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>

                                <th className="px-6 py-3">Date Range</th>

                                <th className="px-6 py-3">Total Orders</th>

                                <th className="px-6 py-3">Revenue</th>

                                <th className="px-6 py-3">Avg Order Value</th>

                                <th className="px-6 py-3">Returns</th>

                                <th className="px-6 py-3">Trend</th>

                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-gray-900">Last 7 Days</td>
                                <td className="px-6 py-4 text-gray-600">{orderStats.last7.total.toLocaleString()}</td>
                                <td className="px-6 py-4 text-gray-600">PKR {orderStats.last7.revenue.toLocaleString()}</td>
                                <td className="px-6 py-4 text-gray-600">PKR {orderStats.last7.avg.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                <td className="px-6 py-4 text-gray-600">{orderStats.last7.returns}%</td>
                                <td className="px-6 py-4 text-gray-600 font-medium">{orderStats.last7.trend}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-brand transition-colors"><Edit2 size={16} /></button>
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"><MoreVertical size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-gray-900">Last 30 Days</td>
                                <td className="px-6 py-4 text-gray-600">{orderStats.last30.total.toLocaleString()}</td>
                                <td className="px-6 py-4 text-gray-600">PKR {orderStats.last30.revenue.toLocaleString()}</td>
                                <td className="px-6 py-4 text-gray-600">PKR {orderStats.last30.avg.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                <td className="px-6 py-4 text-gray-600">{orderStats.last30.returns}%</td>
                                <td className="px-6 py-4 text-gray-600 font-medium">{orderStats.last30.trend}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-brand transition-colors"><Edit2 size={16} /></button>
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"><MoreVertical size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 text-sm text-gray-500 flex items-center justify-between">
                    <span>Showing 2 entries</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1 bg-brand text-white rounded">1</button>
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OrderReports;
