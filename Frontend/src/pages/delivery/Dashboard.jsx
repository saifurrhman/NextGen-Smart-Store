import React, { useState, useEffect } from 'react';
import {
    Package, CheckCircle, TrendingUp, Clock, ChevronRight,
    Zap, Target, Star, MapPin, RefreshCcw
} from 'lucide-react';
import api from '../../utils/api';

const DeliveryDashboard = () => {
    const [stats, setStats] = useState({
        pending: 0,
        transit: 0,
        completed: 0,
        earnings: 0
    });
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [currentSector, setCurrentSector] = useState('Sector 7-G, central');

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Auto-refresh every minute
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [tasksRes, profileRes] = await Promise.all([
                api.get('operations/delivery/my-tasks/'),
                api.get('users/profile/')
            ]);

            setUser(profileRes.data);
            const tasks = tasksRes.data;

            setRecentTasks(tasks.slice(0, 5));
            setStats({
                pending: tasks.filter(t => t.status === 'PENDING' || t.status === 'ASSIGNED').length,
                transit: tasks.filter(t => t.status === 'IN_TRANSIT').length,
                completed: tasks.filter(t => t.status === 'DELIVERED').length,
                earnings: tasks.filter(t => t.status === 'DELIVERED').length * 150
            });

            // Set current sector from user profile or active task
            const activeTask = tasks.find(t => t.status === 'in_transit');
            if (activeTask && activeTask.destination_address) {
                setCurrentSector(activeTask.destination_address);
            } else if (profileRes.data.address) {
                setCurrentSector(profileRes.data.address);
            }

            setLastUpdated(new Date());
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSector = async () => {
        const newSector = prompt("Enter your new Deployment Sector:", currentSector);
        if (newSector && newSector !== currentSector) {
            try {
                setLoading(true);
                await api.patch('users/profile/', { address: newSector });
                setCurrentSector(newSector);
                alert("Sector updated successfully!");
                fetchData();
            } catch (error) {
                console.error("Update sector error:", error);
                alert("Failed to update sector. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const StatusCard = ({ icon: Icon, label, value, color, growth, suffix = "" }) => (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative group hover:shadow-md transition-all duration-300">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</h3>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{value}{suffix}</h2>
                    {growth && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${color === 'text-emerald-500' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'}`}>
                            {growth}
                        </span>
                    )}
                </div>
                <div className={`p-2 rounded-lg bg-gray-50 ${color} group-hover:scale-110 transition-transform`}>
                    <Icon size={18} />
                </div>
            </div>
            <div className="w-full bg-gray-50 h-1 rounded-full overflow-hidden mt-4">
                <div className={`h-full rounded-full w-2/3 ${color.replace('text-', 'bg-')}`}></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Analytics Overview</h1>
                    <div className="flex items-center gap-3 mt-1.5">
                        <p className="text-sm text-gray-500">System status synchronized at {lastUpdated.toLocaleTimeString()}</p>
                        <div className="h-4 w-px bg-gray-200"></div>
                        <button
                            onClick={fetchData}
                            className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                            <RefreshCcw size={12} className={loading ? 'animate-spin' : ''} />
                            Force Refresh
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
                        <MapPin size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Deployment Sector</p>
                        <p className="text-sm font-bold text-gray-800">{currentSector}</p>
                    </div>
                    <button
                        onClick={handleUpdateSector}
                        className="ml-2 text-[10px] font-bold text-emerald-600 underline uppercase tracking-tighter"
                    >
                        Update
                    </button>
                </div>
            </div>

            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatusCard
                    icon={Clock}
                    label="Pending Mobile Tasks"
                    value={stats.pending}
                    color="text-amber-500"
                    growth="Live Sync"
                />
                <StatusCard
                    icon={Package}
                    label="Active In-Transit"
                    value={stats.transit}
                    color="text-blue-500"
                    growth="On Route"
                />
                <StatusCard
                    icon={CheckCircle}
                    label="Operations Completed"
                    value={stats.completed}
                    color="text-emerald-500"
                    growth="Verified"
                />
                <StatusCard
                    icon={TrendingUp}
                    label="Total Net Earnings"
                    value={stats.earnings.toLocaleString()}
                    suffix=" PKR"
                    color="text-emerald-600"
                    growth="Net Payout"
                />
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Operations (Admin Style Table) */}
                <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 tracking-tight">Operation Logs</h3>
                        <button className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest border border-emerald-100 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-all">Export Report</button>
                    </div>

                    <div className="flex-1 overflow-x-auto min-h-[300px]">
                        <table className="w-full text-xs text-left">
                            <thead className="text-gray-400 font-bold uppercase tracking-widest border-b border-gray-50">
                                <tr>
                                    <th className="pb-4 px-2">Tracking ID</th>
                                    <th className="pb-4 px-2">Mobilization</th>
                                    <th className="pb-4 px-2">Current Phase</th>
                                    <th className="pb-4 px-2 text-right opacity-0">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {recentTasks.length > 0 ? recentTasks.map((task) => (
                                    <tr key={task.id} className="border-b border-gray-50/50 hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-2 font-bold text-[13px] tracking-tight">#{task.order_id || task.id}</td>
                                        <td className="py-4 px-2 text-gray-500 font-medium">
                                            {task.created_at ? new Date(task.created_at).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="py-4 px-2">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase ${task.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                <div className={`w-1 h-1 rounded-full ${task.status === 'DELIVERED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2 text-right">
                                            <button className="p-2 bg-gray-50 text-gray-400 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                                <ChevronRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="py-20 text-center text-gray-400 italic">No recent operation logs detected.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance Sidebar (Admin Widget Style) */}
                <div className="space-y-6">
                    {/* Professional Map/Location Widget */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <MapPin size={80} />
                        </div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Live Deployment</h3>
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-800 leading-tight">Operating Sector</p>
                                <p className="text-sm text-emerald-600 font-medium">{currentSector}</p>
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl space-y-2 mb-6">
                            <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400">
                                <span>Signal Strength</span>
                                <span className="text-emerald-500">Optimal</span>
                            </div>
                            <div className="flex gap-1 h-1">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="flex-1 bg-emerald-500 rounded-full"></div>)}
                            </div>
                        </div>
                        <button
                            onClick={handleUpdateSector}
                            className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all"
                        >
                            Change Sector
                        </button>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Performance Hub</h3>
                                <Zap size={14} className="text-amber-500 fill-amber-500" />
                            </div>
                            <div className="p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl text-white shadow-xl shadow-emerald-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <Star size={14} className="fill-white" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Specialist Rating</span>
                                </div>
                                <h2 className="text-3xl font-bold mb-1 tracking-tight">4.95</h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-90">Elite Performance Level</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
                                <span className="text-gray-400">Fulfillment IQ</span>
                                <span className="text-emerald-600">95%</span>
                            </div>
                            <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden border border-gray-100">
                                <div className="bg-emerald-500 h-full rounded-full w-[95%] shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                                    <Target size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Status</p>
                                    <p className="text-xs font-bold text-gray-800 italic">Sector Priority Protocol</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDashboard;
