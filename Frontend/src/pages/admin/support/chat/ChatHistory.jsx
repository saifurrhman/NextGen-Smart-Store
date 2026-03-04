import React, { useState, useEffect } from 'react';
import { History, Search, Download as ExportIcon, Plus, MoreVertical, Edit2, Trash2, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import api from '../../../../utils/api';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../../utils/exportUtils';
import { motion, AnimatePresence } from 'framer-motion';
import FilterDropdown from '../../../../components/admin/common/FilterDropdown';

const ChatHistory = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: 'closed'
    });
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Modal & CRUD State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState(null);
    const [users, setUsers] = useState([]);
    const [agents, setAgents] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [formData, setFormData] = useState({
        customer_name: '',
        user: '',
        topic: '',
        agent: '',
        status: 'closed',
        duration_seconds: 0
    });

    useEffect(() => {
        fetchSessions();
    }, [searchTerm, filters]);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            let url = `support/chat-sessions/?search=${searchTerm}`;
            if (filters.status) url += `&status=${filters.status}`;
            const response = await api.get(url);
            setSessions(response.data.results || response.data);
        } catch (error) {
            console.error("Failed to fetch chat history:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsersAndAgents = async () => {
        try {
            const [usersRes, agentsRes] = await Promise.all([
                api.get('users/?role=CUSTOMER'),
                api.get('users/?role=ADMIN,SUB_ADMIN,SUPER_ADMIN')
            ]);
            setUsers(usersRes.data.results || usersRes.data);
            setAgents(agentsRes.data.results || agentsRes.data);
        } catch (error) {
            console.error("Failed to fetch users/agents:", error);
        }
    };

    const handleOpenEditModal = (session) => {
        setEditingSession(session);
        setFormData({
            customer_name: session.customer_name || '',
            user: session.user || '',
            topic: session.topic || '',
            agent: session.agent || '',
            status: session.status || 'closed',
            duration_seconds: session.duration_seconds || 0
        });
        fetchUsersAndAgents();
        setIsModalOpen(true);
        setActiveMenuId(null);
    };

    const handleDeleteSession = async (id) => {
        if (!window.confirm("Are you sure you want to delete this historical record?")) return;
        try {
            await api.delete(`support/chat-sessions/${id}/`);
            fetchSessions();
        } catch (error) {
            console.error("Failed to delete record:", error);
            alert("Failed to delete record.");
        }
    };

    const handleSaveSession = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        try {
            await api.put(`support/chat-sessions/${editingSession.id}/`, formData);
            setIsModalOpen(false);
            fetchSessions();
        } catch (error) {
            console.error("Failed to update session:", error);
            alert("Failed to update session.");
        } finally {
            setModalLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ status: 'closed' });
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const handleExportExcel = () => {
        const dataToExport = sessions.map(session => ({
            "Session ID": `CHAT-${session.id + 1000}`,
            "Customer": session.customer_name || session.user_details?.username || 'Guest',
            "Topic": session.topic,
            "Agent": session.agent_details?.username || 'Unassigned',
            "Duration": formatDuration(session.duration_seconds),
            "Status": session.status,
            "Date": new Date(session.created_at).toLocaleDateString()
        }));
        exportToExcel(dataToExport, "Chat_History_Report");
        setShowExportOptions(false);
    };

    const handleExportCSV = () => {
        const dataToExport = sessions.map(session => ({
            "Session ID": `CHAT-${session.id + 1000}`,
            "Customer": session.customer_name || session.user_details?.username || 'Guest',
            "Topic": session.topic,
            "Agent": session.agent_details?.username || 'Unassigned',
            "Duration": formatDuration(session.duration_seconds),
            "Status": session.status,
            "Date": new Date(session.created_at).toLocaleDateString()
        }));
        exportToCSV(dataToExport, "Chat_History_Report");
        setShowExportOptions(false);
    };

    const handleExportPDF = () => {
        const columns = ["ID", "Customer", "Topic", "Agent", "Duration", "Date"];
        const dataToExport = sessions.map(session => [
            `CHAT-${session.id + 1000}`,
            session.customer_name || session.user_details?.username || 'Guest',
            session.topic,
            session.agent_details?.username || 'Unassigned',
            formatDuration(session.duration_seconds),
            new Date(session.created_at).toLocaleDateString()
        ]);
        exportToPDF(dataToExport, columns, "Chat_History_Report", "Support Records: Historical Chat Sessions Summary");
        setShowExportOptions(false);
    };

    const filterOptions = [
        {
            key: 'status',
            label: 'Session Status',
            options: [
                { label: 'All Records', value: '' },
                { label: 'Closed', value: 'closed' },
                { label: 'Active', value: 'active' },
                { label: 'Waiting', value: 'waiting' },
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <History size={22} className="text-brand" />
                        Chat History
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Review and manage historical customer interactions</p>
                </div>
                <div className="flex items-center gap-2 relative">
                    <div className="relative">
                        <button
                            onClick={() => setShowExportOptions(!showExportOptions)}
                            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <ExportIcon size={16} className="text-emerald-500" />
                            Export Records
                            <ChevronDown size={14} className={`transition-transform duration-200 ${showExportOptions ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showExportOptions && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowExportOptions(false)}></div>
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                        <div className="p-1">
                                            <button onClick={handleExportExcel} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors border-none"><div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0"><ExportIcon size={14} className="text-emerald-500" /></div>Export Excel</button>
                                            <button onClick={handleExportCSV} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors border-none"><div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0"><ExportIcon size={14} className="text-blue-500" /></div>Export CSV</button>
                                            <button onClick={handleExportPDF} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border-none"><div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0"><FileText size={14} className="text-red-500" /></div>Export PDF</button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Identify session by subject or user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand shadow-sm font-medium text-gray-700"
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
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Session ID</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Topic</th>
                                <th className="px-6 py-3 text-center">Duration</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse"><td colSpan="7" className="px-6 py-6"><div className="h-4 bg-gray-100 rounded-lg w-full"></div></td></tr>
                                ))
                            ) : sessions.length > 0 ? (
                                sessions.map((session) => (
                                    <tr key={session.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono font-bold text-gray-400 text-xs">CHAT-{session.id + 1000}</td>
                                        <td className="px-6 py-4 text-gray-700 font-bold">
                                            {session.customer_name || session.user_details?.username || 'Guest'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium italic">{session.topic}</td>
                                        <td className="px-6 py-4 text-center text-gray-500 font-bold">{formatDuration(session.duration_seconds)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tight ${session.status === 'closed' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                                                {session.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs font-bold">
                                            {new Date(session.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleOpenEditModal(session)} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDeleteSession(session.id)} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="7" className="py-24 text-center text-gray-400 font-bold tracking-widest uppercase italic">Archives are empty for this criterion.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal (Tailored for Archive) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
                        <div className="bg-emerald-600 p-4 text-white">
                            <h3 className="text-lg font-bold">Edit Historical Record</h3>
                        </div>
                        <form onSubmit={handleSaveSession} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Topic/Subject</label>
                                    <input type="text" required value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-500" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Status</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-500">
                                        <option value="closed">Closed (Archived)</option>
                                        <option value="active">Re-open (Active)</option>
                                        <option value="waiting">Re-queue (Waiting)</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Duration (Secs)</label>
                                    <input type="number" value={formData.duration_seconds} onChange={(e) => setFormData({ ...formData, duration_seconds: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-500" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-6 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-xs font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest">Cancel</button>
                                <button type="submit" disabled={modalLoading} className="flex-1 py-3 bg-emerald-500 text-white text-xs font-black rounded-xl hover:bg-emerald-600 transition-all uppercase tracking-widest shadow-lg shadow-emerald-50">{modalLoading ? 'Archiving...' : 'Save Record'}</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ChatHistory;
