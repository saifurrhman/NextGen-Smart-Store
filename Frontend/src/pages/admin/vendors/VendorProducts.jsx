import React, { useState, useEffect } from 'react';
import { Package, Search, ChevronLeft, ChevronRight, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '../../../utils/api';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';

const statusColor = {
    active: 'bg-green-50 text-green-700 border-green-100',
    inactive: 'bg-gray-50 text-gray-500 border-gray-100',
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
};

const VendorProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ status: '', vendor: '' });
    const [vendors, setVendors] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [msg, setMsg] = useState({ text: '', type: '' });

    useEffect(() => { fetchVendors(); }, []);
    useEffect(() => { fetchProducts(); }, [page, searchTerm, filters]);

    const fetchVendors = async () => {
        try {
            const res = await api.get('vendors/?page_size=100');
            setVendors(res.data.results || res.data);
        } catch (err) {
            console.error('Failed to fetch vendors', err);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = `products/?page=${page}&search=${searchTerm}`;
            if (filters.status) url += `&status=${filters.status}`;
            if (filters.vendor) url += `&vendor=${filters.vendor}`;
            const res = await api.get(url);
            setProducts(res.data.results || res.data);
            setPagination({ count: res.data.count || 0, next: res.data.next, previous: res.data.previous });
        } catch (err) {
            console.error('Failed to fetch products', err);
        } finally {
            setLoading(false);
        }
    };

    const showMsg = (text, type) => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    };

    const handleStatusToggle = async (product) => {
        const newStatus = product.status === 'active' ? 'inactive' : 'active';
        try {
            await api.patch(`products/${product.id || product.slug}/`, { status: newStatus });
            showMsg(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'}.`, 'success');
            fetchProducts();
        } catch {
            showMsg('Failed to update product status.', 'error');
        }
    };

    const filterOptions = [
        {
            key: 'status',
            label: 'Status',
            options: [
                { label: 'All Status', value: '' },
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Pending', value: 'pending' },
            ]
        },
        {
            key: 'vendor',
            label: 'Vendor',
            options: [
                { label: 'All Vendors', value: '' },
                ...vendors.map(v => ({ label: v.store_name || v.user?.email || 'Unknown', value: String(v.id) }))
            ]
        }
    ];

    const totalPages = Math.ceil(pagination.count / 10);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <Package size={22} className="text-brand" />
                        Vendor Products
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">View and manage products across all vendors</p>
                </div>
            </div>

            {/* Message */}
            {msg.text && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {msg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {msg.text}
                </div>
            )}

            {/* Main Content */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all shadow-sm"
                        />
                    </div>
                    <FilterDropdown
                        options={filterOptions}
                        activeFilters={filters}
                        onFilterChange={(key, value) => { setFilters(p => ({ ...p, [key]: value })); setPage(1); }}
                        onClear={() => { setFilters({ status: '', vendor: '' }); setPage(1); }}
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3">Vendor</th>
                                <th className="px-6 py-3 text-center">Price</th>
                                <th className="px-6 py-3 text-center">Stock</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 rounded w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id || product.slug} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.images?.[0] ? (
                                                    <img src={product.images[0]} alt={product.name}
                                                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                                        <Package size={16} className="text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-gray-800 text-sm">{product.name}</p>
                                                    <p className="text-xs text-gray-400">{product.category?.name || product.slug || ''}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium text-sm">
                                            {product.vendor?.store_name || product.vendor?.user?.email || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-gray-800">
                                            PKR {Number(product.price || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`font-bold text-sm ${(product.stock || product.quantity || 0) < 10 ? 'text-red-500' : 'text-gray-700'}`}>
                                                {product.stock ?? product.quantity ?? '—'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${statusColor[product.status] || statusColor.inactive}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${product.status === 'active' ? 'bg-green-500' : product.status === 'pending' ? 'bg-amber-400' : 'bg-gray-400'}`} />
                                                {product.status || 'inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleStatusToggle(product)}
                                                    title={product.status === 'active' ? 'Deactivate' : 'Activate'}
                                                    className={`p-1.5 rounded transition-colors text-sm ${product.status === 'active' ? 'hover:bg-red-50 text-red-400 hover:text-red-600' : 'hover:bg-green-50 text-green-400 hover:text-green-600'}`}
                                                >
                                                    {product.status === 'active' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                                                </button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand transition-colors">
                                                    <Eye size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-gray-400 font-bold">
                                        No vendor products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.count > 10 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                        <span>Showing {products.length} of {pagination.count}</span>
                        <div className="flex gap-1">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={!pagination.previous}
                                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button key={i} onClick={() => setPage(i + 1)}
                                    className={`px-3 py-1 rounded font-bold ${page === i + 1 ? 'bg-brand text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>
                                    {i + 1}
                                </button>
                            ))}
                            <button onClick={() => setPage(p => p + 1)} disabled={!pagination.next}
                                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorProducts;
