import React, { useState, useEffect } from 'react';
import { BarChart2, Search, Filter, Download, Plus, TrendingUp, TrendingDown, MousePointer, Eye, DollarSign } from 'lucide-react';
import api from '../../../utils/api';
import { exportToExcel, exportToPDF } from '../../../utils/exportUtils';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';

const MarketingAnalytics = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ platform: '' });

    useEffect(() => {
        fetchAds();
    }, [searchTerm, filters]);

    const fetchAds = async () => {
        setLoading(true);
        try {
            let url = `/marketing/ads/?search=${searchTerm}`;
            if (filters.platform) url += `&platform=${filters.platform}`;
            const res = await api.get(url);
            setAds(res.data.results || res.data);
        } catch (error) {
            console.error("Failed to fetch marketing analytics data", error);
        } finally {
            setLoading(false);
        }
    };

    const totalSpend = ads.reduce((acc, ad) => acc + parseFloat(ad.spend || 0), 0);
    const totalClicks = ads.reduce((acc, ad) => acc + (ad.clicks || 0), 0);
    const totalImpressions = ads.reduce((acc, ad) => acc + (ad.impressions || 0), 0);
    const avgROAS = ads.length > 0 ? (ads.reduce((acc, ad) => acc + parseFloat(ad.roas || 0), 0) / ads.length).toFixed(2) : 0;

    const METRICS = [
        { label: 'Total Spend', value: `$${totalSpend.toLocaleString()}`, sub: 'All Platforms', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Impressions', value: totalImpressions.toLocaleString(), sub: 'Exposure', icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Total Clicks', value: totalClicks.toLocaleString(), sub: 'Engagement', icon: MousePointer, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Avg ROAS', value: `${avgROAS}x`, sub: 'Return on Spend', icon: BarChart2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    const filterOptions = [
        {
            key: 'platform', label: 'Platform', options: [
                { label: 'All Platforms', value: '' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'Google', value: 'google' },
                { label: 'TikTok', value: 'tiktok' },
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <BarChart2 size={24} className="text-brand" />
                        Marketing Performance
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Real-time advertising and campaign analytics</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <button onClick={() => exportToExcel(ads, "Marketing_Analytics")} className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all">Excel</button>
                        <button onClick={() => exportToPDF(ads.map(ad => [ad.campaign_name, ad.platform, `$${ad.spend}`, ad.clicks, ad.roas]), ["Campaign", "Platform", "Spend", "Clicks", "ROAS"], "Marketing_Analytics", "Marketing Performance Report")} className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all font-bold">PDF</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {METRICS.map(({ label, value, sub, icon: Icon, color, bg }) => (
                    <div key={label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                            <Icon size={22} className={color} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                            <h3 className="text-xl font-black text-gray-800">{value}</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search campaigns..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand transition-all font-medium text-gray-700 shadow-sm"
                        />
                    </div>
                    <FilterDropdown options={filterOptions} activeFilters={filters} onFilterChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))} onClear={() => setFilters({ platform: '' })} />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#f8faf9] text-gray-800 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Platform & Campaign</th>
                                <th className="px-6 py-4 text-center">Spend</th>
                                <th className="px-6 py-4 text-center">Impressions</th>
                                <th className="px-6 py-4 text-center">Clicks</th>
                                <th className="px-6 py-4 text-center">ROAS</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse"><td colSpan="6" className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-full"></div></td></tr>
                                ))
                            ) : ads.length > 0 ? (
                                ads.map(ad => (
                                    <tr key={ad.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-[10px] uppercase">
                                                    {ad.platform[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{ad.campaign_name}</p>
                                                    <p className="text-[10px] text-brand font-black uppercase tracking-tighter">{ad.platform}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-black text-gray-700">${parseFloat(ad.spend).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center text-gray-500 font-bold">{ad.impressions.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center text-gray-500 font-bold">{ad.clicks.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${parseFloat(ad.roas) >= 3 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {ad.roas}x
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase rounded-full ${ad.status === 'active' ? 'bg-brand/10 text-brand' : 'bg-gray-100 text-gray-500'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${ad.status === 'active' ? 'bg-brand' : 'bg-gray-400'}`} />
                                                {ad.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6" className="py-20 text-center text-gray-400 font-bold italic uppercase tracking-widest">No campaign data available.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MarketingAnalytics;
