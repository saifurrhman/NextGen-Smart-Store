import React, { useState, useEffect } from 'react';
import {
    Search, Filter, MoreVertical, ArrowUp, ArrowDown, Plus, CreditCard,
    DollarSign, CheckCircle, Clock, XCircle, Download, LayoutGrid, List, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';
import api from '../../../utils/api';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ revenue: 0, completed: 0, pending: 0, failed: 0 });
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
        if (filter === 'all') return true;
        return txn.status === filter;
    });

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
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Transaction</h1>
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
                            <h3 className="text-sm font-semibold text-gray-500 mb-4">Total Revenue</h3>
                            <div className="flex items-end gap-3 mb-1">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">${stats.revenue.toLocaleString()}</h2>
                            </div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Last 7 days</p>
                        </div>
                    </div>

                    {/* Completed Transactions Card */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-6 shadow-sm relative overflow-hidden group">
                        <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 z-10">
                            <MoreVertical size={18} />
                        </button>
                        <div className="relative z-10">
                            <h3 className="text-sm font-semibold text-gray-500 mb-4">Completed Transactions</h3>
                            <div className="flex items-end gap-3 mb-1">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">{stats.completed.toLocaleString()}</h2>
                            </div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Last 7 days</p>
                        </div>
                    </div>

                    {/* Pending Transactions Card */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-6 shadow-sm relative overflow-hidden group">
                        <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 z-10">
                            <MoreVertical size={18} />
                        </button>
                        <div className="relative z-10">
                            <h3 className="text-sm font-semibold text-gray-500 mb-4">Pending Transactions</h3>
                            <div className="flex items-end gap-3 mb-1">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">{stats.pending.toLocaleString()}</h2>
                            </div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Last 7 days</p>
                        </div>
                    </div>

                    {/* Failed Transactions Card */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-6 shadow-sm relative overflow-hidden group">
                        <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 z-10">
                            <MoreVertical size={18} />
                        </button>
                        <div className="relative z-10">
                            <h3 className="text-sm font-semibold text-gray-500 mb-4">Failed Transactions</h3>
                            <div className="flex items-end gap-3 mb-1">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">{stats.failed.toLocaleString()}</h2>
                            </div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Last 7 days</p>
                        </div>
                    </div>
                </div>

                {/* PAYMENT METHOD CARD */}
                <div className="w-full xl:w-[460px] bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-800">Payment Method</h3>
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

                            <div className="text-base tracking-[0.2em] font-medium z-10 opacity-90 font-mono text-center w-full mt-2">
                                **** **** **** 2345
                            </div>

                            <div className="flex justify-between items-end z-10 text-[9px] opacity-80 uppercase tracking-wider w-full pt-1">
                                <div>
                                    <div className="mb-0.5 opacity-80">Card holder name</div>
                                    <div className="font-semibold text-xs text-white capitalize normal-case">Noman Manzoor</div>
                                </div>
                                <div>
                                    <div className="mb-0.5 text-right opacity-80">Expiry Date</div>
                                    <div className="font-semibold text-xs text-white text-right">02/30</div>
                                </div>
                            </div>
                        </div>

                        {/* Card Details Sidebar */}
                        <div className="flex flex-col justify-center space-y-3.5 w-full">
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] text-gray-500 w-[80px]">Status:</span>
                                <span className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Active
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] text-gray-500 w-[80px]">Transactions:</span>
                                <span className="text-[13px] font-bold text-gray-800">{stats.completed.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] text-gray-500 w-[80px]">Revenue:</span>
                                <span className="text-[13px] font-bold text-gray-800">${stats.revenue.toLocaleString()}</span>
                            </div>
                            <a href="#" className="text-[13px] font-medium text-indigo-500 hover:text-indigo-600 mt-1 inline-block">
                                View Transactions
                            </a>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 mt-auto w-full">
                        <button className="flex items-center justify-center gap-2 h-10 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors w-[240px]">
                            <Plus size={16} /> Add Card
                        </button>
                        <button className="h-10 px-4 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto flex-1">
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
                    <div className="flex items-center bg-[#f0f9f4] rounded-lg p-1.5 border border-emerald-50 w-full lg:w-auto overflow-x-auto">
                        <button
                            onClick={() => handleFilterChange('all')}
                            className={`px-5 py-2 text-xs font-semibold rounded-md shadow-sm whitespace-nowrap transition-all ${filter === 'all' ? 'bg-white text-gray-800' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            All Transactions <span className="text-emerald-500 ml-1">({transactions.length})</span>
                        </button>
                        <button
                            onClick={() => handleFilterChange('success')}
                            className={`px-5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${filter === 'success' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Completed <span className="text-emerald-500 ml-1">({stats.completed})</span>
                        </button>
                        <button
                            onClick={() => handleFilterChange('pending')}
                            className={`px-5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${filter === 'pending' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Pending <span className="text-emerald-500 ml-1">({stats.pending})</span>
                        </button>
                        <button
                            onClick={() => handleFilterChange('failed')}
                            className={`px-5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${filter === 'failed' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
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
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all font-medium text-gray-600 placeholder-gray-400"
                            />
                        </div>
                        <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center justify-center shrink-0">
                            <Filter size={16} />
                        </button>
                        <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center justify-center shrink-0">
                            <div className="flex flex-col -space-y-[6px]">
                                <ArrowUp size={11} />
                                <ArrowDown size={11} />
                            </div>
                        </button>
                        <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center justify-center shrink-0">
                            <MoreVertical size={16} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-xs text-left min-w-[800px]">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-semibold tracking-wider">
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
                                <tr key={txn.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-4 font-semibold text-gray-800">#{txn.order_id?.slice(-8).toUpperCase() || 'N/A'}</td>
                                    <td className="py-4 px-4 font-semibold text-gray-800">{txn.customer_email || 'Guest'}</td>
                                    <td className="py-4 px-4 text-gray-600">{new Date(txn.created_at).toLocaleDateString()}</td>
                                    <td className="py-4 px-4 font-bold text-gray-800">${parseFloat(txn.amount).toFixed(2)}</td>
                                    <td className="py-4 px-4 text-gray-600 font-bold">{txn.payment_method}</td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${txn.status === 'success' ? 'bg-emerald-50 text-emerald-600' :
                                            txn.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                                'bg-red-50 text-red-600'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${txn.status === 'success' ? 'bg-emerald-500' :
                                                txn.status === 'pending' ? 'bg-amber-500' :
                                                    'bg-red-500'
                                                }`}></span>
                                            {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button className="text-emerald-500 hover:text-emerald-600 font-bold text-xs uppercase tracking-wider transition-colors">View Details</button>
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && !loading && (
                                <tr><td colSpan="7" className="py-10 text-center text-gray-400">No transactions found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                    <div className="p-5 flex items-center justify-between border-t border-gray-50 text-sm">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ← Previous
                        </button>
                        <div className="flex gap-1.5">
                            {[...Array(totalPages)].map((_, i) => {
                                const pageNum = i + 1;
                                if (totalPages > 7 && pageNum > 3 && pageNum < totalPages - 2 && Math.abs(pageNum - currentPage) > 1) {
                                    if (pageNum === 4 || pageNum === totalPages - 3) return <span key={pageNum} className="px-1 text-gray-400">...</span>;
                                    return null;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 flex items-center justify-center rounded text-xs transition-all ${currentPage === pageNum ? 'bg-[#eaf4f0] text-emerald-700 font-bold' : 'border border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Transactions;
