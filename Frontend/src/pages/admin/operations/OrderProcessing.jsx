import React, { useState } from 'react';
import {
    Clock, Package, Truck, CheckCircle2,
    Search, MoreVertical, ExternalLink,
    Home, ChevronRight, AlertCircle, ShoppingBag, ChevronDown, Download as ExportIcon, FileText
} from 'lucide-react';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import { motion, AnimatePresence } from 'framer-motion';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';

const OrderProcessing = () => {
    const initialOrders = [
        { id: 'ORD-5431', customer: 'Arslan Ali', total: 12500, items: 3, status: 'Processing', time: '12 mins ago' },
        { id: 'ORD-5428', customer: 'Maria Khan', total: 4200, items: 1, status: 'Packed', time: '28 mins ago' },
        { id: 'ORD-5422', customer: 'Zainab Ahmed', total: 8900, items: 2, status: 'Processing', time: '45 mins ago' },
    ];
    const [orders, setOrders] = useState(initialOrders);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: ''
    });
    const [showExportOptions, setShowExportOptions] = useState(false);

    const filterOptions = [
        {
            key: 'status',
            label: 'Order Status',
            options: [
                { label: 'All Orders', value: '' },
                { label: 'Processing', value: 'Processing' },
                { label: 'Packed', value: 'Packed' },
                { label: 'Out for Delivery', value: 'Out for Delivery' },
            ]
        }
    ];

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ status: '' });
    };

    const handleExportExcel = () => {
        const dataToExport = filteredOrders.map(order => ({
            "Order ID": order.id,
            "Customer": order.customer,
            "Total": order.total,
            "Items": order.items,
            "Status": order.status,
            "Wait Time": order.time
        }));
        exportToExcel(dataToExport, "Order_Processing_Queue_Report");
        setShowExportOptions(false);
    };

    const handleExportCSV = () => {
        const dataToExport = filteredOrders.map(order => ({
            "Order ID": order.id,
            "Customer": order.customer,
            "Total": order.total,
            "Items": order.items,
            "Status": order.status,
            "Wait Time": order.time
        }));
        exportToCSV(dataToExport, "Order_Processing_Queue_Report");
        setShowExportOptions(false);
    };

    const handleExportPDF = () => {
        const columns = ["Order ID", "Customer", "Total", "Items", "Status", "Wait Time"];
        const dataToExport = filteredOrders.map(order => [
            order.id,
            order.customer,
            `PKR ${order.total.toLocaleString()}`,
            order.items,
            order.status,
            order.time
        ]);
        exportToPDF(dataToExport, columns, "Order_Processing_Queue_Report", "Order Processing Queue Performance Summary");
        setShowExportOptions(false);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filters.status === '' || order.status === filters.status;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <ShoppingBag size={24} className="text-emerald-500" />
                        Order Processing Hub
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mt-1">
                        <Home size={14} />
                        <ChevronRight size={12} />
                        <span>Operations</span>
                        <ChevronRight size={12} />
                        <span className="text-emerald-500 font-bold">In-Process Orders</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 relative">
                    <div className="relative">
                        <button
                            onClick={() => setShowExportOptions(!showExportOptions)}
                            className="flex items-center gap-2 bg-white border border-emerald-100 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm group"
                        >
                            <ExportIcon size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                            Download Intelligence
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
                    <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100 uppercase tracking-widest animate-pulse shadow-inner">Live Operation Center</span>
                </div>
            </div>

            {/* Stage Progress Tracker */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                    { label: 'New Orders', count: 12, icon: AlertCircle, color: 'blue' },
                    { label: 'Processing', count: 8, icon: Clock, color: 'amber' },
                    { label: 'Packed & Ready', count: 15, icon: Package, color: 'emerald' },
                    { label: 'Out for Delivery', count: 24, icon: Truck, color: 'purple' },
                ].map((stage, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-emerald-200/20 transition-all duration-500">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stage.color}-50 rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-all duration-700 rotate-12 group-hover:rotate-0`}></div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-10 h-10 bg-${stage.color}-50 text-${stage.color}-600 rounded-xl flex items-center justify-center font-bold shadow-inner`}>
                                <stage.icon size={20} />
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stage.label}</span>
                        </div>
                        <h4 className="text-3xl font-black text-gray-900 tracking-tighter">{stage.count}</h4>
                        <div className={`w-12 h-1 bg-${stage.color}-100 rounded-full mt-4 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500`}></div>
                    </div>
                ))}
            </div>

            {/* Active Queue */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-gray-800">Processing Queue</h3>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search queue..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 font-medium text-gray-700"
                            />
                        </div>
                        <FilterDropdown
                            options={filterOptions}
                            activeFilters={filters}
                            onFilterChange={handleFilterChange}
                            onClear={clearFilters}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Order Unit</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Wait Time</th>
                                <th className="px-6 py-4 text-center">Operation Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredOrders.length > 0 ? filteredOrders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">{order.id}</span>
                                            <span className="text-[10px] text-gray-400 font-bold">{order.items} Items • PKR {order.total.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-700">{order.customer}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                                            <Clock size={12} /> {order.time}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <span className={`px-2.5 min-w-[80px] text-center py-1 rounded-md text-[10px] font-bold uppercase border ${order.status === 'Processing' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => alert("Order marked as packed!")}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
                                            >
                                                <CheckCircle2 size={14} className="stroke-[3px]" /> Mark Packed
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-800 transition-colors"><ExternalLink size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-400 font-bold italic">
                                        Queue is empty for these filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderProcessing;
