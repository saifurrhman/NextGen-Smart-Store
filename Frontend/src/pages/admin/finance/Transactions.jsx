import React, { useState, useEffect } from 'react';
import {
    Search, Filter, MoreVertical, ArrowUp, ArrowDown, Plus, CreditCard,
    DollarSign, CheckCircle, Clock, XCircle, Download, LayoutGrid, List, SlidersHorizontal, ArrowUpDown, FileText, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../utils/api';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        method: '',
        dateRange: ''
    });
    const [stats, setStats] = useState({ revenue: 0, completed: 0, pending: 0, failed: 0 });
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
    const navigate = useNavigate();
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get('/api/v1/finance/transactions/');
                setTransactions(response.data);

                // Real stats calculation
                setStats({
                    revenue: response.data.filter(t => t.status === 'success')
                        .reduce((acc, t) => acc + parseFloat(t.amount), 0),
                    completed: response.data.filter(t => t.status === 'success').length,
                    pending: response.data.filter(t => t.status === 'pending').length,
                    failed: response.data.filter(t => t.status === 'failed').length
                });
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    // Filtering logic
    const filteredTxns = transactions.filter(txn => {
        const matchesStatus = filter === 'all' || txn.status === filter;
        const matchesSearch = !searchTerm ||
            txn.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMethod = !filters.method || txn.payment_method === filters.method;

        return matchesStatus && matchesSearch && matchesMethod;
    });

    const handleFilterDropdownChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const clearDropdownFilters = () => {
        setFilters({ method: '', dateRange: '' });
        setCurrentPage(1);
    };

    const handleExportExcel = () => {
        const dataToExport = filteredTxns.map(txn => ({
            "Order ID": txn.order_id,
            "Customer": txn.customer_email || 'Guest',
            "Date": new Date(txn.created_at).toLocaleDateString(),
            "Amount": parseFloat(txn.amount).toFixed(2),
            "Method": txn.payment_method,
            "Status": txn.status
        }));
        exportToExcel(dataToExport, "Transactions_Export");
    };

    const handleExportCSV = () => {
        const dataToExport = filteredTxns.map(txn => ({
            "Order ID": txn.order_id,
            "Customer": txn.customer_email || 'Guest',
            "Date": new Date(txn.created_at).toLocaleDateString(),
            "Amount": parseFloat(txn.amount).toFixed(2),
            "Method": txn.payment_method,
            "Status": txn.status
        }));
        exportToCSV(dataToExport, "Transactions_Export");
    };

    const handleExportPDF = () => {
        const columns = ["Order ID", "Customer", "Date", "Amount", "Method", "Status"];
        const dataToExport = filteredTxns.map(txn => [
            txn.order_id,
            txn.customer_email || 'Guest',
            new Date(txn.created_at).toLocaleDateString(),
            `$${parseFloat(txn.amount).toFixed(2)}`,
            txn.payment_method,
            txn.status
        ]);
        exportToPDF(dataToExport, columns, "Transactions_Export", "Transaction History Report");
    };

    const filterOptions = [
        {
            key: 'method',
            label: 'Payment Method',
            options: [
                { label: 'All Methods', value: '' },
                { label: 'Credit Card', value: 'Credit Card' },
                { label: 'PayPal', value: 'PayPal' },
                { label: 'Bank Transfer', value: 'Bank Transfer' },
            ]
        }
    ];

    // Pagination logic
    const totalPages = Math.ceil(filteredTxns.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTxns.slice(indexOfFirstItem, indexOfLastItem);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    return (
        <div className="max-w-[1600px] mx-auto pb-10">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 font-bold">Transaction</h1>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <button
                            onClick={handleExportExcel}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all font-bold"
                        >
                            <Download size={16} className="text-emerald-600" />
                            Excel
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all font-bold"
                        >
                            <Download size={16} className="text-blue-500" />
                            CSV
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all font-bold"
                        >
                            <FileText size={16} className="text-red-500" />
                            PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* TOP STAT CARDS & PAYMENT METHOD ROW */}
            <div className="flex flex-col xl:flex-row gap-6 mb-6">

                {/* 4 STAT CARDS GRID */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Total Revenue Card */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-6 shadow-sm relative overflow-hidden group">
                        <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 z-10">
                            <MoreVertical size={18} />
                        </button>
                        <div className="relative z-10">
                            <h3 className="text-sm font-semibold text-gray-500 mb-4 font-bold">Total Revenue</h3>
                            <div className="flex items-end gap-3 mb-1">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">${stats.revenue.toLocaleString()}</h2>
                            </div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider font-bold">Last 7 days</p>
                        </div>
                    </div>

                    {/* Completed Transactions Card */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-6 shadow-sm relative overflow-hidden group">
                        <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 z-10">
                            <MoreVertical size={18} />
                        </button>
                        <div className="relative z-10">
                            <h3 className="text-sm font-semibold text-gray-500 mb-4 font-bold">Completed Transactions</h3>
                            <div className="flex items-end gap-3 mb-1">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">{stats.completed.toLocaleString()}</h2>
                            </div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider font-bold">Last 7 days</p>
                        </div>
                    </div>

                    {/* Pending Transactions Card */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-6 shadow-sm relative overflow-hidden group">
                        <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 z-10">
                            <MoreVertical size={18} />
                        </button>
                        <div className="relative z-10">
                            <h3 className="text-sm font-semibold text-gray-500 mb-4 font-bold">Pending Transactions</h3>
                            <div className="flex items-end gap-3 mb-1">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">{stats.pending.toLocaleString()}</h2>
                            </div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider font-bold">Last 7 days</p>
                        </div>
                    </div>

                    {/* Failed Transactions Card */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-6 shadow-sm relative overflow-hidden group">
                        <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 z-10">
                            <MoreVertical size={18} />
                        </button>
                        <div className="relative z-10">
                            <h3 className="text-sm font-semibold text-gray-500 mb-4 font-bold">Failed Transactions</h3>
                            <div className="flex items-end gap-3 mb-1">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">{stats.failed.toLocaleString()}</h2>
                            </div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider font-bold">Last 7 days</p>
                        </div>
                    </div>
                </div>

                {/* PAYMENT METHOD CARD */}
                <div className="w-full xl:w-[460px] bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-800 font-bold">Payment Method</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical size={18} />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 mb-6">
                        {/* Credit Card Visual */}
                        <div className="relative w-full sm:w-[240px] h-[150px] rounded-2xl overflow-hidden shadow text-white p-5 flex flex-col justify-between shrink-0"
                            style={{ background: 'linear-gradient(135deg, #18b38a 0%, #118162 100%)' }}>
                            {/* Card Background elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>

                            <div className="flex justify-between items-start z-10 w-full">
                                <span className="font-bold tracking-wider text-base">Finaci</span>
                                {/* Master card circles */}
                                <div className="flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-white/30 backdrop-blur-sm -mr-2"></div>
                                    <div className="w-6 h-6 rounded-full bg-white/50 backdrop-blur-sm relative border border-white/20"></div>
                                </div>
                            </div>

                            <div className="text-base tracking-[0.2em] font-medium z-10 opacity-90 font-mono text-center w-full mt-2 font-bold">
                                **** **** **** 2345
                            </div>

                            <div className="flex justify-between items-end z-10 text-[9px] opacity-80 uppercase tracking-wider w-full pt-1">
                                <div>
                                    <div className="mb-0.5 opacity-80 font-bold">Card holder name</div>
                                    <div className="font-semibold text-xs text-white capitalize normal-case font-bold">Noman Manzoor</div>
                                </div>
                                <div>
                                    <div className="mb-0.5 text-right opacity-80 font-bold">Expiry Date</div>
                                    <div className="font-semibold text-xs text-white text-right font-bold">02/30</div>
                                </div>
                            </div>
                        </div>

                        {/* Card Details Sidebar */}
                        <div className="flex flex-col justify-center space-y-3.5 w-full">
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] text-gray-500 w-[80px] font-bold">Status:</span>
                                <span className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-500 font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Active
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] text-gray-500 w-[80px] font-bold">Transactions:</span>
                                <span className="text-[13px] font-bold text-gray-800 font-bold">{stats.completed.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] text-gray-500 w-[80px] font-bold">Revenue:</span>
                                <span className="text-[13px] font-bold text-gray-800 font-bold">${stats.revenue.toLocaleString()}</span>
                            </div>
                            <a href="#" className="text-[13px] font-medium text-indigo-500 hover:text-indigo-600 mt-1 inline-block font-bold">
                                View Transactions
                            </a>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 mt-auto w-full">
                        <button
                            onClick={() => setIsAddCardModalOpen(true)}
                            className="flex items-center justify-center gap-2 h-10 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors w-[240px] font-bold"
                        >
                            <Plus size={16} /> Add Card
                        </button>
                        <button
                            onClick={() => { if (window.confirm('Are you sure you want to deactivate this card?')) alert('Card deactivated.'); }}
                            className="h-10 px-4 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto flex-1 font-bold"
                        >
                            Deactivate
                        </button>
                    </div>
                </div>

            </div>

            {/* DATA TABLE */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">

                {/* Table Header/Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-center px-4 py-4 gap-4">
                    {/* Tabs */}
                    <div className="flex items-center bg-[#f0f9f4] rounded-lg p-1.5 border border-emerald-50 w-full lg:w-auto overflow-x-auto shadow-sm">
                        <button
                            onClick={() => handleFilterChange('all')}
                            className={`px-5 py-2 text-xs font-semibold rounded-md shadow-sm whitespace-nowrap transition-all ${filter === 'all' ? 'bg-white text-gray-800 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-800 font-bold'}`}
                        >
                            All Transactions <span className="text-emerald-500 ml-1">({transactions.length})</span>
                        </button>
                        <button
                            onClick={() => handleFilterChange('success')}
                            className={`px-5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${filter === 'success' ? 'bg-white text-gray-800 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-800 font-bold'}`}
                        >
                            Completed <span className="text-emerald-500 ml-1">({stats.completed})</span>
                        </button>
                        <button
                            onClick={() => handleFilterChange('pending')}
                            className={`px-5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${filter === 'pending' ? 'bg-white text-gray-800 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-800 font-bold'}`}
                        >
                            Pending <span className="text-emerald-500 ml-1">({stats.pending})</span>
                        </button>
                        <button
                            onClick={() => handleFilterChange('failed')}
                            className={`px-5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${filter === 'failed' ? 'bg-white text-gray-800 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-800 font-bold'}`}
                        >
                            Failed <span className="text-emerald-500 ml-1">({stats.failed})</span>
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-[260px]">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search payment history"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-10 pr-4 py-2 border border-blue-100 rounded-lg text-xs focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all font-bold text-gray-800 shadow-sm"
                            />
                        </div>
                        <FilterDropdown
                            options={filterOptions}
                            activeFilters={filters}
                            onFilterChange={handleFilterDropdownChange}
                            onClear={clearDropdownFilters}
                        />
                        <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center justify-center shrink-0 shadow-sm">
                            <div className="flex flex-col -space-y-[6px]">
                                <ArrowUp size={11} />
                                <ArrowDown size={11} />
                            </div>
                        </button>
                        <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center justify-center shrink-0 shadow-sm">
                            <MoreVertical size={16} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-xs text-left min-w-[800px]">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider uppercase text-[10px]">
                            <tr>
                                <th className="py-4 px-6 rounded-l-lg">Customer Id</th>
                                <th className="py-4 px-4">Name</th>
                                <th className="py-4 px-4 text-center">Date</th>
                                <th className="py-4 px-4 text-center">Total</th>
                                <th className="py-4 px-4 text-center">Method</th>
                                <th className="py-4 px-4">Status</th>
                                <th className="py-4 px-6 rounded-r-lg text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 font-medium divide-y divide-gray-50">
                            {currentItems.map((txn, idx) => (
                                <tr key={txn.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-4 px-4 font-bold text-gray-800">#{txn.order_id?.slice(-8).toUpperCase() || 'N/A'}</td>
                                    <td className="py-4 px-4 font-bold text-gray-800">{txn.customer_email || 'Guest'}</td>
                                    <td className="py-4 px-4 text-gray-600 font-bold uppercase text-[10px]">{new Date(txn.created_at).toLocaleDateString()}</td>
                                    <td className="py-4 px-4 font-black text-gray-800">${parseFloat(txn.amount).toFixed(2)}</td>
                                    <td className="py-4 px-4 text-gray-600 font-black uppercase text-[10px]">{txn.payment_method}</td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase rounded-full ${txn.status === 'success' ? 'bg-emerald-50 text-emerald-600' :
                                            txn.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                                'bg-red-50 text-red-600'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${txn.status === 'success' ? 'bg-emerald-500' :
                                                txn.status === 'pending' ? 'bg-amber-500' :
                                                    'bg-red-500'
                                                }`}></span>
                                            {txn.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button
                                            onClick={() => navigate(`/admin/orders/details?id=${txn.order_id}`)}
                                            className="text-emerald-500 hover:text-emerald-600 font-black text-[10px] uppercase tracking-wider transition-colors bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && !loading && (
                                <tr><td colSpan="7" className="py-10 text-center text-gray-400 font-bold italic">No transactions found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                    <div className="p-5 flex items-center justify-between border-t border-gray-50 text-sm bg-gray-50/30">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm bg-white"
                        >
                            ← Previous
                        </button>
                        <div className="flex gap-1.5">
                            {[...Array(totalPages)].map((_, i) => {
                                const pageNum = i + 1;
                                if (totalPages > 7 && pageNum > 3 && pageNum < totalPages - 2 && Math.abs(pageNum - currentPage) > 1) {
                                    if (pageNum === 4 || pageNum === totalPages - 3) return <span key={pageNum} className="px-1 text-gray-400 font-bold text-xs self-center">...</span>;
                                    return null;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-all font-black ${currentPage === pageNum ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'bg-white border border-gray-100 text-gray-500 hover:text-gray-800 shadow-sm'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm bg-white"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

            {/* Add Card Modal */}
            <AnimatePresence>
                {isAddCardModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddCardModalOpen(false)}
                            className="absolute inset-0 bg-brand-dark/20 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-800">Add New Payment Card</h3>
                                <button onClick={() => setIsAddCardModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Card Number</label>
                                    <input type="text" placeholder="**** **** **** ****" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Expiry Date</label>
                                        <input type="text" placeholder="MM/YY" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">CVV</label>
                                        <input type="password" placeholder="***" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                                    </div>
                                </div>
                                <button
                                    onClick={() => { alert('Card added successfully!'); setIsAddCardModalOpen(false); }}
                                    className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all mt-4"
                                >
                                    Link Card
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Transactions;
