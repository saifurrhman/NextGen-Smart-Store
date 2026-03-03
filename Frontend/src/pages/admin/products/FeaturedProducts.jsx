import React, { useState } from 'react';
import {
    Star, LayoutGrid, List, Search, Plus,
    MoreVertical, Edit2, Trash2, ArrowUpDown,
    Home, ChevronRight, Package, Loader2
} from 'lucide-react';

const FeaturedProducts = () => {
    const [featured, setFeatured] = useState([
        { id: 1, name: 'Premium Wireless Headphones', price: '15,000', category: 'Electronics', stock: 45, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=50&h=50&fit=crop' },
        { id: 2, name: 'Smart Fitness Tracker', price: '8,500', category: 'Gadgets', stock: 120, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50&h=50&fit=crop' },
        { id: 3, name: 'Leather Messenger Bag', price: '12,900', category: 'Fashion', stock: 15, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=50&h=50&fit=crop' },
    ]);

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Star size={24} className="text-amber-500 fill-amber-500" />
                        Featured Products
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mt-1">
                        <Home size={14} />
                        <ChevronRight size={12} />
                        <span>Product Management</span>
                        <ChevronRight size={12} />
                        <span className="text-emerald-500 font-bold">Featured</span>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg text-sm hover:bg-emerald-600 transition-all shadow-md shadow-emerald-200">
                    <Plus size={18} /> Add Featured Product
                </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search featured items..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
                            />
                        </div>
                        <div className="flex items-center bg-gray-50 p-1 rounded-lg border border-gray-100">
                            <button className="p-1.5 bg-white text-emerald-600 rounded shadow-sm"><LayoutGrid size={16} /></button>
                            <button className="p-1.5 text-gray-400 hover:text-gray-600"><List size={16} /></button>
                        </div>
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        Total Featured: <span className="text-emerald-500">{featured.length} / 12 Max</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Product Details</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price (PKR)</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {featured.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">ID: #PRO-{item.id}0021</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-gray-500">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-extrabold text-gray-900">{item.price}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                            <span className="text-xs font-bold text-gray-600">{item.stock} in stock</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-emerald-500 transition-all shadow-sm"><Edit2 size={14} /></button>
                                            <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-all shadow-sm"><Trash2 size={14} /></button>
                                            <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-gray-800 transition-all shadow-sm"><MoreVertical size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-gray-50/30 border-t border-gray-50 flex items-center justify-center">
                    <button className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest flex items-center gap-2 transition-all">
                        <Loader2 size={14} className="animate-spin" /> Load More Products
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeaturedProducts;
