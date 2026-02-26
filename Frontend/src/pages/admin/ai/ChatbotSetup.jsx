import React from 'react';
import { MessageSquare, Save, Settings, Upload, Eye } from 'lucide-react';

const ChatbotSetup = () => {
    return (
        <div className="max-w-7xl mx-auto pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <MessageSquare className="text-emerald-500" /> Chatbot Configuration
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Design, train, and deploy your customer-facing AI Assistant.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-colors shadow-sm">
                    <Save size={16} /> Deploy Changes
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Configuration Panel */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Appearance */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
                        <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2"><Settings size={18} /> Appearance & Identity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Bot Name</label>
                                <input type="text" defaultValue="NextGen Assistant" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Color</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" defaultValue="#10b981" className="w-10 h-10 border-0 p-0 rounded cursor-pointer" />
                                    <span className="text-sm font-medium text-gray-600">#10b981 (Emerald)</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Welcome Message</label>
                            <textarea rows="3" defaultValue="Hi there! 👋 I'm the NextGen Assistant. How can I help you with your shopping today?" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"></textarea>
                        </div>
                    </div>

                    {/* AI Model & Knowledge */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
                        <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2"><Upload size={18} /> Training & Knowledge Base</h3>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">System Instruction (Prompt)</label>
                            <textarea rows="4" defaultValue="You are a helpful customer support agent for NextGen Store. You recommend products, check order statuses, and assist with returns. Always be polite and keep answers concise." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-gray-50"></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Data Sources</label>
                            <div className="flex items-center gap-3 w-full p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 justify-center hover:bg-emerald-50 hover:border-emerald-300 transition-colors cursor-pointer group">
                                <Upload size={20} className="text-gray-400 group-hover:text-emerald-500" />
                                <span className="text-sm font-medium text-gray-600 group-hover:text-emerald-700">Upload PDF Policies or Website URLs for Context</span>
                            </div>
                            <div className="mt-3 flex gap-2 w-full">
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">Store_Return_Policy.pdf</span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">Product_Catalog_2026.csv</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Preview Panel */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[500px] sticky top-24">
                    <div className="p-4 bg-emerald-500 text-white flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-lg">N</div>
                        <div>
                            <h3 className="font-bold">NextGen Assistant</h3>
                            <p className="text-xs text-emerald-100">Typically replies instantly</p>
                        </div>
                    </div>

                    <div className="flex-1 bg-gray-50 p-4 overflow-y-auto w-full flex flex-col gap-4">
                        <div className="flex gap-3 w-3/4">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">N</div>
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700">
                                Hi there! 👋 I'm the NextGen Assistant. How can I help you with your shopping today?
                            </div>
                        </div>
                        <div className="flex gap-3 w-3/4 self-end flex-row-reverse">
                            <div className="bg-emerald-500 text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-sm">
                                Track my order #ORD-1029 please.
                            </div>
                        </div>
                        <div className="flex gap-3 w-3/4">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">N</div>
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700">
                                Let me check that for you! 📦 Your order #ORD-1029 is currently marked as 'Shipped' and is expected to reach you by Friday.
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                        <input type="text" placeholder="Type a message..." disabled className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm bg-gray-50" />
                        <button disabled className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white opacity-50"><MessageSquare size={16} /></button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ChatbotSetup;
