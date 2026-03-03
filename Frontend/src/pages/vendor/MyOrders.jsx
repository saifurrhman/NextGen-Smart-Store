import React, { useState } from 'react';
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
    User
} from 'lucide-react';
import { motion } from 'framer-motion';

const MyOrders = () => {
    const [filter, setFilter] = useState('All');

    const orders = [
        { id: '#ORD-8821', customer: 'Alex Rivera', email: 'alex@example.com', items: 3, total: '$459.00', status: 'Processing', date: 'Mar 01, 2026', type: 'Standard' },
        { id: '#ORD-8820', customer: 'Sarah Chen', email: 'sarah.c@gmail.com', items: 1, total: '$1,299.00', status: 'Shipped', date: 'Feb 28, 2026', type: 'Priority' },
        { id: '#ORD-8819', customer: 'Marco V.', email: 'marco.v@outlook.com', items: 2, total: '$89.00', status: 'Delivered', date: 'Feb 28, 2026', type: 'Standard' },
        { id: '#ORD-8818', customer: 'Elena G.', email: 'elena.g@corp.com', items: 5, total: '$2,450.00', status: 'Pending', date: 'Feb 27, 2026', type: 'Express' },
    ];

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
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight uppercase">Order Fulfillment</h1>
                    <p className="text-sm text-gray-500 font-medium">Tracking and managing incoming merchant requests across the network.</p>
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
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
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
                            {orders.map((order, i) => (
                                <tr key={order.id} className="group hover:bg-neutral-50/50 transition-colors cursor-pointer">
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
                                            <Package size={14} className="text-gray-300" />
                                            <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">{order.items} Items</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-xs font-black text-gray-900 tracking-tighter">{order.total}</td>
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
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="p-6 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Displaying 4/128 Operational Logs</p>
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
