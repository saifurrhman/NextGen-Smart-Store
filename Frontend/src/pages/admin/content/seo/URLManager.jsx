import React, { useState } from 'react';
import {
    Link2, Search, Plus, Edit2, Trash2,
    Home, ChevronRight, CheckCircle2, AlertCircle,
    ArrowRight, ExternalLink, RefreshCw
} from 'lucide-react';

const URLManager = () => {
    const [redirects, setRedirects] = useState([
        { id: 1, oldUrl: '/old-gadgets', newUrl: '/shop?category=electronics', type: '301 Permanent', status: 'Active' },
        { id: 2, oldUrl: '/sale-2024', newUrl: '/marketing/promotions', type: '302 Temporary', status: 'Active' },
        { id: 3, oldUrl: '/product/vintage-watch', newUrl: '/products/122', type: '301 Permanent', status: 'Inactive' },
    ]);

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Link2 size={24} className="text-emerald-500" />
                        URL Redirection & Slug Manager
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mt-1">
                        <Home size={14} />
                        <ChevronRight size={12} />
                        <span>SEO Tools</span>
                        <ChevronRight size={12} />
                        <span className="text-emerald-500 font-bold">Redirections</span>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg text-sm hover:bg-emerald-600 transition-all shadow-md shadow-emerald-200">
                    <Plus size={18} /> Add New Redirect
                </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><RefreshCw size={80} /></div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Internal Links</h4>
                    <h3 className="text-2xl font-black text-gray-800">4,821 Clean</h3>
                    <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1"><CheckCircle2 size={12} /> All Slugs Optimized</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><AlertCircle size={80} /></div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">404 Errors</h4>
                    <h3 className="text-2xl font-black text-gray-800">12 Reported</h3>
                    <p className="text-[10px] text-amber-500 font-bold mt-2 flex items-center gap-1"><AlertCircle size={12} /> Requires Attention</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><ArrowRight size={80} /></div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Redirects</h4>
                    <h3 className="text-2xl font-black text-gray-800">85 Rules</h3>
                    <p className="text-[10px] text-blue-500 font-bold mt-2 flex items-center gap-1"><ExternalLink size={12} /> Running on Edge</p>
                </div>
            </div>

            {/* Redirects Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/20">
                    <div className="relative w-full md:w-96">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Filter redirection rules..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Source URL (Old)</th>
                                <th className="px-6 py-4">Destination URL (New)</th>
                                <th className="px-6 py-4">HTTP Status</th>
                                <th className="px-6 py-4">Monitor</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-mono text-[11px]">
                            {redirects.map(rule => (
                                <tr key={rule.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-4 text-red-500 font-bold">{rule.oldUrl}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-emerald-600 font-bold">
                                            <ArrowRight size={14} /> {rule.newUrl}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded font-bold uppercase tracking-tighter shadow-sm border border-gray-200">{rule.type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1 font-bold ${rule.status === 'Active' ? 'text-emerald-500' : 'text-gray-400'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${rule.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                                            {rule.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-emerald-500 transition-all shadow-sm"><Edit2 size={13} /></button>
                                            <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-all shadow-sm"><Trash2 size={13} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default URLManager;
