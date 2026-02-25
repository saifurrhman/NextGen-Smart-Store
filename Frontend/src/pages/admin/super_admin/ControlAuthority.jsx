import React, { useState, useEffect } from 'react';
import {
    Shield, Search, Check, X, Loader2, AlertCircle, Send, Clock, CheckCircle2,
    Trash2, Mail, ChevronDown, ChevronUp, Users, Crown, FileText, DollarSign,
    Megaphone, Settings, HeadphonesIcon, UserPlus, Calendar
} from 'lucide-react';
import { invitationsAPI } from '../../../services/api';

const DEPARTMENTS = [
    { key: 'super_admin', label: 'Super Admin', icon: Crown, desc: 'Full system access — all departments' },
    { key: 'content', label: 'Content', icon: FileText, desc: 'Manage pages, blogs, banners & media' },
    { key: 'finance', label: 'Finance', icon: DollarSign, desc: 'Transactions, payouts & revenue reports' },
    { key: 'marketing', label: 'Marketing', icon: Megaphone, desc: 'Coupons, campaigns & promotions' },
    { key: 'operations', label: 'Operations', icon: Settings, desc: 'Orders, inventory & logistics' },
    { key: 'support', label: 'Support', icon: HeadphonesIcon, desc: 'Tickets, chat & customer help' },
];

const DEPT_COLOR = '#2d6a4f';

