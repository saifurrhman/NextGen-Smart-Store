import React, { useState, useEffect } from 'react';
import { RefreshCcw, Search, Download, Plus, MoreVertical, Edit2, Trash2, Clock, CheckCircle, FileText } from 'lucide-react';
import api from '../../../utils/api';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import useRowSelection from '../../../hooks/useRowSelection';
import BulkActionBar from '../../../components/admin/common/BulkActionBar';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';

const RefundsReturns = () => {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: ''
    });
    const [msg, setMsg] = useState({ type: '', text: '' });

    const { selectedIds, toggleAll, toggleOne, isAllSelected, clearSelection } = useRowSelection('id');

    useEffect(() => {
        const fetchRefunds = async () => {
            try {
                let url = '/api/v1/orders/refunds/?';
                if (searchTerm) url += `search=${searchTerm}&`;
                if (filters.status) url += `status=${filters.status}&`;

                const response = await api.get(url);
                setRefunds(response.data);
            } catch (error) {
                console.error("Failed to fetch refunds:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRefunds();
    }, [searchTerm, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ status: '' });
    };

    const handleExportExcel = () => {
        const dataToExport = refunds.map(r => ({
            "RMA ID": `RMA-${r.id.toString().padStart(3, '0')}`,
            "Order ID": `#${r.order.toString().slice(-8).toUpperCase()}`,
            "Amount": r.amount,
            "Reason": r.reason || 'No reason provided',
            "Status": r.status
        }));
        exportToExcel(dataToExport, "Refunds_Returns_Export");
    };

    const handleExportCSV = () => {
        const dataToExport = refunds.map(r => ({
            "RMA ID": `RMA-${r.id.toString().padStart(3, '0')}`,
            "Order ID": `#${r.order.toString().slice(-8).toUpperCase()}`,
            "Amount": r.amount,
            "Reason": r.reason || 'No reason provided',
            "Status": r.status
        }));
        exportToCSV(dataToExport, "Refunds_Returns_Export");
    };

    const handleExportPDF = () => {
        const columns = ["RMA ID", "Order ID", "Amount", "Reason", "Status"];
        const dataToExport = refunds.map(r => {
            const reason = r.reason || 'No reason provided';
            return [
                `RMA-${r.id.toString().padStart(3, '0')}`,
                `#${r.order.toString().slice(-8).toUpperCase()}`,
                `$${parseFloat(r.amount).toFixed(2)}`,
                reason.length > 30 ? reason.substring(0, 30) + "..." : reason,
                r.status
            ];
        });
        exportToPDF(dataToExport, columns, "Refunds_Returns_Export", "Order Refunds & Returns Performance Report");
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected refund requests?`)) return;
        try {
            await Promise.all(selectedIds.map(id => api.delete(`/api/v1/orders/refunds/${id}/`)));
            setRefunds(prev => prev.filter(r => !selectedIds.includes(r.id)));
            setMsg({ type: 'success', text: `${selectedIds.length} refund requests deleted successfully!` });
            clearSelection();
            setTimeout(() => setMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error("Failed to delete refund requests:", error);
            alert('Failed to delete some refund requests.');
        }
    };

    const handleBulkExportExcel = () => {
        const selectedData = refunds.filter(r => selectedIds.includes(r.id));
        const dataToExport = selectedData.map(r => ({
            "RMA ID": `RMA-${r.id.toString().padStart(3, '0')}`,
            "Order ID": `#${r.order.toString().slice(-8).toUpperCase()}`,
            "Amount": r.amount,
            "Reason": r.reason || 'No reason provided',
            "Status": r.status
        }));
        exportToExcel(dataToExport, `Selected_Refunds_${selectedIds.length}`);
    };

    const filterOptions = [
        {
            key: 'status',
            label: 'Refund Status',
            options: [
                { label: 'All Status', value: '' },
                { label: 'Pending', value: 'pending' },
                { label: 'Completed', value: 'completed' },
                { label: 'Rejected', value: 'rejected' },
            ]
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <RefreshCcw size={24} className="text-emerald-500" />
                        Refunds & Returns
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Manage and track your refunds & returns</p>
                </div>
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

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Toolbar */}
                <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search order id or rma id..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium text-gray-700 shadow-sm"
                        />
                    </div>
                    <FilterDropdown
                        options={filterOptions}
                        activeFilters={filters}
                        onFilterChange={handleFilterChange}
                        onClear={clearFilters}
                    />
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold uppercase text-[10px] tracking-wider">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                        checked={isAllSelected(refunds)}
                                        onChange={() => toggleAll(refunds)}
                                    />
                                </th>
                                <th className="px-6 py-4">RMA ID</th>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                            {refunds.map((refund, idx) => (
                                <tr key={refund.id} className={`hover:bg-gray-50/50 transition-colors group ${selectedIds.includes(refund.id) ? 'bg-emerald-50/50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                            checked={selectedIds.includes(refund.id)}
                                            onChange={() => toggleOne(refund.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-black text-gray-400">RMA-{refund.id.toString().padStart(3, '0')}</td>
                                    <td className="px-6 py-4 text-gray-600 font-bold uppercase text-xs">
                                        #{refund.order.toString().slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 text-emerald-600 font-black text-sm">${parseFloat(refund.amount).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-gray-500 text-[11px] font-bold max-w-xs overflow-hidden truncate">{refund.reason}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${refund.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                                            refund.status === 'rejected' ? 'bg-red-50 text-red-700' :
                                                'bg-amber-50 text-amber-700'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${refund.status === 'completed' ? 'bg-emerald-500' :
                                                refund.status === 'rejected' ? 'bg-red-500' :
                                                    'bg-amber-500'
                                                }`}></span>
                                            {refund.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-50 shadow-sm bg-white"><Edit2 size={16} /></button>
                                            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-50 shadow-sm bg-white"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {refunds.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <RefreshCcw size={40} className="text-gray-100 animate-spin-slow" />
                                            <p className="text-gray-400 font-black uppercase text-xs">No refund requests found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <BulkActionBar
                    selectedIds={selectedIds}
                    onClear={clearSelection}
                    label={{ singular: "refund request", plural: "refund requests" }}
                    onExportExcel={handleBulkExportExcel}
                    onExportCSV={() => {
                        const selectedData = refunds.filter(r => selectedIds.includes(r.id));
                        exportToCSV(selectedData, `Selected_Refunds_${selectedIds.length}`);
                    }}
                    onExportPDF={() => {
                        const selectedData = refunds.filter(r => selectedIds.includes(r.id));
                        const columns = ["RMA ID", "Order ID", "Amount", "Reason", "Status"];
                        const dataToExport = selectedData.map(r => [
                            `RMA-${r.id.toString().padStart(3, '0')}`,
                            `#${r.order.toString().slice(-8).toUpperCase()}`,
                            `$${parseFloat(r.amount).toFixed(2)}`,
                            r.reason,
                            r.status
                        ]);
                        exportToPDF(dataToExport, columns, `Selected_Refunds_${selectedIds.length}`);
                    }}
                    onDelete={handleBulkDelete}
                />

                {refunds.length > 0 && (
                    <div className="p-5 flex items-center justify-between border-t border-gray-50 text-sm bg-gray-50/30">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Showing {refunds.length} entries</span>
                        <div className="flex gap-1.5">
                            <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm bg-white" disabled>Prev</button>
                            <button className="w-9 h-9 flex items-center justify-center bg-emerald-500 text-white font-black rounded-lg text-xs shadow-md shadow-emerald-100">1</button>
                            <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-white transition-all shadow-sm bg-white">Next</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default RefundsReturns;
