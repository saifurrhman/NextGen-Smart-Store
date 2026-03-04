import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, User, Search, RefreshCw, CheckCircle, XCircle, AlertCircle, Plus, X } from 'lucide-react';
import api from '../../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToExcel, exportToPDF } from '../../../utils/exportUtils';

const statusColor = {
    waiting: 'bg-amber-50 text-amber-700 border-amber-100',
    active: 'bg-green-50 text-green-700 border-green-100',
    closed: 'bg-gray-50 text-gray-500 border-gray-100',
};

const statusDot = {
    waiting: 'bg-amber-400',
    active: 'bg-green-500',
    closed: 'bg-gray-400',
};

const ChatQueue = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('waiting');
    const [actionLoading, setActionLoading] = useState(null);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newSession, setNewSession] = useState({ customer_name: '', topic: '' });

    useEffect(() => {
        fetchSessions();
    }, [filter]);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            let url = `support/chat-sessions/?status=${filter}`;
            if (searchTerm) url += `&search=${searchTerm}`;
            const res = await api.get(url);
            setSessions(res.data.results || res.data);
        } catch (err) {
            console.error('Failed to fetch chat sessions', err);
        } finally {
            setLoading(false);
        }
    };

    const showMsg = (text, type) => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    };

    const handleAction = async (sessionId, action) => {
        setActionLoading(sessionId);
        try {
            const newStatus = action === 'accept' ? 'active' : 'closed';
            await api.patch(`support/chat-sessions/${sessionId}/`, { status: newStatus });
            showMsg(`Session ${action === 'accept' ? 'accepted' : 'closed'} successfully.`, 'success');
            fetchSessions();
        } catch {
            showMsg('Action failed. Please try again.', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();
        try {
            await api.post('support/chat-sessions/', { ...newSession, status: 'waiting' });
            setIsCreateOpen(false);
            setNewSession({ customer_name: '', topic: '' });
            showMsg('Chat session created.', 'success');
            fetchSessions();
        } catch { showMsg('Failed to create session.', 'error'); }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '—';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m > 0 ? `${m}m ${s}s` : `${s}s`;
    };

    const filteredSessions = sessions.filter(s => {
        const search = searchTerm.toLowerCase();
        return (
            (s.customer_name || '').toLowerCase().includes(search) ||
            (s.topic || '').toLowerCase().includes(search)
        );
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <MessageSquare size={22} className="text-brand" />
                        Live Chat Queue
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and respond to live support sessions</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <button onClick={() => exportToExcel(filteredSessions, "Chat_Sessions")} className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all">Excel</button>
                        <button onClick={() => exportToPDF(filteredSessions.map(s => [s.id, s.customer_name, s.topic, s.status, s.created_at]), ["ID", "Customer", "Topic", "Status", "Date"], "Chat_Sessions", "Live Chat History")} className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all">PDF</button>
                    </div>
                    <button onClick={fetchSessions} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                        <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                    <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-dark transition-all shadow-sm">
                        <Plus size={16} /> New Session
                    </button>
                </div>
            </div>

            {/* Message */}
            {msg.text && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {msg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {msg.text}
                </div>
            )}

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Waiting', status: 'waiting', icon: Clock, color: '#F59E0B' },
                    { label: 'Active', status: 'active', icon: MessageSquare, color: '#4EA674' },
                    { label: 'Closed', status: 'closed', icon: CheckCircle, color: '#6B7280' },
                ].map(({ label, status, icon: Icon, color }) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${filter === status ? 'border-brand shadow-md' : 'border-gray-100 bg-white hover:bg-gray-50'}`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <Icon size={16} style={{ color }} />
                            <span className="text-xs font-bold text-gray-500 uppercase">{label}</span>
                        </div>
                        <p className="text-2xl font-black" style={{ color }}>{label === filter ? filteredSessions.length : '—'}</p>
                    </button>
                ))}
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Search */}
                <div className="p-5 border-b border-gray-100 bg-gray-50/30">
                    <div className="relative w-full max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or topic..."
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); }}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all shadow-sm text-gray-700"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Topic</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-center">Duration</th>
                                <th className="px-6 py-3 text-center">Started</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 rounded w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredSessions.length > 0 ? (
                                filteredSessions.map(session => (
                                    <tr key={session.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                                                    style={{ background: '#023337' }}>
                                                    {(session.customer_name || '?')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{session.customer_name || 'Guest'}</p>
                                                    <p className="text-xs text-gray-400">{session.user?.email || 'Not registered'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{session.topic}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${statusColor[session.status] || statusColor.closed}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[session.status] || statusDot.closed}`} />
                                                {session.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-500 font-mono text-xs">
                                            {formatDuration(session.duration_seconds)}
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-400 text-xs">
                                            {new Date(session.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {session.status === 'waiting' && (
                                                    <button
                                                        onClick={() => handleAction(session.id, 'accept')}
                                                        disabled={actionLoading === session.id}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-50"
                                                        style={{ background: '#4EA674' }}
                                                    >
                                                        <CheckCircle size={13} />
                                                        Accept
                                                    </button>
                                                )}
                                                {session.status !== 'closed' && (
                                                    <button
                                                        onClick={() => handleAction(session.id, 'close')}
                                                        disabled={actionLoading === session.id}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all disabled:opacity-50"
                                                    >
                                                        <XCircle size={13} />
                                                        Close
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-gray-400 font-bold">
                                        No {filter} chat sessions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Session Modal */}
            <AnimatePresence>
                {isCreateOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateOpen(false)} className="absolute inset-0 bg-brand-dark/20 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-base font-bold text-gray-800">New Chat Session</h3>
                                <button onClick={() => setIsCreateOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={16} className="text-gray-500" /></button>
                            </div>
                            <form onSubmit={handleCreateSession} className="p-5 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Customer Name *</label>
                                    <input type="text" required value={newSession.customer_name} onChange={e => setNewSession(p => ({ ...p, customer_name: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="John Doe" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Topic *</label>
                                    <input type="text" required value={newSession.topic} onChange={e => setNewSession(p => ({ ...p, topic: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="Order not received" />
                                </div>
                                <div className="flex justify-end gap-3 pt-1">
                                    <button type="button" onClick={() => setIsCreateOpen(false)} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50">Cancel</button>
                                    <button type="submit" className="px-5 py-2.5 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand-dark shadow-lg shadow-brand/20">Create Session</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatQueue;
