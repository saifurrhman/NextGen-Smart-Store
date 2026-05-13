import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search, Download, Plus,
    Edit2, Trash2, Box, Package, AlertTriangle, TrendingUp, FileText, Eye
} from 'lucide-react';
import api from '../../../utils/api';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';

const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/media/')) return `http://localhost:8000${url}`;
    return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
};

const getProductStatus = (stock) => {
    if (stock <= 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'Active';
};

const buildExportRow = (p) => ({
    'Product ID': p.id,
    'SKU': p.sku || 'N/A',
    'Title': p.title,
    'Price': p.price,
    'Stock': p.stock,
    'Category': p.category_name || 'Uncategorized',
    'Status': getProductStatus(p.stock),
});

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0, lowStock: 0, outOfStock: 0 });
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ is_active: '', category: '' });
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
                previous: response.data.previous,
            });

            if (page === 1) {
                const statsRes = await api.get('products/?page_size=1000');
                const allData = statsRes.data.results || statsRes.data;
                setStats({
                    total: totalCount,
                    active: allData.filter(p => p.is_active).length,
                    lowStock: allData.filter(p => p.stock > 0 && p.stock < 10).length,
                    outOfStock: allData.filter(p => p.stock <= 0).length,
                });
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, filter, filters, searchTerm]);

    const handleDeleteProduct = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
        try {
            await api.delete(`/products/${id}/`);
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('Failed to delete product. Please try again.');
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
        exportToExcel(products.map(buildExportRow), 'All_Products_Export');
        setShowExportMenu(false);
    };

    const handleExportCSV = () => {
        exportToCSV(products.map(buildExportRow), 'All_Products_Export');
        setShowExportMenu(false);
    };

    const handleExportPDF = () => {
        const columns = ['ID', 'SKU', 'Title', 'Price', 'Stock', 'Status'];
        const rows = products.map(p => [
            p.id.toString().slice(-6).toUpperCase(),
            p.sku || 'N/A',
            (p.title || '').length > 30 ? p.title.substring(0, 30) + '...' : (p.title || 'Untitled'),
            `PKR ${p.price}`,
            p.stock,
            getProductStatus(p.stock),
        ]);
        exportToPDF(rows, columns, 'All_Products_Export', 'Store Inventory Performance Report');
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
            ],
        },
        {
            key: 'category',
            label: 'Store Category',
            options: [
                { label: 'All Categories', value: '' },
                { label: 'Electronics', value: 'electronics' },
                { label: 'Fashion', value: 'fashion' },
                { label: 'Home & Living', value: 'home' },
            ],
        },
    ];

    const statCards = [
        { label: 'Total Products', value: stats.total, icon: <Box size={18} />, color: 'emerald' },
        { label: 'Active & Selling', value: stats.active, icon: <TrendingUp size={18} />, color: 'blue', subLabel: 'Currently published' },
        { label: 'Low Stock', value: stats.lowStock, icon: <Package size={18} />, color: 'amber', subLabel: 'Needs restock' },
        { label: 'Out of Stock', value: stats.outOfStock, icon: <AlertTriangle size={18} />, color: 'red', subLabel: 'Not visible to users' },
    ];

    const colorMap = {
        emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500' },
        blue: { bg: 'bg-blue-50', icon: 'text-blue-500' },
        amber: { bg: 'bg-amber-50', icon: 'text-amber-500' },
        red: { bg: 'bg-red-50', icon: 'text-red-400' },
    };

    const stockBadge = (stock) => {
        if (stock <= 0) return { cls: 'text-red-600 border-red-100 bg-red-50', dot: 'bg-red-500', label: 'Out of Stock' };
        if (stock < 10) return { cls: 'text-amber-600 border-amber-100 bg-amber-50', dot: 'bg-amber-500', label: 'Low Stock' };
        return { cls: 'text-emerald-600 border-emerald-100 bg-emerald-50', dot: 'bg-emerald-500', label: 'Active' };
    };

    const stockBar = (stock) => {
        if (stock <= 0) return 'bg-red-500';
        if (stock < 10) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">

            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Product List</h2>
                <div className="flex items-center gap-3">

                    {/* Export Dropdown */}
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
                                {[
                                    { label: 'Export Excel', handler: handleExportExcel, color: 'emerald', icon: <Download size={14} /> },
                                    { label: 'Export CSV', handler: handleExportCSV, color: 'blue', icon: <Download size={14} /> },
                                    { label: 'Export PDF', handler: handleExportPDF, color: 'red', icon: <FileText size={14} /> },
                                ].map(({ label, handler, color, icon }) => (
                                    <button
                                        key={label}
                                        onClick={handler}
                                        className={`w-full text-left px-4 py-2.5 hover:bg-${color}-50 text-gray-700 text-xs font-bold flex items-center gap-3 transition-colors`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg bg-${color}-50 flex items-center justify-center text-${color}-600`}>
                                            {icon}
                                        </div>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        to="/admin/products/add"
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-100"
                    >
                        <Plus size={18} /> Add Product
                    </Link>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map(({ label, value, icon, color, subLabel }) => {
                    const c = colorMap[color];
                    return (
                        <div key={label} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 w-20 h-20 ${c.bg} rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500`} />
                            <div className={`absolute top-6 right-6 ${c.icon} z-10`}>{icon}</div>
                            <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">{label}</h3>
                            <h2 className="text-3xl font-black text-gray-800 mb-1">{value}</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{subLabel || 'Total items in store'}</p>
                        </div>
                    );
                })}
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-center p-4 gap-4 bg-gray-50/30 border-b border-gray-50">

                    {/* Filter Tabs */}
                    <div className="flex items-center bg-white rounded-xl p-1 border border-gray-100 w-full lg:w-auto overflow-x-auto shadow-sm">
                        {[
                            { key: 'all', label: 'All Products', count: stats.total, countColor: 'text-emerald-500' },
                            { key: 'active', label: 'Active', count: stats.active, countColor: 'text-blue-500' },
                            { key: 'low', label: 'Low Stock', count: stats.lowStock, countColor: 'text-amber-500' },
                            { key: 'out', label: 'Out of Stock', count: stats.outOfStock, countColor: 'text-red-500' },
                        ].map(({ key, label, count, countColor }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`px-5 py-2 text-xs font-black rounded-lg transition-all whitespace-nowrap ${filter === key ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                {label}{' '}
                                <span className={`ml-1.5 ${filter === key ? 'text-white' : countColor}`}>({count})</span>
                            </button>
                        ))}
                    </div>

                    {/* Search + Filter */}
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
                                <th className="py-4 px-3 w-16">Image</th>
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
                                        <td colSpan="8" className="py-4 px-6">
                                            <div className="h-4 bg-gray-100 rounded w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : products.map((p, idx) => {
                                const badge = stockBadge(p.stock);
                                return (
                                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <span className="text-gray-400 font-bold">#{(page - 1) * 10 + idx + 1}</span>
                                        </td>
                                        <td className="py-4 px-3">
                                            <Link
                                                to={`/admin/products/preview/${p.id}`}
                                                title="Preview Product"
                                                className="block w-12 h-12 rounded-xl bg-white border border-gray-100 overflow-hidden flex items-center justify-center p-1 hover:border-emerald-300 transition-colors group/img"
                                            >
                                                {p.main_image
                                                    ? <img src={getMediaUrl(p.main_image)} alt={p.title} className="w-full h-full object-contain group-hover/img:scale-110 transition-transform" />
                                                    : <Package className="text-gray-200" size={24} />
                                                }
                                            </Link>
                                        </td>
                                        <td className="py-4 px-3">
                                            <div className="flex flex-col">
                                                <Link
                                                    to={`/admin/products/preview/${p.id}`}
                                                    className="font-bold text-gray-800 text-sm hover:text-emerald-600 transition-colors w-fit max-w-xs"
                                                >
                                                    {p.title}
                                                </Link>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                                                    SKU-{p.sku || p.id.toString().slice(-4).toUpperCase()}
                                                </span>
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
                                                        className={`h-full rounded-full ${stockBar(p.stock)}`}
                                                        style={{ width: `${Math.min(p.stock, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-3">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-[10px] font-black uppercase">
                                                {p.category_name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-3 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase rounded-full border ${badge.cls}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                                {badge.label}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <Link to={`/admin/products/preview/${p.id}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Preview">
                                                    <Eye size={16} />
                                                </Link>
                                                <Link to={`/admin/products/edit/${p.id}`} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
                                                    <Edit2 size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteProduct(p.id, p.title)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.count > 0 && (
                    <div className="p-5 flex items-center justify-between border-t border-gray-50 text-sm bg-gray-50/30">
                        <button
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={!pagination.previous || loading}
                            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm bg-white"
                        >
                            ← Previous
                        </button>
                        <div className="flex gap-1.5 items-center">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Page {page} of {Math.ceil(pagination.count / 10)}
                            </span>
                            <div className="w-px h-4 bg-gray-200 mx-2" />
                            <button className="w-9 h-9 flex items-center justify-center bg-emerald-500 text-white font-black rounded-lg text-xs shadow-md shadow-emerald-100 cursor-default">
                                {page}
                            </button>
                        </div>
                        <button
                            onClick={() => setPage(prev => prev + 1)}
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
