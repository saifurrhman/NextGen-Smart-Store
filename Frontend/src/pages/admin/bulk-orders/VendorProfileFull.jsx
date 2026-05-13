import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bulkOrdersAPI } from '../../../services/api';
import { 
    User, ShoppingBag, DollarSign, Package, CheckCircle2, AlertCircle, Clock, TrendingUp, ArrowLeft, Loader2, Download
} from 'lucide-react';

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

const VendorProfileFull = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);

    const handleDownload = async (orderId) => {
        setDownloadingId(orderId);
        try {
            const response = await bulkOrdersAPI.downloadInvoice(orderId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice_${orderId.slice(0, 8)}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Download failed", err);
            alert("Could not download invoice. Please try again.");
        } finally {
            setDownloadingId(null);
        }
    };
    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await bulkOrdersAPI.getAll();
                setOrders(res.data?.results || []);
            } catch (err) {
                console.error("Failed to fetch orders vendor profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const vendorOrders = useMemo(() => {
        if (!email) return [];
        return orders.filter(o => o.vendor_email === email).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    }, [orders, email]);

    const stats = useMemo(() => {
        const approved = vendorOrders.filter(o => ['shipped', 'approved'].includes(o.status.toLowerCase()));
        const pending = vendorOrders.filter(o => o.status.toLowerCase() === 'pending');
        const blocked = vendorOrders.filter(o => ['canceled', 'blocked'].includes(o.status.toLowerCase()));
        const totalValue = approved.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
        return { 
            total: vendorOrders.length, 
            approvedCount: approved.length, 
            pendingCount: pending.length, 
            blockedCount: blocked.length,
            totalValue 
        };
    }, [vendorOrders]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>;
    }

    return (
        <div className="bg-[#F8FAFC] min-h-screen flex flex-col">
            {/* Header Area */}
            <div className="bg-white border-b border-gray-100 px-8 py-6 shrink-0 sticky top-0 z-30 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:bg-gray-50 hover:text-gray-900 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
                            <User size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 leading-tight">Vendor Complete Profile</h2>
                            <p className="text-sm font-medium text-gray-500 tracking-wide mt-0.5">{email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto w-full pb-16">
                    
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8">
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
                    <div className="px-8 pt-4">
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
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => handleDownload(order.id)}
                                                        disabled={downloadingId === order.id}
                                                        className="p-1.5 bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                        title="Download Physical Bill"
                                                    >
                                                        {downloadingId === order.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                                                    </button>
                                                    <StatusPill status={order.status} />
                                                </div>
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
            </div>
        </div>
    )
}

export default VendorProfileFull;
