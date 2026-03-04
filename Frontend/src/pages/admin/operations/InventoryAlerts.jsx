import React, { useState, useEffect } from 'react';
import { Search, Filter, Download as ExportIcon, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight, MoreVertical, Plus, ChevronDown, FileText } from 'lucide-react';
import api from '../../../utils/api';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import { motion, AnimatePresence } from 'framer-motion';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';

const InventoryAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        priority: '',
        category: ''
    });
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Edit Threshold Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newMinStock, setNewMinStock] = useState(0);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const response = await api.get('operations/inventory-alerts/');
            setAlerts(response.data);
        } catch (error) {
            console.error("Failed to fetch inventory alerts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEditModal = (product) => {
        setEditingProduct(product);
        setNewMinStock(product.min_stock);
        setShowEditModal(true);
        setActiveMenuId(null);
    };

    const handleSaveThreshold = async (e) => {
        e.preventDefault();
        setSaveLoading(true);
        try {
            await api.patch(`/api/v1/products/${editingProduct.id}/`, {
                min_stock: parseInt(newMinStock)
            });
            fetchAlerts();
            setShowEditModal(false);
        } catch (error) {
            console.error("Failed to update threshold:", error);
            alert("Failed to update min stock threshold.");
        } finally {
            setSaveLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ priority: '', category: '' });
    };

    const handleExportExcel = () => {
        const dataToExport = alerts.map(alert => ({
            "Product": alert.title,
            "SKU": alert.sku,
            "Stock": alert.stock,
            "Min Stock": alert.min_stock,
            "Category": alert.category_name,
            "Status": alert.status,
            "Priority": alert.priority
        }));
        exportToExcel(dataToExport, "Inventory_Alerts_Report");
        setShowExportOptions(false);
    };

    const handleExportCSV = () => {
        const dataToExport = alerts.map(alert => ({
            "Product": alert.title,
            "SKU": alert.sku,
            "Stock": alert.stock,
            "Min Stock": alert.min_stock,
            "Category": alert.category_name,
            "Status": alert.status,
            "Priority": alert.priority
        }));
        exportToCSV(dataToExport, "Inventory_Alerts_Report");
        setShowExportOptions(false);
    };

    const handleExportPDF = () => {
        const columns = ["Product", "SKU", "Stock", "Min Stock", "Category", "Status", "Priority"];
        const dataToExport = alerts.map(alert => [
            alert.title,
            alert.sku,
            alert.stock,
            alert.min_stock,
            alert.category_name,
            alert.status,
            alert.priority
        ]);
        exportToPDF(dataToExport, columns, "Inventory_Alerts_Report", "Inventory Alerts Summary");
        setShowExportOptions(false);
    };

    const filteredAlerts = alerts.filter(alert => {
        const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alert.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = filters.priority === '' || alert.priority === filters.priority;
        const matchesCategory = filters.category === '' || alert.category_name === filters.category;
        return matchesSearch && matchesPriority && matchesCategory;
    });

    const filterOptions = [
        {
            key: 'priority',
            label: 'Priority',
            options: [
                { label: 'All Priority', value: '' },
                { label: 'Critical', value: 'Critical' },
                { label: 'High', value: 'High' },
                { label: 'Medium', value: 'Medium' },
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <AlertTriangle size={22} className="text-red-500" />
                        Inventory Alert System
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Real-time low stock monitoring and restock triggers</p>
                </div>
                <div className="flex items-center gap-2 relative">
                    <button
                        onClick={fetchAlerts}
                        disabled={loading}
                        className="p-2.5 bg-white border border-gray-100 text-gray-600 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 text-sm font-bold"
                    >
                        <RefreshCw size={18} className={`${loading ? 'animate-spin' : ''}`} />
                        Refresh System
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setShowExportOptions(!showExportOptions)}
                            className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
                        >
                            <ExportIcon size={18} className="stroke-[3px]" />
                            Download Report
                            <ChevronDown size={14} className={`transition-transform duration-200 ${showExportOptions ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {showExportOptions && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowExportOptions(false)}></div>
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
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

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Identify product by name or SKU..."
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
                        <thead className="bg-red-50/50 text-red-800 font-black text-[10px] uppercase tracking-widest border-b border-red-50">
                            <tr>
                                <th className="px-6 py-4">Product Unit</th>
                                <th className="px-6 py-4">Inventory Metrics</th>
                                <th className="px-6 py-4 text-center">Current Stock</th>
                                <th className="px-6 py-4 text-center">Min threshold</th>
                                <th className="px-6 py-4">Categorization</th>
                                <th className="px-6 py-4 text-center">Alert Trigger</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse"><td colSpan="7" className="px-6 py-8"><div className="h-4 bg-gray-100 rounded-lg w-full"></div></td></tr>
                                ))
                            ) : filteredAlerts.length > 0 ? (
                                filteredAlerts.map((alert, index) => (
                                    <tr key={alert.id || index} className="hover:bg-red-50/30 transition-colors group border-l-4 border-l-transparent hover:border-l-red-500">
                                        <td className="px-6 py-4">
                                            <div className="font-black text-gray-900 text-xs">{alert.title}</div>
                                            <div className="text-[10px] text-gray-400 font-black tracking-widest uppercase mt-0.5">{alert.sku}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tight ${alert.priority === 'Critical' ? 'bg-red-500 text-white' : alert.priority === 'High' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'}`}>
                                                {alert.priority} PRIORITY
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-black text-xs text-center">
                                            <span className={alert.stock <= 0 ? 'text-red-600' : 'text-amber-600'}>{alert.stock} Units</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleOpenEditModal(alert)}
                                                className="group inline-flex items-center gap-1.5 font-bold text-xs text-gray-400 hover:text-emerald-600 transition-colors"
                                            >
                                                {alert.min_stock} Units
                                                <MoreVertical size={10} className="opacity-0 group-hover:opacity-100" />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded inline-block">
                                                {alert.category_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className={`flex items-center justify-center gap-1.5 font-black text-[10px] uppercase ${alert.status === 'Out of Stock' ? 'text-red-600' : 'text-amber-600'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${alert.status === 'Out of Stock' ? 'bg-red-600 animate-pulse' : 'bg-amber-600'}`}></div>
                                                {alert.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(alert)}
                                                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                    title="Edit Threshold"
                                                >
                                                    <Filter size={14} />
                                                </button>
                                                <button
                                                    onClick={() => alert(`Initiating restock for ${alert.title}`)}
                                                    className="bg-brand-dark text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-sm"
                                                >
                                                    Restock
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="7" className="py-24 text-center text-gray-400 font-bold italic tracking-tight">System Secure: All inventory units above threshold.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Threshold Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in transition-opacity" onClick={() => !saveLoading && setShowEditModal(false)}></div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
                    >
                        <div className="p-6 bg-emerald-600 text-white">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Plus size={20} /> Adjust Min Threshold
                            </h3>
                            <p className="text-emerald-50 text-xs mt-1 font-medium italic opacity-80">{editingProduct?.title}</p>
                        </div>
                        <form onSubmit={handleSaveThreshold} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Threshold Value (Units)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={newMinStock}
                                    onChange={(e) => setNewMinStock(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                                />
                            </div>
                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    disabled={saveLoading}
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 py-3 text-xs font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saveLoading}
                                    className="flex-1 py-3 bg-emerald-500 text-white text-xs font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 uppercase tracking-widest"
                                >
                                    {saveLoading ? 'Saving...' : 'Update Limit'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default InventoryAlerts;
