import React, { useState, useEffect } from 'react';
import { Package, MapPin, CheckCircle, Navigation, RefreshCw, Clock, ChevronRight, Zap, Target, Box, Phone, ExternalLink, ShieldCheck } from 'lucide-react';
import api from '../../utils/api';

const DeliveryTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/v1/operations/delivery/my-tasks/');
            setTasks(response.data);
        } catch (error) {
            console.error("Task fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        setUpdating(true);
        try {
            await api.patch(`/api/v1/operations/delivery/${taskId}/`, { status: newStatus });
            fetchTasks();
        } catch (error) {
            alert("Update failed");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Syncing Dispatch Center...</p>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        <Navigation size={12} className="text-blue-600 fill-blue-600" />
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Field Deployment</span>
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-none uppercase">Current Tasks</h2>
                    <p className="text-xs font-bold text-gray-400 max-w-xs">{tasks.length} operations requiring immediate mobilization.</p>
                </div>

                <button
                    onClick={fetchTasks}
                    className="flex items-center gap-3 p-3 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:bg-gray-50 active:scale-95 group"
                >
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-100 group-active:rotate-180 transition-transform duration-500">
                        <RefreshCw size={20} />
                    </div>
                    <span className="pr-4 text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none">Refresh Logs</span>
                </button>
            </div>

            {tasks.length === 0 ? (
                <div className="bg-white rounded-[4rem] p-24 border-4 border-dashed border-gray-100 text-center space-y-6 flex flex-col items-center animate-pulse">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200">
                        <Box size={48} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xl font-black text-gray-900 uppercase tracking-tight">Sector Clear</p>
                        <p className="text-xs font-bold text-gray-400 max-w-xs mx-auto">No pending assignments found in your current vector. Maintain standby status.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-8 pb-20 lg:pb-0">
                    {tasks.map((task) => (
                        <div key={task.id} className="group bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/30 transition-all overflow-hidden flex flex-col flex-1">
                            {/* Card Header */}
                            <div className="p-8 border-b border-gray-50 flex justify-between items-start bg-gray-50/20">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Tracking ID</p>
                                        <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase tracking-tight border border-emerald-100">
                                            Priority
                                        </div>
                                    </div>
                                    <p className="text-xl font-black text-emerald-700 tracking-tighter italic font-mono">{task.tracking_id}</p>
                                </div>
                                <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all ${task.status === 'in_transit'
                                        ? 'bg-blue-600 text-white border-blue-500 shadow-blue-100'
                                        : 'bg-amber-500 text-white border-amber-400 shadow-amber-100'
                                    }`}>
                                    {task.status?.replace('_', ' ')}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-8 space-y-6 flex-1">
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0 border border-gray-100 shadow-sm group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-colors">
                                            <Package size={22} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Shipment Type</p>
                                            <p className="text-lg font-black text-gray-900 tracking-tight leading-none uppercase">ORDER #{task.order_id}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0 border border-gray-100 shadow-sm">
                                            <MapPin size={22} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 leading-none">Field Vector</p>
                                            <p className="text-sm font-bold text-gray-800 leading-relaxed italic">{task.address || 'Standard Delivery Protocol Applied.'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 flex items-center justify-between shadow-inner">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 text-emerald-600">
                                            <Zap size={14} className="fill-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">Status</p>
                                            <p className="text-xs font-black text-gray-900 uppercase">Operational</p>
                                        </div>
                                    </div>
                                    <div className="h-10 w-[2px] bg-gray-200"></div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">Transit Time</p>
                                        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest leading-none">Est. 24m</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Overlay */}
                            <div className="px-8 pb-8 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="py-4 bg-gray-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-gray-200">
                                        <Phone size={14} fill="currentColor" />
                                        Communicate
                                    </button>

                                    {task.status === 'pending' && (
                                        <button
                                            disabled={updating}
                                            onClick={() => handleStatusUpdate(task.id, 'in_transit')}
                                            className="py-4 bg-emerald-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-[0.98]"
                                        >
                                            <Navigation size={14} fill="currentColor" />
                                            Start Transit
                                        </button>
                                    )}

                                    {task.status === 'in_transit' && (
                                        <button
                                            disabled={updating}
                                            onClick={() => handleStatusUpdate(task.id, 'delivered')}
                                            className="py-4 bg-emerald-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-[0.98]"
                                        >
                                            <CheckCircle size={14} fill="currentColor" />
                                            Finalize
                                        </button>
                                    )}
                                </div>
                                <button className="w-full py-4 bg-white text-gray-400 border border-gray-100 rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-[0.98]">
                                    <ExternalLink size={14} />
                                    Launch Navigation Hub
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeliveryTasks;
