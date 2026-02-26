import React from 'react';
import {
    Ticket, Search, Filter, Download, Plus,
    MoreVertical, ArrowUp, ArrowDown, Headphones,
    Shirt, Wallet, Dumbbell, Coffee, Camera, Truck, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';

const AllOrders = () => {
    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 hidden">
                <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Order List</h2>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-colors shadow-sm">
                        <Plus size={16} /> Add Order
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                        More Action <MoreVertical size={16} />
                    </button>
                </div>
            </div>

            {/* TOP STAT CARDS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Orders Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative">
                    <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                        <MoreVertical size={18} />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Total Orders</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-gray-800">1,240</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                            <ArrowUp size={12} strokeWidth={3} /> <span>14.4%</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">Last 7 days</p>
                </div>

                {/* New Orders Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative">
                    <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                        <MoreVertical size={18} />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">New Orders</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-gray-800">240</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                            <ArrowUp size={12} strokeWidth={3} /> <span>20%</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">Last 7 days</p>
                </div>

                {/* Completed Orders Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative">
                    <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                        <MoreVertical size={18} />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Completed Orders</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-gray-800">960</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                            <span>85%</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">Last 7 days</p>
                </div>

                {/* Canceled Orders Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative">
                    <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                        <MoreVertical size={18} />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Canceled Orders</h3>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-gray-800">87</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-red-500 mb-1.5">
                            <ArrowDown size={12} strokeWidth={3} /> <span>5%</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">Last 7 days</p>
                </div>
            </div>

            {/* TABLE CONTAINER */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">

                {/* Table Header/Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    {/* Tabs */}
                    <div className="flex items-center bg-[#f0f9f4] rounded-lg p-1.5 border border-emerald-50">
                        <button className="px-5 py-2 text-sm font-semibold text-gray-800 bg-white rounded-md shadow-sm whitespace-nowrap">
                            All order <span className="text-emerald-500 ml-1">(240)</span>
                        </button>
                        <button className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors whitespace-nowrap">Completed</button>
                        <button className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors whitespace-nowrap">Pending</button>
                        <button className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors whitespace-nowrap">Canceled</button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-[280px]">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search order report"
                                className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all font-medium text-gray-600 placeholder-gray-400"
                            />
                        </div>
                        <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors tooltip" title="Filter">
                            <SlidersHorizontal size={18} />
                        </button>
                        <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors tooltip" title="Sort">
                            <ArrowUpDown size={18} />
                        </button>
                        <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-[#e9f5ee] text-emerald-800 font-semibold">
                            <tr>
                                <th className="py-4 px-6 rounded-l-lg w-20">No.</th>
                                <th className="py-4 px-4">Order Id</th>
                                <th className="py-4 px-4">Product</th>
                                <th className="py-4 px-4">Date</th>
                                <th className="py-4 px-4">Price</th>
                                <th className="py-4 px-4">Payment</th>
                                <th className="py-4 px-6 rounded-r-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 font-medium divide-y divide-gray-50">
                            {[
                                { num: '1', id: '#ORD0001', icon: Headphones, iconColor: 'text-blue-500', name: 'Wireless Bluetooth Headphones', date: '01-01-2025', price: '49.99', payment: 'Paid', status: 'Delivered', statusColor: 'emerald' },
                                { num: '1', id: '#ORD0001', icon: Shirt, iconColor: 'text-gray-800', name: "Men's T-Shirt", date: '01-01-2025', price: '14.99', payment: 'Unpaid', status: 'Pending', statusColor: 'amber' },
                                { num: '1', id: '#ORD0001', icon: Wallet, iconColor: 'text-amber-800', name: "Men's Leather Wallet", date: '01-01-2025', price: '49.99', payment: 'Paid', status: 'Delivered', statusColor: 'emerald' },
                                { num: '1', id: '#ORD0001', icon: 'pillow', iconColor: 'text-gray-300', name: 'Memory Foam Pillow', date: '01-01-2025', price: '39.99', payment: 'Paid', status: 'Shipped', statusColor: 'gray' },
                                { num: '1', id: '#ORD0001', icon: Dumbbell, iconColor: 'text-gray-900', name: 'Adjustable Dumbbells', date: '01-01-2025', price: '14.99', payment: 'Unpaid', status: 'Pending', statusColor: 'amber' },
                                { num: '1', id: '#ORD0001', icon: Coffee, iconColor: 'text-gray-900', name: 'Coffee Maker', date: '01-01-2025', price: '79.99', payment: 'Unpaid', status: 'Cancelled', statusColor: 'red' },
                                { num: '1', id: '#ORD0001', icon: 'cap', iconColor: 'text-green-200', name: 'Casual Baseball Cap', date: '01-01-2025', price: '49.99', payment: 'Paid', status: 'Delivered', statusColor: 'emerald' },
                                { num: '1', id: '#ORD0001', icon: Camera, iconColor: 'text-gray-900', name: 'Full HD Webcam', date: '01-01-2025', price: '39.99', payment: 'Paid', status: 'Delivered', statusColor: 'emerald' },
                                { num: '1', id: '#ORD0001', icon: 'bulb', iconColor: 'text-blue-200', name: 'Smart LED Color Bulb', date: '01-01-2025', price: '79.99', payment: 'Unpaid', status: 'Delivered', statusColor: 'emerald' },
                                { num: '1', id: '#ORD0001', icon: Shirt, iconColor: 'text-gray-800', name: "Men's T-Shirt", date: '01-01-2025', price: '14.99', payment: 'Unpaid', status: 'Delivered', statusColor: 'emerald' },
                            ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 border border-gray-300 rounded focus-within:ring-2 focus-within:ring-emerald-500/30">
                                                <input type="checkbox" className="opacity-0 w-full h-full cursor-pointer" />
                                            </div>
                                            <span className="text-gray-600">{row.num}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 font-semibold text-gray-800">{row.id}</td>
                                    <td className="py-4 px-4 flex items-center gap-4 min-w-[300px]">
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                                            {typeof row.icon === 'string' ? (
                                                <div className={`w-5 h-4 bg-current rounded-sm ${row.iconColor}`}></div>
                                            ) : (
                                                <row.icon size={20} className={row.iconColor} />
                                            )}
                                        </div>
                                        <span className="font-semibold text-gray-800">{row.name}</span>
                                    </td>
                                    <td className="py-4 px-4 text-gray-600">{row.date}</td>
                                    <td className="py-4 px-4 font-medium">{row.price}</td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex items-center gap-2 ${row.payment === 'Paid' ? 'text-emerald-500' : 'text-red-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${row.payment === 'Paid' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                            {row.payment}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase rounded-md border text-emerald-600 border-emerald-200 bg-emerald-50`}>
                                            <Truck size={14} className="text-emerald-500" />
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                    <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                        ← Previous
                    </button>
                    <div className="flex gap-2">
                        <button className="w-9 h-9 flex items-center justify-center bg-[#d2f4e1] text-emerald-700 font-bold rounded-lg text-sm border border-emerald-200">1</button>
                        <button className="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">2</button>
                        <button className="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">3</button>
                        <button className="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">4</button>
                        <button className="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">5</button>
                        <button className="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors tracking-widest">...</button>
                        <button className="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">24</button>
                    </div>
                    <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                        Next →
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AllOrders;
