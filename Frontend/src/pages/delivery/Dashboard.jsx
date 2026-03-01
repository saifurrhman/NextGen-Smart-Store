import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, TrendingUp, Clock, ChevronRight, Zap, Target, Star } from 'lucide-react';
import api from '../../utils/api';

const DeliveryDashboard = () => {
    const [stats, setStats] = useState({
        pending: 0,
        completed: 0,
        earnings: 0
    });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tasksRes, profileRes] = await Promise.all([
                api.get('/api/v1/operations/delivery/my-tasks/'),
                api.get('/api/v1/users/profile/')
            ]);

            setUser(profileRes.data);
            const tasks = tasksRes.data;
            setStats({
                pending: tasks.filter(t => t.status !== 'DELIVERED').length,
                completed: tasks.filter(t => t.status === 'DELIVERED').length,
                earnings: tasks.filter(t => t.status === 'DELIVERED').length * 150 // Mock earnings per delivery
            });
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const StatusCard = ({ icon: Icon, label, value, color, bg }) => (
        <div className={`relative overflow-hidden bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/20 transition-all group active:scale-[0.98]`}>
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full ${bg} opacity-10 group-hover:scale-110 transition-transform duration-500`}></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center shadow-lg shadow-gray-100 border border-white`}>
                    <Icon size={24} strokeWidth={2.5} />
                </div>
                <div className="mt-8">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{label}</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">{value}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Greeting & Quick Action */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        <Zap size={12} className="text-emerald-600 fill-emerald-600" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">System Active</span>
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-none uppercase">
                        Hi, {user?.username || 'Specialist'}
                    </h2>
                    <p className="text-xs font-bold text-gray-400 max-w-xs">You have {stats.pending} operations pending your attention in the field.</p>
                </div>

                <div className="flex items-center gap-3 p-2 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                        <Target size={20} />
                    </div>
                    <div className="pr-6">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Current Session</p>
                        <p className="text-xs font-black text-emerald-600 uppercase">On Duty • Live OS</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatusCard
                    icon={Clock}
                    label="Pending Tasks"
                    value={stats.pending}
                    color="text-amber-600"
                    bg="bg-amber-50"
                />
                <StatusCard
                    icon={Package}
                    label="Active Transit"
                    value="2"
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <StatusCard
                    icon={CheckCircle}
                    label="Completed"
                    value={stats.completed}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                />
                <div className="relative overflow-hidden bg-emerald-600 p-6 rounded-[2.5rem] shadow-2xl shadow-emerald-200 border border-emerald-500 group transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full bg-white opacity-10 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white border border-white/30 backdrop-blur-sm">
                            <TrendingUp size={24} strokeWidth={2.5} />
                        </div>
                        <div className="mt-8 text-white">
                            <p className="text-[10px] font-black opacity-70 uppercase tracking-[0.2em] mb-1">Estimated Revenue</p>
                            <p className="text-3xl font-black tracking-tighter">Rs.{stats.earnings.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20 lg:pb-0">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-black text-gray-900 tracking-tighter uppercase">Recent Operations</h3>
                        <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Internal Logs</button>
                    </div>

                    <div className="space-y-4">
                        {[4211, 4212].map((id) => (
                            <div key={id} className="group flex items-center justify-between p-5 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/20 transition-all">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600 group-hover:bg-emerald-50 transition-colors border border-gray-100 group-hover:border-emerald-100">
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 tracking-tight leading-none mb-1">ORDER #{id} • SUCCESSFUL</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Verified 24 Feb • 14:30 PM</p>
                                    </div>
                                </div>
                                <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-emerald-100 active:scale-90">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6 text-center lg:text-left">
                    <h3 className="text-lg font-black text-gray-900 tracking-tighter uppercase px-2">Performance IQ</h3>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-10 -mt-10 opacity-50"></div>

                        <div className="relative flex flex-col items-center lg:items-start gap-4">
                            <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                <Star size={10} className="fill-emerald-600 text-emerald-600" />
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-mono">Specialist Rating</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Efficiency Metric</p>
                                <p className="text-4xl font-black text-gray-900 tracking-tighter">4.95 / 5.0</p>
                            </div>
                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                                <div className="bg-emerald-600 h-full w-[95%] rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Based on latest performance logs</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDashboard;
