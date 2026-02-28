import React, { useState, useEffect } from 'react';
import { Headphones, Search, Filter, Download as ExportIcon, Plus, MoreVertical } from 'lucide-react';
import api from '../../../../utils/api';

const AllTickets = () => {
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
            const response = await api.get(`/api/v1/support/tickets/?page=${page}&search=${searchTerm}`);
            setTickets(response.data.results || response.data);
            setPagination({
                count: response.data.count || (response.data.results ? response.data.results.length : 0),
                next: response.data.next,
                previous: response.data.previous
            });
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <Headphones size={22} className="text-brand" />
                        Support Tickets
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage all customer and vendor tickets</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-400 font-bold bg-white border-b border-gray-50">
                            <tr>
                                <th className="px-6 py-4">Ticket ID</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : tickets.length > 0 ? (
                                tickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-gray-400">TIC-{ticket.id.toString().slice(-3)}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{ticket.user_details?.username || ticket.user_email || 'Guest'}</td>
                                        <td className="px-6 py-4 text-gray-600">{ticket.subject}</td>
                                        <td className="px-6 py-4 text-gray-600 uppercase text-[10px] font-bold">{ticket.priority}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${ticket.status === 'open' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-gray-400 font-bold italic">
                                        No support tickets found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllTickets;
