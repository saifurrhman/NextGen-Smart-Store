import React, { useState } from 'react';
import { Bot, Link as LinkIcon, Zap, Share2, Save, CheckCircle2, Facebook, Search, Settings, AlertCircle } from 'lucide-react';

const Integrations = () => {
    const [activeTab, setActiveTab] = useState('ai_models');

    return (
        <div className="max-w-[1200px] mx-auto pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <LinkIcon className="text-emerald-500" /> API & Integrations
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Configure your AI providers, Webhooks, and Ads API connections.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-colors shadow-sm">
                    <Save size={16} /> Save Integrations
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
                                    <CheckCircle2 size={14} /> Connected
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
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Default Model Engine</label>
                                        <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500">
                                            <option>GPT-4o (Recommended)</option>
                                            <option>GPT-4 Turbo</option>
                                            <option>Claude 3.5 Sonnet</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Global Temperature</label>
                                        <input type="number" step="0.1" min="0" max="1" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" defaultValue="0.7" />
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
                                    <div className="w-8 h-8 rounded bg-rose-500 text-white flex items-center justify-center font-bold relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center">n8n</div>
                                    </div>
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
                                    <div className="w-8 h-8 rounded bg-[#1f2023] text-white flex items-center justify-center font-bold">M</div>
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
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-8 h-full">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <h3 className="font-semibold text-gray-800 text-lg">Marketing Ads Setup & Automation</h3>
                            </div>

                            <div className="space-y-8">
                                {/* Facebook */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="flex items-center gap-2 font-bold text-gray-800">
                                            <Facebook className="text-blue-600" size={20} /> Meta (Facebook & Instagram)
                                        </h4>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="toggle" id="toggle-fb" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:border-emerald-500 checked:right-0 checked:bg-emerald-500 transition-all duration-300" defaultChecked />
                                            <label htmlFor="toggle-fb" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Access Token</label>
                                            <input type="password" placeholder="EAAB..." className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" defaultValue="EAAB2h3x..." />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Pixel / Ad Account ID</label>
                                            <input type="text" placeholder="1029384756" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" defaultValue="9483726154" />
                                        </div>
                                    </div>
                                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg">
                                        <h5 className="text-xs font-bold text-blue-800 mb-3 uppercase tracking-wide">Run Campaign via AI</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Objective</label>
                                                <select className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:border-emerald-500">
                                                    <option>Sales (Conversions)</option>
                                                    <option>Website Traffic</option>
                                                    <option>Lead Generation</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Max Daily Budget ($)</label>
                                                <input type="number" defaultValue="50" className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:border-emerald-500" />
                                            </div>
                                            <div className="flex items-end">
                                                <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition">Launch Smart Ad</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-gray-100"></div>

                                {/* Google Ads */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="flex items-center gap-2 font-bold text-gray-800">
                                            <Search className="text-red-500" size={20} /> Google Ads
                                        </h4>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="toggle" id="toggle-google" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300" />
                                            <label htmlFor="toggle-google" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Developer Token</label>
                                            <input type="password" placeholder="Token" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Customer ID (MCC)</label>
                                            <input type="text" placeholder="123-456-7890" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                                        </div>
                                    </div>
                                    <div className="bg-red-50/50 border border-red-100 p-4 rounded-lg opacity-60">
                                        <h5 className="text-xs font-bold text-red-800 mb-3 uppercase tracking-wide">Run Campaign via AI</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Objective</label>
                                                <select className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:border-emerald-500">
                                                    <option>Performance Max</option>
                                                    <option>Search Network</option>
                                                    <option>Display Network</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Target ROAS (%)</label>
                                                <input type="number" defaultValue="300" className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:border-emerald-500" />
                                            </div>
                                            <div className="flex items-end">
                                                <button className="w-full px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition">Launch Smart Ad</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1.5 px-1 pb-2">
                                        <Settings size={14} /> Enter your Developer Token and MCC ID to launch and automate Google Campaigns.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Right Sidebar Status Cards */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-4 text-sm">Connection Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">OpenAI Servers</span>
                                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1"><CheckCircle2 size={12} /> Online</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Meta Graph API</span>
                                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1"><CheckCircle2 size={12} /> Online</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">n8n Cloud</span>
                                <span className="text-xs font-bold text-amber-500 flex items-center gap-1"><AlertCircle size={12} /> Waiting</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Integrations;
