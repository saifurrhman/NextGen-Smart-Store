import React, { useState } from 'react';
import {
    Search, Plus, Globe, Edit2, Trash2,
    Save, Home, ChevronRight, CheckCircle2, AlertCircle, Info, ExternalLink
} from 'lucide-react';

const MetaTagsManager = () => {
    const [tags, setTags] = useState([
        { id: 1, page: 'Homepage', title: 'NextGen Smart Store | Premium Shopping Experience', description: 'Shop the latest gadgets, fashion, and home essentials with AI-powered recommendations.', keywords: 'eCommerce, Smart Store, Gadgets' },
        { id: 2, page: 'Shop', title: 'Browse Products | NextGen Smart Store', description: 'Explore thousands of products with express delivery across Pakistan.', keywords: 'Shopping, Online Store' },
        { id: 3, page: 'Contact', title: 'Contact Us | NextGen Smart Store Support', description: 'Get in touch with our 24/7 customer support team for any queries.', keywords: 'Support, Help, Contact' },
    ]);

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Globe size={24} className="text-emerald-500" />
                        SEO Meta Tags Manager
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mt-1">
                        <Home size={14} />
                        <ChevronRight size={12} />
                        <span>SEO & Content</span>
                        <ChevronRight size={12} />
                        <span className="text-emerald-500 font-bold">Meta Tags</span>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg text-sm hover:bg-emerald-600 transition-all shadow-md shadow-emerald-200">
                    <Plus size={18} /> Add Page SEO
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/20">
                    <div className="relative w-full md:w-96">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find page meta configuration..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                            <CheckCircle2 size={12} /> Google Indexing Active
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Page Information</th>
                                <th className="px-6 py-4">Meta Title & Description</th>
                                <th className="px-6 py-4">Keywords</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {tags.map(tag => (
                                <tr key={tag.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-800">{tag.page}</span>
                                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                <Info size={10} /> Static Route
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-md">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-bold text-emerald-600 line-clamp-1">{tag.title}</span>
                                            <span className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{tag.description}</span>
                                            <div className="flex items-center gap-1.5 mt-2">
                                                <div className="h-1 flex-1 bg-emerald-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 w-[70%]"></div>
                                                </div>
                                                <span className="text-[9px] font-bold text-emerald-600 uppercase">Optimal Length</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {tag.keywords.split(',').map((kw, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-bold rounded uppercase tracking-tighter shadow-sm">{kw.trim()}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-emerald-500 transition-all shadow-sm"><Edit2 size={14} /></button>
                                            <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-all shadow-sm"><Trash2 size={14} /></button>
                                            <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-gray-800 transition-all shadow-sm"><ExternalLink size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Google Preview Section */}
            <div className="bg-[#f8f9fa] border border-gray-200 rounded-2xl p-8 space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Serp Preview (Desktop)</h4>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-3xl">
                    <p className="text-[#1a0dab] text-xl font-normal hover:underline cursor-pointer mb-1">NextGen Smart Store | Premium Shopping Experience</p>
                    <p className="text-[#006621] text-sm mb-1 flex items-center gap-1">https://nextgen-store.pk <ChevronRight size={10} /></p>
                    <p className="text-[#545454] text-sm leading-relaxed">Shop the latest gadgets, fashion, and home essentials with AI-powered recommendations. Get express delivery across Pakistan with secure payment...</p>
                </div>
            </div>
        </div>
    );
};

export default MetaTagsManager;
