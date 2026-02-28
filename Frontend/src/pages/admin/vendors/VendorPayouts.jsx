import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Filter, Download as DownloadIcon, ArrowUpRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../../utils/api';

const VendorPayouts = () => {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });

    useEffect(() => {
        const fetchPayouts = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/v1/finance/payouts/?page=${page}`);
                setPayouts(response.data.results);
                setPagination({
                    count: response.data.count,
                    next: response.data.next,
                    previous: response.data.previous
                });
            } catch (error) {
                console.error("Failed to fetch payouts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayouts();
    }, [page]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <DollarSign size={22} className="text-brand" />
                        Vendor Payouts
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and track vendor payout requests</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                        <DownloadIcon size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search payouts..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Payout ID</th>
                                <th className="px-6 py-3">Vendor</th>
                                <th className="px-6 py-3">Store</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payouts.map((payout) => (
                                <tr key={payout.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-gray-900">PAY-{payout.id.slice(-6).toUpperCase()}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{payout.vendor_name}</span>
                                            <span className="text-[10px] text-gray-400">{payout.vendor_email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{payout.store_name}</td>
                                    <td className="px-6 py-4 font-bold text-emerald-600">PKR {payout.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${payout.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                                                payout.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                                            }`}>
                                            {payout.status === 'completed' && <CheckCircle2 size={12} />}
                                            {payout.status === 'pending' && <Clock size={12} />}
                                            {payout.status === 'failed' && <XCircle size={12} />}
                                            {payout.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-xs">{new Date(payout.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-brand hover:text-brand-dark font-bold text-xs uppercase tracking-wider">
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {payouts.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center text-gray-400 font-bold">
                                        No payout requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.count > 10 && (
                    <div className="p-4 border-t border-gray-100 text-sm text-gray-500 flex items-center justify-between">
                        <span>Showing {payouts.length} entries of {pagination.count}</span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={!pagination.previous || loading}
                                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                            >Prev</button>
                            <button className="px-3 py-1 bg-emerald-500 text-white rounded font-bold shadow-sm">{page}</button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={!pagination.next || loading}
                                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                            >Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorPayouts;
