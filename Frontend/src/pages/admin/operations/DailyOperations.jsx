import React, { useState, useEffect } from 'react';
import { Sun, Search, Download as ExportIcon, Plus, MoreVertical, Edit2, Trash2, ChevronDown, FileText, X } from 'lucide-react';
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        total_orders: 0,
        packed: 0,
        shipped: 0,
        exceptions: 0,
        status: 'Active'
    });

    useEffect(() => {
        fetchDailyStats();
    }, [searchTerm, filters]);

    const fetchDailyStats = async () => {
        setLoading(true);
        try {
            let url = 'operations/daily-stats/';
            const response = await api.get(url);
            setOperations(response.data);
        } catch (error) {
            console.error("Failed to fetch daily operations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (log = null) => {
        if (log && log.source === 'manual') {
            setEditingLog(log);
            setFormData({
                date: log.date,
                total_orders: log.total_orders,
                packed: log.packed,
                shipped: log.shipped,
                exceptions: log.exceptions,
                status: log.status
            });
        } else {
            setEditingLog(null);
            setFormData({
                date: new Date().toISOString().split('T')[0],
                total_orders: 0,
                packed: 0,
                shipped: 0,
                exceptions: 0,
                status: 'Active'
            });
        }
        setIsModalOpen(true);
        setActiveMenuId(null);
    };

    const handleSave = async () => {
        if (!formData.date) {
            alert('Please select a date.');
            return;
        }
        try {
            const data = {
                ...formData,
                total_orders: parseInt(formData.total_orders) || 0,
                packed: parseInt(formData.packed) || 0,
                shipped: parseInt(formData.shipped) || 0,
                exceptions: parseInt(formData.exceptions) || 0,
            };

            if (editingLog) {
                await api.put(`operations/daily-stats/${editingLog.id}/`, data);
            } else {
                await api.post('operations/daily-stats/', data);
            }

            setIsModalOpen(false);
            fetchDailyStats();
        } catch (e) {
            console.error("Save error:", e);
            alert(e.response?.data?.detail || 'Failed to save. Please check your data.');
        }
    };

    const handleDelete = async (log) => {
        if (log.source !== 'manual') {
            alert("Auto-generated logs cannot be deleted.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this log?')) {
            try {
                await api.delete(`operations/daily-stats/${log.id}/`);
                fetchDailyStats();
            } catch (error) {
                alert('Failed to delete log.');
            }
        }
        setActiveMenuId(null);
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
            "Status": op.status,
            "Source": op.source
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
            "Status": op.status,
            "Source": op.source
        }));
        exportToCSV(dataToExport, "Daily_Operations_Report");
        setShowExportOptions(false);
    };

    const handleExportPDF = () => {
        const columns = ["Date", "Total Orders", "Packed", "Shipped", "Exceptions", "Status", "Source"];
        const dataToExport = operations.map(op => [
            op.date,
            op.total_orders,
            op.packed,
            op.shipped,
            op.exceptions,
            op.status,
            op.source
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
                { label: 'Review Pending', value: 'Review Pending' },
            ]
        }
    ];

    const filteredOps = operations.filter(op => {
        const matchesSearch = op.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
            op.status.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filters.status === '' || op.status === filters.status;
        return matchesSearch && matchesStatus;
    });

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
                            Download Archives
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
                    <button
                        onClick={() => handleOpenModal()}
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
                            placeholder="Search by date or status..."
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
                                <th className="px-6 py-4">Source</th>
                                <th className="px-6 py-4 text-center">Total Orders</th>
                                <th className="px-6 py-4 text-center">Packed</th>
                                <th className="px-6 py-4 text-center">Shipped</th>
                                <th className="px-6 py-4 text-center">Exceptions</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="8" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredOps.length > 0 ? (
                                filteredOps.map((op, index) => (
                                    <tr key={op.id || index} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-gray-900 text-xs">{op.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${op.source === 'manual' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                                {op.source}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-700 font-black">{op.total_orders.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center text-gray-700 font-bold">{op.packed.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center text-gray-700 font-bold">{op.shipped.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center text-red-500 font-bold">{op.exceptions.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${op.status === 'Active' || op.status === 'Completed' || op.status === 'Review Pending' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${op.status === 'Active' || op.status === 'Completed' || op.status === 'Review Pending' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                {op.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            {op.source === 'manual' && (
                                                <>
                                                    <button
                                                        onClick={() => setActiveMenuId(activeMenuId === op.id ? null : op.id)}
                                                        className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>
                                                    <AnimatePresence>
                                                        {activeMenuId === op.id && (
                                                            <>
                                                                <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)}></div>
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                    className="absolute right-6 top-10 w-32 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 overflow-hidden"
                                                                >
                                                                    <button onClick={() => handleOpenModal(op)} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors border-none"><Edit2 size={14} /> Edit</button>
                                                                    <button onClick={() => handleDelete(op)} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors border-none"><Trash2 size={14} /> Delete</button>
                                                                </motion.div>
                                                            </>
                                                        )}
                                                    </AnimatePresence>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="8" className="py-20 text-center text-gray-400 font-bold italic">No logs found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-brand-dark/20 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden" >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{editingLog ? 'Edit' : 'New'} Operation Log</h3>
                                    <p className="text-xs text-gray-500 font-medium tracking-tight">Capture manual performance metrics for {formData.date}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors font-bold text-gray-400"><X size={20} /></button>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operation Date</label>
                                    <input type="date" value={formData.date} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10" onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Orders</label>
                                    <input type="number" value={formData.total_orders} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10" onChange={(e) => setFormData({ ...formData, total_orders: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Packed</label>
                                    <input type="number" value={formData.packed} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10" onChange={(e) => setFormData({ ...formData, packed: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Shipped</label>
                                    <input type="number" value={formData.shipped} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10" onChange={(e) => setFormData({ ...formData, shipped: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Exceptions</label>
                                    <input type="number" value={formData.exceptions} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-red-500/10" onChange={(e) => setFormData({ ...formData, exceptions: e.target.value })} />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</label>
                                    <select value={formData.status} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10" onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Review Pending">Review Pending</option>
                                    </select>
                                </div>
                                <div className="col-span-2 pt-4">
                                    <button onClick={handleSave} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all hover:-translate-y-1 active:translate-y-0" >
                                        {editingLog ? 'Update' : 'Save'} Daily Record
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
