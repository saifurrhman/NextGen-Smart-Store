import React, { useState } from 'react';
import {
    Package, AlertTriangle, ArrowUpRight,
    Home, ChevronRight, Plus, RefreshCw, Search, MoreVertical, ChevronDown, Download as ExportIcon, FileText
} from 'lucide-react';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import { motion, AnimatePresence } from 'framer-motion';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';

const InventoryAlerts = () => {
    const initialAlerts = [
        { id: 1, product: 'Wireless Headphones', sku: 'WH-001', stock: 5, minStock: 10, status: 'Low Stock', priority: 'High' },
        { id: 2, product: 'Smart Watch Series 7', sku: 'SW-007', stock: 0, minStock: 5, status: 'Out of Stock', priority: 'Critical' },
        { id: 3, product: 'Leather Wallet', sku: 'LW-099', stock: 8, minStock: 15, status: 'Low Stock', priority: 'Medium' },
    ];
    const [alerts, setAlerts] = useState(initialAlerts);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        priority: ''
    });
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const filterOptions = [
        {
            key: 'status',
            label: 'Stock Status',
            options: [
                { label: 'All Status', value: '' },
                { label: 'Low Stock', value: 'Low Stock' },
                { label: 'Out of Stock', value: 'Out of Stock' },
            ]
        },
        {
            key: 'priority',
            label: 'Priority Level',
            options: [
                { label: 'All Priorities', value: '' },
                { label: 'Critical', value: 'Critical' },
                { label: 'High', value: 'High' },
                { label: 'Medium', value: 'Medium' },
            ]
        }
    ];

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ status: '', priority: '' });
    };

    const handleExportExcel = () => {
        const dataToExport = filteredAlerts.map(alert => ({
            "Product": alert.product,
            "SKU": alert.sku,
            "Current Stock": alert.stock,
            "Min Stock": alert.minStock,
            "Status": alert.status,
            "Priority": alert.priority
        }));
        exportToExcel(dataToExport, "Inventory_Alerts_Report");
        setShowExportOptions(false);
    };

    const handleExportCSV = () => {
        const dataToExport = filteredAlerts.map(alert => ({
            "Product": alert.product,
            "SKU": alert.sku,
            "Current Stock": alert.stock,
            "Min Stock": alert.minStock,
            "Status": alert.status,
            "Priority": alert.priority
        }));
        exportToCSV(dataToExport, "Inventory_Alerts_Report");
        setShowExportOptions(false);
    };

    const handleExportPDF = () => {
        const columns = ["Product", "SKU", "Stock", "Min Stock", "Status", "Priority"];
        const dataToExport = filteredAlerts.map(alert => [
            alert.product,
            alert.sku,
            alert.stock,
            alert.minStock,
            alert.status,
            alert.priority
        ]);
        exportToPDF(dataToExport, columns, "Inventory_Alerts_Report", "Inventory Stock Alerts Performance Summary");
        setShowExportOptions(false);
    };

    const filteredAlerts = alerts.filter(alert => {
        const matchesSearch = alert.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alert.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filters.status === '' || alert.status === filters.status;
        const matchesPriority = filters.priority === '' || alert.priority === filters.priority;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <AlertTriangle size={24} className="text-amber-500" />
                        Inventory Stock Alerts
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mt-1">
                        <Home size={14} />
                        <ChevronRight size={12} />
                        <span>Operations</span>
                        <ChevronRight size={12} />
                        <span className="text-emerald-500 font-bold">Inventory Alerts</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 relative">
                    <div className="relative">
                        <button
                            onClick={() => setShowExportOptions(!showExportOptions)}
                            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <ExportIcon size={18} className="text-emerald-500" />
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
                        onClick={() => { setSelectedProduct(null); setIsRestockModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg text-sm hover:bg-emerald-600 transition-all"
                    >
                        <Plus size={18} /> Create Restock Order
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Out of Stock</p>
                        <h4 className="text-xl font-bold text-gray-800">42 Products</h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Low Stock</p>
                        <h4 className="text-xl font-bold text-gray-800">128 Products</h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                        <RefreshCw size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Restocked (7d)</p>
                        <h4 className="text-xl font-bold text-gray-800">850 Items</h4>
                    </div>
                </div>
            </div>

            {/* Alerts Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/20">
                    <div className="relative w-full md:w-96">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Product name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium text-gray-700"
                        />
                    </div>
                    <FilterDropdown
                        options={filterOptions}
                        activeFilters={filters}
                        onFilterChange={handleFilterChange}
                        onClear={clearFilters}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Product Information</th>
                                <th className="px-6 py-4">Current Stock</th>
                                <th className="px-6 py-4">Status & Priority</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredAlerts.length > 0 ? filteredAlerts.map(alert => (
                                <tr key={alert.id} className="hover:bg-gray-50/30 transition-colors group text-sm">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">{alert.product}</span>
                                            <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">SKU: {alert.sku}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5 min-w-[150px]">
                                            <div className="flex justify-between items-center text-[10px] font-bold">
                                                <span className="text-gray-500">{alert.stock} of {alert.minStock} (Min)</span>
                                                <span className={alert.stock === 0 ? 'text-red-500' : 'text-amber-500'}>{alert.minStock > 0 ? Math.round((alert.stock / alert.minStock) * 100) : 0}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${alert.stock === 0 ? 'bg-red-500 w-[0%]' : 'bg-amber-500'}`}
                                                    style={{ width: `${alert.minStock > 0 ? Math.min((alert.stock / alert.minStock) * 100, 100) : 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${alert.stock === 0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                {alert.status}
                                            </span>
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${alert.priority === 'Critical' ? 'bg-red-500 text-white' :
                                                alert.priority === 'High' ? 'bg-amber-600 text-white' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                {alert.priority}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => { setSelectedProduct(alert); setIsRestockModalOpen(true); }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all border border-emerald-100"
                                            >
                                                <ArrowUpRight size={14} /> Restock
                                            </button>
                                            <button
                                                onClick={() => alert(`Details for SKU ${alert.sku}`)}
                                                className="p-2 text-gray-400 hover:text-gray-800 transition-colors"
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center text-gray-400 font-bold italic">
                                        No inventory alerts matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Restock Modal */}
            <AnimatePresence>
                {isRestockModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsRestockModalOpen(false)}
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
                                    <h3 className="text-lg font-bold text-gray-800">Restock Request</h3>
                                    <p className="text-xs text-gray-500 font-medium">Order more stock from vendors</p>
                                </div>
                                <button onClick={() => setIsRestockModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors font-bold text-gray-400">
                                    <Plus size={20} className="rotate-45" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Product Information</label>
                                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                                        {selectedProduct ? (
                                            <div>
                                                <p className="font-bold text-gray-800">{selectedProduct.product}</p>
                                                <p className="text-[10px] text-gray-400 font-bold">SKU: {selectedProduct.sku} | Current: {selectedProduct.stock}</p>
                                            </div>
                                        ) : (
                                            <select className="w-full bg-transparent text-sm font-bold border-none focus:ring-0">
                                                <option>Search Product...</option>
                                                {alerts.map(a => <option key={a.id}>{a.product} ({a.sku})</option>)}
                                            </select>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Order Quantity</label>
                                        <input type="number" placeholder="0" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Expected Date</label>
                                        <input type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Vendor Note</label>
                                    <textarea placeholder="Urgent restock needed..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 h-24 resize-none"></textarea>
                                </div>
                                <button
                                    onClick={() => { alert('Restock order placed successfully!'); setIsRestockModalOpen(false); }}
                                    className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all mt-2"
                                >
                                    Submit Purchase Order
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InventoryAlerts;
