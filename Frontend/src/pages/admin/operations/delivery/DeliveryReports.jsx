import React, { useState, useEffect } from 'react';
import {
    BarChart3, PieChart, TrendingUp, Truck,
    Calendar, Download as ExportIcon, Filter,
    ChevronLeft, ChevronRight, Search,
    ChevronDown, FileText, CheckCircle2, Clock, AlertTriangle
} from 'lucide-react';
import api from '../../../../utils/api';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../../utils/exportUtils';
import { motion, AnimatePresence } from 'framer-motion';
import FilterDropdown from '../../../../components/admin/common/FilterDropdown';

const DeliveryReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        timeRange: 'this_month',
        status: ''
    });
    const [showExportOptions, setShowExportOptions] = useState(false);

    const stats = [
        { label: 'Success Rate', value: '98.2%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Avg. Finish Time', value: '42 mins', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Delayed', value: '1.8%', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Active Specialists', value: '24', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    useEffect(() => {
        fetchReports();
    }, [filters]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            // Simulated report data based on delivery history
            const response = await api.get(`/api/v1/operations/delivery/report/?range=${filters.timeRange}`);
            setReports(response.data.results || []);
        } catch (error) {
            console.error("Failed to fetch delivery reports:", error);
            // Fallback for demo
            setReports([
                { id: 1, date: '2024-03-01', total: 145, delivered: 142, cancelled: 2, pending: 1, efficiency: '97.9%' },
                { id: 2, date: '2024-03-02', total: 168, delivered: 165, cancelled: 1, pending: 2, efficiency: '98.2%' },
                { id: 3, date: '2024-03-03', total: 132, delivered: 128, cancelled: 3, pending: 1, efficiency: '96.9%' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = () => {
        const dataToExport = reports.map(r => ({
            "Date": r.date,
            "Total Assignments": r.total,
            "Successfully Delivered": r.delivered,
            "Cancelled": r.cancelled,
            "Efficiency": r.efficiency
        }));
        exportToExcel(dataToExport, "Delivery_Performance_Report");
        setShowExportOptions(false);
    };

    const handleExportCSV = () => {
        const dataToExport = reports.map(r => ({
            "Date": r.date,
            "Total Assignments": r.total,
            "Successfully Delivered": r.delivered,
            "Cancelled": r.cancelled,
            "Efficiency": r.efficiency
        }));
        exportToCSV(dataToExport, "Delivery_Performance_Report");
        setShowExportOptions(false);
    };

    const handleExportPDF = () => {
        const columns = ["Date", "Total", "Delivered", "Cancelled", "Efficiency"];
        const dataToExport = reports.map(r => [
            r.date, r.total, r.delivered, r.cancelled, r.efficiency
        ]);
        exportToPDF(dataToExport, columns, "Delivery_Performance_Report", "Fleet Intelligence: Delivery Performance Analytics");
        setShowExportOptions(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <BarChart3 size={24} className="text-emerald-500" />
                        Delivery Intelligence
                    </h2>
                    <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Fleet Performance & Logistical Analytics</p>
                </div>
                <div className="flex items-center gap-2 relative">
                    <div className="relative">
                        <button
                            onClick={() => setShowExportOptions(!showExportOptions)}
                            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <ExportIcon size={18} className="text-emerald-500" />
                            Download Intelligence
                            <ChevronDown size={14} className={`transition-transform duration-200 ${showExportOptions ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showExportOptions && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowExportOptions(false)}></div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                                    >
                                        <div className="p-1">
                                            <button onClick={handleExportExcel} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors border-none"><div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0"><ExportIcon size={14} className="text-emerald-500" /></div>Export Excel</button>
                                            <button onClick={handleExportCSV} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors border-none"><div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0"><ExportIcon size={14} className="text-blue-500" /></div>Export CSV</button>
                                            <button onClick={handleExportPDF} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border-none"><div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0"><FileText size={14} className="text-red-500" /></div>Export PDF</button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                            <stat.icon size={20} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <h4 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h4>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <h3 className="font-black text-gray-900 tracking-tight">Daily Performance Logs</h3>
                    <div className="flex gap-2">
                        <select
                            value={filters.timeRange}
                            onChange={(e) => setFilters(f => ({ ...f, timeRange: e.target.value }))}
                            className="bg-white border border-gray-100 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                        >
                            <option value="today">Today</option>
                            <option value="this_week">This Week</option>
                            <option value="this_month">This Month</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 font-black text-[10px] uppercase tracking-widest border-b border-gray-50">
                                <th className="px-8 py-4">Timeline</th>
                                <th className="px-8 py-4 text-center">Assigned</th>
                                <th className="px-8 py-4 text-center">Delivered</th>
                                <th className="px-8 py-4 text-center">Failed/Cancelled</th>
                                <th className="px-8 py-4 text-right">Performance Rank</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {reports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50/20 transition-all group">
                                    <td className="px-8 py-5 font-black text-gray-900">{new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                    <td className="px-8 py-5 text-center font-bold text-gray-600">{report.total}</td>
                                    <td className="px-8 py-5 text-center font-black text-emerald-600">
                                        <span className="bg-emerald-50 px-3 py-1 rounded-lg">{report.delivered}</span>
                                    </td>
                                    <td className="px-8 py-5 text-center font-bold text-red-500">{report.cancelled}</td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-black text-gray-900 group-hover:text-emerald-600 transition-colors">{report.efficiency} Success</span>
                                            <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: report.efficiency }}></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DeliveryReports;
