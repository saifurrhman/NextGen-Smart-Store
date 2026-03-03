import React, { useState, useEffect } from 'react';
import { History, Search, Calendar, Package, ArrowRight, Filter, Zap, ShieldCheck, Box, ChevronRight, Download, Database, Target } from 'lucide-react';
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
            const response = await api.get('operations/delivery/my-tasks/?include_history=true');
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

    const stats = {
        total: history.length,
        delivered: history.filter(i => i.status === 'delivered').length,
        efficiency: history.length > 0 ? '98.5%' : '---',
        avgTime: history.length > 0 ? '24m' : '---'
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-10">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Service Archive</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight uppercase">Operation Logs</h2>
                    <p className="text-sm text-gray-500 mt-1">Audit trail of all verified specialist assignments</p>
                </div>

                <div className="relative group w-full md:w-96">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search logs by tracking id..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-200 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Archived Logs', val: stats.total, icon: Database, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Completion Rate', val: stats.efficiency, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Total Delivered', val: stats.delivered, icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Avg Latency', val: stats.avgTime, icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' }
                ].map((s, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center border border-white shrink-0`}>
                            <s.icon size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 leading-none">{s.label}</p>
                            <p className="text-lg font-bold text-gray-800 tracking-tight">{s.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-64 bg-white animate-pulse rounded-2xl border border-gray-100 shadow-sm"></div>
                    ))}
                </div>
            ) : filteredHistory.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredHistory.map((item) => (
                        <div key={item.id} className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:shadow-gray-200/20 transition-all flex flex-col space-y-5">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Record ID</p>
                                        <p className="text-lg font-bold text-gray-800 tracking-tight italic">#{item.order_id || item.id.substring(0, 8)}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-1.5 bg-emerald-500 px-2.5 py-1 rounded-lg shadow-lg shadow-emerald-100">
                                        <ShieldCheck size={10} className="text-white fill-white" />
                                        <span className="text-[9px] font-bold text-white uppercase tracking-wider">Verified</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                                        {item.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-gray-500 font-medium">
                                        <Calendar size={14} />
                                        <span>
                                            {new Date(item.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold uppercase text-[10px]">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                        Standard Route
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-gray-200/50 flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                                        {item.tracking_id || 'INTERNAL-LOG-SEC'}
                                    </span>
                                    <button className="text-[10px] font-bold text-emerald-600 uppercase hover:underline">View Summary</button>
                                </div>
                            </div>

                            <button className="w-full py-2.5 bg-white text-gray-500 hover:text-emerald-600 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-gray-100 hover:border-emerald-100 hover:bg-emerald-50 transition-all active:scale-[0.98]">
                                <Download size={14} />
                                Export Manifest
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="relative">
                        <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-200 relative z-10">
                            <Box size={56} strokeWidth={1.5} />
                        </div>
                        <div className="absolute top-0 right-0 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-emerald-600 -mr-4 -mt-4 border border-emerald-50 animate-bounce">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="absolute -inset-4 bg-emerald-500/5 rounded-full blur-2xl -z-0"></div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-800 tracking-tight uppercase">Secure Archive Empty</h3>
                        <p className="text-sm text-gray-400 max-w-sm mx-auto font-medium">Your operational history is currently clear. Complete and verify new assignments to build your service record.</p>
                    </div>
                    <button onClick={fetchHistory} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95">
                        Refresh Database
                    </button>
                </div>
            )}
        </div>
    );
};

export default DeliveryHistory;
