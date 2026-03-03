import React, { useState, useEffect } from 'react';
import { BarChart, Plus, Search, Download, FileText, Calendar, CheckCircle, Clock, Trash2 } from 'lucide-react';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import api from '../../../utils/api';
import useRowSelection from '../../../hooks/useRowSelection';
import BulkActionBar from '../../../components/admin/common/BulkActionBar';

const FinancialReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [filters, setFilters] = useState({
        type: '',
    });

    const { selectedIds, toggleAll, toggleOne, isAllSelected, clearSelection } = useRowSelection('id');

    useEffect(() => {
        fetchReports();
    }, [filters, searchTerm, activeTab]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            // Mapping payouts to 'Reports' for now as there isn't a direct 'FinancialReports' model
            const response = await api.get(`/api/v1/finance/payouts/?search=${searchTerm}`);
            const data = response.data.results || response.data;

            // Transform data if necessary to match the UI expectation
            const transformedData = data.map(p => ({
                id: p.id,
                name: `Payout to ${p.vendor_name || p.vendor_email}`,
                type: 'payout',
                date: new Date(p.created_at).toISOString().split('T')[0],
                status: p.status === 'completed' ? 'generated' : 'pending',
                amount: `$${parseFloat(p.amount).toLocaleString()}`,
                raw: p
            }));

            setReports(transformedData);
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ type: '' });
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} reports?`)) return;
        try {
            await Promise.all(selectedIds.map(id => api.delete(`/api/v1/finance/payouts/${id}/`)));
            setReports(prev => prev.filter(r => !selectedIds.includes(r.id)));
            clearSelection();
            alert('Reports deleted successfully');
        } catch (error) {
            console.error("Bulk delete failed:", error);
            alert('Failed to delete some reports.');
        }
    };

    const handleExportExcel = () => {
        const selectedData = reports.filter(r => selectedIds.includes(r.id));
        const dataToExport = selectedData.map(r => ({
            ID: r.id,
            Name: r.name,
            Type: r.type,
            Date: r.date,
            Amount: r.amount,
            Status: r.status
        }));
        exportToExcel(dataToExport, "Financial_Reports_Export");
    };

    const handleExportCSV = () => {
        const selectedData = reports.filter(r => selectedIds.includes(r.id));
        const dataToExport = selectedData.map(r => ({
            ID: r.id,
            Name: r.name,
            Type: r.type,
            Date: r.date,
            Amount: r.amount,
            Status: r.status
        }));
        exportToCSV(dataToExport, "Financial_Reports_Export");
    };

    const handleExportPDF = () => {
        const selectedData = reports.filter(r => selectedIds.includes(r.id));
        const columns = ["ID", "Name", "Type", "Date", "Amount", "Status"];
        const dataToExport = selectedData.map(r => [
            r.id,
            r.name,
            r.type,
            r.date,
            r.amount,
            r.status
        ]);
        exportToPDF(dataToExport, columns, "Financial_Reports_Export", "Financial Reports Summary");
    };

    const handleDownloadSingle = (report) => {
        const columns = ["ID", "Name", "Type", "Date", "Amount", "Status"];
        const dataToExport = [[
            report.id,
            report.name,
            report.type,
            report.date,
            report.amount,
            report.status
        ]];
        exportToPDF(dataToExport, columns, report.id, `Financial Report: ${report.name}`);
    };

    const filterOptions = [
        {
            key: 'type',
            label: 'Report Type',
            options: [
                { label: 'All Types', value: '' },
                { label: 'Revenue', value: 'revenue' },
                { label: 'Expense', value: 'expense' },
                { label: 'Tax', value: 'tax' },
                { label: 'Payouts', value: 'payout' },
            ]
        }
    ];

    const filteredReports = reports; // API filters

    const stats = {
        all: reports.length,
        generated: reports.filter(r => r.status === 'generated').length,
        pending: reports.filter(r => r.status === 'pending').length,
    };

    return (
        <div className="space-y-6">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <BarChart size={24} className="text-emerald-500" />
                        Financial Reports
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Generate and download detailed financial statements</p>
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
                    <button className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 font-bold">
                        <Plus size={18} />
                        Generate New
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[400px]">
                {/* Tabs & Toolbar */}
                <div className="p-4 border-b border-gray-50 flex flex-col lg:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="flex items-center bg-white rounded-xl p-1 border border-gray-100 w-full lg:w-auto overflow-x-auto shadow-sm">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            All Reports <span className={`ml-1.5 ${activeTab === 'all' ? 'text-white' : 'text-emerald-500'}`}>({stats.all})</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('generated')}
                            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'generated' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Generated <span className={`ml-1.5 ${activeTab === 'generated' ? 'text-white' : 'text-emerald-500'}`}>({stats.generated})</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'pending' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Pending <span className={`ml-1.5 ${activeTab === 'pending' ? 'text-white' : 'text-emerald-500'}`}>({stats.pending})</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or ID..."
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
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                        checked={isAllSelected(reports)}
                                        onChange={() => toggleAll(reports)}
                                    />
                                </th>
                                <th className="px-6 py-4">Report Details</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Total Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="7" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredReports.length > 0 ? (
                                filteredReports.map((report) => (
                                    <tr key={report.id} className={`hover:bg-gray-50/50 transition-colors group ${selectedIds.includes(report.id) ? 'bg-emerald-50/50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                                checked={selectedIds.includes(report.id)}
                                                onChange={() => toggleOne(report.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{report.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{report.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-gray-600 capitalize">{report.type}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                <Calendar size={14} />
                                                {report.date}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-black text-gray-800">{report.amount}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase rounded-full ${report.status === 'generated' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {report.status === 'generated' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDownloadSingle(report)}
                                                className="text-xs font-black text-emerald-500 hover:text-emerald-600 uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100 px-3 py-1 bg-emerald-50 rounded-lg hover:bg-emerald-100"
                                            >
                                                Download
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center text-gray-400 italic font-bold uppercase tracking-widest">
                                        No reports found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <BulkActionBar
                    selectedIds={selectedIds}
                    onClear={clearSelection}
                    label={{ singular: "report", plural: "reports" }}
                    onExportExcel={handleExportExcel}
                    onExportCSV={handleExportCSV}
                    onExportPDF={handleExportPDF}
                    onDelete={handleBulkDelete}
                />
            </div>
        </div>
    );
};

export default FinancialReports;

