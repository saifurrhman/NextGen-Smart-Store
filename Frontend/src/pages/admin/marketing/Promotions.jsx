import React, { useState, useEffect } from 'react';
import { Tag, Search, Download as ExportIcon, Plus, MoreVertical, Edit2, Trash2, ChevronLeft, ChevronRight, ChevronDown, FileText } from 'lucide-react';
import api from '../../../utils/api';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import { motion, AnimatePresence } from 'framer-motion';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';

const Promotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        type: ''
    });
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'percentage',
        discount: '',
        status: 'active',
        usage_limit: 100,
        start_date: '',
        end_date: ''
    });

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'percentage',
            discount: '',
            status: 'active',
            usage_limit: 100,
            start_date: '',
            end_date: ''
        });
        setIsEditing(false);
        setSelectedPromotion(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (promotion) => {
        setFormData({
            name: promotion.name,
            type: promotion.type,
            discount: promotion.discount,
            status: promotion.status,
            usage_limit: promotion.usage_limit,
            start_date: promotion.start_date || '',
            end_date: promotion.end_date || ''
        });
        setSelectedPromotion(promotion);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this promotion?')) {
            try {
                await api.delete(`/api/v1/marketing/promotions/${id}/`);
                fetchPromotions();
            } catch (error) {
                console.error("Failed to delete promotion:", error);
                alert("Failed to delete promotion. Please try again.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/api/v1/marketing/promotions/${selectedPromotion.id}/`, formData);
            } else {
                await api.post('/api/v1/marketing/promotions/', formData);
            }
            setIsModalOpen(false);
            resetForm();
            fetchPromotions();
        } catch (error) {
            console.error("Failed to save promotion:", error);
            alert("Failed to save promotion. Please check all fields.");
        }
    };

    const fetchPromotions = async () => {
        setLoading(true);
        try {
            let url = `/api/v1/marketing/promotions/?page=${page}&search=${searchTerm}`;
            if (filters.status) url += `&status=${filters.status}`;
            if (filters.type) url += `&type=${filters.type}`;

            const response = await api.get(url);
            setPromotions(response.data.results);
            setPagination({
                count: response.data.count,
                next: response.data.next,
                previous: response.data.previous
            });
        } catch (error) {
            console.error("Failed to fetch promotions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({ status: '', type: '' });
        setPage(1);
    };

    const handleExportExcel = () => {
        const dataToExport = promotions.map(p => ({
            "Promotion Name": p.name,
            "Type": p.type,
            "Discount": p.discount,
            "Status": p.status,
            "Usage Limit": p.usage_limit,
            "Redeemed": p.redeemed
        }));
        exportToExcel(dataToExport, "Active_Promotions_Report");
        setShowExportOptions(false);
    };

    const handleExportCSV = () => {
        const dataToExport = promotions.map(p => ({
            "Promotion Name": p.name,
            "Type": p.type,
            "Discount": p.discount,
            "Status": p.status,
            "Usage Limit": p.usage_limit,
            "Redeemed": p.redeemed
        }));
        exportToCSV(dataToExport, "Active_Promotions_Report");
        setShowExportOptions(false);
    };

    const handleExportPDF = () => {
        const columns = ["Name", "Type", "Discount", "Status", "Usage", "Redeemed"];
        const dataToExport = promotions.map(p => [
            p.name,
            p.type,
            p.discount,
            p.status,
            p.usage_limit,
            p.redeemed
        ]);
        exportToPDF(dataToExport, columns, "Active_Promotions_Report", "Active Promotions Performance Report");
        setShowExportOptions(false);
    };

    const filterOptions = [
        {
            key: 'status',
            label: 'Promotion Status',
            options: [
                { label: 'All Status', value: '' },
                { label: 'Active', value: 'active' },
                { label: 'Expired', value: 'expired' },
                { label: 'Upcoming', value: 'upcoming' },
            ]
        },
        {
            key: 'type',
            label: 'Promotion Type',
            options: [
                { label: 'All Types', value: '' },
                { label: 'Percentage', value: 'percentage' },
                { label: 'Fixed Amount', value: 'fixed' },
                { label: 'Free Shipping', value: 'shipping' },
            ]
        }
    ];

    const totalPages = Math.ceil(pagination.count / 10);

    return (
        <div className="space-y-6">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <Tag size={22} className="text-brand" />
                        Active Promotions
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and view your active promotions</p>
                </div>
                <div className="flex items-center gap-2 relative">
                    <div className="relative">
                        <button
                            onClick={() => setShowExportOptions(!showExportOptions)}
                            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <ExportIcon size={16} className="text-emerald-500" />
                            Export
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
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors border-none"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                                    <ExportIcon size={14} className="text-emerald-500" />
                                                </div>
                                                Export Excel
                                            </button>
                                            <button
                                                onClick={handleExportCSV}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors border-none"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                                    <ExportIcon size={14} className="text-blue-500" />
                                                </div>
                                                Export CSV
                                            </button>
                                            <button
                                                onClick={handleExportPDF}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border-none"
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
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors shadow-sm"
                    >
                        <Plus size={16} />
                        Create New
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Toolbar */}
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search in Active Promotions..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all shadow-sm text-gray-700"
                        />
                    </div>
                    <FilterDropdown
                        options={filterOptions}
                        activeFilters={filters}
                        onFilterChange={handleFilterChange}
                        onClear={clearFilters}
                    />
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Promotion Name</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Discount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Usage Limit</th>
                                <th className="px-6 py-3 font-semibold text-center">Redeemed</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="7" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : promotions.length > 0 ? (
                                promotions.map((promotion) => (
                                    <tr key={promotion.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-gray-900">{promotion.name}</td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{promotion.type}</td>
                                        <td className="px-6 py-4 text-emerald-600 font-bold uppercase">{promotion.discount}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                {promotion.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-semibold">{promotion.usage_limit}</td>
                                        <td className="px-6 py-4 text-center font-bold text-gray-400 text-xs tracking-tighter shadow-sm">{promotion.redeemed} times</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(promotion)}
                                                    className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-brand transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(promotion.id)}
                                                    className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"><MoreVertical size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest bg-gray-50/50">
                                        No active promotions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.count > 10 && (
                    <div className="p-4 border-t border-gray-100 text-sm text-gray-500 flex items-center justify-between">
                        <span>Showing {promotions.length} entries of {pagination.count}</span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={!pagination.previous || loading}
                                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`px-3 py-1 rounded font-bold ${page === i + 1 ? 'bg-brand text-white shadow-sm' : 'border border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={!pagination.next || loading}
                                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-brand-dark/20 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-800">
                                    {isEditing ? 'Edit Promotion' : 'Create New Promotion'}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <Plus size={20} className="rotate-45 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Promotion Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                                        placeholder="Summer Sale 2024"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                                        >
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed Amount</option>
                                            <option value="shipping">Free Shipping</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Discount Value</label>
                                        <input
                                            type="text"
                                            name="discount"
                                            required
                                            value={formData.discount}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                                            placeholder="e.g. 20% or PKR 500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Usage Limit</label>
                                        <input
                                            type="number"
                                            name="usage_limit"
                                            required
                                            value={formData.usage_limit}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                                        >
                                            <option value="active">Active</option>
                                            <option value="expired">Expired</option>
                                            <option value="upcoming">Upcoming</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Start Date</label>
                                        <input
                                            type="date"
                                            name="start_date"
                                            value={formData.start_date}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">End Date</label>
                                        <input
                                            type="date"
                                            name="end_date"
                                            value={formData.end_date}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand/20"
                                    >
                                        {isEditing ? 'Save Changes' : 'Create Promotion'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Promotions;
