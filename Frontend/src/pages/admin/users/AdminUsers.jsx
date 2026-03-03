import React, { useState } from 'react';
import {
    Users, Shield, ShieldCheck, Mail, Phone,
    MoreVertical, Edit2, Trash2, Plus,
    Home, ChevronRight, UserPlus, Search, Download, FileText
} from 'lucide-react';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';

const AdminUsers = () => {
    const initialAdmins = [
        { id: 1, name: 'Saif Ur Rehman', email: 'saif@nextgen.com', role: 'Super Admin', status: 'Active', joined: '2025-01-10' },
        { id: 2, name: 'Alice Smith', email: 'alice@nextgen.com', role: 'Support Manager', status: 'Active', joined: '2025-02-15' },
        { id: 3, name: 'Bob Johnson', email: 'bob@nextgen.com', role: 'Marketing Staff', status: 'Offline', joined: '2025-03-01' },
    ];
    const [admins, setAdmins] = useState(initialAdmins);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        role: '',
        status: ''
    });

    const filterOptions = [
        {
            key: 'role',
            label: 'Staff Role',
            options: [
                { label: 'All Roles', value: '' },
                { label: 'Super Admin', value: 'Super Admin' },
                { label: 'Support Manager', value: 'Support Manager' },
                { label: 'Marketing Staff', value: 'Marketing Staff' },
            ]
        },
        {
            key: 'status',
            label: 'Availability',
            options: [
                { label: 'Any Status', value: '' },
                { label: 'Active', value: 'Active' },
                { label: 'Offline', value: 'Offline' },
            ]
        }
    ];

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ role: '', status: '' });
    };

    const handleExportExcel = () => {
        const dataToExport = filteredAdmins.map(a => ({
            "Staff ID": a.id,
            "Name": a.name,
            "Email": a.email,
            "Role": a.role,
            "Status": a.status,
            "Joined Date": a.joined
        }));
        exportToExcel(dataToExport, "Admin_Staff_Export");
    };

    const handleExportCSV = () => {
        const dataToExport = filteredAdmins.map(a => ({
            "Staff ID": a.id,
            "Name": a.name,
            "Email": a.email,
            "Role": a.role,
            "Status": a.status,
            "Joined Date": a.joined
        }));
        exportToCSV(dataToExport, "Admin_Staff_Export");
    };

    const handleExportPDF = () => {
        const columns = ["ID", "Name", "Email", "Role", "Status", "Joined"];
        const dataToExport = filteredAdmins.map(a => [
            a.id,
            a.name,
            a.email,
            a.role,
            a.status,
            a.joined
        ]);
        exportToPDF(dataToExport, columns, "Admin_Staff_Export", "Internal Staff and Admin Security Audit Report");
    };

    const filteredAdmins = admins.filter(staff => {
        const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filters.role === '' || staff.role === filters.role;
        const matchesStatus = filters.status === '' || staff.status === filters.status;

        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <ShieldCheck size={24} className="text-emerald-500" />
                        Admin & Staff
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mt-1">
                        <Home size={14} />
                        <ChevronRight size={12} />
                        <span>Staff Management</span>
                        <ChevronRight size={12} />
                        <span className="text-emerald-500 font-bold">Admin Users</span>
                    </div>
                </div>
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
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-bold rounded-xl text-sm hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 font-bold">
                        <UserPlus size={18} /> Add New Staff
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Staff</p>
                        <h4 className="text-xl font-black text-gray-800">{admins.length} Members</h4>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                        <Shield size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Roles</p>
                        <h4 className="text-xl font-black text-gray-800">4 Defined</h4>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Security</p>
                        <h4 className="text-xl font-black text-gray-800">2FA Enabled</h4>
                    </div>
                </div>
            </div>

            {/* Main Table Container */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative w-full md:w-96">
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find staff members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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

                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold uppercase text-[10px] tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Staff Member</th>
                                <th className="px-6 py-4">Role & Access</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Joined Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredAdmins.length > 0 ? filteredAdmins.map(staff => (
                                <tr key={staff.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-black shadow-lg shadow-emerald-100 text-xs">
                                                {staff.name[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">{staff.name}</span>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase">
                                                    <Mail size={10} /> {staff.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${staff.role === 'Super Admin' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                            staff.role.includes('Manager') ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            }`}>
                                            {staff.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-1.5 font-black text-[10px] uppercase">
                                            <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'Active' ? 'bg-emerald-500 animate-pulse outline outline-offset-2 outline-emerald-100' : 'bg-gray-300'}`}></span>
                                            <span className={staff.status === 'Active' ? 'text-emerald-600' : 'text-gray-400'}>{staff.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-[10px] font-black text-gray-400 uppercase">{staff.joined}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-50 shadow-sm bg-white"><Edit2 size={16} /></button>
                                            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-50 shadow-sm bg-white"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-400 font-black uppercase text-xs italic">
                                        No staff members found matching your filters.
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

export default AdminUsers;
