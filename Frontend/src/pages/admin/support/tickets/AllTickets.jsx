import React, { useState, useEffect } from 'react';
import { Headphones, Search, Plus, MoreVertical, X, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import FilterDropdown from '../../../../components/admin/common/FilterDropdown';

const priorityColor = { low: 'bg-gray-50 text-gray-500', medium: 'bg-yellow-50 text-yellow-700', high: 'bg-orange-50 text-orange-700', urgent: 'bg-red-50 text-red-600' };
const statusColor = { open: 'bg-blue-50 text-blue-700', in_progress: 'bg-amber-50 text-amber-700', resolved: 'bg-green-50 text-green-700', closed: 'bg-gray-50 text-gray-500' };

const EMPTY_FORM = { subject: '', description: '', priority: 'medium', status: 'open', user: '' };

const AllTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ status: '', priority: '' });
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [msg, setMsg] = useState({ text: '', type: '' });

    useEffect(() => { fetchTickets(); }, [page, searchTerm, filters]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            let url = `support/tickets/?page=${page}&search=${searchTerm}`;
            if (filters.status) url += `&status=${filters.status}`;
            if (filters.priority) url += `&priority=${filters.priority}`;
            const res = await api.get(url);
            setTickets(res.data.results || res.data);
            setPagination({ count: res.data.count || 0, next: res.data.next, previous: res.data.previous });
        } catch (err) { console.error('Failed to fetch tickets:', err); }
        finally { setLoading(false); }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('users/');
            setUsers(response.data.results || response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    const showMsg = (text, type) => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000); };

    const openCreate = () => {
        setFormData(EMPTY_FORM);
        setIsEditing(false);
        setSelectedId(null);
        setIsModalOpen(true);
        fetchUsers();
    };
    const openEdit = (ticket) => {
        setFormData({
            subject: ticket.subject,
            description: ticket.description,
            priority: ticket.priority,
            status: ticket.status,
            user: ticket.user
        });
        setSelectedId(ticket.id);
        setIsEditing(true);
        setIsModalOpen(true);
        setActiveMenuId(null);
        fetchUsers();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.user) {
            showMsg('Please select a user/vendor.', 'error');
            return;
        }
        try {
            if (isEditing) { await api.put(`support/tickets/${selectedId}/`, formData); showMsg('Ticket updated!', 'success'); }
            else { await api.post('support/tickets/', formData); showMsg('Ticket created!', 'success'); }
            setIsModalOpen(false);
            fetchTickets();
        } catch { showMsg('Failed to save ticket. Check all fields.', 'error'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this ticket?')) return;
        setActiveMenuId(null);
        try {
            await api.delete(`support/tickets/${id}/`);
            showMsg('Ticket deleted.', 'success');
            fetchTickets();
        } catch { showMsg('Failed to delete.', 'error'); }
    };

    const filterOptions = [
        { key: 'status', label: 'Status', options: [{ label: 'All Status', value: '' }, { label: 'Open', value: 'open' }, { label: 'In Progress', value: 'in_progress' }, { label: 'Resolved', value: 'resolved' }, { label: 'Closed', value: 'closed' }] },
        { key: 'priority', label: 'Priority', options: [{ label: 'All Priority', value: '' }, { label: 'Urgent', value: 'urgent' }, { label: 'High', value: 'high' }, { label: 'Medium', value: 'medium' }, { label: 'Low', value: 'low' }] }
    ];
    const totalPages = Math.ceil((pagination.count || 0) / 10);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2"><Headphones size={22} className="text-brand" />Support Tickets</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage all customer and vendor tickets</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-dark transition-all shadow-sm">
                    <Plus size={16} /> Create Ticket
                </button>
            </div>

            {msg.text && (
                <div className={`px-4 py-3 rounded-xl text-sm font-semibold border ${msg.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>{msg.text}</div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search tickets..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand shadow-sm" />
                    </div>
                    <FilterDropdown options={filterOptions} activeFilters={filters} onFilterChange={(k, v) => { setFilters(p => ({ ...p, [k]: v })); setPage(1); }} onClear={() => { setFilters({ status: '', priority: '' }); setPage(1); }} />
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Ticket</th>
                                <th className="px-6 py-3">User/Vendor</th>
                                <th className="px-6 py-3">Subject</th>
                                <th className="px-6 py-3 text-center">Priority</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse"><td colSpan="6" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full" /></td></tr>
                            )) : tickets.length > 0 ? tickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-gray-400 text-xs">TIC-{ticket.id.toString().padStart(3, '0')}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{ticket.user_details?.username || 'Unknown'}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800 max-w-xs truncate">{ticket.subject}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${priorityColor[ticket.priority] || ''}`}>{ticket.priority}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor[ticket.status] || ''}`}>{ticket.status?.replace('_', ' ')}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                        <button onClick={() => setActiveMenuId(activeMenuId === ticket.id ? null : ticket.id)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg">
                                            <MoreVertical size={16} />
                                        </button>
                                        {activeMenuId === ticket.id && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                                                <div className="absolute right-6 top-10 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1">
                                                    <button onClick={() => openEdit(ticket)} className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                                                        <Edit2 size={14} /> Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(ticket.id)} className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50">
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" className="py-20 text-center text-gray-400 font-bold italic">No support tickets found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {(pagination.count || 0) > 10 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                        <span>Showing {tickets.length} of {pagination.count}</span>
                        <div className="flex gap-1">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={!pagination.previous} className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={16} /></button>
                            {Array.from({ length: totalPages }).map((_, i) => <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded font-bold ${page === i + 1 ? 'bg-brand text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>{i + 1}</button>)}
                            <button onClick={() => setPage(p => p + 1)} disabled={!pagination.next} className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-brand-dark/20 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-800">{isEditing ? 'Edit Ticket' : 'Create New Ticket'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={18} className="text-gray-500" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Subject *</label>
                                    <input type="text" required value={formData.subject} onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="Product not delivered" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Select User/Vendor *</label>
                                    <select required value={formData.user} onChange={e => setFormData(p => ({ ...p, user: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand">
                                        <option value="">Choose User</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Description *</label>
                                    <textarea required rows="3" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none" placeholder="Describe the issue..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Priority</label>
                                        <select value={formData.priority} onChange={e => setFormData(p => ({ ...p, priority: e.target.value }))}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand">
                                            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                                        <select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand">
                                            <option value="open">Open</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50">Cancel</button>
                                    <button type="submit" className="px-5 py-2.5 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand-dark shadow-lg shadow-brand/20">{isEditing ? 'Update' : 'Create'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AllTickets;
