import React, { useState } from 'react';
import {
    FileText, RefreshCw, Download,
    Home, ChevronRight, CheckCircle2, Clock,
    ExternalLink, AlertTriangle, Code
} from 'lucide-react';

const SitemapGenerator = () => {
    const [generating, setGenerating] = useState(false);
    const [history, setHistory] = useState([
        { id: 1, type: 'XML', pages: 1250, size: '2.5 MB', status: 'Success', date: '2025-03-10 10:00 AM' },
        { id: 2, type: 'HTML', pages: 1250, size: '1.2 MB', status: 'Success', date: '2025-03-05 04:30 PM' },
    ]);

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            const newEntry = {
                id: history.length + 1,
                type: 'XML',
                pages: 1250 + Math.floor(Math.random() * 50),
                size: '2.6 MB',
                status: 'Success',
                date: new Date().toLocaleString()
            };
            setHistory([newEntry, ...history]);
        }, 2000);
    };

    return (
        <div className="max-w-[1200px] mx-auto pb-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Code size={24} className="text-emerald-500" />
                        Sitemap Generator
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mt-1">
                        <Home size={14} />
                        <ChevronRight size={12} />
                        <span>SEO Tools</span>
                        <ChevronRight size={12} />
                        <span className="text-emerald-500 font-bold">XML Sitemaps</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Generator Controls */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 flex flex-col justify-between h-full group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-emerald-100 transition-colors duration-500"></div>

                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Build Index</h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">Re-scan all products, categories, and dynamic pages to create a fresh SEO index for search engines.</p>

                        <div className="mt-10 space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Include Images</span>
                                <label className="flex items-center cursor-pointer relative">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Auto-Ping Google</span>
                                <label className="flex items-center cursor-pointer relative">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="mt-12 w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        {generating ? (
                            <><RefreshCw size={20} className="animate-spin" /> Crawling Site...</>
                        ) : (
                            <><RefreshCw size={20} /> Generate Now</>
                        )}
                    </button>
                </div>

                {/* Status Column */}
                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-6">Current Status</h4>
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-400">Public URL:</span>
                                <a href="#" className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline">/sitemap.xml <ExternalLink size={12} /></a>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-400">Last Build:</span>
                                <span className="text-xs font-bold text-white">10 March 2025</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-400">Daily Update:</span>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-xs font-black text-emerald-500 uppercase">Enabled</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Recent Builds</h4>
                        <div className="space-y-5">
                            {history.map(entry => (
                                <div key={entry.id} className="flex items-center justify-between group/item">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center border border-gray-100 group-hover/item:border-emerald-100 group-hover/item:text-emerald-500 transition-colors">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-gray-800 uppercase tracking-tight">{entry.pages} Pages</p>
                                            <p className="text-[9px] font-bold text-gray-400">{entry.date}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-emerald-500 transition-colors"><Download size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SitemapGenerator;
