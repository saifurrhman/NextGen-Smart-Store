import React, { useState } from 'react';
import { Share2, Search, Filter, Download, Plus, Instagram, Facebook, Twitter, Link2, ExternalLink } from 'lucide-react';
import { exportToExcel, exportToPDF } from '../../../utils/exportUtils';

const SocialMedia = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const PLATFORMS = [
        { name: 'Instagram', handle: '@nextgen_store', followers: '24.5K', status: 'Connected', lastSync: '10 mins ago', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
        { name: 'Facebook', handle: 'NextGen Smart Store', followers: '18.2K', status: 'Connected', lastSync: '15 mins ago', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'TikTok', handle: '@nextgen.official', followers: '142K', status: 'Disconnected', lastSync: '2 days ago', icon: Share2, color: 'text-black', bg: 'bg-gray-100' },
    ];

    const filtered = PLATFORMS.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.handle.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Share2 size={24} className="text-pink-500" />
                        Social Media Integrations
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Manage and sync your social media accounts</p>
                </div>
                <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <button onClick={() => exportToExcel(PLATFORMS, "Social_Media_Integrations")} className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all">Excel</button>
                    <button onClick={() => exportToPDF(PLATFORMS.map(p => [p.name, p.handle, p.followers, p.status]), ["Platform", "Handle", "Followers", "Status"], "Social_Media_Integrations", "Social Media Account Status")} className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all font-bold">PDF</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PLATFORMS.map((p) => (
                    <div key={p.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className={`w-12 h-12 rounded-xl ${p.bg} flex items-center justify-center`}>
                                <p.icon size={24} className={p.color} />
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${p.status === 'Connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {p.status}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-800">{p.name}</h3>
                            <p className="text-sm text-gray-500 font-medium">{p.handle}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Followers</p>
                                <p className="text-sm font-black text-gray-800">{p.followers}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Last Sync</p>
                                <p className="text-[10px] font-bold text-gray-600">{p.lastSync}</p>
                            </div>
                        </div>
                        <button className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${p.status === 'Connected' ? 'bg-gray-50 text-gray-700 hover:bg-gray-100' : 'bg-brand text-white hover:bg-brand-dark shadow-lg shadow-brand/20'}`}>
                            {p.status === 'Connected' ? <><Link2 size={14} /> Manage Account</> : <><ExternalLink size={14} /> Connect Account</>}
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-50 bg-gray-50/30">
                    <div className="relative w-full max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search integrations..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-500 transition-all shadow-sm"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#fdf8fa] text-pink-900 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Platform</th>
                                <th className="px-6 py-4">Account</th>
                                <th className="px-6 py-4 text-center">Followers</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(p => (
                                <tr key={p.name} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-800">{p.name}</td>
                                    <td className="px-6 py-4 text-gray-500 font-medium">{p.handle}</td>
                                    <td className="px-6 py-4 text-center font-black text-gray-700">{p.followers}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${p.status === 'Connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'Connected' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[10px] font-black uppercase text-pink-600 hover:text-pink-800 tracking-widest">Settings</button>
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

export default SocialMedia;
