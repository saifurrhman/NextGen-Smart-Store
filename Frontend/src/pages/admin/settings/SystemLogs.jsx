import React, { useState } from 'react';
import {
    Terminal, Search, Filter, Trash2,
    Home, ChevronRight, AlertCircle, CheckCircle, Clock, Info
} from 'lucide-react';

const SystemLogs = () => {
    const [logs, setLogs] = useState([
        { id: 1, type: 'Info', message: 'Backup system started successfully', user: 'System', time: '10:00:05 AM', date: '2025-03-15' },
        { id: 2, type: 'Warning', message: 'Failed login attempt from IP 182.164.x.x', user: 'Guest', time: '10:15:32 AM', date: '2025-03-15' },
        { id: 3, type: 'Error', message: 'Database connection timeout on query #881', user: 'DB_ADMIN', time: '10:30:11 AM', date: '2025-03-15' },
        { id: 4, type: 'Success', message: 'Product #PRO-122 updated by staff', user: 'Ali Admin', time: '10:45:00 AM', date: '2025-03-15' },
    ]);

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Terminal size={24} className="text-gray-700" />
                        System Activity Logs
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mt-1">
                        <Home size={14} />
                        <ChevronRight size={12} />
                        <span>Settings</span>
                        <ChevronRight size={12} />
                        <span className="text-emerald-500 font-bold">Activity Logs</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg text-sm hover:bg-red-100 transition-all border border-red-100">
                        <Trash2 size={16} /> Clear All Logs
                    </button>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search logs by keyword..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                    {['All', 'Errors', 'Warnings', 'Success', 'Auth'].map(type => (
                        <button key={type} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${type === 'All' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                            }`}>
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Logs Window */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden font-mono">
                <div className="p-4 bg-gray-900 text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span className="ml-2 uppercase tracking-tighter">Live Log Stream</span>
                    </div>
                    <span>March 15, 2025</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 w-12 text-center">Type</th>
                                <th className="px-6 py-4">Event Description</th>
                                <th className="px-6 py-4 w-32">Initiator</th>
                                <th className="px-6 py-4 w-40 text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            {log.type === 'Error' && <AlertCircle size={16} className="text-red-500" />}
                                            {log.type === 'Warning' && <AlertCircle size={16} className="text-amber-500" />}
                                            {log.type === 'Info' && <Info size={16} className="text-blue-500" />}
                                            {log.type === 'Success' && <CheckCircle size={16} className="text-emerald-500" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={`font-bold ${log.type === 'Error' ? 'text-red-600' :
                                                    log.type === 'Warning' ? 'text-amber-600' :
                                                        'text-gray-700'
                                                }`}>{log.message}</span>
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Event ID: log_{log.id}x992</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-gray-500">@{log.user}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">{log.time}</span>
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{log.date}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-gray-50 text-center">
                    <button className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-2 mx-auto transition-all">
                        <Clock size={12} /> View Complete Archives
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemLogs;
