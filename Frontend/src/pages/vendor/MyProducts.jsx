import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit3,
    Eye,
    Trash2,
    Package,
    AlertCircle,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';

const MyProducts = () => {
    const { formatCurrency } = useCurrency();
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = '/vendors/products/';
                if (searchQuery) url += `?search=${encodeURIComponent(searchQuery)}`;

                const response = await api.get(url);
                if (response.data && response.data.results) {
                    setProducts(response.data.results);
                }
            } catch (error) {
                console.error("Failed to fetch vendor products:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, products.length]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/vendors/products/${id}/`);
                setProducts(prev => prev.filter(p => p.id !== id));
            } catch (err) {
                console.error("Failed to delete product:", err);
                alert("Failed to delete product.");
            }
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">My Products</h1>
                    <p className="text-sm text-gray-500">Manage your product catalog and inventory.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-emerald-500 transition-colors shadow-sm"
                        />
                    </div>
                    <Link
                        to="/vendor/request-product"
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-emerald-600 text-emerald-600 text-sm font-medium rounded-lg hover:bg-emerald-50 transition-colors shadow-sm whitespace-nowrap"
                    >
                        Request Product
                    </Link>
                    <Link
                        to="/vendor/add-product"
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm whitespace-nowrap"
                    >
                        <Plus size={16} />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <p className="font-medium">No products found {searchQuery && `matching "${searchQuery}"`}.</p>
                            {!searchQuery && (
                                <Link
                                    to="/vendor/add-product"
                                    className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                                >
                                    <Plus size={16} />
                                    Add your first product
                                </Link>
                            )}
                        </div>
                    ) : (
                        products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                            >
                                {/* Image Layer */}
                                <div className="aspect-[4/3] relative bg-gray-50 border-b border-gray-100">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-contain p-4"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Package size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${product.status === 'In Stock'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : product.status === 'Low Stock'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-rose-100 text-rose-700'
                                            }`}>
                                            {product.status === 'In Stock' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                                            {product.status}
                                        </div>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <Link
                                            to={`/vendor/edit-product/${product.id}`}
                                            className="p-1.5 bg-white rounded shadow-sm text-gray-500 hover:text-emerald-600 border border-gray-100 block transition-colors"
                                            title="Edit Product"
                                        >
                                            <Edit3 size={14} />
                                        </Link>
                                    </div>
                                </div>

                                {/* Content Layer */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-gray-500">{product.category}</span>
                                        <span className="text-xs text-gray-400 font-mono">{product.sku}</span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-4 leading-tight">
                                        {product.name}
                                    </h3>

                                    <div className="mt-auto border-t border-gray-50 pt-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-0.5">Price</p>
                                            <p className="text-lg font-bold text-gray-900 leading-none">{formatCurrency(product.price)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 mb-0.5">Stock</p>
                                            <p className={`text-sm font-semibold leading-none ${product.stock === 0 ? 'text-rose-500' : 'text-gray-900'}`}>
                                                {product.stock}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions Footer */}
                                <div className="border-t border-gray-50 bg-gray-50/50 p-2 flex border-collapse">
                                    <Link
                                        to={`/products/${product.id}`}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                    >
                                        <Eye size={14} />
                                        View
                                    </Link>
                                    <div className="w-px bg-gray-200 my-1 mx-1" />
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MyProducts;
