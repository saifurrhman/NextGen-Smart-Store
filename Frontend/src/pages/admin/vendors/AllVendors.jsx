import React, { useState, useEffect } from 'react';
import {
    Store, Search, Download, Plus, MoreVertical, Edit2, Trash2, FileText,
    User, Mail, Phone, MapPin, CheckCircle2, AlertCircle, XCircle, X
} from 'lucide-react';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import api from '../../../utils/api';
import useRowSelection from '../../../hooks/useRowSelection';
import BulkActionBar from '../../../components/admin/common/BulkActionBar';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';

const AllVendors = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: ''
    });
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [showExportMenu, setShowExportMenu] = useState(false);

    const { selectedIds, toggleAll, toggleOne, isAllSelected, clearSelection } = useRowSelection('id');

    // Add Vendor Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        store_name: '',
        owner_name: '',
        owner_email: '',
        phone_number: '',
        address: '',
        description: '',
        status: 'pending'
    });

    useEffect(() => {
        fetchVendors();
    }, [page, searchTerm, filters]);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            let url = `/api/v1/vendors/?page=${page}`;
            if (searchTerm) url += `&search=${searchTerm}`;
            if (filters.status !== '') url += `&status=${filters.status}`;

            const response = await api.get(url);
            setVendors(response.data.results);
            setPagination({
                count: response.data.count,
                next: response.data.next,
                previous: response.data.previous
            });
        } catch (error) {
            console.error("Failed to fetch vendors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({ status: '' });
        setPage(1);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateVendor = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        setMsg({ type: '', text: '' });
        try {
            await api.post('/api/v1/vendors/', formData);
            setMsg({ type: 'success', text: 'Vendor application created successfully!' });
            setFormData({
                store_name: '',
                owner_name: '',
                owner_email: '',
                phone_number: '',
                address: '',
                description: '',
                status: 'pending'
            });
            // Refresh list
            fetchVendors();
            setTimeout(() => {
                setShowAddModal(false);
                setMsg({ type: '', text: '' });
            }, 1500);
        } catch (error) {
            console.error("Failed to create vendor:", error);
            const errorMsg = error.response?.data?.detail ||
                (error.response?.data?.owner_email ? error.response.data.owner_email[0] : null) ||
                'Failed to create vendor. Please check if email is unique.';
            setMsg({ type: 'error', text: errorMsg });
        } finally {
            setCreateLoading(false);
        }
    };

    const handleDeleteVendor = async (vendorId) => {
        if (!window.confirm('Are you sure you want to delete this vendor account? This will also affect their listed products.')) return;
        try {
            await api.delete(`/api/v1/vendors/${vendorId}/`);
            setVendors(prev => prev.filter(v => v.id !== vendorId));
            setMsg({ type: 'success', text: 'Vendor deleted successfully!' });
            setTimeout(() => setMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error("Failed to delete vendor:", error);
            alert('Failed to delete vendor.');
        }
    };

    const handleExportExcel = () => {
        const dataToExport = vendors.map(v => ({
            "Vendor ID": v.id,
            "Store Name": v.store_name || 'N/A',
            "Owner": v.owner_name || 'N/A',
            "Email": v.owner_email || 'N/A',
            "Products": v.product_count,
            "Revenue": v.balance,
            "Status": v.status,
            "Joined Date": new Date(v.created_at).toLocaleDateString()
        }));
        exportToExcel(dataToExport, "All_Vendors_Report");
        setShowExportMenu(false);
    };

    const handleExportCSV = () => {
        const dataToExport = vendors.map(v => ({
            "Vendor ID": v.id,
            "Store Name": v.store_name || 'N/A',
            "Owner": v.owner_name || 'N/A',
            "Email": v.owner_email || 'N/A',
            "Products": v.product_count,
            "Revenue": v.balance,
            "Status": v.status,
            "Joined Date": new Date(v.created_at).toLocaleDateString()
        }));
        exportToCSV(dataToExport, "All_Vendors_Export");
        setShowExportMenu(false);
    };

    const handleExportPDF = () => {
        const columns = ["ID", "Store Name", "Owner", "Products", "Revenue", "Status"];
        const dataToExport = vendors.map(v => [
            v.id.toString().slice(-6).toUpperCase(),
            v.store_name || 'N/A',
            v.owner_name || 'N/A',
            v.product_count,
            `PKR ${v.balance}`,
            v.status
        ]);
        exportToPDF(dataToExport, columns, "All_Vendors_Export", "Vendor Directory Performance Report");
        setShowExportMenu(false);
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected vendors?`)) return;
        try {
            await Promise.all(selectedIds.map(id => api.delete(`/api/v1/vendors/${id}/`)));
            setVendors(prev => prev.filter(v => !selectedIds.includes(v.id)));
            setMsg({ type: 'success', text: `${selectedIds.length} vendors deleted successfully!` });
            clearSelection();
            setTimeout(() => setMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error("Failed to delete vendors:", error);
            alert('Failed to delete some vendors.');
        }
    };

    const handleBulkExportExcel = () => {
        const selectedData = vendors.filter(v => selectedIds.includes(v.id));
        const dataToExport = selectedData.map(v => ({
            "Vendor ID": v.id,
            "Store Name": v.store_name || 'N/A',
            "Owner": v.owner_name || 'N/A',
            "Email": v.owner_email || 'N/A',
            "Products": v.product_count,
            "Revenue": v.balance,
            "Status": v.status,
            "Joined Date": new Date(v.created_at).toLocaleDateString()
        }));
        exportToExcel(dataToExport, `Selected_Vendors_${selectedIds.length}`);
    };

    const filterOptions = [
        {
            key: 'status',
            label: 'Vendor Status',
            options: [
                { label: 'All Status', value: '' },
                { label: 'Active', value: 'active' },
                { label: 'Pending', value: 'pending' },
                { label: 'Suspended', value: 'suspended' },
            ]
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Store size={24} className="text-emerald-500" />
                        All Vendors
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Manage and view your all vendors</p>
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
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-100"
                    >
                        <Plus size={18} />
                        Create New
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Toolbar */}
                <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search in All Vendors..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium text-gray-700 shadow-sm"
                        />
                    </div>
                    <FilterDropdown
                        options={filterOptions}
                        activeFilters={filters}
                        onFilterChange={handleFilterChange}
                        onClear={clearFilters}
                    />
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                        checked={isAllSelected(vendors)}
                                        onChange={() => toggleAll(vendors)}
                                    />
                                </th>
                                <th className="px-6 py-4">No.</th>
                                <th className="px-6 py-4">Store Name</th>
                                <th className="px-6 py-4">Owner</th>
                                <th className="px-6 py-4 text-center">Products</th>
                                <th className="px-6 py-4 text-center">Revenue</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {vendors.map((vendor, idx) => (
                                <tr key={vendor.id} className={`hover:bg-gray-50/50 transition-colors group ${selectedIds.includes(vendor.id) ? 'bg-emerald-50/50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                            checked={selectedIds.includes(vendor.id)}
                                            onChange={() => toggleOne(vendor.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-400">#{(page - 1) * 10 + idx + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">{vendor.store_name}</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Joined {new Date(vendor.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-bold text-sm">{vendor.owner_name}</span>
                                            <span className="text-[10px] text-gray-400 font-bold lowercase">{vendor.owner_email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-[10px] font-black uppercase">{vendor.product_count}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-black text-emerald-600 text-sm">PKR {vendor.balance}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${vendor.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                                            vendor.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${vendor.status === 'active' ? 'bg-emerald-500' :
                                                vendor.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                                                }`}></span>
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => alert(`Editing vendor: ${vendor.store_name}`)}
                                                className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteVendor(vendor.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {vendors.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="8" className="py-20 text-center text-gray-400 font-black uppercase text-xs italic">
                                        No vendors found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <BulkActionBar
                    selectedIds={selectedIds}
                    onClear={clearSelection}
                    label={{ singular: "vendor", plural: "vendors" }}
                    onExportExcel={handleBulkExportExcel}
                    onExportCSV={() => {
                        const selectedData = vendors.filter(v => selectedIds.includes(v.id));
                        exportToCSV(selectedData, `Selected_Vendors_${selectedIds.length}`);
                    }}
                    onExportPDF={() => {
                        const selectedData = vendors.filter(v => selectedIds.includes(v.id));
                        const columns = ["ID", "Store Name", "Owner", "Products", "Revenue", "Status"];
                        const dataToExport = selectedData.map(v => [
                            v.id,
                            v.store_name,
                            v.owner_name,
                            v.product_count,
                            `PKR ${v.balance}`,
                            v.status
                        ]);
                        exportToPDF(dataToExport, columns, `Selected_Vendors_${selectedIds.length}`);
                    }}
                    onDelete={handleBulkDelete}
                />

                {/* Pagination */}
                {pagination.count > 10 && (
                    <div className="p-5 flex items-center justify-between border-t border-gray-50 text-sm bg-gray-50/30">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Showing {vendors.length} of {pagination.count}</span>
                        <div className="flex gap-1.5">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={!pagination.previous || loading}
                                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm bg-white"
                            >Prev</button>
                            <button className="w-9 h-9 flex items-center justify-center bg-emerald-500 text-white font-black rounded-lg text-xs shadow-md shadow-emerald-100">{page}</button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={!pagination.next || loading}
                                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm bg-white"
                            >Next</button>
                        </div>
                    </div>
                )}

            </div>

            {/* Add Vendor Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => !createLoading && setShowAddModal(false)}></div>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-emerald-600 p-6 flex justify-between items-center text-white">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Store size={22} /> Register New Vendor
                                </h3>
                                <p className="text-emerald-50 text-xs mt-1 font-medium">Add a new store partner to the platform</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-white/20 rounded-xl transition-all"
                            >
                                <XCircle size={22} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleCreateVendor} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            {msg.text && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 font-bold text-sm ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                    {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    {msg.text}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Store Name</label>
                                    <div className="relative">
                                        <Store size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="store_name"
                                            required
                                            value={formData.store_name}
                                            onChange={handleFormChange}
                                            placeholder="Official Store Name"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-gray-800"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Owner Name</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="owner_name"
                                            required
                                            value={formData.owner_name}
                                            onChange={handleFormChange}
                                            placeholder="Legal Owner Name"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-gray-800"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Owner Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            name="owner_email"
                                            required
                                            value={formData.owner_email}
                                            onChange={handleFormChange}
                                            placeholder="owner@example.com"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-gray-800"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Contact Phone</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="phone_number"
                                            required
                                            value={formData.phone_number}
                                            onChange={handleFormChange}
                                            placeholder="+92 3XX XXXXXXX"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-gray-800"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Initial Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-gray-800"
                                    >
                                        <option value="pending">Pending Approval</option>
                                        <option value="active">Active</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Store Address</label>
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-4 top-4 text-gray-400" />
                                        <textarea
                                            name="address"
                                            required
                                            value={formData.address}
                                            onChange={handleFormChange}
                                            placeholder="Full physical address"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-gray-800 h-20 resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Store Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleFormChange}
                                        placeholder="Briefly describe what this store sells..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-gray-800 h-24 resize-none"
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    disabled={createLoading}
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 text-sm font-black text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-2xl transition-all border border-transparent"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className="flex-1 py-3 bg-emerald-500 text-white text-sm font-black rounded-2xl hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {createLoading ? 'Finalizing...' : <><Plus size={18} /> Register Vendor</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllVendors;
