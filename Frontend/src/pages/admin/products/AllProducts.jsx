import React from 'react';
import {
    Store, Search, Filter, Download, Plus, MoreVertical,
    ArrowUp, Edit2, Trash2, Box, Package, AlertTriangle, TrendingUp
} from 'lucide-react';

const AllProducts = () => {
    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 hidden">
                <h1 className="text-2xl font-bold text-gray-800">Products Inventory</h1>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Product List</h2>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-colors shadow-sm">
                        <Plus size={16} /> Add Product
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* TOP STAT CARDS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Products Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative">
                    <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                        <Box size={18} />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Total Products</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-gray-800">1,240</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                            <ArrowUp size={12} strokeWidth={3} /> <span>14.4%</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">Total items in store</p>
                </div>

                {/* Active Products Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative">
                    <button className="absolute top-6 right-6 text-emerald-500">
                        <TrendingUp size={18} />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Active & Selling</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-gray-800">960</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                            <span>85%</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">Currently published</p>
                </div>

                {/* Low Stock Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative">
                    <button className="absolute top-6 right-6 text-amber-500">
                        <Package size={18} />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Low Stock</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-gray-800">87</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 mb-1.5">
                            <span>&lt; 10 items left</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">Needs restock</p>
                </div>

                {/* Out of Stock Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative">
                    <button className="absolute top-6 right-6 text-red-400">
                        <AlertTriangle size={18} />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Out of Stock</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-gray-800">42</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-red-500 mb-1.5">
                            <span>Empty</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">Not visible to users</p>
                </div>
            </div>

            {/* TABLE CONTAINER */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">

                {/* Table Header/Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    {/* Tabs */}
                    <div className="flex items-center bg-gray-50/50 rounded-lg p-1 border border-gray-100 overflow-x-auto max-w-full">
                        <button className="px-4 py-2 text-xs font-bold text-gray-800 bg-white rounded-md shadow-sm border border-gray-200 whitespace-nowrap">
                            All products <span className="text-emerald-500 font-bold ml-1">(1,240)</span>
                        </button>
                        <button className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors whitespace-nowrap">Active</button>
                        <button className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors whitespace-nowrap">Low Stock</button>
                        <button className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors whitespace-nowrap">Out of Stock</button>
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
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="py-3 px-5 rounded-l-lg w-16">No.</th>
                                <th className="py-3 px-3">Product Name</th>
                                <th className="py-3 px-3">SKU</th>
                                <th className="py-3 px-3">Category</th>
                                <th className="py-3 px-3 text-center">Price</th>
                                <th className="py-3 px-3">Stock</th>
                                <th className="py-3 px-3">Status</th>
                                <th className="py-3 px-5 rounded-r-lg text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 font-medium divide-y divide-gray-50/50">
                            {[
                                { num: '1', name: 'Wireless Bluetooth Headphones', sku: 'SKU-0912', cat: 'Electronics', price: 'PKR 3,500', stock: 120, status: 'Active', statusColor: 'emerald' },
                                { num: '2', name: 'Organic Face Wash', sku: 'SKU-0913', cat: 'Beauty', price: 'PKR 800', stock: 45, status: 'Active', statusColor: 'emerald' },
                                { num: '3', name: 'Gaming Mouse', sku: 'SKU-0914', cat: 'Electronics', price: 'PKR 4,200', stock: 0, status: 'Out of Stock', statusColor: 'red' },
                                { num: '4', name: 'Men Leather Wallet', sku: 'SKU-0915', cat: 'Fashion', price: 'PKR 1,500', stock: 8, status: 'Low Stock', statusColor: 'amber' },
                                { num: '5', name: 'Adjustable Dumbbells', sku: 'SKU-0916', cat: 'Sports', price: 'PKR 12,000', stock: 20, status: 'Active', statusColor: 'emerald' },
                            ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 border border-gray-300 rounded-sm"></div>
                                            <span className="text-gray-500">{row.num}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3 font-semibold">{row.name}</td>
                                    <td className="py-4 px-3 text-gray-500">{row.sku}</td>
                                    <td className="py-4 px-3">{row.cat}</td>
                                    <td className="py-4 px-3 text-center font-bold text-gray-700">{row.price}</td>
                                    <td className="py-4 px-3 text-gray-700">{row.stock} in stock</td>
                                    <td className="py-4 px-3">
                                        <span className={`inline-flex flex-row items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border text-${row.statusColor}-600 border-${row.statusColor}-200 bg-${row.statusColor}-50`}>
                                            <span className={`w-1.5 h-1.5 rounded-full bg-${row.statusColor}-500`}></span>
                                            {row.status}
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

export default AllProducts;