const ControlAuthority = () => {
    const [search, setSearch] = useState('');
    const [expandedDept, setExpandedDept] = useState(null);
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [addingTo, setAddingTo] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [activeTab, setActiveTab] = useState('departments'); // departments | all

    // ─── Load invitations ───
    useEffect(() => { fetchInvitations(); }, []);
    useEffect(() => {
        if (successMsg) { const t = setTimeout(() => setSuccessMsg(''), 4000); return () => clearTimeout(t); }
    }, [successMsg]);
    useEffect(() => {
        if (errorMsg) { const t = setTimeout(() => setErrorMsg(''), 5000); return () => clearTimeout(t); }
    }, [errorMsg]);

    const fetchInvitations = async () => {
        setLoading(true);
        try {
            const res = await invitationsAPI.list();
            setInvitations(res.data);
        } catch {
            // Fallback empty
            setInvitations([]);
        } finally {
            setLoading(false);
        }
    };

    const sendInvite = async (deptKey) => {
        if (!newEmail.trim()) return;
        setSending(true);
        setErrorMsg('');
        try {
            await invitationsAPI.send({ email: newEmail.trim().toLowerCase(), department: deptKey });
            setSuccessMsg(`Invitation sent to ${newEmail.trim()} for ${DEPARTMENTS.find(d => d.key === deptKey)?.label}!`);
            setNewEmail('');
            setAddingTo(null);
            fetchInvitations();
        } catch (err) {
            setErrorMsg(err.response?.data?.error || 'Failed to send invitation.');
        } finally {
            setSending(false);
        }
    };

    const removeInvite = async (id) => {
        try {
            await invitationsAPI.remove(id);
            setSuccessMsg('Invitation removed.');
            fetchInvitations();
        } catch (err) {
            setErrorMsg(err.response?.data?.error || 'Failed to remove invitation.');
        }
    };

    const toggleDept = (key) => {
        setExpandedDept(expandedDept === key ? null : key);
        setAddingTo(null);
        setNewEmail('');
    };

    const getDeptInvites = (deptKey) => invitations.filter(i => i.department === deptKey);
    const pendingCount = invitations.filter(i => i.status === 'pending').length;
    const acceptedCount = invitations.filter(i => i.status === 'accepted').length;

    const filteredDepts = DEPARTMENTS.filter(d =>
        d.label.toLowerCase().includes(search.toLowerCase()) ||
        d.desc.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (iso) => {
        if (!iso) return '—';
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
            ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <Shield size={22} className="text-brand" />
                        Control Authority
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Send invitations to admins for department-wise access
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-lg flex items-center gap-2" style={{ background: '#eaf4f0' }}>
                        <Clock size={14} style={{ color: DEPT_COLOR }} />
                        <span className="text-sm font-medium" style={{ color: DEPT_COLOR }}>{pendingCount} Pending</span>
                    </div>
                    <div className="px-4 py-2 rounded-lg flex items-center gap-2" style={{ background: '#eaf4f0' }}>
                        <CheckCircle2 size={14} style={{ color: DEPT_COLOR }} />
                        <span className="text-sm font-medium" style={{ color: DEPT_COLOR }}>{acceptedCount} Accepted</span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            {successMsg && (
                <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: '#eaf4f0', color: DEPT_COLOR }}>
                    <Check size={16} /> {successMsg}
                </div>
            )}
            {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    <AlertCircle size={16} /> {errorMsg}
                </div>
            )}

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
                <button
                    onClick={() => setActiveTab('departments')}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'departments'
                        ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Departments
                </button>
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'all'
                        ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    All Admins ({invitations.length})
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder={activeTab === 'departments' ? 'Search departments...' : 'Search admins by email...'}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="animate-spin text-brand" size={28} />
                    <span className="ml-3 text-gray-500 text-sm">Loading...</span>
                </div>
            ) : activeTab === 'departments' ? (
                /* ═══════ DEPARTMENTS VIEW ═══════ */
                <div className="space-y-3">
                    {filteredDepts.map((dept) => {
                        const isExpanded = expandedDept === dept.key;
                        const deptInvites = getDeptInvites(dept.key);
                        const accepted = deptInvites.filter(i => i.status === 'accepted');
                        const pending = deptInvites.filter(i => i.status === 'pending');
                        const Icon = dept.icon;

                        return (
                            <div
                                key={dept.key}
                                className={`bg-white rounded-xl border transition-all duration-300 ${isExpanded
                                    ? 'border-brand shadow-md' : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'}`}
                            >
                                {/* Department Header */}
                                <button
                                    onClick={() => toggleDept(dept.key)}
                                    className="w-full flex items-center gap-4 p-5 text-left"
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm"
                                        style={{ background: DEPT_COLOR }}
                                    >
                                        <Icon size={22} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-brand-dark">{dept.label}</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">{dept.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        {accepted.length > 0 && (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#eaf4f0', color: DEPT_COLOR }}>
                                                {accepted.length} active
                                            </span>
                                        )}
                                        {pending.length > 0 && (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
                                                {pending.length} pending
                                            </span>
                                        )}
                                        {deptInvites.length === 0 && (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                                0 admins
                                            </span>
                                        )}
                                        {isExpanded
                                            ? <ChevronUp size={18} className="text-gray-400" />
                                            : <ChevronDown size={18} className="text-gray-400" />
                                        }
                                    </div>
                                </button>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
                                        {/* Accepted admins */}
                                        {accepted.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Active Admins</p>
                                                {accepted.map((inv) => (
                                                    <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg group hover:bg-gray-50 transition-colors" style={{ background: '#f8faf9' }}>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: DEPT_COLOR }}>
                                                                {(inv.admin_name || inv.email).charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-700">{inv.admin_name || inv.email}</p>
                                                                <p className="text-xs text-gray-400">{inv.email} • Joined {formatDate(inv.accepted_at)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white" style={{ background: DEPT_COLOR }}>Active</span>
                                                            <button
                                                                onClick={() => removeInvite(inv.id)}
                                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Pending invitations */}
                                        {pending.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Pending Invitations</p>
                                                {pending.map((inv) => (
                                                    <div key={inv.id} className="flex items-center justify-between p-3 bg-amber-50/50 rounded-lg group hover:bg-amber-50 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                                                <Mail size={16} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-700">{inv.email}</p>
                                                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                                                    <Clock size={10} /> Sent {formatDate(inv.invited_at)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-semibold">Pending</span>
                                                            <button
                                                                onClick={() => removeInvite(inv.id)}
                                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {deptInvites.length === 0 && (
                                            <p className="text-sm text-gray-400 text-center py-3">
                                                No admins assigned to this department yet.
                                            </p>
                                        )}

                                        {/* Send Invite */}
                                        {addingTo === dept.key ? (
                                            <div className="flex items-center gap-2">
                                                <div className="relative flex-1">
                                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        placeholder="Enter email to invite..."
                                                        value={newEmail}
                                                        onChange={(e) => setNewEmail(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && sendInvite(dept.key)}
                                                        autoFocus
                                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => sendInvite(dept.key)}
                                                    disabled={sending}
                                                    className="p-2.5 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-1"
                                                    style={{ background: DEPT_COLOR }}
                                                >
                                                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                                </button>
                                                <button
                                                    onClick={() => { setAddingTo(null); setNewEmail(''); }}
                                                    className="p-2.5 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setAddingTo(dept.key)}
                                                className="flex items-center gap-2 px-4 py-2.5 w-full justify-center border-2 border-dashed rounded-lg text-sm font-medium transition-colors"
                                                style={{ borderColor: '#c5ddd3', color: DEPT_COLOR }}
                                                onMouseOver={(e) => e.currentTarget.style.borderColor = DEPT_COLOR}
                                                onMouseOut={(e) => e.currentTarget.style.borderColor = '#c5ddd3'}
                                            >
                                                <UserPlus size={16} /> Send Invitation
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* ═══════ ALL ADMINS VIEW ═══════ */
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100" style={{ background: '#f8faf9' }}>
                                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Admin</th>
                                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Department</th>
                                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Invited</th>
                                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Accepted</th>
                                    <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invitations
                                    .filter(inv => {
                                        if (!search) return true;
                                        const s = search.toLowerCase();
                                        return inv.email.toLowerCase().includes(s) ||
                                            inv.department_label.toLowerCase().includes(s) ||
                                            (inv.admin_name || '').toLowerCase().includes(s);
                                    })
                                    .map((inv) => {
                                        const dept = DEPARTMENTS.find(d => d.key === inv.department);
                                        const Icon = dept?.icon || Shield;
                                        return (
                                            <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                                            style={{ background: DEPT_COLOR }}
                                                        >
                                                            {(inv.admin_name || inv.email).charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-700">{inv.admin_name || '—'}</p>
                                                            <p className="text-xs text-gray-400">{inv.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ background: DEPT_COLOR }}>
                                                            <Icon size={14} />
                                                        </div>
                                                        <span className="text-gray-700">{inv.department_label}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    {inv.status === 'accepted' ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{ background: DEPT_COLOR }}>
                                                            <CheckCircle2 size={12} /> Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                                                            <Clock size={12} /> Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3 text-gray-500 text-xs">{formatDate(inv.invited_at)}</td>
                                                <td className="px-5 py-3 text-gray-500 text-xs">
                                                    {inv.accepted_at ? formatDate(inv.accepted_at) : '—'}
                                                </td>
                                                <td className="px-5 py-3 text-right">
                                                    <button
                                                        onClick={() => removeInvite(inv.id)}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                        title="Remove"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                {invitations.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                                            <Users size={32} className="mx-auto mb-3 opacity-50" />
                                            <p>No invitations sent yet.</p>
                                            <p className="text-xs mt-1">Go to Departments tab to send invitations.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ControlAuthority;
