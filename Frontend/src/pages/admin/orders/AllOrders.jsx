import React, { useState, useEffect } from 'react';
import {
    Ticket, Search, Filter, Download, Plus,
    MoreVertical, ArrowUp, ArrowDown, Headphones,
    Shirt, Wallet, Dumbbell, Coffee, Camera, Truck, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';
import api from '../../../utils/api';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, new: 0, completed: 0, canceled: 0 });
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/api/v1/orders/');
                setOrders(response.data);

                // Calculate basic stats from real data
                const total = response.data.length;
                const newOrders = response.data.filter(o => o.status === 'pending').length;
                const completed = response.data.filter(o => o.status === 'delivered').length;
                const canceled = response.data.filter(o => o.status === 'canceled').length;
                setStats({ total, new: newOrders, completed, canceled });
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getIcon = (productName) => {
        if (!productName) return Headphones;
        const name = productName.toLowerCase();
        if (name.includes('shirt')) return Shirt;
        if (name.includes('wallet')) return Wallet;
        if (name.includes('dumbbell')) return Dumbbell;
        if (name.includes('coffee')) return Coffee;
        if (name.includes('webcam') || name.includes('camera')) return Camera;
        return Headphones;
    };

    // Filtering logic
    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'completed') return order.status === 'delivered';
        if (filter === 'pending') return order.status === 'pending';
        if (filter === 'canceled') return order.status === 'canceled';
        return true;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };
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
                        <h2 className="text-3xl font-bold text-gray-800">{stats.total.toLocaleString()}</h2>
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
                        <h2 className="text-3xl font-bold text-gray-800">{stats.new.toLocaleString()}</h2>
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
                        <h2 className="text-3xl font-bold text-gray-800">{stats.completed.toLocaleString()}</h2>
                        {/* <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                            <span>85%</span>
                        </div> */}
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
                        <h2 className="text-3xl font-bold text-gray-800">{stats.canceled.toLocaleString()}</h2>
                        {/* <div className="flex items-center gap-1 text-xs font-semibold text-red-500 mb-1.5">
                            <ArrowDown size={12} strokeWidth={3} /> <span>5%</span>
                        </div> */}
                    </div>
                    <p className="text-xs text-gray-400">Last 7 days</p>
                </div>
            </div>

            {/* TABLE CONTAINER */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">

                {/* Table Header/Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    {/* Tabs */}
                    <div className="flex items-center bg-[#f0f9f4] rounded-lg p-1.5 border border-emerald-50 w-full lg:w-auto overflow-x-auto">
                        <button
                            onClick={() => handleFilterChange('all')}
                            className={`px-5 py-2 text-sm font-semibold rounded-md shadow-sm whitespace-nowrap transition-all ${filter === 'all' ? 'bg-white text-gray-800' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            All order <span className="text-emerald-500 ml-1">({stats.total})</span>
                        </button>
                        <button
                            onClick={() => handleFilterChange('completed')}
                            className={`px-5 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all ${filter === 'completed' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Completed <span className="text-emerald-500 ml-1">({stats.completed})</span>
                        </button>
                        <button
                            onClick={() => handleFilterChange('pending')}
                            className={`px-5 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all ${filter === 'pending' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Pending <span className="text-emerald-500 ml-1">({stats.new})</span>
                        </button>
                        <button
                            onClick={() => handleFilterChange('canceled')}
                            className={`px-5 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all ${filter === 'canceled' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Canceled <span className="text-emerald-500 ml-1">({stats.canceled})</span>
                        </button>
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
                            {currentItems.map((order, idx) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 border border-gray-300 rounded focus-within:ring-2 focus-within:ring-emerald-500/30">
                                                <input type="checkbox" className="opacity-0 w-full h-full cursor-pointer" />
                                            </div>
                                            <span className="text-gray-600">{indexOfFirstItem + idx + 1}.</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 font-semibold text-gray-800">#{order.id.toString().slice(-8).toUpperCase()}</td>
                                    <td className="py-4 px-4 flex items-center gap-4 min-w-[300px]">
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                                            {React.createElement(getIcon(order.items?.[0]?.product_details?.title), {
                                                size: 20,
                                                className: "text-emerald-500"
                                            })}
                                        </div>
                                        <span className="font-semibold text-gray-800">
                                            {order.items?.[0]?.product_details?.title || 'No internal items'}
                                            {order.items?.length > 1 && ` (+${order.items.length - 1})`}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="py-4 px-4 font-medium">${parseFloat(order.total_amount).toFixed(2)}</td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex items-center gap-2 text-emerald-500`}>
                                            <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500`}></span>
                                            Paid
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase rounded-md border ${order.status === 'delivered' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' :
                                            order.status === 'canceled' ? 'text-red-500 border-red-200 bg-red-50' :
                                                'text-amber-600 border-amber-200 bg-amber-50'
                                            }`}>
                                            <Truck size={14} />
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="7" className="py-10 text-center text-gray-400">No orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                    <div className="mt-6 flex items-center justify-between">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ← Previous
                        </button>
                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, i) => {
                                const pageNum = i + 1;
                                // Basic logic to show limited pages
                                if (totalPages > 7 && pageNum > 3 && pageNum < totalPages - 2 && Math.abs(pageNum - currentPage) > 1) {
                                    if (pageNum === 4 || pageNum === totalPages - 3) return <span key={pageNum} className="px-2">...</span>;
                                    return null;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${currentPage === pageNum ? 'bg-[#d2f4e1] text-emerald-700 border border-emerald-200' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AllOrders;
