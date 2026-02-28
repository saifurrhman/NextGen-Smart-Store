import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, Megaphone, Workflow, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../../utils/api';

const AIDashboard = () => {
    const [stats, setStats] = useState({
        chatsHandled: 0,
        chatsGrowth: 0,
        adConversions: 0,
        adGrowth: 0,
        triggers: 0
    });
    const [logs, setLogs] = useState([]);
    const [systemStatus, setSystemStatus] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, logsRes, statusRes] = await Promise.all([
                    api.get('/api/v1/ai-automation/stats/'),
                    api.get('/api/v1/ai-automation/logs/'),
                    api.get('/api/v1/ai-automation/status/')
                ]);

                setStats(statsRes.data);
                setLogs(logsRes.data.results || logsRes.data);
                setSystemStatus(statusRes.data.results || statusRes.data);
            } catch (error) {
                console.error("Error fetching AI Dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const getTimeAgo = (timestamp) => {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        if (seconds < 60) return `${seconds} secs ago`;
        const mins = Math.floor(seconds / 60);
        if (mins < 60) return `${mins} mins ago`;
        const hours = Math.floor(mins / 60);
        return `${hours} hours ago`;
    };

    return (
        <div className="max-w-7xl mx-auto pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Bot className="text-emerald-500" /> AI Command Center
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Overview of your automated agents, chatbot performance, and ad integrations.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Stat Cards */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <MessageSquare size={20} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">
                            <ArrowUpRight size={14} /> {stats.chatsGrowth}%
                        </span>
                    </div>
                    <div>
                        <h4 className="text-gray-500 text-sm font-medium mb-1">Chats Handled by AI</h4>
                        <h2 className="text-2xl font-bold text-gray-800">{stats.chatsHandled.toLocaleString()}</h2>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <Megaphone size={20} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">
                            <ArrowUpRight size={14} /> {stats.adGrowth}%
                        </span>
                    </div>
                    <div>
                        <h4 className="text-gray-500 text-sm font-medium mb-1">AI Ad Conversions</h4>
                        <h2 className="text-2xl font-bold text-gray-800">{stats.adConversions.toLocaleString()}</h2>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                            <Workflow size={20} />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-gray-500 text-sm font-medium mb-1">n8n/Make Triggers</h4>
                        <h2 className="text-2xl font-bold text-gray-800">{stats.triggers.toLocaleString()}</h2>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 shadow-md text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 space-y-4 h-full flex flex-col justify-center">
                        <div className="flex items-center gap-2">
                            <Bot size={24} />
                            <h3 className="font-bold text-lg">System Status</h3>
                        </div>
                        <div>
                            <p className="text-sm font-medium opacity-90 mb-1">All AI Agents Operational</p>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase rounded-md bg-white/20">
                                <CheckCircle2 size={14} /> Healthy
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live System Activity Log */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-full">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                        <h3 className="font-semibold text-gray-800">Live AI Activity Log</h3>
                    </div>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="animate-pulse space-y-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-100 rounded"></div>)}
                            </div>
                        ) : logs.length > 0 ? (
                            logs.map((log) => (
                                <div key={log.id} className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${log.activity_type === 'support' ? 'bg-emerald-50 text-emerald-600' :
                                        log.activity_type === 'marketing' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                        }`}>
                                        {log.activity_type === 'support' ? <MessageSquare size={14} /> :
                                            log.activity_type === 'marketing' ? <Megaphone size={14} /> : <Workflow size={14} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{log.action}</p>
                                        <p className="text-xs text-gray-500">{log.details} • {getTimeAgo(log.timestamp)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 italic">No activity logs found.</p>
                        )}
                    </div>
                </div>

                {/* Integration Health */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-full">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                        <h3 className="font-semibold text-gray-800">Integration Health</h3>
                    </div>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="animate-pulse space-y-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded"></div>)}
                            </div>
                        ) : systemStatus.length > 0 ? (
                            systemStatus.map((status) => (
                                <div key={status.id} className={`flex items-center justify-between p-3 rounded-lg border ${status.status === 'healthy' ? 'border-gray-100 bg-gray-50' :
                                    status.status === 'warning' ? 'border-amber-100 bg-amber-50 text-amber-800' : 'border-red-100 bg-red-50 text-red-800'
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded flex items-center justify-center text-white ${status.agent_name.includes('OpenAI') ? 'bg-emerald-600' :
                                            status.agent_name.includes('Meta') ? 'bg-blue-600' : 'bg-rose-500'
                                            }`}>
                                            {status.agent_name.includes('n8n') ? <span className="font-bold text-[10px]">n8n</span> :
                                                status.agent_name.includes('OpenAI') ? <Bot size={12} /> : <Megaphone size={12} />}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">{status.agent_name}</span>
                                    </div>
                                    <span className={`${status.status === 'healthy' ? 'text-emerald-500' :
                                        status.status === 'warning' ? 'text-amber-500' : 'text-red-500'
                                        } flex items-center gap-1 text-xs font-bold uppercase`}>
                                        {status.status === 'healthy' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                        {status.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 italic">No integration status found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AIDashboard;
