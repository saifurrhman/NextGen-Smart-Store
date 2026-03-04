import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Truck,
    CheckCircle2,
    Clock,
    XCircle,
    Package,
    ArrowUpRight,
    MapPin,
    User,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';

const MyOrders = () => {
    const { formatCurrency } = useCurrency();
    const [filter, setFilter] = useState('All Orders');
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Processing': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Pending': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Order Fulfillment</h1>
                    <p className="text-sm text-gray-400 font-medium">Tracking and managing incoming merchant requests across the network.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all border border-gray-100">
                        <Filter size={14} /> Refine View
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-200">
                        Batch Export
                    </button>
                </div>
            </div>

            {/* Main Content Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden"
            >
                {/* Table Filter Tabs */}
                <div className="flex items-center gap-6 px-8 border-b border-gray-50">
                    {['All Orders', 'Pending', 'Processing', 'Dispatched', 'Completed'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${filter === tab ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab}
                            {filter === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600" />}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Hash ID</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Customer Identity</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Item Group</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Net Value</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Operation Date</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-8 py-12 text-center relative h-32">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                                        </div>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-8 py-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        No tracking data for {filter}
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order, i) => (
                                    <tr key={order.id || i} className="group hover:bg-neutral-50/50 transition-colors cursor-pointer">
                                        <td className="px-8 py-5">
                                            <p className="text-xs font-bold text-emerald-600 tracking-wider font-mono uppercase">{order.id}</p>
                                            <p className="text-[9px] font-bold text-gray-300 uppercase mt-0.5">{order.type} SHIPMENT</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                                    <User size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-extrabold text-gray-800 uppercase tracking-tight">{order.customer}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium lowercase">{order.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <Package size={14} className="text-gray-300" strokeWidth={2.5} />
                                                <span className="text-xs font-black text-gray-500 uppercase tracking-tight">{order.items} Items</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-black text-gray-900 tracking-tighter">{formatCurrency(order.total)}</td>
                                        <td className="px-8 py-5">
                                            <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${getStatusStyle(order.status)}`}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                                {order.status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Clock size={12} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{order.date}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="View Inspection">
                                                    <Eye size={16} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Initialize Transit">
                                                    <Truck size={16} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
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

                {/* Pagination Placeholder */}
                <div className="p-6 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Displaying {orders.length} Operational Logs</p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white border border-gray-100 rounded-lg hover:text-emerald-600 transition-all disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white border border-gray-100 rounded-lg hover:text-emerald-600 transition-all">Next</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MyOrders;
