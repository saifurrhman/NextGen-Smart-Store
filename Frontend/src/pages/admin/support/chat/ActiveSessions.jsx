import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Filter, Download as ExportIcon, Plus, MoreVertical } from 'lucide-react';
import api from '../../../../utils/api';

const ActiveSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSessions();
    }, [searchTerm]);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/v1/support/chat-sessions/?search=${searchTerm}`);
            setSessions(response.data.results || response.data);
        } catch (error) {
            console.error("Failed to fetch chat sessions:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <MessageSquare size={22} className="text-brand" />
                        Active Chat Sessions
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and view your active chat sessions</p>
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
                            placeholder="Search in Active Chat Sessions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                        <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3">Session ID</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Topic</th>
                                <th className="px-6 py-3">Agent</th>
                                <th className="px-6 py-3">Duration</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="7" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : sessions.length > 0 ? (
                                sessions.map((session) => (
                                    <tr key={session.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-gray-900">CHAT-{session.id + 1000}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {session.customer_name || session.user_details?.username || 'Guest'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{session.topic}</td>
                                        <td className="px-6 py-4 text-gray-600">{session.agent_details?.username || 'Unassigned'}</td>
                                        <td className="px-6 py-4 text-gray-600">{formatDuration(session.duration_seconds)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${session.status === 'active' ? 'bg-green-50 text-green-700' :
                                                    session.status === 'waiting' ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-700'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${session.status === 'active' ? 'bg-green-500' :
                                                        session.status === 'waiting' ? 'bg-amber-500' : 'bg-gray-500'
                                                    }`}></span>
                                                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center text-gray-400 font-bold italic">
                                        No active chat sessions found.
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

export default ActiveSessions;
