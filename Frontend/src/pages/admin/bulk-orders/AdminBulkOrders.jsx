import React, { useState, useEffect } from 'react';
import { bulkOrdersAPI } from '../../../services/api';
import {
    Package, CheckCircle2, Truck, Loader2, Search, Info, DollarSign, ChevronRight, User, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/media/')) return `http://localhost:8000${url}`;
    return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
};

const AdminBulkOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [processingId, setProcessingId] = useState(null);
    const [expandedRows, setExpandedRows] = useState(new Set());

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
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id, e) => {
        if(e) e.stopPropagation();
        if (!window.confirm('Are you sure you want to approve this order? This will allocate inventory.')) return;

        try {
            setProcessingId(id);
            await bulkOrdersAPI.approve(id);
            await fetchOrders();
        } catch (err) {
            console.error('Error approving order:', err);
            const errorMsg = err.response?.data?.error || err.message || 'Approval failed';
            alert(`Failed: ${errorMsg}`);
        } finally {
            setProcessingId(null);
        }
    };

    const StatusBadge = ({ status }) => {
        const isPending = status.toLowerCase() === 'pending';
        return (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isPending ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                {status}
            </span>
        );
    }

    const toggleRow = (id) => {
        const newSet = new Set(expandedRows);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedRows(newSet);
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = (o.vendor_email || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                              o.id.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesStatus = true;
        if (filterStatus !== 'ALL') {
            if (filterStatus === 'APPROVED') {
                matchesStatus = ['shipped', 'approved', 'processed'].includes(o.status.toLowerCase());
            } else if (filterStatus === 'BLOCKED') {
                matchesStatus = ['canceled', 'blocked', 'rejected'].includes(o.status.toLowerCase());
            } else {
                matchesStatus = o.status.toLowerCase() === filterStatus.toLowerCase();
            }
        }
        return matchesSearch && matchesStatus;
    });

    const pendingCount = orders.filter(o => o.status.toLowerCase() === 'pending').length;
    const totalVolume = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-10">
            {/* Header section */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 mb-8">
                <div className="max-w-[1400px] mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                                Wholesale Fulfillment <Truck className="text-emerald-500" size={20} />
                            </h1>
                            <p className="text-gray-500 text-xs mt-1">Review vendor bulk requests</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            {/* Filter Status Row */}
                            <div className="flex items-center p-1 bg-gray-50 rounded-lg border border-gray-100">
                                {['ALL', 'PENDING', 'APPROVED', 'BLOCKED'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-1.5 rounded-md text-[11px] font-bold tracking-wider uppercase transition-all ${
                                            filterStatus === status 
                                            ? 'bg-white text-emerald-600 shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>

                            <div className="relative group w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search vendor or ID..."
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-500/30 rounded-lg text-xs font-medium outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6">
                {/* Summary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
                            <Package size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Pending Approvals</p>
                            <p className="text-xl font-bold text-gray-900">{pendingCount}</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Volume</p>
                            <p className="text-xl font-bold text-gray-900">${totalVolume.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" /></div>
                ) : (
                    <div className="bg-white border md:rounded-xl border-gray-200 shadow-sm overflow-hidden text-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-500">
                                    <th className="py-3 px-4 font-bold w-10"></th>
                                    <th className="py-3 px-4 font-bold">Order ID</th>
                                    <th className="py-3 px-4 font-bold">Vendor Info</th>
                                    <th className="py-3 px-4 font-bold">Items</th>
                                    <th className="py-3 px-4 font-bold text-right">Value (PKR)</th>
                                    <th className="py-3 px-4 font-bold text-center">Status</th>
                                    <th className="py-3 px-4 font-bold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center text-gray-400 text-xs">No orders found.</td>
                                    </tr>
                                )}
                                {filteredOrders.map(order => {
                                    const isExpanded = expandedRows.has(order.id);
                                    const isPending = order.status.toLowerCase() === 'pending';
                                    
                                    return (
                                        <React.Fragment key={order.id}>
                                            <tr 
                                                className={`hover:bg-gray-50 cursor-pointer transition-colors ${isExpanded ? 'bg-gray-50/50' : ''}`}
                                                onClick={() => toggleRow(order.id)}
                                            >
                                                <td className="py-4 px-4 text-gray-400 text-center">
                                                    <ChevronRight size={16} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="font-mono text-xs font-semibold text-gray-600">#{order.id.slice(0, 8).toUpperCase()}</span>
                                                    <div className="text-[10px] text-gray-400 mt-0.5">{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2 group">
                                                        <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                            <User size={12} />
                                                        </div>
                                                        <span className="font-medium text-gray-800 text-xs truncate max-w-[200px]">{order.vendor_email || 'Unknown'}</span>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); navigate(`/admin/bulk-orders/vendor/${order.vendor_email}`); }}
                                                            className="opacity-0 group-hover:opacity-100 p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all ml-auto focus:opacity-100"
                                                            title="View Vendor Complete Profile"
                                                        >
                                                            <Eye size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                                                        <Package size={14} className="text-gray-400"/>
                                                        {order.items?.length || 0} Products
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <span className="font-bold text-gray-900 border-b border-dashed border-gray-300 pb-0.5">
                                                        ${parseFloat(order.total_amount).toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <StatusBadge status={order.status} />
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {isPending ? (
                                                        <button 
                                                            disabled={processingId === order.id}
                                                            onClick={(e) => handleApprove(order.id, e)}
                                                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-1.5 mx-auto"
                                                        >
                                                            {processingId === order.id ? <Loader2 size={12} className="animate-spin"/> : <CheckCircle2 size={12}/>}
                                                            Approve
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex justify-center items-center gap-1">
                                                            <CheckCircle2 size={12} /> Allocated
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <tr className="bg-gray-50/30 border-b border-gray-100">
                                                        <td colSpan="7" className="p-0">
                                                            <motion.div 
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-14 py-6 border-l-4 border-emerald-500 ml-4 mb-4 mt-2 bg-white rounded-r-xl shadow-sm max-w-4xl">
                                                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                                                        <Info size={12}/> Detailed Order Manifest
                                                                    </h4>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        {order.items?.map((item, idx) => (
                                                                            <div key={idx} className="flex gap-3 p-3 border border-gray-100 rounded-lg hover:border-emerald-500/30 transition-colors">
                                                                                <div className="w-12 h-12 bg-gray-50 rounded border border-gray-200 flex-shrink-0 flex items-center justify-center p-1">
                                                                                    {item.product_details?.main_image ? 
                                                                                        <img src={getMediaUrl(item.product_details.main_image)} className="w-full h-full object-contain" alt=""/> 
                                                                                        : <Package size={16} className="text-gray-300"/>}
                                                                                </div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="text-xs font-bold text-gray-800 truncate">{item.product_details?.title}</p>
                                                                                    <div className="flex justify-between items-end mt-1 text-[11px]">
                                                                                        <span className="text-gray-500">Qty: <strong className="text-gray-900">{item.quantity}</strong></span>
                                                                                        <span className="font-semibold text-emerald-600">${parseFloat(item.price).toLocaleString()} <span className="text-gray-400 font-normal">/ea</span></span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </AnimatePresence>
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBulkOrders;
