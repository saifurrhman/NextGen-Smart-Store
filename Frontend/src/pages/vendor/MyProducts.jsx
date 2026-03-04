import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Edit3,
    Eye,
    Trash2,
    Package,
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    ArrowUpDown,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
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
                // If search query exists, append it
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

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, products.length]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to de-list this product? This action is irreversible across the network.")) {
            try {
                await api.delete(`/vendors/products/${id}/`);
                setProducts(prev => prev.filter(p => p.id !== id));
            } catch (err) {
                console.error("Failed to delete product:", err);
                alert("Critical: Failed to de-list product. Network error.");
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight uppercase">Inventory Control</h1>
                    <p className="text-sm text-gray-500 font-medium">Managing your ecosystem of listed products and stock levels.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Filter by name or SKU..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all w-64"
                        />
                    </div>
                    <Link
                        to="/vendor/add-product"
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                    >
                        <Plus size={16} strokeWidth={3} />
                        Register Product
                    </Link>
                </div>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                    {products.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-gray-500 font-medium">
                            <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <p>No products found {searchQuery && `matching "${searchQuery}"`}.</p>
                            {!searchQuery && (
                                <Link to="/vendor/add-product" className="text-emerald-600 hover:underline text-xs mt-2 block font-bold uppercase tracking-widest">
                                    Initialize First Asset
                                </Link>
                            )}
                        </div>
                    ) : (
                        products.map((product, i) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                key={product.id}
                                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col relative"
                            >
                                {/* Image Layer */}
                                <div className="aspect-square relative overflow-hidden bg-gray-50">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 h-fit">
                                        <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm ${product.status === 'In Stock'
                                            ? 'bg-emerald-500 text-white'
                                            : product.status === 'Low Stock'
                                                ? 'bg-amber-500 text-white'
                                                : 'bg-rose-500 text-white'
                                            }`}>
                                            {product.status === 'In Stock' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                                            {product.status}
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 h-fit">
                                        <Link
                                            to={`/vendor/edit-product/${product.id}`}
                                            className="p-2 bg-white/90 backdrop-blur-md rounded-lg text-gray-500 hover:text-emerald-600 shadow-sm transition-all border border-white block"
                                        >
                                            <Edit3 size={14} />
                                        </Link>
                                    </div>
                                </div>

                                {/* Content Layer */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">{product.category}</span>
                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest font-mono">{product.sku}</span>
                                    </div>
                                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight leading-tight mb-6 group-hover:text-emerald-600 transition-colors line-clamp-2 min-h-[40px]">
                                        {product.name}
                                    </h3>

                                    <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">Price Point</p>
                                            <p className="text-xl font-black text-gray-900 tracking-tighter">{formatCurrency(product.price)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">Inventory</p>
                                            <p className={`text-xs font-black tracking-tight leading-none ${product.stock === 0 ? 'text-rose-500' : 'text-gray-900'}`}>
                                                {product.stock} Units
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions Footer */}
                                <div className="border-t border-gray-50 bg-gray-50/30 p-3 grid grid-cols-2 gap-2">
                                    <Link
                                        to={`/products/${product.id}`}
                                        className="flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                    >
                                        <Eye size={12} />
                                        Observe
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-rose-400 uppercase tracking-widest hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                    >
                                        <Trash2 size={12} />
                                        De-list
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}

                    {/* New Product Shortcut */}
                    <Link
                        to="/vendor/add-product"
                        className="group border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center p-8 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all duration-300 text-center"
                    >
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm border border-gray-100">
                            <Plus size={32} strokeWidth={2.5} />
                        </div>
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight mb-1.5">New Entry</p>
                        <p className="text-[10px] text-gray-400 font-medium px-4 leading-relaxed">Initialize a new product across the global retail network.</p>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyProducts;
