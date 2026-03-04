import React, { useState, useEffect } from 'react';
import { Wallet, Search, Clock, Download, CheckCircle, XCircle, Filter } from 'lucide-react';
import api from '../../../utils/api';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import useRowSelection from '../../../hooks/useRowSelection';

const VendorPayouts = () => {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ status: '' });

    const { selectedIds, toggleAll, toggleOne, isAllSelected } = useRowSelection('id');

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
            console.error("Failed to fetch vendor payouts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = () => exportToExcel(payouts.filter(p => selectedIds.includes(p.id)), "Vendor_Payout_History");
    const handleExportCSV = () => exportToCSV(payouts.filter(p => selectedIds.includes(p.id)), "Vendor_Payout_History");
    const handleExportPDF = () => {
        const data = payouts.filter(p => selectedIds.includes(p.id)).map(p => [p.id, p.vendor_name, `$${p.amount}`, p.status, p.created_at]);
        exportToPDF(data, ["ID", "Vendor", "Amount", "Status", "Date"], "Vendor_Payout_History", "Vendor Payout Statement");
    };

    const filterOptions = [
        {
            key: 'status', label: 'Status', options: [
                { label: 'All Status', value: '' },
                { label: 'Pending', value: 'pending' },
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
                        <Wallet size={24} className="text-blue-500" />
                        Vendor Payouts
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Overview of all pending and completed vendor payouts</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all font-bold">
                            <Download size={16} className="text-emerald-600" />Excel
                        </button>
                        <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all font-bold">
                            <Download size={16} className="text-red-500" />PDF
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by vendor, store, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm"
                        />
                    </div>
                    <FilterDropdown options={filterOptions} activeFilters={filters} onFilterChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))} onClear={() => setFilters({ status: '' })} />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#f0f4f8] text-blue-900 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" checked={isAllSelected(payouts)} onChange={() => toggleAll(payouts)} />
                                </th>
                                <th className="px-6 py-4">Vendor & Store</th>
                                <th className="px-6 py-4 text-center">Payout Amount</th>
                                <th className="px-6 py-4 text-center">Requested Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse"><td colSpan="5" className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-full"></div></td></tr>
                                ))
                            ) : payouts.length > 0 ? (
                                payouts.map(payout => (
                                    <tr key={payout.id} className={`hover:bg-gray-50/50 transition-colors group ${selectedIds.includes(payout.id) ? 'bg-blue-50/50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" checked={selectedIds.includes(payout.id)} onChange={() => toggleOne(payout.id)} />
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <p className="font-bold text-gray-800">{payout.vendor_name || payout.vendor_email}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{payout.store_name}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-black text-gray-800">${parseFloat(payout.amount).toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-500">
                                                <Clock size={14} />
                                                {new Date(payout.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase rounded-full ${payout.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                                    payout.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                {payout.status === 'completed' ? <CheckCircle size={12} /> : payout.status === 'pending' ? <Clock size={12} /> : <XCircle size={12} />}
                                                {payout.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="py-20 text-center text-gray-400 font-bold italic uppercase tracking-widest">No vendor payouts found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VendorPayouts;
