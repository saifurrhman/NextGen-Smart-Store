import React, { useState, useEffect } from 'react';
import { bulkOrdersAPI } from '../../../services/api';
import {
    Package,
    CheckCircle2,
    XCircle,
    Truck,
    Loader2,
    Search,
    Filter,
    ArrowRight,
    User,
    DollarSign,
    AlertCircle,
    Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/media/')) return `http://localhost:8000${url}`;
    return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
};

const AdminBulkOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await bulkOrdersAPI.getAll();
            setOrders(response.data.results || []);
        } catch (err) {
            console.error('Failed to fetch orders', err);
            const errorMsg = err.response?.data?.error || err.message || 'Unknown network error';
            alert(`Failed to load bulk orders: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm('Are you sure you want to approve this order? This will automatically allocate inventory to the vendor.')) return;

        try {
            setProcessingId(id);
            await bulkOrdersAPI.approve(id);
            await fetchOrders();
            alert('Order approved and stock allocated successfully.');
        } catch (err) {
            console.error('Error approving order:', err);
            const errorMsg = err.response?.data?.error || err.message || 'Approval failed';
            alert(`Failed to approve order: ${errorMsg}`);
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'shipped': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'canceled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-10">
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 mb-8">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
                                Wholesale Fulfillment
                                <Truck className="text-emerald-500" size={24} />
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">Review vendor bulk requests and allocate global stock.</p>
                        </div>
                        <div className="relative group lg:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search by Vendor or ID..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-500/30 rounded-xl text-sm font-medium transition-all outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="animate-spin text-emerald-500" size={40} />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Bulk Transactions...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="py-24 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
                        <Package className="mx-auto text-gray-200 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-gray-800 mb-2">No Active Bulk Orders</h3>
                        <p className="text-gray-400 text-sm">When vendors purchase from the master catalog, they will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <motion.div
                                key={order.id}
                                layout
                                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                            >
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 text-gray-400">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Master Provisioning</span>
                                                    <span className="text-xs font-bold text-gray-400">#{order.id.toString().toUpperCase()}</span>
                                                </div>
                                                <h3 className="text-base font-bold text-gray-900">
                                                    Vendor: {order.vendor_email}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="lg:col-span-2 space-y-4">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Items</p>
                                            <div className="space-y-3">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-0.5">
                                                                {item.product_details?.main_image ? (
                                                                    <img
                                                                        src={getMediaUrl(item.product_details.main_image)}
                                                                        className="w-full h-full object-contain"
                                                                        alt=""
                                                                    />
                                                                ) : (
                                                                    <Package size={18} className="text-gray-300" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-800">{item.product_details?.title}</p>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Requested: {item.quantity} Units</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs font-bold text-gray-500">PKR {item.price}/unit</p>
                                                            <p className="text-sm font-bold text-gray-900">PKR {(item.quantity * item.price).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-2xl p-6 flex flex-col border border-gray-100">
                                            <div className="flex-1 space-y-6">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Financial Summary</p>
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="text-emerald-500" size={20} />
                                                        <span className="text-2xl font-bold text-gray-900 tracking-tight">
                                                            {parseFloat(order.total_amount).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <Info size={14} className="text-emerald-500" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Inventory Expansion</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <AlertCircle size={14} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Awaiting Approval</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {order.status === 'pending' ? (
                                                <button
                                                    onClick={() => handleApprove(order.id)}
                                                    disabled={processingId === order.id}
                                                    className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/10 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
                                                >
                                                    {processingId === order.id ? (
                                                        <Loader2 className="animate-spin" size={14} />
                                                    ) : (
                                                        <>
                                                            Approve & Allocate
                                                            <CheckCircle2 size={14} />
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <div className="mt-8 p-3 bg-white rounded-xl border border-gray-100 flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest text-center justify-center">
                                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                                    Provisioned
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


export default AdminBulkOrders;
