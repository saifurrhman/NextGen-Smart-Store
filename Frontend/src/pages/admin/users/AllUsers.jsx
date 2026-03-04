import React, { useState, useEffect } from 'react';
import {
    Users, Search, Filter, Download, Plus, MoreVertical,
    ArrowUp, Edit2, Trash2, UserPlus, Shield, UserCheck, Briefcase, FileText,
    X, CheckCircle2, AlertCircle, Key, Mail, User
} from 'lucide-react';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import api from '../../../utils/api';
import useRowSelection from '../../../hooks/useRowSelection';
import BulkActionBar from '../../../components/admin/common/BulkActionBar';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [role, setRole] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        is_active: ''
    });
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [stats, setStats] = useState({
        total: 0,
        customers: 0,
        vendors: 0,
        admins: 0
    });

    const { selectedIds, toggleAll, toggleOne, isAllSelected, clearSelection, getId } = useRowSelection(user => user.uid || user.email);

    // Add User Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'CUSTOMER',
        is_active: true
    });

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                let url = `users/?page=${page}`;
                if (role) url += `&role=${role}`;
                if (filters.is_active !== '') url += `&is_active=${filters.is_active}`;
                if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

                const response = await api.get(url);
                const data = response.data;

                // Handle both paginated { count, results: [] } and plain array
                if (Array.isArray(data)) {
                    setUsers(data);
                    setPagination({ count: data.length, next: null, previous: null });
                } else {
                    setUsers(data.results || []);
                    setPagination({
                        count: data.count || 0,
                        next: data.next || null,
                        previous: data.previous || null,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch users:', error.response?.data || error.message);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        // Fetch stats separately (all users, role-wise counts)
        const fetchStats = async () => {
            try {
                const res = await api.get('users/stats/');
                setStats({
                    total: res.data.total || 0,
                    customers: res.data.customers || 0,
                    vendors: res.data.vendors || 0,
                    admins: res.data.admins || 0,
                });
            } catch (err) {
                console.error('Failed to fetch stats:', err.response?.data || err.message);
            }
        };

        fetchUsers();
        // Only refresh stats when not filtered (to get global counts)
        if (!role && !searchTerm && filters.is_active === '') {
            fetchStats();
        }
    }, [page, role, filters, searchTerm]);


    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({ is_active: '' });
        setPage(1);
    };

    const handleExportExcel = () => {
        const dataToExport = users.map(u => ({
            "User ID": u.id,
            "Name": `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'N/A',
            "Role": (u.role || '').replace('_', ' '),
            "Email": u.email,
            "Status": u.is_active ? 'Active' : 'Inactive',
            "Joined Date": new Date(u.date_joined).toLocaleDateString()
        }));
        exportToExcel(dataToExport, "Systems_Users_Export");
    };

    const handleExportCSV = () => {
        const dataToExport = users.map(u => ({
            "User ID": u.id,
            "Name": `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'N/A',
            "Role": (u.role || '').replace('_', ' '),
            "Email": u.email,
            "Status": u.is_active ? 'Active' : 'Inactive',
            "Joined Date": new Date(u.date_joined).toLocaleDateString()
        }));
        exportToCSV(dataToExport, "Systems_Users_Export");
    };

    const handleExportPDF = () => {
        const columns = ["ID", "Name", "Role", "Email", "Status", "Joined"];
        const dataToExport = users.map(u => [
            u.id.toString().slice(-6).toUpperCase(),
            `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'N/A',
            (u.role || '').replace('_', ' '),
            u.email,
            u.is_active ? 'Active' : 'Inactive',
            new Date(u.date_joined).toLocaleDateString()
        ]);
        exportToPDF(dataToExport, columns, "Systems_Users_Export", "System User Directory Report");
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected users?`)) return;
        try {
            await Promise.all(selectedIds.map(uid => api.delete(`users/${uid}/`)));
            setUsers(prev => prev.filter(u => !selectedIds.includes(getId(u))));
            setMsg({ type: 'success', text: `${selectedIds.length} users deleted successfully!` });
            clearSelection();
            setTimeout(() => setMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error("Failed to delete users:", error);
            alert('Failed to delete some users.');
        }
    };

    const handleBulkExportExcel = () => {
        const selectedData = users.filter(u => selectedIds.includes(getId(u)));
        const dataToExport = selectedData.map(u => ({
            "User ID": u.id,
            "Name": `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'N/A',
            "Role": (u.role || '').replace('_', ' '),
            "Email": u.email,
            "Status": u.is_active ? 'Active' : 'Inactive',
            "Joined Date": new Date(u.date_joined).toLocaleDateString()
        }));
        exportToExcel(dataToExport, `Selected_Users_${selectedIds.length}`);
    };

    const filterOptions = [
        {
            key: 'is_active',
            label: 'Account Status',
            options: [
                { label: 'All Status', value: '' },
                { label: 'Active Only', value: 'true' },
                { label: 'Inactive Only', value: 'false' },
            ]
        }
    ];

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        setPage(1);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        setMsg({ type: '', text: '' });
        try {
            await api.post('users/', {
                ...formData,
                username: formData.email
            });
            setMsg({ type: 'success', text: 'User created successfully!' });
            setFormData({ first_name: '', last_name: '', email: '', password: '', role: 'CUSTOMER', is_active: true });
            setPage(1);
            setTimeout(() => {
                setShowAddModal(false);
                setMsg({ type: '', text: '' });
            }, 1500);
        } catch (error) {
            console.error("Failed to create user:", error);
            const errorMsg = error.response?.data?.detail ||
                (error.response?.data?.email ? error.response.data.email[0] : null) ||
                'Failed to create user. Please check if email is unique.';
            setMsg({ type: 'error', text: errorMsg });
        } finally {
            setCreateLoading(false);
        }
    };

    const handleDeleteUser = async (user) => {
        const displayName = user.first_name || user.username || user.email;
        if (!window.confirm(`Are you sure you want to delete "${displayName}"? This cannot be undone.`)) return;

        const uid = user.uid || user.email;
        try {
            await api.delete(`users/${uid}/`);
            setUsers(prev => prev.filter(u => (u.uid || u.email) !== uid));
            setMsg({ type: 'success', text: `"${displayName}" deleted successfully!` });
            setTimeout(() => setMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Failed to delete user:', error.response?.data || error.message);
            alert('Failed to delete user. They may have related records.');
        }
    };


    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">All System Users</h2>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <button
                            onClick={handleExportExcel}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all font-bold"
                        >
                            <Download size={16} className="text-emerald-600" />
                            Excel
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all font-bold"
                        >
                            <Download size={16} className="text-blue-500" />
                            CSV
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all font-bold"
                        >
                            <FileText size={16} className="text-red-500" />
                            PDF
                        </button>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 font-bold"
                    >
                        <UserPlus size={18} /> Add User
                    </button>
                </div>
            </div>

            {/* TOP STAT CARDS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Users Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative group transition-all hover:border-emerald-100">
                    <button className="absolute top-6 right-6 text-emerald-500">
                        <Users size={20} />
                    </button>
                    <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Total Users</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-black text-gray-800">{stats.total}</h2>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Registered accounts</p>
                </div>

                {/* Store Customers Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative group transition-all hover:border-emerald-100">
                    <button className="absolute top-6 right-6 text-blue-500">
                        <UserCheck size={20} />
                    </button>
                    <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Store Customers</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-black text-gray-800">{stats.customers}</h2>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Shopping accounts</p>
                </div>

                {/* Store Vendors Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative group transition-all hover:border-emerald-100">
                    <button className="absolute top-6 right-6 text-amber-500">
                        <Briefcase size={20} />
                    </button>
                    <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Store Vendors</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-black text-gray-800">{stats.vendors}</h2>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Seller accounts</p>
                </div>

                {/* Admins & Staff Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative group transition-all hover:border-emerald-100">
                    <button className="absolute top-6 right-6 text-purple-500">
                        <Shield size={20} />
                    </button>
                    <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Admins & Staff</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-black text-gray-800">{stats.admins}</h2>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Management roles</p>
                </div>
            </div>

            {/* TABLE CONTAINER */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Table Header/Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-center p-4 gap-4 bg-gray-50/30 border-b border-gray-50">
                    {/* Tabs */}
                    <div className="flex items-center bg-white rounded-xl p-1 border border-gray-100 w-full lg:w-auto overflow-x-auto shadow-sm">
                        <button
                            onClick={() => handleRoleChange('')}
                            className={`px-5 py-2 text-xs font-black rounded-lg transition-all whitespace-nowrap ${role === '' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            All Users <span className={`ml-1.5 ${role === '' ? 'text-white' : 'text-emerald-500'}`}>({pagination.count})</span>
                        </button>
                        <button
                            onClick={() => handleRoleChange('CUSTOMER')}
                            className={`px-5 py-2 text-xs font-black rounded-lg transition-all whitespace-nowrap ${role === 'CUSTOMER' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-gray-500 hover:text-gray-800'}`}
                        >Customers</button>
                        <button
                            onClick={() => handleRoleChange('VENDOR')}
                            className={`px-5 py-2 text-xs font-black rounded-lg transition-all whitespace-nowrap ${role === 'VENDOR' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-gray-500 hover:text-gray-800'}`}
                        >Vendors</button>
                        <button
                            onClick={() => handleRoleChange('SUPER_ADMIN')}
                            className={`px-5 py-2 text-xs font-black rounded-lg transition-all whitespace-nowrap ${role === 'SUPER_ADMIN' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-gray-500 hover:text-gray-800'}`}
                        >Admins</button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-[280px]">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users by name..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium text-gray-700 shadow-sm"
                            />
                        </div>
                        <FilterDropdown
                            options={filterOptions}
                            activeFilters={filters}
                            onFilterChange={handleFilterChange}
                            onClear={clearFilters}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold uppercase text-[10px] tracking-wider">
                            <tr>
                                <th className="py-4 px-5 w-10 text-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                        checked={isAllSelected(users)}
                                        onChange={() => toggleAll(users)}
                                    />
                                </th>
                                <th className="py-4 px-3 w-16 text-center">No.</th>
                                <th className="py-4 px-3">Name & Email</th>
                                <th className="py-4 px-3 text-center">Role</th>
                                <th className="py-4 px-3 text-center">Joined Date</th>
                                <th className="py-4 px-3 text-center">Status</th>
                                <th className="py-4 px-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 font-medium divide-y divide-gray-50">
                            {/* Loading Skeleton */}
                            {loading && Array(6).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="py-4 px-5 text-center"><div className="h-4 bg-gray-100 rounded w-4" /></td>
                                    <td className="py-4 px-5 text-center"><div className="h-4 bg-gray-100 rounded w-8 mx-auto" /></td>
                                    <td className="py-4 px-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100" />
                                            <div className="space-y-1.5">
                                                <div className="h-3.5 bg-gray-100 rounded w-32" />
                                                <div className="h-2.5 bg-gray-100 rounded w-44" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3 text-center"><div className="h-6 bg-gray-100 rounded-full w-20 mx-auto" /></td>
                                    <td className="py-4 px-3 text-center"><div className="h-3.5 bg-gray-100 rounded w-20 mx-auto" /></td>
                                    <td className="py-4 px-3 text-center"><div className="h-6 bg-gray-100 rounded-full w-16 mx-auto" /></td>
                                    <td className="py-4 px-5" />
                                </tr>
                            ))}
                            {/* Data rows */}
                            {!loading && users.map((row, idx) => (
                                <tr key={row.uid || row.email} className={`hover:bg-gray-50/50 transition-colors group ${selectedIds.includes(getId(row)) ? 'bg-emerald-50/50' : ''}`}>
                                    <td className="py-4 px-5 text-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                            checked={selectedIds.includes(getId(row))}
                                            onChange={() => toggleOne(getId(row))}
                                        />
                                    </td>
                                    <td className="py-4 px-5 text-center">
                                        <span className="text-gray-400 font-bold">#{(page - 1) * 10 + idx + 1}</span>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center font-black text-xs shadow-sm capitalize border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                                {row.first_name?.[0] || row.username?.[0] || row.email?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800 text-sm group-hover:text-emerald-600 transition-colors">
                                                    {[row.first_name, row.last_name].filter(Boolean).join(' ') || row.username || '—'}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-bold">{row.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3 text-center">
                                        <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${(row.role || '').includes('ADMIN') ? 'text-purple-600 border-purple-100 bg-purple-50' :
                                            row.role === 'VENDOR' ? 'text-blue-600 border-blue-100 bg-blue-50' : 'text-emerald-600 border-emerald-100 bg-emerald-50'
                                            }`}>
                                            {(row.role || 'CUSTOMER').replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="py-4 px-3 text-center text-xs font-bold text-gray-500">
                                        {row.date_joined ? new Date(row.date_joined).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="py-4 px-3 text-center">
                                        <span className={`inline-flex flex-row items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase rounded-full ${row.is_active ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${row.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                            {row.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => alert(`Editing user: ${row.first_name} ${row.last_name}`)}
                                                className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(row)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && users.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Users size={40} className="text-gray-200" />
                                            <p className="text-gray-400 font-black uppercase text-xs">
                                                {role ? `No ${role.toLowerCase().replace('_', ' ')}s found.` : 'No users found.'}
                                            </p>
                                            <p className="text-gray-300 text-xs font-medium">Try adjusting your search or filter.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.count > 10 && (
                    <div className="p-5 flex items-center justify-between border-t border-gray-50 text-sm bg-gray-50/30">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={!pagination.previous || loading}
                            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm bg-white"
                        >
                            ← Previous
                        </button>
                        <div className="flex gap-1.5">
                            <button className="w-9 h-9 flex items-center justify-center bg-emerald-500 text-white font-black rounded-lg text-xs shadow-md shadow-emerald-100">{page}</button>
                        </div>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={!pagination.next || loading}
                            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm bg-white"
                        >
                            Next →
                        </button>
                    </div>
                )}

            </div>

            <BulkActionBar
                selectedIds={selectedIds}
                onClear={clearSelection}
                label={{ singular: "user", plural: "users" }}
                onExportExcel={handleBulkExportExcel}
                onExportCSV={() => {
                    const selectedData = users.filter(u => selectedIds.includes(getId(u)));
                    exportToCSV(selectedData, `Selected_Users_${selectedIds.length}`);
                }}
                onExportPDF={() => {
                    const selectedData = users.filter(u => selectedIds.includes(getId(u)));
                    const columns = ["ID", "Name", "Role", "Email", "Status", "Joined"];
                    const dataToExport = selectedData.map(u => [
                        u.id,
                        `${u.first_name || ''} ${u.last_name || ''}`.trim(),
                        u.role,
                        u.email,
                        u.is_active ? 'Active' : 'Inactive',
                        new Date(u.date_joined).toLocaleDateString()
                    ]);
                    exportToPDF(dataToExport, columns, `Selected_Users_${selectedIds.length}`);
                }}
                onDelete={handleBulkDelete}
            />

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => !createLoading && setShowAddModal(false)} />
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100" style={{ background: 'linear-gradient(to right, #EAF8E7, white)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: '#4EA674', boxShadow: '0 4px 14px rgba(78,166,116,0.3)' }}>
                                    <UserPlus size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-gray-900">Create New User</h3>
                                    <p className="text-xs font-medium mt-0.5" style={{ color: '#4EA674' }}>Add a new staff, vendor, or customer account</p>
                                </div>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleCreateUser}>
                            <div className="px-7 py-5 space-y-5">

                                {msg.text && (
                                    <div className={`p-4 rounded-xl flex items-center gap-3 font-bold text-sm ${msg.type === 'success' ? 'bg-[#EAF8E7] text-[#4EA674] border border-[#C1E6BA]' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                        {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                        {msg.text}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    {/* First Name */}
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">First Name <span className="text-red-400">*</span></label>
                                        <div className="relative">
                                            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input
                                                type="text" name="first_name" required
                                                value={formData.first_name} onChange={handleFormChange}
                                                placeholder="John"
                                                className="w-full pl-9 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:bg-white transition-all text-gray-800"
                                                style={{ '--tw-ring-color': '#4EA674' }}
                                                onFocus={e => e.target.style.borderColor = '#4EA674'}
                                                onBlur={e => e.target.style.borderColor = '#f3f4f6'}
                                            />
                                        </div>
                                    </div>

                                    {/* Last Name */}
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Name <span className="text-red-400">*</span></label>
                                        <input
                                            type="text" name="last_name" required
                                            value={formData.last_name} onChange={handleFormChange}
                                            placeholder="Doe"
                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:bg-white transition-all text-gray-800"
                                            onFocus={e => e.target.style.borderColor = '#4EA674'}
                                            onBlur={e => e.target.style.borderColor = '#f3f4f6'}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="col-span-2 space-y-1.5">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address <span className="text-red-400">*</span></label>
                                        <div className="relative">
                                            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input
                                                type="email" name="email" required
                                                value={formData.email} onChange={handleFormChange}
                                                placeholder="john.doe@example.com"
                                                className="w-full pl-9 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:bg-white transition-all text-gray-800"
                                                onFocus={e => e.target.style.borderColor = '#4EA674'}
                                                onBlur={e => e.target.style.borderColor = '#f3f4f6'}
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Password <span className="text-red-400">*</span></label>
                                        <div className="relative">
                                            <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input
                                                type="password" name="password" required
                                                value={formData.password} onChange={handleFormChange}
                                                placeholder="••••••••"
                                                className="w-full pl-9 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:bg-white transition-all text-gray-800"
                                                onFocus={e => e.target.style.borderColor = '#4EA674'}
                                                onBlur={e => e.target.style.borderColor = '#f3f4f6'}
                                            />
                                        </div>
                                    </div>

                                    {/* Account Role */}
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Role</label>
                                        <select
                                            name="role" value={formData.role} onChange={handleFormChange}
                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:bg-white transition-all text-gray-800"
                                            onFocus={e => e.target.style.borderColor = '#4EA674'}
                                            onBlur={e => e.target.style.borderColor = '#f3f4f6'}
                                        >
                                            <option value="CUSTOMER">Customer</option>
                                            <option value="VENDOR">Vendor</option>
                                            <option value="SUPER_ADMIN">System Admin</option>
                                        </select>
                                    </div>

                                    {/* Active Status */}
                                    <div className="col-span-2">
                                        <div className="flex items-center justify-between p-4 rounded-xl border-2" style={{ background: '#EAF8E7', borderColor: '#C1E6BA' }}>
                                            <div>
                                                <p className="text-xs font-black text-gray-700">Active Status</p>
                                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Allows user to login immediately</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleFormChange} className="sr-only peer" />
                                                <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#4EA674] transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:shadow-sm after:transition-all peer-checked:after:translate-x-5" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex gap-3 px-7 py-5 border-t border-gray-50 bg-gray-50/30">
                                <button
                                    type="button" disabled={createLoading} onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 text-sm font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all"
                                >Cancel</button>
                                <button
                                    type="submit" disabled={createLoading}
                                    className="flex-[2] py-3 text-white text-sm font-black rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
                                    style={{ background: '#4EA674', boxShadow: '0 4px 14px rgba(78,166,116,0.25)' }}
                                >
                                    {createLoading
                                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
                                        : <><UserPlus size={16} /> Create Account</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </div>
    );
};

export default AllUsers;
