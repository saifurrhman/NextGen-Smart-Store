import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Filter, Download as DownloadIcon, ArrowUpRight, Clock, CheckCircle2, XCircle, FileText } from 'lucide-react';
import api from '../../../utils/api';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';

const VendorPayouts = () => {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [showExportMenu, setShowExportMenu] = useState(false);

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
    const handleExportExcel = () => {
        const dataToExport = payouts.map(p => ({
            "Payout ID": `PAY-${(p.id || '').slice(-6).toUpperCase()}`,
            "Vendor": p.vendor_name || 'N/A',
            "Store": p.store_name || 'N/A',
            "Amount": p.amount,
            "Status": p.status,
            "Date": new Date(p.created_at).toLocaleDateString()
        }));
        exportToExcel(dataToExport, "Vendor_Payouts_Report");
        setShowExportMenu(false);
    };

    const handleExportCSV = () => {
        const dataToExport = payouts.map(p => ({
            "Payout ID": `PAY-${(p.id || '').slice(-6).toUpperCase()}`,
            "Vendor": p.vendor_name || 'N/A',
            "Store": p.store_name || 'N/A',
            "Amount": p.amount,
            "Status": p.status,
            "Date": new Date(p.created_at).toLocaleDateString()
        }));
        exportToCSV(dataToExport, "Vendor_Payouts_Export");
        setShowExportMenu(false);
    };

    const handleExportPDF = () => {
        const columns = ["ID", "Vendor", "Store", "Amount", "Status", "Date"];
        const dataToExport = payouts.map(p => [
            `PAY-${(p.id || '').slice(-6).toUpperCase()}`,
            p.vendor_name || 'N/A',
            p.store_name || 'N/A',
            `PKR ${p.amount}`,
            p.status,
            new Date(p.created_at).toLocaleDateString()
        ]);
        exportToPDF(dataToExport, columns, "Vendor_Payouts_Export", "Vendor Payouts Performance Report");
        setShowExportMenu(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <DollarSign size={24} className="text-emerald-500" />
                        Vendor Payouts
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Manage and track vendor payout requests</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-emerald-100 text-emerald-700 text-xs font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-sm"
                        >
                            <DownloadIcon size={16} />
                            Export
                        </button>
                        {showExportMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                <button onClick={handleExportExcel} className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 text-gray-700 text-xs font-bold flex items-center gap-3 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <DownloadIcon size={14} />
                                    </div>
                                    Export Excel
                                </button>
                                <button onClick={handleExportCSV} className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-gray-700 text-xs font-bold flex items-center gap-3 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <DownloadIcon size={14} />
                                    </div>
                                    Export CSV
                                </button>
                                <button onClick={handleExportPDF} className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-gray-700 text-xs font-bold flex items-center gap-3 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                                        <FileText size={14} />
                                    </div>
                                    Export PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search payouts..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium text-gray-700 shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Payout ID</th>
                                <th className="px-6 py-4">Vendor</th>
                                <th className="px-6 py-4">Store</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {payouts.map((payout) => (
                                <tr key={payout.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-gray-400">PAY-{payout.id.slice(-6).toUpperCase()}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800 group-hover:text-emerald-600 transition-colors text-sm">{payout.vendor_name}</span>
                                            <span className="text-[10px] text-gray-400 font-bold lowercase">{payout.vendor_email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-bold text-sm">{payout.store_name}</td>
                                    <td className="px-6 py-4 font-black text-emerald-600">PKR {payout.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${payout.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                                            payout.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                                            }`}>
                                            {payout.status === 'completed' && <CheckCircle2 size={12} />}
                                            {payout.status === 'pending' && <Clock size={12} />}
                                            {payout.status === 'failed' && <XCircle size={12} />}
                                            {payout.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 font-bold text-xs">{new Date(payout.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => alert(`Viewing details for payout PAY-${payout.id.slice(-6).toUpperCase()} functionality coming soon!`)}
                                            className="text-emerald-500 hover:text-emerald-600 font-black text-[10px] uppercase tracking-widest border border-emerald-100 px-3 py-1.5 rounded-lg hover:bg-emerald-50 active:scale-95 transition-all"
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {payouts.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center text-gray-400 font-black uppercase text-xs italic">
                                        No payout requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.count > 10 && (
                    <div className="p-5 flex items-center justify-between border-t border-gray-50 text-sm bg-gray-50/30">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Showing {payouts.length} of {pagination.count}</span>
                        <div className="flex gap-1.5">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={!pagination.previous || loading}
                                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm bg-white"
                            >Prev</button>
                            <button className="w-9 h-9 flex items-center justify-center bg-emerald-500 text-white font-black rounded-lg text-xs shadow-md shadow-emerald-100">{page}</button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={!pagination.next || loading}
                                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm bg-white"
                            >Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorPayouts;
