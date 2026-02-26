import React from 'react';
import {
    Users, Search, Filter, Download, Plus, MoreVertical,
    ArrowUp, Edit2, Trash2, UserPlus, Shield, UserCheck, Briefcase
} from 'lucide-react';

const AllUsers = () => {
    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 hidden">
                <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            </div>

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
                        <h2 className="text-3xl font-bold text-gray-800">12,540</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                            <ArrowUp size={12} strokeWidth={3} /> <span>12.4%</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">Total registered accounts</p>
                </div>

                {/* Active Customers Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative">
                    <button className="absolute top-6 right-6 text-emerald-500">
                        <UserCheck size={18} />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Active Customers</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-gray-800">11,040</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                            <span>88%</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">Shopping accounts</p>
                </div>

                {/* Total Vendors Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative">
                    <button className="absolute top-6 right-6 text-blue-500">
                        <Briefcase size={18} />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Store Vendors</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-gray-800">1,450</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                            <ArrowUp size={12} strokeWidth={3} /> <span>5.2%</span>
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
                        <h2 className="text-3xl font-bold text-gray-800">50</h2>
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
                        <button className="px-5 py-2 text-sm font-semibold text-gray-800 bg-white rounded-md shadow-sm whitespace-nowrap">
                            All Users <span className="text-emerald-500 ml-1">(12,540)</span>
                        </button>
                        <button className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors whitespace-nowrap">Customers</button>
                        <button className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors whitespace-nowrap">Vendors</button>
                        <button className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors whitespace-nowrap">Admins</button>
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
                        <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="py-3 px-5 rounded-l-lg w-16">No.</th>
                                <th className="py-3 px-3">User ID</th>
                                <th className="py-3 px-3">Name & Email</th>
                                <th className="py-3 px-3">Role</th>
                                <th className="py-3 px-3">Joined Date</th>
                                <th className="py-3 px-3">Status</th>
                                <th className="py-3 px-5 rounded-r-lg text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 font-medium divide-y divide-gray-50/50">
                            {[
                                { num: '1', id: 'USR-1204', name: 'Saif Ur Rehman', email: 'admin@nextgen.com', role: 'Super Admin', joined: 'Jan 10, 2026', status: 'Active', statusColor: 'emerald' },
                                { num: '2', id: 'USR-1205', name: 'Hassan Ali', email: 'hassan@example.com', role: 'Vendor', joined: 'Feb 15, 2026', status: 'Active', statusColor: 'emerald' },
                                { num: '3', id: 'USR-1206', name: 'Fatima Z.', email: 'fatima@example.com', role: 'Customer', joined: 'Mar 20, 2026', status: 'Inactive', statusColor: 'red' },
                                { num: '4', id: 'USR-1207', name: 'Ahmed Khan', email: 'ahmed@store.com', role: 'Staff Admin', joined: 'Apr 02, 2026', status: 'Active', statusColor: 'emerald' },
                                { num: '5', id: 'USR-1208', name: 'Sara Smith', email: 'sara@fashion.com', role: 'Vendor', joined: 'Apr 10, 2026', status: 'Pending', statusColor: 'amber' },
                            ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 border border-gray-300 rounded-sm"></div>
                                            <span className="text-gray-500">{row.num}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3 font-semibold text-gray-500">{row.id}</td>
                                    <td className="py-4 px-3">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-800">{row.name}</span>
                                            <span className="text-gray-500 text-[10px]">{row.email}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold bg-white border border-gray-200 ${row.role.includes('Admin') ? 'text-purple-600' :
                                            row.role === 'Vendor' ? 'text-blue-600' : 'text-gray-600'
                                            }`}>
                                            {row.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-3 text-gray-500">{row.joined}</td>
                                    <td className="py-4 px-3">
                                        <span className={`inline-flex flex-row items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border text-${row.statusColor}-600 border-${row.statusColor}-200 bg-${row.statusColor}-50`}>
                                            <span className={`w-1.5 h-1.5 rounded-full bg-${row.statusColor}-500`}></span>
                                            {row.status}
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
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
                        ← Previous
                    </button>
                    <div className="flex gap-1.5">
                        <button className="w-8 h-8 flex items-center justify-center bg-[#d2f4e1] text-emerald-700 font-semibold rounded text-xs border border-emerald-200">1</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded text-xs hover:bg-gray-50">2</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded text-xs hover:bg-gray-50">3</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded text-xs hover:bg-gray-50">....</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded text-xs hover:bg-gray-50">120</button>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
                        Next →
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AllUsers;
