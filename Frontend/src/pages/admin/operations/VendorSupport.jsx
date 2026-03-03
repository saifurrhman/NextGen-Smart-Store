import React, { useState, useEffect } from 'react';
import { Headset, Search, Download as ExportIcon, Plus, MoreVertical, Edit2, Trash2, ChevronLeft, ChevronRight, ChevronDown, FileText } from 'lucide-react';
import api from '../../../utils/api';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import { motion, AnimatePresence } from 'framer-motion';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';

const VendorSupport = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        priority: ''
    });
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [showExportOptions, setShowExportOptions] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, [page, searchTerm, filters]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            // Fetch support tickets
            let url = `/api/v1/support/tickets/?page=${page}&search=${searchTerm}`;
            if (filters.status) url += `&status=${filters.status}`;
            if (filters.priority) url += `&priority=${filters.priority}`;

            const response = await api.get(url);
            setTickets(response.data.results);
            setPagination({
                count: response.data.count,
                next: response.data.next,
                previous: response.data.previous
            });
        } catch (error) {
            console.error("Failed to fetch vendor support tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({ status: '', priority: '' });
        setPage(1);
    };

    const handleExportExcel = () => {
        const dataToExport = tickets.map(t => ({
            "Ticket ID": `TIC-${t.id.toString().padStart(3, '0')}`,
            "Vendor": t.user_details?.username,
            "Subject": t.subject,
            "Priority": t.priority,
            "Status": t.status,
            "Created At": new Date(t.created_at).toLocaleDateString()
        }));
        exportToExcel(dataToExport, "Vendor_Support_Tickets_Report");
        setShowExportOptions(false);
    };

    const handleExportCSV = () => {
        const dataToExport = tickets.map(t => ({
            "Ticket ID": `TIC-${t.id.toString().padStart(3, '0')}`,
            "Vendor": t.user_details?.username,
            "Subject": t.subject,
            "Priority": t.priority,
            "Status": t.status,
            "Created At": new Date(t.created_at).toLocaleDateString()
        }));
        exportToCSV(dataToExport, "Vendor_Support_Tickets_Report");
        setShowExportOptions(false);
    };

    const handleExportPDF = () => {
        const columns = ["Ticket ID", "Vendor", "Subject", "Priority", "Status", "Created At"];
        const dataToExport = tickets.map(t => [
            `TIC-${t.id.toString().padStart(3, '0')}`,
            t.user_details?.username,
            t.subject,
            t.priority,
            t.status,
            new Date(t.created_at).toLocaleDateString()
        ]);
        exportToPDF(dataToExport, columns, "Vendor_Support_Tickets_Report", "Vendor Support Tickets Performance Summary");
        setShowExportOptions(false);
    };

    const filterOptions = [
        {
            key: 'status',
            label: 'Ticket Status',
            options: [
                { label: 'All Status', value: '' },
                { label: 'Open', value: 'open' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Resolved', value: 'resolved' },
                { label: 'Closed', value: 'closed' },
            ]
        },
        {
            key: 'priority',
            label: 'Priority',
            options: [
                { label: 'All Priority', value: '' },
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
                { label: 'Urgent', value: 'urgent' },
            ]
        }
    ];

    const totalPages = Math.ceil(pagination.count / 20);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <Headset size={22} className="text-brand" />
                        Vendor Support Tickets
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and view your vendor support tickets</p>
                </div>
                <div className="flex items-center gap-2 relative">
                    <div className="relative">
                        <button
                            onClick={() => setShowExportOptions(!showExportOptions)}
                            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <ExportIcon size={16} className="text-emerald-500" />
                            Export
                            <ChevronDown size={14} className={`transition-transform duration-200 ${showExportOptions ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showExportOptions && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowExportOptions(false)}
                                    ></div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                                    >
                                        <div className="p-1">
                                            <button
                                                onClick={handleExportExcel}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                                    <ExportIcon size={14} className="text-emerald-500" />
                                                </div>
                                                Export Excel
                                            </button>
                                            <button
                                                onClick={handleExportCSV}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                                    <ExportIcon size={14} className="text-blue-500" />
                                                </div>
                                                Export CSV
                                            </button>
                                            <button
                                                onClick={handleExportPDF}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                                    <FileText size={14} className="text-red-500" />
                                                </div>
                                                Export PDF
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                    <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors shadow-sm">
                        <Plus size={16} />
                        Create New
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search in Vendor Support Tickets..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all shadow-sm text-gray-700 font-medium"
                        />
                    </div>
                    <FilterDropdown
                        options={filterOptions}
                        activeFilters={filters}
                        onFilterChange={handleFilterChange}
                        onClear={clearFilters}
                    />
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-400 font-bold bg-white border-b border-gray-50">
                            <tr>
                                <th className="px-6 py-4">Ticket ID</th>
                                <th className="px-6 py-4">Vendor Name</th>
                                <th className="px-6 py-4">Issue Type</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4 text-center">Created At</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="7" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : tickets.length > 0 ? (
                                tickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-gray-400">TIC-{ticket.id.toString().padStart(3, '0')}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{ticket.user_details?.username}</td>
                                        <td className="px-6 py-4 text-gray-600">{ticket.subject}</td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</td>
                                        <td className="px-6 py-4 text-center text-gray-500 text-xs">{new Date(ticket.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${ticket.status === 'open' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                ticket.status === 'in_progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                <span className={`w-1 h-1 rounded-full ${ticket.status === 'open' ? 'bg-orange-600' :
                                                    ticket.status === 'in_progress' ? 'bg-blue-600' : 'bg-emerald-600'
                                                    }`}></span>
                                                {ticket.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-400 font-bold">Actions</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center text-gray-400 font-bold italic">
                                        No vendor support tickets found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && tickets.length > 0 && (
                    <div className="p-4 border-t border-gray-100 text-sm text-gray-500 flex items-center justify-between">
                        <span>Showing {tickets.length} entries</span>
                        <div className="flex gap-1">
                            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-gray-400">Prev</button>
                            <button className="px-3 py-1 bg-brand text-white rounded font-bold shadow-sm">1</button>
                            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
                            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorSupport;
