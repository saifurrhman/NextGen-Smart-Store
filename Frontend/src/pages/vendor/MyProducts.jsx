import React, { useState } from 'react';
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
    ArrowUpDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MyProducts = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const products = [
        { id: 1, name: 'Ultra-Slim Pro Laptop 14"', category: 'Electronics', price: '$1,299', stock: 12, status: 'In Stock', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=200&h=200', sku: 'LP-PRO-14' },
        { id: 2, name: 'Noise-Cancelling Wireless Headphones', category: 'Audio', price: '$299', stock: 5, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200&h=200', sku: 'HP-WRL-NC' },
        { id: 3, name: '4K Professional Monitor 27"', category: 'Peripherals', price: '$499', stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=200&h=200', sku: 'MON-4K-27' },
        { id: 4, name: 'Mechanical RGB Keyboard', category: 'Accessories', price: '$159', stock: 24, status: 'In Stock', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=200&h=200', sku: 'KB-MECH-RGB' },
    ];

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {products.map((product, i) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={product.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500 flex flex-col"
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
                                <button className="p-2 bg-white/90 backdrop-blur-md rounded-lg text-gray-500 hover:text-emerald-600 shadow-sm transition-all border border-white">
                                    <Edit3 size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Content Layer */}
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">{product.category}</span>
                                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest font-mono">{product.sku}</span>
                            </div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight leading-tight mb-4 group-hover:text-emerald-600 transition-colors line-clamp-2 min-h-[40px]">
                                {product.name}
                            </h3>

                            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Price Point</p>
                                    <p className="text-xl font-black text-gray-900 tracking-tighter">{product.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Inventory</p>
                                    <p className={`text-xs font-bold leading-none ${product.stock === 0 ? 'text-rose-500' : 'text-gray-800'}`}>
                                        {product.stock} Units
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Footer */}
                        <div className="border-t border-gray-50 bg-gray-50/30 p-3 grid grid-cols-2 gap-2">
                            <button className="flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                                <Eye size={12} />
                                Observe
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-rose-400 uppercase tracking-widest hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                <Trash2 size={12} />
                                De-list
                            </button>
                        </div>
                    </motion.div>
                ))}

                {/* New Product Shortcut */}
                <Link
                    to="/vendor/add-product"
                    className="group border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300 text-center"
                >
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm border border-gray-100">
                        <Plus size={32} />
                    </div>
                    <p className="text-sm font-bold text-gray-800 uppercase tracking-tight mb-1">New Entry</p>
                    <p className="text-[10px] text-gray-400 font-medium px-4">Initialize a new product across the global retail network.</p>
                </Link>
            </div>
        </div>
    );
};

export default MyProducts;
