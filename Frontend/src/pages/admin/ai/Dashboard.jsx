import React from 'react';
import { Bot, MessageSquare, Megaphone, Workflow, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

const AIDashboard = () => {
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
                            <ArrowUpRight size={14} /> 12%
                        </span>
                    </div>
                    <div>
                        <h4 className="text-gray-500 text-sm font-medium mb-1">Chats Handled by AI</h4>
                        <h2 className="text-2xl font-bold text-gray-800">1,248</h2>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <Megaphone size={20} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">
                            <ArrowUpRight size={14} /> 8%
                        </span>
                    </div>
                    <div>
                        <h4 className="text-gray-500 text-sm font-medium mb-1">AI Ad Conversions</h4>
                        <h2 className="text-2xl font-bold text-gray-800">842</h2>
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
                        <h2 className="text-2xl font-bold text-gray-800">5,433</h2>
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
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0"><MessageSquare size={14} /></div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Replied to Support Ticket #1024</p>
                                <p className="text-xs text-gray-500">"Your order has shipped..." • 2 mins ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"><Megaphone size={14} /></div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Scaled Facebook Campaign "Summer Sale"</p>
                                <p className="text-xs text-gray-500">ROAS reached target 3.5x • 15 mins ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0"><Workflow size={14} /></div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Triggered Make.com scenario (Order #ORD-991)</p>
                                <p className="text-xs text-gray-500">Inventory deduction synced • 1 hour ago</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Integration Health */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-full">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                        <h3 className="font-semibold text-gray-800">Integration Health</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-3">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" alt="OpenAI" className="w-6 h-6" />
                                <span className="text-sm font-semibold text-gray-700">OpenAI API (GPT-4o)</span>
                            </div>
                            <span className="text-emerald-500"><CheckCircle2 size={18} /></span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white"><Megaphone size={12} /></div>
                                <span className="text-sm font-semibold text-gray-700">Meta Ads API</span>
                            </div>
                            <span className="text-emerald-500"><CheckCircle2 size={18} /></span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-red-100 bg-red-50 text-red-800">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-rose-500 flex items-center justify-center text-white font-bold text-[10px]">n8n</div>
                                <span className="text-sm font-semibold">n8n Webhook</span>
                            </div>
                            <span className="text-red-500 flex items-center gap-1 text-xs font-bold"><AlertCircle size={14} /> Disconnected</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AIDashboard;
