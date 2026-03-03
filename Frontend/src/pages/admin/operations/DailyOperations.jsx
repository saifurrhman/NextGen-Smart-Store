import React, { useState, useEffect } from 'react';
import { Sun, Search, Download as ExportIcon, Plus, MoreVertical, Edit2, Trash2, ChevronLeft, ChevronRight, ChevronDown, FileText } from 'lucide-react';
import api from '../../../utils/api';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import { motion, AnimatePresence } from 'framer-motion';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';

const DailyOperations = () => {
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: ''
    });
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [formData, setFormData] = useState({ date: '', total_orders: 0, packed: 0, shipped: 0, exceptions: 0, status: 'Active' });

    useEffect(() => {
        fetchDailyStats();
    }, [searchTerm, filters]);

    const fetchDailyStats = async () => {
        setLoading(true);
        try {
            let url = '/api/v1/operations/daily-stats/?';
            if (searchTerm) url += `search=${searchTerm}&`;
            if (filters.status) url += `status=${filters.status}&`;

            const response = await api.get(url);
            setOperations(response.data);
        } catch (error) {
            console.error("Failed to fetch daily operations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ status: '' });
    };

    const handleExportExcel = () => {
        const dataToExport = operations.map(op => ({
            "Date": op.date,
            "Total Orders": op.total_orders,
            "Packed": op.packed,
            "Shipped": op.shipped,
            "Exceptions": op.exceptions,
            "Status": op.status
        }));
        exportToExcel(dataToExport, "Daily_Operations_Report");
        setShowExportOptions(false);
    };

    const handleExportCSV = () => {
        const dataToExport = operations.map(op => ({
            "Date": op.date,
            "Total Orders": op.total_orders,
            "Packed": op.packed,
            "Shipped": op.shipped,
            "Exceptions": op.exceptions,
            "Status": op.status
        }));
        exportToCSV(dataToExport, "Daily_Operations_Report");
        setShowExportOptions(false);
    };

    const handleExportPDF = () => {
        const columns = ["Date", "Total Orders", "Packed", "Shipped", "Exceptions", "Status"];
        const dataToExport = operations.map(op => [
            op.date,
            op.total_orders,
            op.packed,
            op.shipped,
            op.exceptions,
            op.status
        ]);
        exportToPDF(dataToExport, columns, "Daily_Operations_Report", "Daily Operations Summary Report");
        setShowExportOptions(false);
    };

    const filterOptions = [
        {
            key: 'status',
            label: 'Status',
            options: [
                { label: 'All Status', value: '' },
                { label: 'Active', value: 'Active' },
                { label: 'Completed', value: 'Completed' },
            ]
        }
    ];

    const filteredOps = operations; // Now filtered on backend level via API call above

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <Sun size={22} className="text-brand" />
                        Daily Operations
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and view your daily operations</p>
                </div>
                <div className="flex items-center gap-2 relative">
                    <div className="relative">
                        <button
                            onClick={() => setShowExportOptions(!showExportOptions)}
                            className="flex items-center gap-2 bg-white border border-emerald-100 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm group"
                        >
                            <ExportIcon size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                            Download Daily Archive
                            <ChevronDown size={14} className={`transition-transform duration-200 ${showExportOptions ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showExportOptions && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowExportOptions(false)}
                                    ></div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                                    >
                                        <div className="p-1">
                                            <button
                                                onClick={handleExportExcel}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                                    <ExportIcon size={14} className="text-emerald-500" />
                                                </div>
                                                Export Excel
                                            </button>
                                            <button
                                                onClick={handleExportCSV}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                                    <ExportIcon size={14} className="text-blue-500" />
                                                </div>
                                                Export CSV
                                            </button>
                                            <button
                                                onClick={handleExportPDF}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                                    <FileText size={14} className="text-red-500" />
                                                </div>
                                                Export PDF
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-emerald-600 transition-all shadow-[0_8px_30px_rgb(16,185,129,0.2)] hover:-translate-y-0.5"
                    >
                        <Plus size={20} className="stroke-[3px]" />
                        Create New Log
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search in Daily Operations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
                        />
                    </div>
                    <FilterDropdown
                        options={filterOptions}
                        activeFilters={filters}
                        onFilterChange={handleFilterChange}
                        onClear={clearFilters}
                    />
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-black text-[10px] uppercase tracking-widest border-b border-gray-50">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Total Orders</th>
                                <th className="px-6 py-4">Packed</th>
                                <th className="px-6 py-4">Shipped</th>
                                <th className="px-6 py-4">Exceptions</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="7" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredOps.length > 0 ? (
                                filteredOps.map((op, index) => (
                                    <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-gray-900">{op.date}</td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{op.total_orders.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{op.packed.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{op.shipped.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{op.exceptions.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${op.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${op.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                {op.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={() => setActiveMenuId(activeMenuId === index ? null : index)}
                                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                            {activeMenuId === index && (
                                                <>
                                                    <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)}></div>
                                                    <div className="absolute right-6 top-10 w-32 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 overflow-hidden">
                                                        <button
                                                            onClick={() => alert(`Editing log for ${op.date}`)}
                                                            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                                        >
                                                            <Edit2 size={14} /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => { if (window.confirm('Delete this log?')) alert('Deleted.'); }}
                                                            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                                                        >
                                                            <Trash2 size={14} /> Delete
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center text-gray-400 font-bold italic">
                                        No operation logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && filteredOps.length > 0 && (
                    <div className="p-6 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Operation Logs Activity</span>
                        <div className="flex gap-2">
                            <button className="p-2 border border-gray-100 rounded-xl text-gray-300 cursor-not-allowed">Prev</button>
                            <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-100">1</button>
                            <button className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-bold hover:bg-emerald-50 hover:text-emerald-600 transition-all">2</button>
                            <button className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">Next</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Log Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-brand-dark/20 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">New Operation Log</h3>
                                    <p className="text-xs text-gray-500 font-medium">Capture daily performance metrics</p>
                                </div>
                                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors font-bold text-gray-400">
                                    <ChevronRight size={20} className="rotate-90" />
                                </button>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-1">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Operation Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Total Orders</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                                        onChange={(e) => setFormData({ ...formData, total_orders: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Packed</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                                        onChange={(e) => setFormData({ ...formData, packed: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Shipped</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                                        onChange={(e) => setFormData({ ...formData, shipped: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Exceptions</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-red-500/10"
                                        onChange={(e) => setFormData({ ...formData, exceptions: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2 pt-4">
                                    <button
                                        onClick={() => { alert('Daily log created successfully!'); setIsCreateModalOpen(false); }}
                                        className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all hover:-translate-y-1 active:translate-y-0"
                                    >
                                        Save Daily Record
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DailyOperations;
