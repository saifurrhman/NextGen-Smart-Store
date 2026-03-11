import React, { useState, useEffect } from 'react';
import { productsAPI } from '../../../services/api';
import {
    MessageSquare,
    CheckCircle2,
    XCircle,
    Loader2,
    Search,
    Filter,
    ArrowRight,
    User,
    Info,
    Image,
    Tag,
    DollarSign,
    FileText,
    ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminProductRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await productsAPI.getRequests();
            setRequests(response.data.results || []);
        } catch (err) {
            console.error('Failed to fetch requests', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedRequest) return;
        try {
            setProcessing(true);
            await productsAPI.approveRequest(selectedRequest.id, adminNotes);
            alert('Request approved and Master Product created.');
            setSelectedRequest(null);
            fetchRequests();
        } catch (err) {
            alert('Failed to approve request.');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!selectedRequest) return;
        try {
            setProcessing(true);
            await productsAPI.rejectRequest(selectedRequest.id, adminNotes);
            alert('Request rejected.');
            setSelectedRequest(null);
            fetchRequests();
        } catch (err) {
            alert('Failed to reject request.');
        } finally {
            setProcessing(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toUpperCase()) {
            case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'REJECTED': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getImageUrl = (url) => {
        if (!url || url === 'undefined' || url === 'null' || url === '') return null;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (url.startsWith('/media/')) return `http://localhost:8000${url}`;
        return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-10">
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 mb-8">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
                                Product Suggestions
                                <Tag className="text-emerald-500" size={24} />
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">Review vendor ideas for new global catalog entries.</p>
                        </div>
                        <div className="relative group lg:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search requests..."
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
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Filtering Suggestions...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="py-24 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
                        <MessageSquare className="mx-auto text-gray-200 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-gray-800 mb-2">No Requests Found</h3>
                        <p className="text-gray-400 text-sm">When vendors suggest items we don't have, they will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requests.map((req) => (
                            <motion.div
                                key={req.id}
                                whileHover={{ y: -4 }}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all h-[420px]"
                                onClick={() => { setSelectedRequest(req); setAdminNotes(req.admin_notes || ''); }}
                            >
                                <div className="h-56 bg-white relative shrink-0 flex items-center justify-center p-2">
                                    {req.image ? (
                                        <img src={getImageUrl(req.image)} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                                            <Image size={32} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                                        </div>
                                    )}
                                    <div className={`absolute top-4 left-4 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md ${getStatusColor(req.status)}`}>
                                        {req.status}
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="text-base font-bold text-gray-800 mb-2 truncate group-hover:text-emerald-600 transition-colors">
                                        {req.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-4">
                                        <User size={12} className="text-gray-400" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{req.vendor_email}</span>
                                    </div>
                                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-6 flex-1">
                                        {req.description}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <span className="text-base font-bold text-gray-800">PKR {req.suggested_price}</span>
                                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedRequest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRequest(null)}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors uppercase text-[10px] font-bold tracking-widest"
                                >
                                    <ArrowLeft size={16} />
                                    Back to list
                                </button>
                                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(selectedRequest.status)}`}>
                                    {selectedRequest.status}
                                </div>
                            </div>

                            <div className="overflow-y-auto p-8 space-y-8">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-48 h-48 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                                        {selectedRequest.image ? (
                                            <img src={getImageUrl(selectedRequest.image)} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                <Image size={40} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <h2 className="text-2xl font-bold text-gray-800 tracking-tight leading-tight">
                                            {selectedRequest.title}
                                        </h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Proposed MSRP</p>
                                                <p className="text-lg font-bold text-emerald-600">PKR {selectedRequest.suggested_price}</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Category</p>
                                                <p className="text-sm font-bold text-gray-700 uppercase">{selectedRequest.category_name || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <FileText size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Proposal Details</span>
                                    </div>
                                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedRequest.description}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <MessageSquare size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Admin Review Notes</span>
                                    </div>
                                    <textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Add feedback for the vendor or internal approval notes..."
                                        className="w-full p-4 bg-gray-50 border border-gray-100 focus:border-emerald-500/30 focus:bg-white rounded-xl text-sm outline-none transition-all h-28 resize-none"
                                    />
                                </div>
                            </div>

                            {selectedRequest.status === 'PENDING' && (
                                <div className="p-6 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-4 shrink-0">
                                    <button
                                        onClick={handleReject}
                                        disabled={processing}
                                        className="py-3 bg-white border border-gray-200 text-gray-500 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        <XCircle size={14} />
                                        Reject
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        disabled={processing}
                                        className="py-3 bg-emerald-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/10 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {processing ? <Loader2 className="animate-spin" size={14} /> : <><CheckCircle2 size={14} /> Approve & List</>}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProductRequests;
