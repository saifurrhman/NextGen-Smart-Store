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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        report_type: 'revenue',
        start_date: '',
        end_date: ''
    });
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
            let url = `/finance/reports/?search=${searchTerm}`;
            if (activeTab !== 'all') url += `&status=${activeTab}`;
            if (filters.type) url += `&report_type=${filters.type}`;

            const response = await api.get(url);
            const data = response.data.results || response.data;
            setReports(data);
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerateReport = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            await api.post('/finance/reports/', formData);
            alert('Report generated successfully!');
            setIsModalOpen(false);
            setFormData({ title: '', report_type: 'revenue', start_date: '', end_date: '' });
            fetchReports();
        } catch (error) {
            console.error("Failed to generate report:", error);
            alert('Failed to generate report. Please check if all fields are filled.');
        } finally {
            setSubmitLoading(false);
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
            await Promise.all(selectedIds.map(id => api.delete(`/finance/reports/${id}/`)));
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
            Title: r.title,
            Type: r.report_type,
            Date: r.created_at,
            Status: r.status
        }));
        exportToExcel(dataToExport, "Financial_Reports_Export");
    };

    const handleExportCSV = () => {
        const selectedData = reports.filter(r => selectedIds.includes(r.id));
        const dataToExport = selectedData.map(r => ({
            ID: r.id,
            Title: r.title,
            Type: r.report_type,
            Date: r.created_at,
            Status: r.status
        }));
        exportToCSV(dataToExport, "Financial_Reports_Export");
    };

    const handleExportPDF = () => {
        const selectedData = reports.filter(r => selectedIds.includes(r.id));
        const columns = ["ID", "Title", "Type", "Date", "Status"];
        const dataToExport = selectedData.map(r => [
            r.id,
            r.title,
            r.report_type,
            r.created_at,
            r.status
        ]);
        exportToPDF(dataToExport, columns, "Financial_Reports_Export", "Financial Reports Summary");
    };

    const handleDownloadSingle = (report) => {
        // Prepare data from the snapshot
        const snapshot = report.data_snapshot || {};
        const columns = ["Metric", "Value"];
        const rows = [
            ["Title", report.title],
            ["Type", report.report_type],
            ["Range", `${report.start_date} to ${report.end_date}`],
            ["Generated At", new Date(report.created_at).toLocaleString()],
            ["Total Revenue", `$${(snapshot.revenue || 0).toLocaleString()}`],
            ["Payouts", `$${(snapshot.payouts || 0).toLocaleString()}`],
            ["Est. Tax", `$${(snapshot.tax || 0).toLocaleString()}`],
            ["Transactions", snapshot.transactions_count || 0]
        ];
        exportToPDF(rows, columns, report.id, `Financial Statement: ${report.title}`);
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
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all"
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
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 font-bold"
                    >
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
                                <th className="px-6 py-4">Range</th>
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
                            ) : reports.length > 0 ? (
                                reports.map((report) => (
                                    <tr key={report.id} className={`hover:bg-gray-50/50 transition-colors group ${selectedIds.includes(report.id) ? 'bg-emerald-50/50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                                checked={selectedIds.includes(report.id)}
                                                onChange={() => toggleOne(report.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold">
                                            {report.title}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-gray-600 capitalize">{report.report_type}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                <Calendar size={14} />
                                                {report.start_date} - {report.end_date}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDownloadSingle(report)}
                                                className="text-xs font-black text-emerald-500 hover:text-emerald-600 uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100 px-3 py-1 bg-emerald-50 rounded-lg hover:bg-emerald-100"
                                            >
                                                Download PDF
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

            {/* Generate Report Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-800">Generate New Report</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <Plus className="rotate-45" size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleGenerateReport} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Report Title</label>
                                <input
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Q1 Sales Summary"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Report Type</label>
                                <select
                                    name="report_type"
                                    value={formData.report_type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
                                >
                                    <option value="revenue">Revenue Report</option>
                                    <option value="expense">Expense Report</option>
                                    <option value="tax">Tax Report</option>
                                    <option value="payout">Payout Report</option>
                                    <option value="all">General Statement</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Start Date</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        required
                                        value={formData.start_date}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">End Date</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        required
                                        value={formData.end_date}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className="flex-1 py-3 text-sm font-bold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
                                >
                                    {submitLoading ? 'Generating...' : 'Generate Report'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinancialReports;

