import React, { useState, useEffect } from 'react';
import {
    Users, UserPlus, UserCheck, Search,
    Download, MoreVertical, Mail, Trash2,
    FileText
} from 'lucide-react';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import api from '../../../utils/api';
import useRowSelection from '../../../hooks/useRowSelection';
import BulkActionBar from '../../../components/admin/common/BulkActionBar';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        is_active: '',
        type: ''
    });
    const [stats, setStats] = useState({ total: 0, active: 0, new: 0, vips: 0 });
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const { selectedIds, toggleAll, toggleOne, isAllSelected, clearSelection } = useRowSelection('id');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                let url = '/api/v1/users/customers/?';
                if (searchTerm) url += `search=${searchTerm}&`;
                if (filters.is_active !== '') url += `is_active=${filters.is_active}&`;

                const response = await api.get(url);
                setCustomers(response.data);

                // Real stats calculation
                setStats({
                    total: response.data.length,
                    active: response.data.filter(u => u.is_active).length,
                    new: response.data.filter(u => new Date(u.date_joined) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
                    vips: 0
                });
            } catch (error) {
                console.error("Failed to fetch customers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, [searchTerm, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleDeleteCustomer = async (customerId) => {
        if (!window.confirm('Are you sure you want to delete this customer account?')) return;
        try {
            await api.delete(`/api/v1/users/${customerId}/`);
            setCustomers(prev => prev.filter(c => c.id !== customerId));
            setMsg({ type: 'success', text: 'Customer deleted successfully!' });
            setTimeout(() => setMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error("Failed to delete customer:", error);
            alert('Failed to delete customer account.');
        }
    };

    const handleSendEmail = (email) => {
        window.location.href = `mailto:${email}?subject=Message from NextGen Store Admin`;
    };

    const clearFilters = () => {
        setFilters({ is_active: '', type: '' });
    };

    const handleExportExcel = () => {
        const dataToExport = customers.map(c => ({
            "Customer ID": c.id,
            "Name": `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'N/A',
            "Email": c.email,
            "Phone": c.phone_number || 'N/A',
            "Status": c.is_active ? 'Active' : 'Inactive',
            "Joined Date": new Date(c.date_joined).toLocaleDateString()
        }));
        exportToExcel(dataToExport, "Customers_List_Export");
        setShowExportMenu(false);
    };

    const handleExportCSV = () => {
        const dataToExport = customers.map(c => ({
            "Customer ID": c.id,
            "Name": `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'N/A',
            "Email": c.email,
            "Phone": c.phone_number || 'N/A',
            "Status": c.is_active ? 'Active' : 'Inactive',
            "Joined Date": new Date(c.date_joined).toLocaleDateString()
        }));
        exportToCSV(dataToExport, "Customers_List_Export");
        setShowExportMenu(false);
    };

    const handleExportPDF = () => {
        const columns = ["ID", "Name", "Email", "Phone", "Status", "Joined"];
        const dataToExport = customers.map(c => [
            c.id.toString().slice(-6).toUpperCase(),
            `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'N/A',
            c.email,
            c.phone_number || 'N/A',
            c.is_active ? 'Active' : 'Inactive',
            new Date(c.date_joined).toLocaleDateString()
        ]);
        exportToPDF(dataToExport, columns, "Customers_List_Export", "Customer Directory Report");
        setShowExportMenu(false);
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected customers?`)) return;
        try {
            // In a real app, you'd have a bulk delete endpoint
            // For now, we'll delete them one by one or simulate it
            await Promise.all(selectedIds.map(id => api.delete(`/api/v1/users/${id}/`)));
            setCustomers(prev => prev.filter(c => !selectedIds.includes(c.id)));
            setMsg({ type: 'success', text: `${selectedIds.length} customers deleted successfully!` });
            clearSelection();
            setTimeout(() => setMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error("Failed to delete customers:", error);
            alert('Failed to delete some customers.');
        }
    };

    const handleBulkExportExcel = () => {
        const selectedData = customers.filter(c => selectedIds.includes(c.id));
        const dataToExport = selectedData.map(c => ({
            "Customer ID": c.id,
            "Name": `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'N/A',
            "Email": c.email,
            "Phone": c.phone_number || 'N/A',
            "Status": c.is_active ? 'Active' : 'Inactive',
            "Joined Date": new Date(c.date_joined).toLocaleDateString()
        }));
        exportToExcel(dataToExport, `Selected_Customers_${selectedIds.length}`);
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
        },
        {
            key: 'type',
            label: 'Customer Segment',
            options: [
                { label: 'All Regular', value: '' },
                { label: 'VIP Members', value: 'vip' },
            ]
        }
    ];

    return (
        <div className="max-w-[1600px] mx-auto pb-10">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Customers</h1>
                    <p className="text-[10px] md:text-sm text-gray-500 mt-1 font-medium">Manage and view your customer base</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-emerald-100 text-emerald-700 text-xs font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-sm"
                        >
                            <Download size={16} />
                            Export
                        </button>
                        {showExportMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                <button onClick={handleExportExcel} className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 text-gray-700 text-xs font-bold flex items-center gap-3 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <Download size={14} />
                                    </div>
                                    Export Excel
                                </button>
                                <button onClick={handleExportCSV} className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-gray-700 text-xs font-bold flex items-center gap-3 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Download size={14} />
                                    </div>
                                    Export CSV
                                </button>
                                <button onClick={handleExportPDF} className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-gray-700 text-xs font-bold flex items-center gap-3 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                                        <FileText size={14} />
                                    </div>
                                    Export PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* 4 STAT CARDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {/* Total Customers Card */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                        <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 z-10">
                            <MoreVertical size={18} />
                        </button>
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                                <Users size={20} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">Total Customers</h3>
                            <div className="flex items-end gap-3">
                                <h2 className="text-xl md:text-2xl font-black text-gray-800">{stats.total.toLocaleString()}</h2>
                            </div>
                        </div>
                    </div>

                    {/* Active Customers Card */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                        <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 z-10">
                            <MoreVertical size={18} />
                        </button>
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                                <UserCheck size={20} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">Active Customers</h3>
                            <div className="flex items-end gap-3">
                                <h2 className="text-xl md:text-2xl font-black text-gray-800">{stats.active.toLocaleString()}</h2>
                            </div>
                        </div>
                    </div>

                    {/* New Customers Card */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                        <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 z-10">
                            <MoreVertical size={18} />
                        </button>
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                                <UserPlus size={20} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">New (7 days)</h3>
                            <div className="flex items-end gap-3">
                                <h2 className="text-xl md:text-2xl font-black text-gray-800">{stats.new.toLocaleString()}</h2>
                            </div>
                        </div>
                    </div>

                    {/* VIP Customers Card */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                        <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 z-10">
                            <MoreVertical size={18} />
                        </button>
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                                <UserCheck size={20} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">VIP Members</h3>
                            <div className="flex items-end gap-3">
                                <h2 className="text-xl md:text-2xl font-black text-gray-800">{stats.vips.toLocaleString()}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Table Container */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-center gap-4 bg-gray-50/30">
                        <div className="relative flex-1 w-full lg:max-w-md">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium text-gray-700 shadow-sm"
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <FilterDropdown
                                options={filterOptions}
                                activeFilters={filters}
                                onFilterChange={handleFilterChange}
                                onClear={clearFilters}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-[#eaf4f0] text-emerald-800 font-bold text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="py-4 px-6 w-10">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                            checked={isAllSelected(customers)}
                                            onChange={() => toggleAll(customers)}
                                        />
                                    </th>
                                    <th className="py-4 px-2">ID</th>
                                    <th className="py-4 px-4">Customer</th>
                                    <th className="py-4 px-4">Phone</th>
                                    <th className="py-4 px-4 text-center">Orders</th>
                                    <th className="py-4 px-4">Spend</th>
                                    <th className="py-4 px-4">Status</th>
                                    <th className="py-4 px-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 font-medium divide-y divide-gray-50">
                                {customers.map((customer, idx) => (
                                    <tr key={customer.id} className={`hover:bg-gray-50/50 transition-colors group ${selectedIds.includes(customer.id) ? 'bg-emerald-50/50' : ''}`}>
                                        <td className="py-4 px-6">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                                checked={selectedIds.includes(customer.id)}
                                                onChange={() => toggleOne(customer.id)}
                                            />
                                        </td>
                                        <td className="py-4 px-2 font-bold text-gray-400 group-hover:text-emerald-500 transition-colors">
                                            #{customer.id.toString().slice(-6).toUpperCase()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center font-black text-xs shadow-sm capitalize border border-emerald-100">
                                                    {customer.first_name?.[0] || customer.email[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-800 text-sm group-hover:text-emerald-600 transition-colors">
                                                        {customer.first_name || 'N/A'} {customer.last_name || ''}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{customer.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-xs text-gray-600 font-bold">{customer.phone_number || 'N/A'}</td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-[10px] font-black uppercase">0</span>
                                        </td>
                                        <td className="py-4 px-4 font-black text-gray-800">
                                            $0.00
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase rounded-full ${customer.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${customer.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                {customer.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => handleSendEmail(customer.email)}
                                                    className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                                                >
                                                    <Mail size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCustomer(customer.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {customers.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan="8" className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Users size={40} className="text-gray-200" />
                                                <p className="text-gray-400 font-black uppercase text-xs">No customers found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <BulkActionBar
                    selectedIds={selectedIds}
                    onClear={clearSelection}
                    label={{ singular: "customer", plural: "customers" }}
                    onExportExcel={handleBulkExportExcel}
                    onExportCSV={() => {
                        const selectedData = customers.filter(c => selectedIds.includes(c.id));
                        exportToCSV(selectedData, `Selected_Customers_${selectedIds.length}`);
                    }}
                    onExportPDF={() => {
                        const selectedData = customers.filter(c => selectedIds.includes(c.id));
                        const columns = ["ID", "Name", "Email", "Phone", "Status", "Joined"];
                        const dataToExport = selectedData.map(c => [
                            c.id,
                            `${c.first_name || ''} ${c.last_name || ''}`.trim(),
                            c.email,
                            c.phone_number || 'N/A',
                            c.is_active ? 'Active' : 'Inactive',
                            new Date(c.date_joined).toLocaleDateString()
                        ]);
                        exportToPDF(dataToExport, columns, `Selected_Customers_${selectedIds.length}`);
                    }}
                    onDelete={handleBulkDelete}
                />


            </div>
        </div>
    );
};

export default Customers;
