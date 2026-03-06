import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Download,
    Eye,
    Truck,
    MoreHorizontal,
    Package,
    User,
    Loader2
} from 'lucide-react';
import api from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';

const MyOrders = () => {
    const { formatCurrency } = useCurrency();
    const [filter, setFilter] = useState('All Orders');
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/vendors/orders/?filter=${encodeURIComponent(filter)}`);
                if (response.data && response.data.results) {
                    setOrders(response.data.results);
                }
            } catch (error) {
                console.error("Failed to fetch vendor orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [filter]);

    const filteredOrders = orders.filter(order => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            order.id?.toString().toLowerCase().includes(term) ||
            order.customer?.toLowerCase().includes(term) ||
            order.email?.toLowerCase().includes(term)
        );
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return 'text-emerald-600 border-emerald-200 bg-emerald-50';
            case 'Shipped': return 'text-blue-600 border-blue-200 bg-blue-50';
            case 'Processing': return 'text-amber-600 border-amber-200 bg-amber-50';
            case 'Pending': return 'text-rose-500 border-rose-200 bg-rose-50';
            case 'Canceled': return 'text-red-500 border-red-200 bg-red-50';
            default: return 'text-gray-600 border-gray-200 bg-gray-50';
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Order List</h2>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all">
                            <Download size={16} className="text-emerald-600" />
                            Excel
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Table Header/Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-center p-4 gap-4 bg-gray-50/30 border-b border-gray-50">
                    <div className="flex items-center bg-white rounded-xl p-1 border border-gray-100 w-full lg:w-auto overflow-x-auto shadow-sm">
                        {['All Orders', 'Pending', 'Processing', 'Dispatched', 'Completed'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-5 py-2 text-xs font-black rounded-lg transition-all whitespace-nowrap ${filter === tab
                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100'
                                        : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-[280px]">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium text-gray-700 shadow-sm"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-700">
                            <Filter size={16} /> Filters
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-[#e9f5ee] text-emerald-800 font-bold uppercase text-[10px] tracking-wider">
                            <tr>
                                <th className="py-4 px-6 w-16">No.</th>
                                <th className="py-4 px-4">Order Id</th>
                                <th className="py-4 px-4">Customer</th>
                                <th className="py-4 px-4">Items</th>
                                <th className="py-4 px-4 text-center">Date</th>
                                <th className="py-4 px-4 text-center">Amount</th>
                                <th className="py-4 px-4 text-center">Status</th>
                                <th className="py-4 px-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 font-medium divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="py-12 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-20 text-center text-gray-400 font-bold italic">No orders found.</td>
                                </tr>
                            ) : (
                                filteredOrders.map((order, idx) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <span className="text-gray-400 font-bold">{idx + 1}.</span>
                                        </td>
                                        <td className="py-4 px-4 font-bold text-gray-800">
                                            #{order.id?.toString().slice(-8).toUpperCase()}
                                        </td>
                                        <td className="py-4 px-4 flex items-center gap-4 min-w-[250px]">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm text-emerald-500">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-800 block">{order.customer || 'Unknown'}</span>
                                                <span className="text-xs text-gray-500">{order.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-1.5 text-gray-600 font-bold">
                                                <Package size={16} className="text-gray-400" /> {order.items}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center text-gray-500 font-bold text-xs">{order.date}</td>
                                        <td className="py-4 px-4 text-center font-black text-gray-800">{formatCurrency(order.total, 0)}</td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase rounded-lg border ${getStatusStyle(order.status)}`}>
                                                <Truck size={14} />
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" title="View Details">
                                                    <Eye size={16} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && orders.length > 0 && (
                    <div className="p-5 flex items-center justify-between border-t border-gray-50 text-sm bg-gray-50/30">
                        <button disabled className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 bg-white opacity-50 cursor-not-allowed shadow-sm">
                            ← Previous
                        </button>
                        <div className="flex gap-1.5">
                            <button className="w-9 h-9 flex items-center justify-center rounded-lg text-xs transition-all font-black bg-emerald-500 text-white shadow-md shadow-emerald-100">1</button>
                        </div>
                        <button disabled className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 bg-white opacity-50 cursor-not-allowed shadow-sm">
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
