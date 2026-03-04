import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Search, Clock, Download, MoreVertical, Trash2, Check, X } from 'lucide-react';
import api from '../../../utils/api';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import useRowSelection from '../../../hooks/useRowSelection';
import BulkActionBar from '../../../components/admin/common/BulkActionBar';

const PayoutApproval = () => {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ status: 'pending' });
    const [processLoading, setProcessLoading] = useState(null);

    const { selectedIds, toggleAll, toggleOne, isAllSelected, clearSelection } = useRowSelection('id');

    useEffect(() => {
        fetchPayouts();
    }, [searchTerm, filters]);

    const fetchPayouts = async () => {
        setLoading(true);
        try {
            let url = `/finance/payouts/?search=${searchTerm}`;
            if (filters.status) url += `&status=${filters.status}`;
            const response = await api.get(url);
            setPayouts(response.data.results || response.data);
        } catch (error) {
            console.error("Failed to fetch payouts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        setProcessLoading(id);
        try {
            await api.patch(`/finance/payouts/${id}/`, { status });
            setPayouts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
            alert(`Payout ${status} successfully`);
        } catch (error) {
            console.error(`Failed to ${status} payout:`, error);
            alert(`Failed to update payout status.`);
        } finally {
            setProcessLoading(null);
        }
    };

    const handleBulkAction = async (status) => {
        if (!window.confirm(`${status === 'completed' ? 'Approve' : 'Reject'} ${selectedIds.length} payouts?`)) return;
        try {
            await Promise.all(selectedIds.map(id => api.patch(`/finance/payouts/${id}/`, { status })));
            fetchPayouts();
            clearSelection();
            alert(`Bulk ${status} completed`);
        } catch (error) {
            console.error("Bulk action failed:", error);
            alert('Failed to process some payouts.');
        }
    };

    const handleExportExcel = () => exportToExcel(payouts.filter(p => selectedIds.includes(p.id)), "Payout_Approvals");
    const handleExportCSV = () => exportToCSV(payouts.filter(p => selectedIds.includes(p.id)), "Payout_Approvals");
    const handleExportPDF = () => {
        const data = payouts.filter(p => selectedIds.includes(p.id)).map(p => [p.id, p.vendor_email, `$${p.amount}`, p.status, p.created_at]);
        exportToPDF(data, ["ID", "Vendor", "Amount", "Status", "Date"], "Payout_Approvals", "Vendor Payout Requests");
    };

    const filterOptions = [
        {
            key: 'status', label: 'Status', options: [
                { label: 'All Status', value: '' },
                { label: 'Pending', value: 'pending' },
                { label: 'Processing', value: 'processing' },
                { label: 'Completed', value: 'completed' },
                { label: 'Failed', value: 'failed' },
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <CheckCircle size={24} className="text-emerald-500" />
                        Payout Approval
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Review and process vendor withdrawal requests</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <button onClick={handleExportExcel} className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all font-bold">Excel</button>
                        <button onClick={handleExportPDF} className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all font-bold">PDF</button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by vendor or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium text-gray-700 shadow-sm"
                        />
                    </div>
                    <FilterDropdown options={filterOptions} activeFilters={filters} onFilterChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))} onClear={() => setFilters({ status: 'pending' })} />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" checked={isAllSelected(payouts)} onChange={() => toggleAll(payouts)} />
                                </th>
                                <th className="px-6 py-4">Vendor Details</th>
                                <th className="px-6 py-4 text-center">Amount</th>
                                <th className="px-6 py-4">Bank Info</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse"><td colSpan="6" className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-full"></div></td></tr>
                                ))
                            ) : payouts.length > 0 ? (
                                payouts.map(payout => (
                                    <tr key={payout.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" checked={selectedIds.includes(payout.id)} onChange={() => toggleOne(payout.id)} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-gray-800">{payout.vendor_name || payout.vendor_email}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{payout.store_name}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center font-black text-gray-800">
                                            ${parseFloat(payout.amount).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500 font-medium max-w-[200px] truncate">
                                            {payout.bank_info}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase rounded-full ${payout.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                                    payout.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                {payout.status === 'completed' ? <CheckCircle size={12} /> : payout.status === 'pending' ? <Clock size={12} /> : <XCircle size={12} />}
                                                {payout.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {payout.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction(payout.id, 'completed')}
                                                            disabled={processLoading === payout.id}
                                                            className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 disabled:opacity-50"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(payout.id, 'failed')}
                                                            disabled={processLoading === payout.id}
                                                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6" className="py-20 text-center text-gray-400 font-bold italic uppercase tracking-widest">No payout requests found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {selectedIds.length > 0 && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900/90 backdrop-blur text-white px-6 py-3 rounded-2xl shadow-2xl z-50 border border-white/10">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 border-r border-white/10 pr-4 mr-2">{selectedIds.length} Selected</span>
                        <button onClick={() => handleBulkAction('completed')} className="flex items-center gap-2 text-xs font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-tighter">Approve All</button>
                        <button onClick={() => handleBulkAction('failed')} className="flex items-center gap-2 text-xs font-black text-red-400 hover:text-red-300 uppercase tracking-tighter">Reject All</button>
                        <button onClick={clearSelection} className="ml-4 text-[10px] text-gray-500 hover:text-white uppercase font-black tracking-widest border-l border-white/10 pl-4">Cancel</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayoutApproval;
