import React, { useState, useEffect } from 'react';
import { RefreshCcw, Search, Filter, Download, Plus, MoreVertical, Edit2, Trash2, Clock, CheckCircle } from 'lucide-react';
import api from '../../../utils/api';

const RefundsReturns = () => {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRefunds = async () => {
            try {
                const response = await api.get('/api/v1/orders/refunds/');
                setRefunds(response.data);
            } catch (error) {
                console.error("Failed to fetch refunds:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRefunds();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <RefreshCcw size={22} className="text-emerald-500" />
                        Refunds & Returns
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Manage and view your refunds & returns</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-white border border-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                        <Download size={16} />
                        Export
                    </button>
                    <button className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-100">
                        <Plus size={16} />
                        Create New
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Toolbar */}
                <div className="p-5 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/20">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search in Refunds & Returns..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm font-medium"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-100 hover:bg-gray-50 rounded-lg transition-colors w-full sm:w-auto shadow-sm">
                        <Filter size={16} />
                        Filters
                    </button>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 text-emerald-600 font-bold uppercase text-[11px] tracking-wider border-b border-gray-50">
                            <tr>
                                <th className="px-6 py-4">RMA ID</th>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                            {refunds.map((refund, idx) => (
                                <tr key={refund.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-gray-800">RMA-{refund.id.toString().padStart(3, '0')}</td>
                                    <td className="px-6 py-4 text-gray-600 font-bold uppercase">
                                        #{refund.order.toString().slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-800 font-bold">${parseFloat(refund.amount).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{refund.reason}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${refund.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                                refund.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                                    'bg-amber-50 text-amber-600'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${refund.status === 'completed' ? 'bg-emerald-500' :
                                                    refund.status === 'rejected' ? 'bg-red-500' :
                                                        'bg-amber-500'
                                                }`}></span>
                                            {refund.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 bg-gray-50 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-emerald-500 transition-all border border-transparent hover:border-emerald-100"><Edit2 size={14} /></button>
                                            <button className="p-1.5 bg-gray-50 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {refunds.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <RefreshCcw size={40} className="text-gray-100 animate-spin-slow" />
                                            <p className="text-gray-400 font-bold">No refund requests found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {refunds.length > 0 && (
                    <div className="p-4 border-t border-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
                        <span>Showing {refunds.length} entries</span>
                        <div className="flex gap-1">
                            <button className="px-3 py-1.5 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>Prev</button>
                            <button className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg shadow-sm">1</button>
                            <button className="px-3 py-1.5 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">Next</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default RefundsReturns;
