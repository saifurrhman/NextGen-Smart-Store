import React, { useState, useEffect } from 'react';
import { BarChart2, Ticket, MessageSquare, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import api from '../../../utils/api';

const StatCard = ({ icon: Icon, label, value, sub, color, bg }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
            <Icon size={22} style={{ color }} />
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase">{label}</p>
            <p className="text-2xl font-black text-gray-800">{value ?? '—'}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
    </div>
);

const SupportAnalytics = () => {
    const [ticketStats, setTicketStats] = useState(null);
    const [chatStats, setChatStats] = useState(null);
    const [recentTickets, setRecentTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const [ticketsRes, chatsRes] = await Promise.allSettled([
                api.get('support/tickets/?page_size=100'),
                api.get('support/chat-sessions/?page_size=100'),
            ]);

            if (ticketsRes.status === 'fulfilled') {
                const tickets = ticketsRes.value.data.results || ticketsRes.value.data;
                setTicketStats({
                    total: tickets.length,
                    open: tickets.filter(t => t.status === 'open').length,
                    in_progress: tickets.filter(t => t.status === 'in_progress').length,
                    resolved: tickets.filter(t => t.status === 'resolved').length,
                    closed: tickets.filter(t => t.status === 'closed').length,
                    urgent: tickets.filter(t => t.priority === 'urgent').length,
                    high: tickets.filter(t => t.priority === 'high').length,
                    medium: tickets.filter(t => t.priority === 'medium').length,
                    low: tickets.filter(t => t.priority === 'low').length,
                });
                setRecentTickets(tickets.slice(0, 6));
            }

            if (chatsRes.status === 'fulfilled') {
                const chats = chatsRes.value.data.results || chatsRes.value.data;
                const avg = chats.length
                    ? Math.round(chats.reduce((a, c) => a + (c.duration_seconds || 0), 0) / chats.length)
                    : 0;
                setChatStats({
                    total: chats.length,
                    waiting: chats.filter(c => c.status === 'waiting').length,
                    active: chats.filter(c => c.status === 'active').length,
                    closed: chats.filter(c => c.status === 'closed').length,
                    avgDuration: avg,
                });
            }
        } catch (err) {
            console.error('Failed to fetch support analytics', err);
        } finally {
            setLoading(false);
        }
    };

    const statusColor = {
        open: 'bg-blue-50 text-blue-700',
        in_progress: 'bg-amber-50 text-amber-700',
        resolved: 'bg-green-50 text-green-700',
        closed: 'bg-gray-50 text-gray-500',
    };
    const priorityColor = {
        urgent: 'bg-red-50 text-red-700',
        high: 'bg-orange-50 text-orange-700',
        medium: 'bg-yellow-50 text-yellow-700',
        low: 'bg-gray-50 text-gray-500',
    };
    const formatDuration = (s) => {
        if (!s) return '0s';
        const m = Math.floor(s / 60);
        return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 w-48 bg-gray-200 rounded" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl" />)}
                </div>
            </div>
        );
    }

    const priorities = [
        { label: 'Urgent', count: ticketStats?.urgent, color: '#EF4444' },
        { label: 'High', count: ticketStats?.high, color: '#F97316' },
        { label: 'Medium', count: ticketStats?.medium, color: '#F59E0B' },
        { label: 'Low', count: ticketStats?.low, color: '#6B7280' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                    <BarChart2 size={22} className="text-brand" />
                    Support Analytics
                </h2>
                <p className="text-sm text-gray-500 mt-1">Overview of tickets, chat sessions, and support metrics</p>
            </div>

            {/* Ticket KPI cards */}
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                    <Ticket size={13} /> Ticket Overview
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={Ticket} label="Total Tickets" value={ticketStats?.total} bg="#EAF8E7" color="#4EA674" />
                    <StatCard icon={Clock} label="Open" value={ticketStats?.open} sub="Awaiting response" bg="#EFF6FF" color="#3B82F6" />
                    <StatCard icon={TrendingUp} label="In Progress" value={ticketStats?.in_progress} bg="#FFFBEB" color="#F59E0B" />
                    <StatCard icon={CheckCircle} label="Resolved" value={ticketStats?.resolved} sub={`${ticketStats?.closed ?? 0} closed`} bg="#F0FDF4" color="#22C55E" />
                </div>
            </div>

            {/* Priority breakdown + Chat stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-5 text-sm">Ticket Priority Breakdown</h3>
                    <div className="space-y-4">
                        {priorities.map(({ label, count, color }) => {
                            const pct = ticketStats?.total ? Math.round(((count || 0) / ticketStats.total) * 100) : 0;
                            return (
                                <div key={label}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs font-bold text-gray-600">{label}</span>
                                        <span className="text-xs font-black" style={{ color }}>{count ?? 0}</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100">
                                        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-5 text-sm flex items-center gap-2">
                        <MessageSquare size={14} className="text-brand" /> Chat Session Overview
                    </h3>
                    <div className="space-y-5">
                        {[
                            { label: 'Total Sessions', value: chatStats?.total, color: '#023337' },
                            { label: 'Waiting', value: chatStats?.waiting, color: '#F59E0B' },
                            { label: 'Active Now', value: chatStats?.active, color: '#4EA674' },
                            { label: 'Avg Duration', value: formatDuration(chatStats?.avgDuration), color: '#6366F1' },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
                                <span className="text-sm text-gray-500">{label}</span>
                                <span className="font-black text-xl" style={{ color }}>{value ?? '—'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Tickets table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/30">
                    <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                        <AlertTriangle size={14} className="text-amber-500" /> Recent Tickets
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold">
                            <tr>
                                <th className="px-6 py-3 text-left">Subject</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-center">Priority</th>
                                <th className="px-6 py-3 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentTickets.length > 0 ? recentTickets.map(ticket => (
                                <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-3 font-medium text-gray-800">{ticket.subject}</td>
                                    <td className="px-6 py-3 text-center">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor[ticket.status] || ''}`}>
                                            {ticket.status?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${priorityColor[ticket.priority] || ''}`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right text-xs text-gray-400">
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="py-12 text-center text-gray-400 font-bold">No tickets found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SupportAnalytics;
