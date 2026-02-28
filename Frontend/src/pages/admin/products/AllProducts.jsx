import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Store, Search, Filter, Download, Plus, MoreVertical,
    ArrowUp, Edit2, Trash2, Box, Package, AlertTriangle, TrendingUp
} from 'lucide-react';
import api from '../../../utils/api';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0, lowStock: 0, outOfStock: 0 });
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/v1/products/?page=${page}`);
                const data = response.data.results || response.data;
                const totalCount = response.data.count || data.length;

                setProducts(data);
                setPagination({
                    count: totalCount,
                    next: response.data.next,
                    previous: response.data.previous
                });

                // Stats are usually better fetched from a dedicated endpoint for all items, 
                // but we can estimate or fetch summary separately. For now, we fetch a summary or use first page.
                // To get accurate stats across ALL products, we'd need another API call without pagination.
                if (page === 1) {
                    // For demo, we use the first page's data to represent stats if count is low, 
                    // otherwise we should fetch total stats.
                    const statsRes = await api.get('/api/v1/products/?page_size=1000');
                    const allData = statsRes.data.results || statsRes.data;
                    setStats({
                        total: totalCount,
                        active: allData.filter(p => p.is_active).length,
                        lowStock: allData.filter(p => p.stock > 0 && p.stock < 10).length,
                        outOfStock: allData.filter(p => p.stock <= 0).length
                    });
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [page]);

    const filteredProducts = products.filter(p => {
        if (filter === 'active') return p.is_active;
        if (filter === 'low') return p.stock > 0 && p.stock < 10;
        if (filter === 'out') return p.stock <= 0;
        return true;
    });

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Product List</h2>
                <div className="flex items-center gap-3">
                    <Link to="/admin/products/add" className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-colors shadow-sm">
                        <Plus size={16} /> Add Product
                    </Link>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* TOP STAT CARDS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Products Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                    <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 z-10">
                        <Box size={18} />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-500 mb-4">Total Products</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-gray-800">{stats.total}</h2>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">Total items in store</p>
                </div>

                {/* Active Products Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                    <button className="absolute top-6 right-6 text-emerald-500 z-10">
                        <TrendingUp size={18} />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-500 mb-4">Active & Selling</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-gray-800">{stats.active}</h2>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">Currently published</p>
                </div>

                {/* Low Stock Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                    <button className="absolute top-6 right-6 text-amber-500 z-10">
                        <Package size={18} />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-500 mb-4">Low Stock</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-gray-800">{stats.lowStock}</h2>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">Needs restock</p>
                </div>

                {/* Out of Stock Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                    <button className="absolute top-6 right-6 text-red-400 z-10">
                        <AlertTriangle size={18} />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-500 mb-4">Out of Stock</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-gray-800">{stats.outOfStock}</h2>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">Not visible to users</p>
                </div>
            </div>

            {/* TABLE CONTAINER */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">

                {/* Table Header/Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    {/* Tabs */}
                    <div className="flex items-center bg-gray-50/50 rounded-lg p-1 border border-gray-100 overflow-x-auto max-w-full">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap ${filter === 'all' ? 'text-gray-800 bg-white shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            All products <span className="text-emerald-500 font-bold ml-1">({stats.total})</span>
                        </button>
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap ${filter === 'active' ? 'text-gray-800 bg-white shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Active <span className="text-blue-500 font-bold ml-1">({stats.active})</span>
                        </button>
                        <button
                            onClick={() => setFilter('low')}
                            className={`px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap ${filter === 'low' ? 'text-gray-800 bg-white shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Low Stock <span className="text-amber-500 font-bold ml-1">({stats.lowStock})</span>
                        </button>
                        <button
                            onClick={() => setFilter('out')}
                            className={`px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap ${filter === 'out' ? 'text-gray-800 bg-white shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Out of Stock <span className="text-red-500 font-bold ml-1">({stats.outOfStock})</span>
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all font-medium"
                            />
                        </div>
                        <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                            <Filter size={18} />
                        </button>
                        <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="py-3 px-5 rounded-l-lg w-16 text-emerald-600">No.</th>
                                <th className="py-3 px-3 text-emerald-600">Product Name</th>
                                <th className="py-3 px-3 text-emerald-600 text-center">Price</th>
                                <th className="py-3 px-3 text-emerald-600">Stock</th>
                                <th className="py-3 px-3 text-emerald-600">Category</th>
                                <th className="py-3 px-3 text-emerald-600">Status</th>
                                <th className="py-3 px-5 rounded-r-lg text-center text-emerald-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 font-medium divide-y divide-gray-50/50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="7" className="py-4 px-5">
                                            <div className="h-4 bg-gray-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredProducts.map((p, idx) => (
                                <tr key={p.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 border border-gray-300 rounded-sm"></div>
                                            <span className="text-gray-500 font-bold">#{(page - 1) * 10 + idx + 1}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800 text-sm group-hover:text-emerald-600 transition-colors">{p.title}</span>
                                            <span className="text-[10px] text-gray-400 font-medium">SKU-{p.sku || p.id.toString().slice(-4).toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3 text-center">
                                        <span className="font-extrabold text-gray-900 text-sm">PKR {parseFloat(p.price).toLocaleString()}</span>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-gray-700">{p.stock} in stock</span>
                                            <div className="w-20 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${p.stock < 10 ? 'bg-amber-500' : p.stock === 0 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${Math.min(p.stock, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">{p.category_name || 'Uncategorized'}</span>
                                    </td>
                                    <td className="py-4 px-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border ${p.stock <= 0 ? 'text-red-600 border-red-100 bg-red-50' :
                                            p.stock < 10 ? 'text-amber-600 border-amber-100 bg-amber-50' :
                                                'text-emerald-600 border-emerald-100 bg-emerald-50'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${p.stock <= 0 ? 'bg-red-500' :
                                                p.stock < 10 ? 'bg-amber-500' :
                                                    'bg-emerald-500'
                                                }`}></span>
                                            {p.stock <= 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'Active'}
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
                            {filteredProducts.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Box size={40} className="text-gray-200" />
                                            <p className="text-gray-400 font-bold">No products found</p>
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
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
                        >
                            ← Previous
                        </button>
                        <div className="flex gap-1.5 items-center">
                            <span className="text-xs font-bold text-gray-500">Page {page} of {Math.ceil(pagination.count / 10)}</span>
                            <div className="w-px h-4 bg-gray-200 mx-2"></div>
                            <button className="w-8 h-8 flex items-center justify-center bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-md shadow-emerald-200 cursor-default">{page}</button>
                        </div>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={!pagination.next || loading}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
                        >
                            Next →
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AllProducts;
