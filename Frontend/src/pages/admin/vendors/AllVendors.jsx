import React, { useState, useEffect } from 'react';
import { Store, Search, Filter, Download, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import api from '../../../utils/api';

const AllVendors = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });

    useEffect(() => {
        const fetchVendors = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/v1/vendors/?page=${page}`);
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
        fetchVendors();
    }, [page]);

    return (
        <div className="space-y-6">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <Store size={22} className="text-brand" />
                        All Vendors
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and view your all vendors</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                        <Download size={16} />
                        Export
                    </button>
                    <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors shadow-sm">
                        <Plus size={16} />
                        Create New
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Toolbar */}
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search in All Vendors..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all shadow-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors w-full sm:w-auto shadow-sm">
                        <Filter size={16} />
                        Filters
                    </button>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-3">No.</th>
                                <th className="px-6 py-3">Store Name</th>
                                <th className="px-6 py-3">Owner</th>
                                <th className="px-6 py-3 text-center">Products</th>
                                <th className="px-6 py-3 text-center">Revenue</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {vendors.map((vendor, idx) => (
                                <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-gray-400">#{(page - 1) * 10 + idx + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">{vendor.store_name}</span>
                                            <span className="text-[10px] text-gray-400 font-medium">Joined {new Date(vendor.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-medium">{vendor.owner_name}</span>
                                            <span className="text-[10px] text-gray-400">{vendor.owner_email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-600 font-bold">{vendor.product_count}</td>
                                    <td className="px-6 py-4 text-center text-emerald-600 font-bold">PKR {vendor.balance}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${vendor.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                                                vendor.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50text-red-700'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${vendor.status === 'active' ? 'bg-emerald-500' :
                                                    vendor.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                                                }`}></span>
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-emerald-500 transition-colors"><Edit2 size={16} /></button>
                                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"><MoreVertical size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {vendors.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center text-gray-400 font-bold">
                                        No vendors found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.count > 10 && (
                    <div className="p-4 border-t border-gray-100 text-sm text-gray-500 flex items-center justify-between">
                        <span>Showing {vendors.length} entries of {pagination.count}</span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={!pagination.previous || loading}
                                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                            >Prev</button>
                            <button className="px-3 py-1 bg-emerald-500 text-white rounded font-bold shadow-sm">{page}</button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={!pagination.next || loading}
                                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                            >Next</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AllVendors;
