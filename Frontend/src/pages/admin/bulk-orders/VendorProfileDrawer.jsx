import React, { useMemo } from 'react';
import { 
    X, User, ShoppingBag, DollarSign, Package, CheckCircle2, AlertCircle, Clock, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/media/')) return `http://localhost:8000${url}`;
    return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
};

const StatusPill = ({ status }) => {
    const s = status.toLowerCase();
    if (s === 'pending') return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Pending</span>;
    if (['shipped','approved'].includes(s)) return <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Approved</span>;
    if (['canceled','blocked','rejected'].includes(s)) return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Blocked</span>;
    return <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{status}</span>;
}

const VendorProfileDrawer = ({ isOpen, onClose, vendorEmail, vendorId, allOrders }) => {
    
    const vendorOrders = useMemo(() => {
        if (!vendorEmail && !vendorId) return [];
        return allOrders.filter(o => o.vendor_email === vendorEmail || o.vendor_id === vendorId).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    }, [allOrders, vendorEmail, vendorId]);

    const stats = useMemo(() => {
        const approved = vendorOrders.filter(o => ['shipped', 'approved'].includes(o.status.toLowerCase()));
        const pending = vendorOrders.filter(o => o.status.toLowerCase() === 'pending');
        const blocked = vendorOrders.filter(o => ['canceled', 'blocked'].includes(o.status.toLowerCase()));
        const totalValue = approved.reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
        return { 
            total: vendorOrders.length, 
            approvedCount: approved.length, 
            pendingCount: pending.length, 
            blockedCount: blocked.length,
            totalValue 
        };
    }, [vendorOrders]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-6"
                        onClick={onClose}
                    >
                        {/* Nested Drawer/Modal Box */}
                        <motion.div 
                            key="vendor-modal-content"
                            initial={{ opacity: 0, y: 20, scale: 0.98 }} 
                            animate={{ opacity: 1, y: 0, scale: 1 }} 
                            exit={{ opacity: 0, y: 20, scale: 0.98 }} 
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-[#F8FAFC] w-full max-w-6xl h-full max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
                                        <User size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 leading-tight">Vendor Profile Dashboard</h2>
                                        <p className="text-sm font-medium text-gray-500 tracking-wide mt-0.5">{vendorEmail || 'Unknown Email'}</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="px-5 py-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 font-bold text-xs tracking-widest uppercase rounded-lg transition-colors flex items-center gap-2">
                                    <X size={16} /> Close Tracker
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
                                
                                {/* Key Metrics */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 max-w-5xl mx-auto w-full">
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <TrendingUp size={16} className="text-gray-400" />
                                            <span className="text-[10px] uppercase font-bold text-gray-400">Total Spent</span>
                                        </div>
                                        <p className="text-xl font-black text-gray-900">${stats.totalValue.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-emerald-500">
                                        <div className="flex justify-between items-start mb-2">
                                            <CheckCircle2 size={16} className="text-emerald-500" />
                                            <span className="text-[10px] uppercase font-bold text-gray-400">Approved</span>
                                        </div>
                                        <p className="text-xl font-black text-gray-900">{stats.approvedCount}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-amber-500">
                                        <div className="flex justify-between items-start mb-2">
                                            <Clock size={16} className="text-amber-500" />
                                            <span className="text-[10px] uppercase font-bold text-gray-400">Pending</span>
                                        </div>
                                        <p className="text-xl font-black text-gray-900">{stats.pendingCount}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-red-500">
                                        <div className="flex justify-between items-start mb-2">
                                            <AlertCircle size={16} className="text-red-500" />
                                            <span className="text-[10px] uppercase font-bold text-gray-400">Blocked</span>
                                        </div>
                                        <p className="text-xl font-black text-gray-900">{stats.blockedCount}</p>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="px-8 pb-16 max-w-5xl mx-auto w-full pt-8">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
                                        <ShoppingBag size={16} /> Complete Order Tracking History
                                    </h3>

                                    <div className="space-y-6">
                                        {vendorOrders.map((order, index) => (
                                            <div key={order.id} className="relative pl-6 pb-2">
                                                {/* Timeline Node */}
                                                {index !== vendorOrders.length - 1 && (
                                                    <div className="absolute left-2.5 top-8 bottom-0 w-px bg-gray-200" />
                                                )}
                                                <div className="absolute left-1 top-2 w-3 h-3 bg-white border-2 border-emerald-500 rounded-full z-10" />
                                                
                                                <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 hover:border-emerald-500/20 transition-all">
                                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">Order #{order.id.slice(0,8).toUpperCase()}</p>
                                                            <p className="text-xs font-medium text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1">
                                                            <StatusPill status={order.status} />
                                                            <span className="text-sm font-black text-gray-900">${parseFloat(order.total_amount).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="bg-gray-50 rounded-lg p-3">
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 px-1">Manifest Items</p>
                                                        <div className="space-y-2">
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                                                                    <div className="flex items-center gap-2 min-w-0">
                                                                        <div className="w-6 h-6 bg-white border border-gray-200 rounded shrink-0 p-0.5">
                                                                            {item.product_details?.main_image ? 
                                                                                <img src={getMediaUrl(item.product_details.main_image)} className="w-full h-full object-contain" alt=""/> 
                                                                                : <Package size={12} className="text-gray-300"/>}
                                                                        </div>
                                                                        <span className="font-semibold text-gray-700 truncate">{item.product_details?.title || 'Unknown Item'}</span>
                                                                    </div>
                                                                    <div className="text-gray-500 bg-white border border-gray-100 px-2 py-0.5 rounded font-mono text-[10px]">
                                                                        {item.quantity} x ${parseFloat(item.price || 0)}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {(!order.items || order.items.length === 0) && (
                                                                <div className="text-center py-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                                                    No manifest items recorded
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {vendorOrders.length === 0 && (
                                            <div className="text-center py-10 bg-white rounded-xl border border-gray-100 text-gray-400">
                                                <ShoppingBag size={32} className="mx-auto mb-3 opacity-20" />
                                                <p className="text-sm font-semibold">No order history available.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default VendorProfileDrawer;
