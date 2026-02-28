import React, { useState, useEffect } from 'react';
import {
    Users, Search, Filter, Download, Plus, MoreVertical,
    ArrowUp, Edit2, Trash2, UserPlus, Shield, UserCheck, Briefcase
} from 'lucide-react';
import api from '../../../utils/api';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [role, setRole] = useState('');
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [stats, setStats] = useState({
        total: 0,
        customers: 0,
        vendors: 0,
        admins: 0
    });

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                let url = `/api/v1/users/?page=${page}`;
                if (role) url += `&role=${role}`;

                const response = await api.get(url);
                setUsers(response.data.results);
                setPagination({
                    count: response.data.count,
                    next: response.data.next,
                    previous: response.data.previous
                });

                // Fetch basic stats (this could be optimized later with a dedicated stats endpoint)
                if (!role) {
                    const statsRes = await api.get('/api/v1/analytics/dashboard/');
                    // Assuming the analytics endpoint returns some user stats, otherwise we'll use local count for simple totals
                    setStats({
                        total: response.data.count,
                        customers: response.data.count, // Placeholder, usually fetched separately
                        vendors: 0,
                        admins: 0
                    });
                }
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [page, role]);

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        setPage(1);
    };

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">All System Users</h2>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-colors shadow-sm">
                        <UserPlus size={16} /> Add User
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* TOP STAT CARDS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Users Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative">
                    <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                        <Users size={18} />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Total Users</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-gray-800">{stats.total}</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                            <ArrowUp size={12} strokeWidth={3} /> <span>Calculated</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">Total registered accounts</p>
                </div>

                {/* Active Customers Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative">
                    <button className="absolute top-6 right-6 text-emerald-500">
                        <UserCheck size={18} />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Store Customers</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-gray-800">{stats.customers}</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                            <span>Real-time</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">Shopping accounts</p>
                </div>

                {/* Total Vendors Card - Placeholder for now */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative">
                    <button className="absolute top-6 right-6 text-blue-500">
                        <Briefcase size={18} />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Store Vendors</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-gray-800">{stats.vendors}</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                            <span>Active</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">Seller accounts</p>
                </div>

                {/* Admins & Staff Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative">
                    <button className="absolute top-6 right-6 text-purple-500">
                        <Shield size={18} />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Admins & Staff</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-gray-800">{stats.admins}</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                            <span>Stable</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">Management roles</p>
                </div>
            </div>

            {/* TABLE CONTAINER */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 overflow-hidden">

                {/* Table Header/Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    {/* Tabs */}
                    <div className="flex items-center bg-[#f0f9f4] rounded-lg p-1.5 border border-emerald-50 overflow-x-auto max-w-full">
                        <button
                            onClick={() => handleRoleChange('')}
                            className={`px-5 py-2 text-sm font-semibold rounded-md transition-all whitespace-nowrap ${role === '' ? 'text-gray-800 bg-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            All Users <span className="text-emerald-500 ml-1">({pagination.count})</span>
                        </button>
                        <button
                            onClick={() => handleRoleChange('CUSTOMER')}
                            className={`px-5 py-2 text-sm font-medium transition-colors whitespace-nowrap ${role === 'CUSTOMER' ? 'text-gray-800 bg-white shadow-sm rounded-md' : 'text-gray-500 hover:text-gray-800'}`}
                        >Customers</button>
                        <button
                            onClick={() => handleRoleChange('VENDOR')}
                            className={`px-5 py-2 text-sm font-medium transition-colors whitespace-nowrap ${role === 'VENDOR' ? 'text-gray-800 bg-white shadow-sm rounded-md' : 'text-gray-500 hover:text-gray-800'}`}
                        >Vendors</button>
                        <button
                            onClick={() => handleRoleChange('SUPER_ADMIN')}
                            className={`px-5 py-2 text-sm font-medium transition-colors whitespace-nowrap ${role === 'SUPER_ADMIN' ? 'text-gray-800 bg-white shadow-sm rounded-md' : 'text-gray-500 hover:text-gray-800'}`}
                        >Admins</button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-[280px]">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users by name..."
                                className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all font-medium text-gray-600 placeholder-gray-400"
                            />
                        </div>
                        <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="py-3 px-5 rounded-l-lg w-16 text-center">No.</th>
                                <th className="py-3 px-3">Name & Email</th>
                                <th className="py-3 px-3">Role</th>
                                <th className="py-3 px-3">Joined Date</th>
                                <th className="py-3 px-3">Status</th>
                                <th className="py-3 px-5 rounded-r-lg text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 font-medium divide-y divide-gray-50/50">
                            {users.map((row, idx) => (
                                <tr key={row.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3 justify-center">
                                            <span className="text-gray-500 italic">#{(page - 1) * 10 + idx + 1}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                                                {row.first_name?.[0] || row.username?.[0] || 'U'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-800">{row.first_name} {row.last_name}</span>
                                                <span className="text-gray-500 text-[10px]">{row.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold bg-white border border-gray-100 ${row.role.includes('ADMIN') ? 'text-purple-600' :
                                                row.role === 'VENDOR' ? 'text-blue-600' : 'text-emerald-600'
                                            }`}>
                                            {row.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="py-4 px-3 text-gray-500">{new Date(row.date_joined).toLocaleDateString()}</td>
                                    <td className="py-4 px-3">
                                        <span className={`inline-flex flex-row items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border ${row.is_active ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-red-600 border-red-200 bg-red-50'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${row.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                            {row.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-5">
                                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="hover:text-emerald-600 transition-colors bg-white p-1.5 rounded-md border border-gray-200 shadow-sm"><Edit2 size={13} /></button>
                                            <button className="hover:text-red-600 transition-colors bg-white p-1.5 rounded-md border border-gray-200 shadow-sm"><Trash2 size={13} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-gray-400 font-bold">
                                        No users found for this role.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.count > 10 && (
                    <div className="mt-6 flex items-center justify-between">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={!pagination.previous || loading}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                            ← Previous
                        </button>
                        <div className="flex gap-1.5">
                            <button className="w-8 h-8 flex items-center justify-center bg-emerald-500 text-white font-semibold rounded text-xs border border-emerald-400">{page}</button>
                        </div>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={!pagination.next || loading}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next →
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AllUsers;
