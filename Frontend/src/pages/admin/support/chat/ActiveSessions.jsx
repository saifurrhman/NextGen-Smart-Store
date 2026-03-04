import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Download as ExportIcon, Plus, MoreVertical, ChevronDown, FileText } from 'lucide-react';
import api from '../../../../utils/api';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../../utils/exportUtils';
import { motion, AnimatePresence } from 'framer-motion';
import FilterDropdown from '../../../../components/admin/common/FilterDropdown';

const ActiveSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: ''
    });
    const [showExportOptions, setShowExportOptions] = useState(false);

    // Modal & CRUD State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState(null);
    const [users, setUsers] = useState([]);
    const [agents, setAgents] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [formData, setFormData] = useState({
        customer_name: '',
        user: '',
        topic: '',
        agent: '',
        status: 'waiting',
        duration_seconds: 0
    });

    useEffect(() => {
        fetchSessions();
    }, [searchTerm, filters]);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            let url = `/api/v1/support/chat-sessions/?search=${searchTerm}`;
            if (filters.status) url += `&status=${filters.status}`;
            const response = await api.get(url);
            setSessions(response.data.results || response.data);
        } catch (error) {
            console.error("Failed to fetch chat sessions:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsersAndAgents = async () => {
        try {
            const [usersRes, agentsRes] = await Promise.all([
                api.get('/api/v1/users/?role=CUSTOMER'),
                api.get('/api/v1/users/?role=ADMIN,SUB_ADMIN,SUPER_ADMIN')
            ]);
            setUsers(usersRes.data.results || usersRes.data);
            setAgents(agentsRes.data.results || agentsRes.data);
        } catch (error) {
            console.error("Failed to fetch users/agents:", error);
        }
    };

    const handleOpenCreateModal = () => {
        setEditingSession(null);
        setFormData({
            customer_name: '',
            user: '',
            topic: '',
            agent: '',
            status: 'waiting',
            duration_seconds: 0
        });
        fetchUsersAndAgents();
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (session) => {
        setEditingSession(session);
        setFormData({
            customer_name: session.customer_name || '',
            user: session.user || '',
            topic: session.topic || '',
            agent: session.agent || '',
            status: session.status || 'waiting',
            duration_seconds: session.duration_seconds || 0
        });
        fetchUsersAndAgents();
        setIsModalOpen(true);
        setActiveMenuId(null);
    };

    const handleDeleteSession = async (id) => {
        if (!window.confirm("Are you sure you want to delete this session?")) return;
        try {
            await api.delete(`/api/v1/support/chat-sessions/${id}/`);
            fetchSessions();
        } catch (error) {
            console.error("Failed to delete session:", error);
            alert("Failed to delete session.");
        }
    };

    const handleSaveSession = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        try {
            if (editingSession) {
                await api.put(`/api/v1/support/chat-sessions/${editingSession.id}/`, formData);
            } else {
                await api.post('/api/v1/support/chat-sessions/', formData);
            }
            setIsModalOpen(false);
            fetchSessions();
        } catch (error) {
            console.error("Failed to save session:", error);
            alert("Failed to save session. Please check all fields.");
        } finally {
            setModalLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ status: '' });
    };

    const handleExportExcel = () => {
        const dataToExport = sessions.map(session => ({
            "Session ID": `CHAT-${session.id + 1000}`,
            "Customer": session.customer_name || session.user_details?.username || 'Guest',
            "Topic": session.topic,
            "Agent": session.agent_details?.username || 'Unassigned',
            "Duration": formatDuration(session.duration_seconds),
            "Status": session.status
        }));
        exportToExcel(dataToExport, "Active_Chat_Sessions_Report");
        setShowExportOptions(false);
    };

    const handleExportCSV = () => {
        const dataToExport = sessions.map(session => ({
            "Session ID": `CHAT-${session.id + 1000}`,
            "Customer": session.customer_name || session.user_details?.username || 'Guest',
            "Topic": session.topic,
            "Agent": session.agent_details?.username || 'Unassigned',
            "Duration": formatDuration(session.duration_seconds),
            "Status": session.status
        }));
        exportToCSV(dataToExport, "Active_Chat_Sessions_Report");
        setShowExportOptions(false);
    };

    const handleExportPDF = () => {
        const columns = ["ID", "Customer", "Topic", "Agent", "Duration", "Status"];
        const dataToExport = sessions.map(session => [
            `CHAT-${session.id + 1000}`,
            session.customer_name || session.user_details?.username || 'Guest',
            session.topic,
            session.agent_details?.username || 'Unassigned',
            formatDuration(session.duration_seconds),
            session.status
        ]);
        exportToPDF(dataToExport, columns, "Active_Chat_Sessions_Report", "Support Center: Active Chat Sessions Status");
        setShowExportOptions(false);
    };

    const filterOptions = [
        {
            key: 'status',
            label: 'Session Status',
            options: [
                { label: 'All Status', value: '' },
                { label: 'Active', value: 'active' },
                { label: 'Waiting', value: 'waiting' },
                { label: 'Closed', value: 'closed' },
            ]
        }
    ];

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
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors border-none"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                                    <ExportIcon size={14} className="text-emerald-500" />
                                                </div>
                                                Export Excel
                                            </button>
                                            <button
                                                onClick={handleExportCSV}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors border-none"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                                    <ExportIcon size={14} className="text-blue-500" />
                                                </div>
                                                Export CSV
                                            </button>
                                            <button
                                                onClick={handleExportPDF}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border-none"
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
                    <button
                        onClick={handleOpenCreateModal}
                        className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors shadow-sm"
                    >
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
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={() => setActiveMenuId(activeMenuId === session.id ? null : session.id)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                            {activeMenuId === session.id && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)}></div>
                                                    <div className="absolute right-6 top-10 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-1">
                                                        <button
                                                            onClick={() => handleOpenEditModal(session)}
                                                            className="w-full px-4 py-2 text-left text-xs font-bold text-gray-700 hover:bg-brand/5 hover:text-brand transition-colors"
                                                        >
                                                            Edit Session
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteSession(session.id)}
                                                            className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </>
                                            )}
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

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-brand p-4 text-white">
                            <h3 className="text-lg font-bold">{editingSession ? 'Edit Chat Session' : 'Create New Chat Session'}</h3>
                        </div>
                        <form onSubmit={handleSaveSession} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Customer Name (Guest)</label>
                                    <input
                                        type="text"
                                        value={formData.customer_name}
                                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand"
                                        placeholder="Enter guest name"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Registered User</label>
                                    <select
                                        value={formData.user}
                                        onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand"
                                    >
                                        <option value="">Select User</option>
                                        {users.map(u => <option key={u.id} value={u.id}>{u.username} ({u.email})</option>)}
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Topic</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.topic}
                                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand"
                                        placeholder="Support/Sales"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Assigned Agent</label>
                                    <select
                                        value={formData.agent}
                                        onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand"
                                    >
                                        <option value="">Assign Agent</option>
                                        {agents.map(a => <option key={a.id} value={a.id}>{a.username}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand"
                                    >
                                        <option value="waiting">Waiting</option>
                                        <option value="active">Active</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Duration (seconds)</label>
                                    <input
                                        type="number"
                                        value={formData.duration_seconds}
                                        onChange={(e) => setFormData({ ...formData, duration_seconds: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={modalLoading}
                                    className="flex-1 py-2 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50"
                                >
                                    {modalLoading ? 'Saving...' : 'Save Session'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveSessions;
