import React, { useState } from 'react';
import { Bot, Link as LinkIcon, Zap, Share2, Save, CheckCircle2, Facebook, Search, Settings } from 'lucide-react';

const AIAgentSettings = () => {
    const [activeTab, setActiveTab] = useState('ai_models');

    return (
        <div className="max-w-[1200px] mx-auto pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Bot className="text-emerald-500" /> AI & Automation Settings
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Configure your AI agent, Webhooks, and Ads API connections.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-colors shadow-sm">
                    <Save size={16} /> Save Changes
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center bg-white rounded-xl border border-gray-100 p-1.5 shadow-sm overflow-x-auto w-fit mb-6">
                <button
                    onClick={() => setActiveTab('ai_models')}
                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${activeTab === 'ai_models' ? 'bg-[#f0f9f4] text-emerald-600' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    <Bot size={16} /> AI Models (OpenAI/Anthropic)
                </button>
                <button
                    onClick={() => setActiveTab('automation')}
                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${activeTab === 'automation' ? 'bg-[#f0f9f4] text-emerald-600' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    <Share2 size={16} /> Automation (n8n / Make)
                </button>
                <button
                    onClick={() => setActiveTab('ads')}
                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${activeTab === 'ads' ? 'bg-[#f0f9f4] text-emerald-600' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    <Zap size={16} /> Ads Integration
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="xl:col-span-2 space-y-6">

                    {/* Render Tab Contents */}
                    {activeTab === 'ai_models' && (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <h3 className="font-semibold text-gray-800 text-lg">AI Provider Configuration</h3>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase rounded-md text-emerald-600 bg-emerald-50">
                                    <CheckCircle2 size={14} /> Active
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">OpenAI API Key</label>
                                    <input type="password" placeholder="sk-..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20" defaultValue="sk-proj-jdf8934hf893hf83j" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Anthropic API Key (Claude)</label>
                                    <input type="password" placeholder="sk-ant-..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Default Model</label>
                                        <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500">
                                            <option>GPT-4o</option>
                                            <option>GPT-4 Turbo</option>
                                            <option>Claude 3.5 Sonnet</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Agent Context Identity</label>
                                        <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" defaultValue="Customer Support & Sales Agent" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'automation' && (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6 flex flex-col items-start w-full">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4 w-full">
                                <h3 className="font-semibold text-gray-800 text-lg">Webhooks & Workflows</h3>
                            </div>

                            {/* n8n Form */}
                            <div className="w-full p-5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-rose-500 text-white flex items-center justify-center font-bold">n8n</div>
                                    <h4 className="font-semibold text-gray-800">n8n Integration</h4>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Webhook URL (Order Triggers)</label>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="https://your-n8n-instance.com/webhook/orders" className="flex-1 px-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500" />
                                        <button className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition">Test</button>
                                    </div>
                                </div>
                            </div>

                            {/* Make.com Form */}
                            <div className="w-full p-5 rounded-lg border border-gray-100 bg-gray-50/50 space-y-4 mt-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-indigo-600 text-white flex items-center justify-center font-bold">M</div>
                                    <h4 className="font-semibold text-gray-800">Make.com (Integromat)</h4>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Scenario Webhook</label>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="https://hook.us1.make.com/xxxxxx" className="flex-1 px-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500" />
                                        <button className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition">Test</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ads' && (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <h3 className="font-semibold text-gray-800 text-lg">Marketing Ads Automation</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Facebook */}
                                <div>
                                    <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                                        <Facebook className="text-blue-600" size={18} /> Meta (Facebook) Ads API
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" placeholder="Access Token" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                                        <input type="text" placeholder="Pixel ID" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                                    </div>
                                </div>

                                <div className="w-full h-px bg-gray-100"></div>

                                {/* Google Ads */}
                                <div>
                                    <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                                        <Search className="text-red-500" size={18} /> Google Ads API
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" placeholder="Developer Token" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                                        <input type="text" placeholder="Customer ID (MCC)" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                                    </div>
                                    <div className="mt-3 text-xs text-gray-500 flex items-center gap-1.5 bg-blue-50 text-blue-700 p-2.5 rounded border border-blue-100">
                                        <Settings size={14} /> The AI Agent uses these to automatically pause/scale campaigns based on store revenue metrics.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Right Sidebar Status Cards */}
                <div className="space-y-6">
                    <div className="bg-[#18b38a] rounded-xl shadow-md text-white p-6 relative overflow-hidden">
                        {/* Decorative background circle */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative z-10 space-y-4">
                            <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><Bot size={20} /> Agent Status</h3>
                            <div className="flex items-center justify-between pb-3 border-b border-white/20">
                                <span className="text-sm font-medium opacity-90">Auto-Responder</span>
                                <span className="px-2 py-0.5 bg-white text-emerald-600 font-bold text-xs rounded-full">ACTIVE</span>
                            </div>
                            <div className="flex items-center justify-between pb-3 border-b border-white/20">
                                <span className="text-sm font-medium opacity-90">Ads Optimizer</span>
                                <span className="px-2 py-0.5 bg-white text-emerald-600 font-bold text-xs rounded-full">ACTIVE</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium opacity-90">Inventory Sync</span>
                                <span className="px-2 py-0.5 bg-white/20 text-white font-bold text-xs rounded-full">PAUSED</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-4 text-sm">Integration Logs</h3>
                        <div className="space-y-3 relative">
                            {/* Line connecting the steps */}
                            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-100"></div>

                            <div className="relative flex items-start gap-4">
                                <span className="w-4 h-4 rounded-full bg-emerald-500 shrink-0 mt-1 shadow-[0_0_0_3px_#f0f9f4]"></span>
                                <div>
                                    <p className="text-xs font-semibold text-gray-800">Order successfully synced to n8n</p>
                                    <p className="text-[10px] text-gray-400">2 minutes ago</p>
                                </div>
                            </div>
                            <div className="relative flex items-start gap-4">
                                <span className="w-4 h-4 rounded-full bg-blue-500 shrink-0 mt-1 shadow-[0_0_0_3px_#eff6ff]"></span>
                                <div>
                                    <p className="text-xs font-semibold text-gray-800">Meta Pixel conversion fired</p>
                                    <p className="text-[10px] text-gray-400">1 hour ago</p>
                                </div>
                            </div>
                            <div className="relative flex items-start gap-4">
                                <span className="w-4 h-4 rounded-full bg-emerald-500 shrink-0 mt-1 shadow-[0_0_0_3px_#f0f9f4]"></span>
                                <div>
                                    <p className="text-xs font-semibold text-gray-800">Support ticket answered by AI</p>
                                    <p className="text-[10px] text-gray-400">3 hours ago</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full py-2 mt-4 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                            View All Logs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAgentSettings;
