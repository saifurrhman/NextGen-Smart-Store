import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, Search, Filter, Download, Plus, MoreVertical, Edit2, Trash2, Tag } from 'lucide-react';
import api from '../../../utils/api';

const ProductAttributes = () => {
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });

    useEffect(() => {
        const fetchAttributes = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/v1/attributes/?page=${page}`);
                const data = response.data.results || response.data;
                const totalCount = response.data.count || data.length;

                setAttributes(data);
                setPagination({
                    count: totalCount,
                    next: response.data.next,
                    previous: response.data.previous
                });
            } catch (error) {
                console.error("Failed to fetch attributes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttributes();
    }, [page]);

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Tag size={22} className="text-emerald-500" />
                        Product Attributes
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Manage and view your product attributes</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all shadow-sm">
                        <Download size={16} />
                        Export
                    </button>
                    <Link to="/admin/products/add" className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-200">
                        <Plus size={16} />
                        Create New
                    </Link>
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
                            placeholder="Search in Product Attributes..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 transition-all font-medium"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all w-full sm:w-auto shadow-sm">
                        <Filter size={16} />
                        Filters
                    </button>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-3 rounded-l-lg text-emerald-600">Attribute</th>
                                <th className="px-6 py-3 text-emerald-600">Slug</th>
                                <th className="px-6 py-3 text-emerald-600">Terms</th>
                                <th className="px-6 py-3 text-emerald-600 text-center">Status</th>
                                <th className="px-6 py-3 rounded-r-lg text-right text-emerald-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {attributes.map((attr, idx) => (
                                <tr key={attr.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-gray-800 sm:text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-300 font-bold">#{(page - 1) * 10 + idx + 1}</span>
                                            {attr.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 font-medium">
                                        {attr.slug}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 max-w-xs font-medium">
                                        <div className="flex flex-wrap gap-1">
                                            {(attr.terms || "").split(',').map((term, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-500 font-bold">
                                                    {term.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${attr.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${attr.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                            {attr.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:text-emerald-500 transition-colors bg-white border border-gray-100 rounded shadow-sm"><Edit2 size={14} /></button>
                                            <button className="p-1.5 hover:text-red-500 transition-colors bg-white border border-gray-100 rounded shadow-sm"><Trash2 size={14} /></button>
                                            <button className="p-1.5 hover:text-gray-800 transition-colors bg-white border border-gray-100 rounded shadow-sm"><MoreVertical size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {attributes.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Tag size={40} className="text-gray-200" />
                                            <p className="text-gray-400 font-bold">No attributes found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.count > 0 && (
                    <div className="p-4 border-t border-gray-100 text-[10px] font-bold text-gray-400 flex items-center justify-between uppercase">
                        <span>Showing {attributes.length} entries of {pagination.count}</span>
                        <div className="flex gap-1.5">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={!pagination.previous || loading}
                                className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-bold disabled:opacity-50"
                            >Prev</button>
                            <button className="w-8 h-8 flex items-center justify-center bg-emerald-500 text-white font-bold rounded-lg shadow-md shadow-emerald-200">{page}</button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={!pagination.next || loading}
                                className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-bold disabled:opacity-50"
                            >Next</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProductAttributes;
