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
            const response = await api.get('operations/delivery/my-tasks/');
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
            await api.patch(`operations/delivery/${taskId}/`, { status: newStatus });
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
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] animate-pulse">Syncing Dispatch Center...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Field Deployment</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight uppercase">Current Tasks</h2>
                    <p className="text-sm text-gray-500 mt-1">{tasks.length} operations requiring mobilization</p>
                </div>

                <button
                    onClick={fetchTasks}
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:bg-gray-50 active:scale-95 group"
                >
                    <RefreshCw size={16} className={`text-emerald-600 ${loading ? 'animate-spin' : ''}`} />
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Refresh Logs</span>
                </button>
            </div>

            {tasks.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 border-2 border-dashed border-gray-100 text-center space-y-4 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200">
                        <Box size={40} />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-gray-800 uppercase tracking-tight">Sector Clear</p>
                        <p className="text-sm text-gray-400 max-w-xs mx-auto">No pending assignments found in your current vector. Standby for new updates.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                        <div key={task.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/20 transition-all flex flex-col overflow-hidden">
                            {/* Card Header */}
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Tracking ID</p>
                                    <p className="text-lg font-bold text-emerald-700 tracking-tight italic font-mono">{task.tracking_id}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border shadow-sm ${task.status === 'in_transit'
                                    ? 'bg-blue-600 text-white border-blue-500'
                                    : 'bg-amber-500 text-white border-amber-400'
                                    }`}>
                                    {task.status?.replace('_', ' ')}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 space-y-5 flex-1">
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0">
                                            <Package size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Shipment</p>
                                            <p className="text-base font-bold text-gray-800 tracking-tight uppercase">ORDER #{task.order_id}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100 shrink-0">
                                            <MapPin size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Destination</p>
                                            <p className="text-sm font-medium text-gray-700 leading-snug italic">{task.destination_address || task.address || 'Standard Protocol Vector'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center border border-gray-100 text-emerald-600">
                                            <Zap size={12} className="fill-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
                                            <p className="text-[10px] font-bold text-gray-800 uppercase">Operational</p>
                                        </div>
                                    </div>
                                    <div className="h-8 w-px bg-gray-200"></div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Estimate</p>
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">On Schedule</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-6 pt-0 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98]">
                                        <Phone size={14} fill="currentColor" />
                                        Call
                                    </button>

                                    {task.status === 'pending' && (
                                        <button
                                            disabled={updating}
                                            onClick={() => handleStatusUpdate(task.id, 'in_transit')}
                                            className="py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-[0.98]"
                                        >
                                            <Navigation size={14} fill="currentColor" />
                                            Dispatch
                                        </button>
                                    )}

                                    {task.status === 'in_transit' && (
                                        <button
                                            disabled={updating}
                                            onClick={() => handleStatusUpdate(task.id, 'delivered')}
                                            className="py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-[0.98]"
                                        >
                                            <CheckCircle size={14} fill="currentColor" />
                                            Complete
                                        </button>
                                    )}
                                </div>
                                <button className="w-full py-2.5 bg-white text-gray-500 border border-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-gray-800 transition-all active:scale-[0.98]">
                                    <ExternalLink size={14} />
                                    Open Navigation
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
