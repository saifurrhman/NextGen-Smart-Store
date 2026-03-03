import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Store, Search, Filter, Download, Plus, MoreVertical,
    ArrowUp, Edit2, Trash2, Box, Package, AlertTriangle, TrendingUp, FileText
} from 'lucide-react';
import api from '../../../utils/api';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0, lowStock: 0, outOfStock: 0 });
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        is_active: '',
        category: ''
    });
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [showExportMenu, setShowExportMenu] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = `products/?page=${page}`;
            if (filter === 'active') url += '&is_active=true';
            if (filter === 'low') url += '&low_stock=true';
            if (filter === 'out') url += '&out_of_stock=true';

            if (filters.is_active !== '') url += `&is_active=${filters.is_active}`;
            if (filters.category !== '') url += `&category=${filters.category}`;
            if (searchTerm) url += `&search=${searchTerm}`;

            const response = await api.get(url);
            const data = response.data.results || response.data;
            const totalCount = response.data.count || data.length;

            setProducts(data);
            setPagination({
                count: totalCount,
                next: response.data.next,
                previous: response.data.previous
            });

            if (page === 1) {
                const statsRes = await api.get('products/?page_size=1000');
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

    useEffect(() => {
        fetchProducts();
    }, [page, filter, filters, searchTerm]);

    const handleDeleteProduct = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            try {
                await api.delete(`/api/v1/products/${id}/`);
                fetchProducts();
            } catch (error) {
                console.error("Failed to delete product:", error);
                alert("Failed to delete product. Please try again.");
            }
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({ is_active: '', category: '' });
        setPage(1);
    };

    const handleExportExcel = () => {
        const dataToExport = products.map(p => ({
            "Product ID": p.id,
            "SKU": p.sku || 'N/A',
            "Title": p.title,
            "Price": p.price,
            "Stock": p.stock,
            "Category": p.category_name || 'Uncategorized',
            "Status": p.stock <= 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'Active'
        }));
        exportToExcel(dataToExport, "All_Products_Export");
        setShowExportMenu(false);
    };

    const handleExportCSV = () => {
        const dataToExport = products.map(p => ({
            "Product ID": p.id,
            "SKU": p.sku || 'N/A',
            "Title": p.title,
            "Price": p.price,
            "Stock": p.stock,
            "Category": p.category_name || 'Uncategorized',
            "Status": p.stock <= 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'Active'
        }));
        exportToCSV(dataToExport, "All_Products_Export");
        setShowExportMenu(false);
    };

    const handleExportPDF = () => {
        const columns = ["ID", "SKU", "Title", "Price", "Stock", "Status"];
        const dataToExport = products.map(p => [
            p.id.toString().slice(-6).toUpperCase(),
            p.sku || 'N/A',
            (p.title || '').length > 30 ? p.title.substring(0, 30) + "..." : (p.title || 'Untitled'),
            `PKR ${p.price}`,
            p.stock,
            p.stock <= 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'Active'
        ]);
        exportToPDF(dataToExport, columns, "All_Products_Export", "Store Inventory Performance Report");
        setShowExportMenu(false);
    };

    const filterOptions = [
        {
            key: 'is_active',
            label: 'Visibility Status',
            options: [
                { label: 'All Status', value: '' },
                { label: 'Published Only', value: 'true' },
                { label: 'Hidden Only', value: 'false' },
            ]
        },
        {
            key: 'category',
            label: 'Store Category',
            options: [
                { label: 'All Categories', value: '' },
                { label: 'Electronics', value: 'electronics' },
                { label: 'Fashion', value: 'fashion' },
                { label: 'Home & Living', value: 'home' },
            ]
        }
    ];

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
                    <Link to="/admin/products/add" className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-100">
                        <Plus size={18} /> Add Product
                    </Link>
                </div>
            </div>

            {/* TOP STAT CARDS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Products Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                    <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 z-10">
                        <Box size={18} />
                    </button>
                    <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Total Products</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-black text-gray-800">{stats.total}</h2>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Total items in store</p>
                </div>

                {/* Active Products Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                    <button className="absolute top-6 right-6 text-emerald-500 z-10">
                        <TrendingUp size={18} />
                    </button>
                    <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Active & Selling</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-black text-gray-800">{stats.active}</h2>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Currently published</p>
                </div>

                {/* Low Stock Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                    <button className="absolute top-6 right-6 text-amber-500 z-10">
                        <Package size={18} />
                    </button>
                    <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Low Stock</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-black text-gray-800">{stats.lowStock}</h2>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Needs restock</p>
                </div>

                {/* Out of Stock Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                    <button className="absolute top-6 right-6 text-red-400 z-10">
                        <AlertTriangle size={18} />
                    </button>
                    <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Out of Stock</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-black text-gray-800">{stats.outOfStock}</h2>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Not visible to users</p>
                </div>
            </div>

            {/* TABLE CONTAINER */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Table Header/Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-center p-4 gap-4 bg-gray-50/30 border-b border-gray-50">
                    {/* Tabs */}
                    <div className="flex items-center bg-white rounded-xl p-1 border border-gray-100 w-full lg:w-auto overflow-x-auto shadow-sm">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-5 py-2 text-xs font-black rounded-lg transition-all whitespace-nowrap ${filter === 'all' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            All products <span className={`ml-1.5 ${filter === 'all' ? 'text-white' : 'text-emerald-500'}`}>({stats.total})</span>
                        </button>
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-5 py-2 text-xs font-black rounded-lg transition-all whitespace-nowrap ${filter === 'active' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Active <span className={`ml-1.5 ${filter === 'active' ? 'text-white' : 'text-blue-500'}`}>({stats.active})</span>
                        </button>
                        <button
                            onClick={() => setFilter('low')}
                            className={`px-5 py-2 text-xs font-black rounded-lg transition-all whitespace-nowrap ${filter === 'low' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Low Stock <span className={`ml-1.5 ${filter === 'low' ? 'text-white' : 'text-amber-500'}`}>({stats.lowStock})</span>
                        </button>
                        <button
                            onClick={() => setFilter('out')}
                            className={`px-5 py-2 text-xs font-black rounded-lg transition-all whitespace-nowrap ${filter === 'out' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Out of Stock <span className={`ml-1.5 ${filter === 'out' ? 'text-white' : 'text-red-500'}`}>({stats.outOfStock})</span>
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition-all font-medium text-gray-700 shadow-sm"
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
                                <th className="py-4 px-6 w-16">No.</th>
                                <th className="py-4 px-3">Product Name</th>
                                <th className="py-4 px-3 text-center">Price</th>
                                <th className="py-4 px-3 text-center">Stock</th>
                                <th className="py-4 px-3">Category</th>
                                <th className="py-4 px-3 text-center">Status</th>
                                <th className="py-4 px-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 font-medium divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="7" className="py-4 px-6">
                                            <div className="h-4 bg-gray-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredProducts.map((p, idx) => (
                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <span className="text-gray-400 font-bold">#{(page - 1) * 10 + idx + 1}</span>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800 text-sm group-hover:text-emerald-600 transition-colors">{p.title}</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">SKU-{p.sku || p.id.toString().slice(-4).toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3 text-center">
                                        <span className="font-black text-gray-900 text-sm">PKR {parseFloat(p.price).toLocaleString()}</span>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="font-bold text-gray-700 text-xs">{p.stock} Units</span>
                                            <div className="w-20 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${p.stock < 10 ? 'bg-amber-500' : p.stock === 0 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${Math.min(p.stock, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-[10px] font-black uppercase">{p.category_name || 'Uncategorized'}</span>
                                    </td>
                                    <td className="py-4 px-3 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase rounded-full border ${p.stock <= 0 ? 'text-red-600 border-red-100 bg-red-50' :
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
                                    <td className="py-4 px-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <Link to={`/admin/products/edit/${p.id}`} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"><Edit2 size={16} /></Link>
                                            <button
                                                onClick={() => handleDeleteProduct(p.id, p.title)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.count > 0 && (
                    <div className="p-5 flex items-center justify-between border-t border-gray-50 text-sm bg-gray-50/30">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={!pagination.previous || loading}
                            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm bg-white"
                        >
                            ← Previous
                        </button>
                        <div className="flex gap-1.5 items-center">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Page {page} of {Math.ceil(pagination.count / 10)}</span>
                            <div className="w-px h-4 bg-gray-200 mx-2"></div>
                            <button className="w-9 h-9 flex items-center justify-center bg-emerald-500 text-white font-black rounded-lg text-xs shadow-md shadow-emerald-100 cursor-default">{page}</button>
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
        </div>
    );
};

export default AllProducts;
