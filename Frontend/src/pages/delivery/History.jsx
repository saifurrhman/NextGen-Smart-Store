import React, { useState, useEffect } from 'react';
import { History, Search, Calendar, Package, ArrowRight, Filter, Zap, ShieldCheck, Box, ChevronRight, Download } from 'lucide-react';
import api from '../../utils/api';

const DeliveryHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/v1/operations/delivery/my-tasks/?include_history=true');
            setHistory(response.data);
        } catch (error) {
            console.error("History fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredHistory = history.filter(item =>
        item.tracking_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.order_id?.toString().includes(searchTerm)
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        <History size={12} className="text-emerald-600 fill-emerald-600" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Service Archive</span>
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-none uppercase">Operation Logs</h2>
                    <p className="text-xs font-bold text-gray-400 max-w-xs">{history.length} verified operations archived in your specialist profile.</p>
                </div>

                <div className="relative group w-full md:w-96">
                    <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search logs by tracking id..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[2rem] text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-emerald-200 focus:ring-8 focus:ring-emerald-500/5 transition-all shadow-sm"
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-64 bg-white animate-pulse rounded-[3rem] border border-gray-50 shadow-sm"></div>
                    ))}
                </div>
            ) : filteredHistory.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-8 pb-20 lg:pb-0">
                    {filteredHistory.map((item) => (
                        <div key={item.id} className="group bg-white rounded-[3.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-gray-200/30 transition-all flex flex-col space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-4">
                                    <div className="w-14 h-14 bg-emerald-50 rounded-[1.8rem] flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <Package size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Record Reference</p>
                                        <p className="text-2xl font-black text-gray-900 tracking-tighter italic">#{item.order_id}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-1.5 bg-emerald-600 px-3 py-1 rounded-full border border-emerald-500 shadow-lg shadow-emerald-100">
                                        <ShieldCheck size={10} className="text-white fill-white" />
                                        <span className="text-[8px] font-black text-white uppercase tracking-widest">Verified</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">{item.status}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-5 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 shadow-inner flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={16} className="text-gray-300" />
                                        <div>
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5 leading-none">Finalized Date</p>
                                            <p className="text-xs font-black text-gray-900 uppercase">
                                                {new Date(item.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="h-8 w-[1px] bg-gray-200"></div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5 leading-none">Network Latency</p>
                                        <p className="text-xs font-black text-emerald-600 uppercase">Safe Transit</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-2">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] font-mono truncate max-w-[180px]">
                                        {item.tracking_id || 'LOG-SECURED-INTERNAL'}
                                    </p>
                                    <button className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-emerald-600 transition-colors group/btn">
                                        Summary
                                        <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-gray-50 text-gray-400 rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 hover:text-white transition-all active:scale-[0.98] border border-gray-100">
                                <Download size={14} />
                                Export Manifest
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[4rem] p-24 border-4 border-dashed border-gray-100 text-center space-y-6 flex flex-col items-center animate-pulse">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200">
                        <Box size={48} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xl font-black text-gray-900 uppercase tracking-tight">Archive Empty</p>
                        <p className="text-xs font-bold text-gray-400 max-w-xs mx-auto">No records found matching your search parameters. Complete more assignments to build history.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryHistory;
