import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search, Filter, Plus, MoreHorizontal,
    Headphones, Shirt, Wallet, Monitor, Phone,
    Dumbbell, Book, Coffee, Camera, ChevronRight, Edit2, Trash2, Tag, Layers, Grid
} from 'lucide-react';
import api from '../../../utils/api';

const ProductCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/v1/categories/?page=${page}`);
                const data = response.data.results || response.data;
                const totalCount = response.data.count || data.length;

                setCategories(data);
                setPagination({
                    count: totalCount,
                    next: response.data.next,
                    previous: response.data.previous
                });
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [page]);

    const discoverIcons = [
        Monitor, Shirt, Headphones, Coffee, Grid, Layers, Dumbbell, Book
    ];

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
            </div>

            {/* TOP DISCOVER GRID */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Discover</h2>
                    <div className="flex items-center gap-3">
                        <Link to="/admin/products/add" className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-all shadow-md shadow-emerald-200">
                            <Plus size={14} /> Add Product
                        </Link>
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-all shadow-sm">
                            More Action <MoreHorizontal size={14} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.slice(0, 8).map((cat, idx) => {
                        const IconComponent = discoverIcons[idx % discoverIcons.length];
                        return (
                            <div key={cat.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer bg-white group/card">
                                <div className="w-14 h-14 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover/card:bg-emerald-500 group-hover/card:text-white transition-all duration-300">
                                    <IconComponent size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-800 text-sm">{cat.name}</span>
                                    <span className="text-[10px] text-gray-400 font-medium">Click to explore</span>
                                </div>
                            </div>
                        );
                    })}
                    {categories.length === 0 && loading && Array(4).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 bg-gray-50 animate-pulse">
                            <div className="w-14 h-14 rounded-lg bg-gray-200"></div>
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>


            {/* BOTTOM TABLE SECTION */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">

                {/* Table Header/Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    {/* Tabs */}
                    <div className="flex items-center bg-gray-50/50 rounded-lg p-1 border border-gray-100">
                        <button className="px-4 py-2 text-xs font-bold text-gray-800 bg-white rounded-md shadow-sm border border-gray-200">
                            All Categories <span className="text-emerald-500 font-bold ml-1">({pagination.count})</span>
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search your category..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-emerald-500 transition-all font-medium"
                            />
                        </div>
                        <button className="p-2 border border-gray-100 rounded-lg text-gray-500 hover:text-emerald-500 transition-all">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="py-3 px-5 rounded-l-lg w-16 text-emerald-600">No.</th>
                                <th className="py-3 px-3 text-emerald-600">Category</th>
                                <th className="py-3 px-3 text-emerald-600 text-center">Slug</th>
                                <th className="py-3 px-3 text-emerald-600 text-center">Created Date</th>
                                <th className="py-3 px-3 text-emerald-600 text-center">Status</th>
                                <th className="py-3 px-5 text-right rounded-r-lg text-emerald-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 font-medium divide-y divide-gray-50/50">
                            {categories.map((cat, idx) => (
                                <tr key={cat.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 border border-gray-300 rounded-sm"></div>
                                            <span className="text-gray-400 font-bold">#{(page - 1) * 10 + idx + 1}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="flex items-center gap-4">
                                            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-[10px] shadow-sm uppercase">
                                                {cat.name.slice(0, 2)}
                                            </div>
                                            <span className="font-bold text-gray-800 text-sm group-hover:text-emerald-600 transition-colors">{cat.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3 text-center text-gray-500 font-medium">{cat.slug}</td>
                                    <td className="py-4 px-3 text-center font-bold text-gray-600">{new Date(cat.created_at).toLocaleDateString()}</td>
                                    <td className="py-4 px-3 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${cat.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${cat.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                            {cat.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-5">
                                        <div className="flex items-center justify-end gap-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="hover:text-emerald-500 transition-colors bg-white p-1.5 rounded-md border border-gray-100 shadow-sm"><Edit2 size={14} /></button>
                                            <button className="hover:text-red-500 transition-colors bg-white p-1.5 rounded-md border border-gray-100 shadow-sm"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Layers size={40} className="text-gray-200" />
                                            <p className="text-gray-400 font-bold">No categories found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.count > 0 && (
                    <div className="mt-6 flex items-center justify-between">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={!pagination.previous || loading}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
                        >
                            ← Prev
                        </button>
                        <div className="flex gap-1.5">
                            <button className="w-8 h-8 flex items-center justify-center bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-md shadow-emerald-200">{page}</button>
                        </div>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={!pagination.next || loading}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
};

export default ProductCategories;
