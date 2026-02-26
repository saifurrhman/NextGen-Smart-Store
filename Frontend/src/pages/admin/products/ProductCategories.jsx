import React from 'react';
import {
    Search, Filter, Plus, MoreHorizontal,
    Headphones, Shirt, Wallet, Monitor, Phone,
    Dumbbell, Book, Coffee, Camera, ChevronRight, Edit2, Trash2
} from 'lucide-react';

const ProductCategories = () => {
    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
            </div>

            {/* TOP DISCOVER GRID */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 relative">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Discover</h2>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors">
                            <Plus size={14} /> Add Product
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                            More Action <MoreHorizontal size={14} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1 */}
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer">
                        <div className="w-14 h-14 rounded-lg bg-gray-50 flex flex-wrap items-center justify-center p-1 gap-0.5 overflow-hidden">
                            <Monitor size={16} className="text-gray-600" />
                            <Phone size={16} className="text-gray-600" />
                            <Headphones size={16} className="text-gray-600" />
                            <Camera size={16} className="text-gray-600" />
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">Electronics</span>
                    </div>

                    {/* Card 2 */}
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer">
                        <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center relative overflow-hidden">
                            <Shirt size={24} className="text-gray-600 absolute left-2 top-2" />
                            <Wallet size={16} className="text-amber-800 absolute right-1 bottom-1" />
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">Fashion</span>
                    </div>

                    {/* Card 3 */}
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer">
                        <div className="w-14 h-14 rounded-lg bg-gray-50 flex flex-wrap items-center justify-center p-1 gap-0.5 overflow-hidden">
                            <Monitor size={18} className="text-gray-800" />
                            <Headphones size={14} className="text-emerald-500" />
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">Accessories</span>
                    </div>

                    {/* Card 4 */}
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer">
                        <div className="w-14 h-14 rounded-lg bg-gray-50 flex flex-wrap items-center justify-center p-1 gap-0.5 overflow-hidden">
                            <Coffee size={24} className="text-gray-600" />
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">Home & Kitchen</span>
                    </div>

                    {/* Card 5 */}
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer">
                        <div className="w-14 h-14 rounded-lg bg-gray-50 flex flex-wrap items-center justify-center p-1.5 gap-1 overflow-hidden">
                            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                            <div className="w-4 h-4 rounded-full bg-white border border-gray-300"></div>
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">Sports & Outdoors</span>
                    </div>

                    {/* Card 6 */}
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer">
                        <div className="w-14 h-14 rounded-lg bg-[#eaf4f0] flex relative items-center justify-center overflow-hidden">
                            <div className="w-6 h-6 bg-red-400 rounded-sm absolute left-1 top-2 transform rotate-12"></div>
                            <div className="w-6 h-6 bg-blue-400 rounded-sm absolute right-1 bottom-1 transform -rotate-6"></div>
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">Toys & Games</span>
                    </div>

                    {/* Card 7 */}
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer">
                        <div className="w-14 h-14 rounded-lg bg-gray-50 flex flex-wrap items-center justify-center p-1 gap-0.5 overflow-hidden">
                            <Dumbbell size={20} className="text-gray-700" />
                            <div className="w-3 h-8 bg-green-500 rounded-sm"></div>
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">Health & Fitness</span>
                    </div>

                    {/* Card 8 */}
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer">
                        <div className="w-14 h-14 rounded-lg bg-gray-50 flex flex-wrap items-center justify-center p-1 gap-0.5 overflow-hidden">
                            <Book size={24} className="text-blue-800" />
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">Books</span>
                    </div>
                </div>

                {/* Right Arrow Navigation Overlay */}
                <button className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-emerald-500 hover:border-emerald-500 transition-colors z-10">
                    <ChevronRight size={20} />
                </button>
            </div>


            {/* BOTTOM TABLE SECTION */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">

                {/* Table Header/Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    {/* Tabs */}
                    <div className="flex items-center bg-gray-50/50 rounded-lg p-1 border border-gray-100">
                        <button className="px-4 py-2 text-xs font-bold text-gray-800 bg-white rounded-md shadow-sm border border-gray-200">
                            All Product <span className="text-emerald-500 font-bold ml-1">(145)</span>
                        </button>
                        <button className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors">Featured Products</button>
                        <button className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors">On Sale</button>
                        <button className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors">Out of Stock</button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search your product"
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all font-medium"
                            />
                        </div>
                        <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                            <Filter size={18} />
                        </button>
                        <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                            <Plus size={18} />
                        </button>
                        <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="py-3 px-5 rounded-l-lg w-16">No.</th>
                                <th className="py-3 px-3">Product</th>
                                <th className="py-3 px-3 text-center">Created Date</th>
                                <th className="py-3 px-3 text-center">Order</th>
                                <th className="py-3 px-5 text-right rounded-r-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 font-medium divide-y divide-gray-50/50">
                            {[
                                { num: '1', icon: Headphones, iconColor: 'text-blue-500', name: 'Wireless Bluetooth Headphones', date: '01-01-2025', orders: 25 },
                                { num: '1', icon: Shirt, iconColor: 'text-gray-800', name: "Men's T-Shirt", date: '01-01-2025', orders: 20 },
                                { num: '1', icon: Wallet, iconColor: 'text-amber-800', name: "Men's Leather Wallet", date: '01-01-2025', orders: 35 },
                                { num: '1', icon: 'pillow', iconColor: 'text-gray-300', name: 'Memory Foam Pillow', date: '01-01-2025', orders: 40 },
                                { num: '1', icon: Coffee, iconColor: 'text-gray-900', name: 'Coffee Maker', date: '01-01-2025', orders: 45 },
                                { num: '1', icon: 'cap', iconColor: 'text-green-200', name: 'Casual Baseball Cap', date: '01-01-2025', orders: 55 },
                                { num: '1', icon: Camera, iconColor: 'text-gray-900', name: 'Full HD Webcam', date: '01-01-2025', orders: 20 },
                                { num: '1', icon: 'bulb', iconColor: 'text-blue-200', name: 'Smart LED Color Bulb', date: '01-01-2025', orders: 16 },
                                { num: '1', icon: Shirt, iconColor: 'text-gray-800', name: "Men's T-Shirt", date: '01-01-2025', orders: 10 },
                                { num: '1', icon: Wallet, iconColor: 'text-amber-800', name: "Men's Leather Wallet", date: '01-01-2025', orders: 35 },
                            ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 border border-gray-300 rounded-sm"></div>
                                            <span className="text-gray-500">{row.num}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                            {typeof row.icon === 'string' ? (
                                                <div className={`w-5 h-4 bg-current rounded-sm ${row.iconColor}`}></div>
                                            ) : (
                                                <row.icon size={18} className={row.iconColor} />
                                            )}
                                        </div>
                                        <span className="font-semibold max-w-[200px] leading-tight">{row.name}</span>
                                    </td>
                                    <td className="py-4 px-3 text-center">{row.date}</td>
                                    <td className="py-4 px-3 text-center">{row.orders}</td>
                                    <td className="py-4 px-5">
                                        <div className="flex items-center justify-end gap-2 text-gray-400">
                                            <button className="hover:text-gray-600 transition-colors bg-gray-50 p-1.5 rounded-md border border-gray-100"><Edit2 size={14} /></button>
                                            <button className="hover:text-red-500 transition-colors bg-gray-50 p-1.5 rounded-md border border-gray-100"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
                        ← Previous
                    </button>
                    <div className="flex gap-1.5">
                        <button className="w-8 h-8 flex items-center justify-center bg-[#d2f4e1] text-emerald-700 font-semibold rounded text-xs border border-emerald-200">1</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded text-xs hover:bg-gray-50">2</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded text-xs hover:bg-gray-50">3</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded text-xs hover:bg-gray-50">4</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded text-xs hover:bg-gray-50">5</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded text-xs hover:bg-gray-50">....</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded text-xs hover:bg-gray-50">24</button>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
                        Next →
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ProductCategories;
