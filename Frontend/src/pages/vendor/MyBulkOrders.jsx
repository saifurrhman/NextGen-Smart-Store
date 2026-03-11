import React, { useState, useEffect } from 'react';
import { bulkOrdersAPI } from '../../services/api';
import {
    Package,
    Clock,
    CheckCircle2,
    XCircle,
    Truck,
    CreditCard,
    ArrowRight,
    Search,
    Filter,
    Loader2,
    Calendar,
    Hash,
    Info
} from 'lucide-react';
import { motion } from 'framer-motion';

const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/media/')) return `http://localhost:8000${url}`;
    return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
};

const MyBulkOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await bulkOrdersAPI.getAll();
            setOrders(response.data.results || []);
        } catch (err) {
            console.error('Failed to fetch bulk orders', err);
            const errorMsg = err.response?.data?.error || err.message || 'Unknown network error';
            alert(`Failed to load bulk orders: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const s = (status || 'pending').toLowerCase();
        switch (s) {
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'approved': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'shipped': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'canceled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        const s = (status || 'pending').toLowerCase();
        switch (s) {
            case 'pending': return Clock;
            case 'approved': return CreditCard;
            case 'shipped': return CheckCircle2;
            case 'canceled': return XCircle;
            default: return Package;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-10">
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 mb-8">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Bulk Order History</h1>
                            <p className="text-gray-500 text-sm mt-1">Track your wholesale inventory purchases and fulfillment status.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group lg:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Order # or product..."
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-500/30 rounded-xl text-sm font-medium transition-all outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-emerald-600 rounded-xl transition-all">
                                <Filter size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="animate-spin text-emerald-500" size={40} />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Retrieving Orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="py-24 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <Package size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">No Bulk Orders Found</h3>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto mb-8">You haven't placed any wholesale orders yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getStatusColor(order.status)} shrink-0`}>
                                                {React.createElement(getStatusIcon(order.status), { size: 20 })}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</span>
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-mono text-xs font-bold tracking-tight">#{order.id ? order.id.toString().slice(-8).toUpperCase() : 'N/A'}</span>
                                                </div>
                                                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2 text-capitalize">
                                                    Status: {order.status || 'Pending'}
                                                    <div className={`w-1.5 h-1.5 rounded-full ${(order.status || '').toLowerCase() === 'shipped' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 text-right">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                                <p className="text-lg font-bold text-gray-800 tracking-tight">PKR {order.total_amount ? parseFloat(order.total_amount).toLocaleString() : '0'}</p>
                                            </div>
                                            <div className="hidden sm:block">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date</p>
                                                <p className="text-xs font-bold text-gray-600">
                                                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="grid grid-cols-1 gap-3">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-white rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center shrink-0 p-0.5">
                                                            {item.product_details?.main_image ? (
                                                                <img
                                                                    src={getMediaUrl(item.product_details.main_image)}
                                                                    alt=""
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            ) : (
                                                                <Package className="text-gray-300" size={18} />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-700">{item.product_details?.title || 'Product'}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Qty: {item.quantity} | PKR {item.price}/unit</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-gray-800">PKR {(item.quantity * item.price).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {(order.status || '').toLowerCase() === 'pending' && (
                                        <div className="mt-6 flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                            <Info size={16} className="text-amber-500 shrink-0" />
                                            <p className="text-[10px] font-bold text-amber-800/70 uppercase tracking-widest leading-relaxed">
                                                Awaiting admin review and payment confirmation.
                                            </p>
                                        </div>
                                    )}
                                    {(order.status || '').toLowerCase() === 'shipped' && (
                                        <div className="mt-6 flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                            <Truck size={16} className="text-emerald-500 shrink-0" />
                                            <p className="text-[10px] font-bold text-emerald-800/70 uppercase tracking-widest leading-relaxed">
                                                Stock allocated to your inventory.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBulkOrders;
