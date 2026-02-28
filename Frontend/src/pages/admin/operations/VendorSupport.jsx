import React, { useState, useEffect } from 'react';
import { Headset, Search, Filter, Download as ExportIcon, Plus, MoreVertical, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../../utils/api';

const VendorSupport = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });

    useEffect(() => {
        fetchTickets();
    }, [page, searchTerm]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            // Fetch support tickets
            const response = await api.get(`/api/v1/support/tickets/?page=${page}&search=${searchTerm}`);
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
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                        <ExportIcon size={16} />
                        Export
                    </button>
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
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all shadow-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors w-full sm:w-auto shadow-sm">
                        <Filter size={16} />
                        Filters
                    </button>
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
