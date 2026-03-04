import React, { useState, useEffect } from 'react';
import { Target, Search, Download as ExportIcon, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, ChevronDown, FileText, X } from 'lucide-react';
import api from '../../../utils/api';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import { motion, AnimatePresence } from 'framer-motion';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';

const Ads = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ platform: '', status: '' });
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedAd, setSelectedAd] = useState(null);
    const [formData, setFormData] = useState({
        campaign_name: '', platform: 'facebook', spend: '', impressions: 0, clicks: 0, roas: '', status: 'active'
    });

    const resetForm = () => {
        setFormData({ campaign_name: '', platform: 'facebook', spend: '', impressions: 0, clicks: 0, roas: '', status: 'active' });
        setIsEditing(false);
        setSelectedAd(null);
    };

    const fetchAds = async () => {
        setLoading(true);
        try {
            let url = `marketing/ads/?page=${page}&search=${searchTerm}`;
            if (filters.platform) url += `&platform=${filters.platform}`;
            if (filters.status) url += `&status=${filters.status}`;
            const response = await api.get(url);
            setAds(response.data.results || response.data);
            setPagination({ count: response.data.count || 0, next: response.data.next, previous: response.data.previous });
        } catch (error) {
            console.error('Failed to fetch ads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAds(); }, [page, searchTerm, filters]);

    const handleEdit = (ad) => {
        setFormData({
            campaign_name: ad.campaign_name,
            platform: ad.platform,
            spend: ad.spend,
            impressions: ad.impressions,
            clicks: ad.clicks,
            roas: ad.roas,
            status: ad.status || 'active'
        });
        setSelectedAd(ad);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this ad?')) return;
        try {
            await api.delete(`marketing/ads/${id}/`);
            fetchAds();
        } catch { alert('Failed to delete ad.'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, spend: parseFloat(formData.spend), roas: parseFloat(formData.roas), impressions: parseInt(formData.impressions), clicks: parseInt(formData.clicks) };
            if (isEditing) { await api.put(`marketing/ads/${selectedAd.id}/`, payload); }
            else { await api.post('marketing/ads/', payload); }
            setIsModalOpen(false);
            resetForm();
            fetchAds();
        } catch (error) {
            console.error("Failed to save ad:", error.response?.data || error.message);
            const errorMsg = error.response?.data
                ? Object.entries(error.response.data).map(([field, msg]) => `${field}: ${msg}`).join('\n')
                : "Check all fields and try again.";
            alert(`Failed to save ad:\n${errorMsg}`);
        }
    };

    const handleFilterChange = (key, value) => { setFilters(p => ({ ...p, [key]: value })); setPage(1); };
    const clearFilters = () => { setFilters({ platform: '', status: '' }); setPage(1); };

    const handleExportExcel = () => { exportToExcel(ads.map(ad => ({ "Campaign": ad.campaign_name, "Platform": ad.platform, "Spend": ad.spend, "Impressions": ad.impressions, "Clicks": ad.clicks, "ROAS": ad.roas })), "Ad_Tracker_Report"); setShowExportOptions(false); };
    const handleExportCSV = () => { exportToCSV(ads.map(ad => ({ "Campaign": ad.campaign_name, "Platform": ad.platform, "Spend": ad.spend, "Impressions": ad.impressions, "Clicks": ad.clicks, "ROAS": ad.roas })), "Ad_Tracker_Report"); setShowExportOptions(false); };
    const handleExportPDF = () => { exportToPDF(ads.map(ad => [ad.campaign_name, ad.platform, `PKR ${Number(ad.spend).toLocaleString()}`, Number(ad.impressions).toLocaleString(), Number(ad.clicks).toLocaleString(), `${ad.roas}x`]), ["Campaign", "Platform", "Spend", "Impressions", "Clicks", "ROAS"], "Ad_Tracker_Report", "Ad Performance Tracking Report"); setShowExportOptions(false); };

    const filterOptions = [
        { key: 'platform', label: 'Platform', options: [{ label: 'All Platforms', value: '' }, { label: 'Facebook', value: 'facebook' }, { label: 'Instagram', value: 'instagram' }, { label: 'Google', value: 'google' }, { label: 'TikTok', value: 'tiktok' }] },
        { key: 'status', label: 'Status', options: [{ label: 'All Status', value: '' }, { label: 'Active', value: 'active' }, { label: 'Paused', value: 'paused' }, { label: 'Ended', value: 'ended' }] }
    ];
    const totalPages = Math.ceil((pagination.count || 0) / 10);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <Target size={22} className="text-brand" />Ad Tracker
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Track and manage your ad campaigns</p>
                </div>
                <div className="flex items-center gap-2 relative">
                    <div className="relative">
                        <button onClick={() => setShowExportOptions(!showExportOptions)} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm">
                            <ExportIcon size={16} className="text-emerald-500" /> Export <ChevronDown size={14} className={`transition-transform ${showExportOptions ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {showExportOptions && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowExportOptions(false)} />
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden p-1">
                                        <button onClick={handleExportExcel} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><ExportIcon size={14} className="text-emerald-500" /></div>Export Excel
                                        </button>
                                        <button onClick={handleExportCSV} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><ExportIcon size={14} className="text-blue-500" /></div>Export CSV
                                        </button>
                                        <button onClick={handleExportPDF} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg">
                                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center"><FileText size={14} className="text-red-500" /></div>Export PDF
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                    <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-dark transition-all shadow-sm">
                        <Plus size={16} /> Create New
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search ads..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 shadow-sm" />
                    </div>
                    <FilterDropdown options={filterOptions} activeFilters={filters} onFilterChange={handleFilterChange} onClear={clearFilters} />
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Campaign / Ad Set</th>
                                <th className="px-6 py-3">Platform</th>
                                <th className="px-6 py-3 text-center">Spend</th>
                                <th className="px-6 py-3 text-center">Impressions</th>
                                <th className="px-6 py-3 text-center">Clicks</th>
                                <th className="px-6 py-3 text-center">ROAS</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse"><td colSpan="7" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full" /></td></tr>
                            )) : ads.length > 0 ? ads.map((ad) => (
                                <tr key={ad.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-gray-900">{ad.campaign_name}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-bold uppercase text-gray-500 border border-gray-200">{ad.platform}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-emerald-600 font-bold">PKR {Number(ad.spend).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center text-gray-500 font-mono text-xs">{Number(ad.impressions).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center text-gray-500 font-mono text-xs">{Number(ad.clicks).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-2 py-1 rounded-full bg-brand/10 text-brand font-bold text-xs">{ad.roas}x</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(ad)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-brand transition-colors"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(ad.id)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="7" className="py-20 text-center text-gray-400 font-bold">No ads found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {(pagination.count || 0) > 10 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                        <span>Showing {ads.length} of {pagination.count}</span>
                        <div className="flex gap-1">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={!pagination.previous} className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={16} /></button>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded font-bold ${page === i + 1 ? 'bg-brand text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>{i + 1}</button>
                            ))}
                            <button onClick={() => setPage(p => p + 1)} disabled={!pagination.next} className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-brand-dark/20 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-800">{isEditing ? 'Edit Ad' : 'Create New Ad'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={18} className="text-gray-500" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Campaign Name *</label>
                                    <input type="text" required value={formData.campaign_name} onChange={e => setFormData(p => ({ ...p, campaign_name: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                                        placeholder="Summer Sale FB Campaign" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Platform</label>
                                        <select value={formData.platform} onChange={e => setFormData(p => ({ ...p, platform: e.target.value }))}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand">
                                            <option value="facebook">Facebook</option>
                                            <option value="instagram">Instagram</option>
                                            <option value="google">Google</option>
                                            <option value="tiktok">TikTok</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                                        <select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand">
                                            <option value="active">Active</option>
                                            <option value="paused">Paused</option>
                                            <option value="ended">Ended</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Spend (PKR) *</label>
                                        <input type="number" required step="0.01" value={formData.spend} onChange={e => setFormData(p => ({ ...p, spend: e.target.value }))}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="5000" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">ROAS *</label>
                                        <input type="number" required step="0.01" value={formData.roas} onChange={e => setFormData(p => ({ ...p, roas: e.target.value }))}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="3.5" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Impressions</label>
                                        <input type="number" value={formData.impressions} onChange={e => setFormData(p => ({ ...p, impressions: e.target.value }))}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="10000" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Clicks</label>
                                        <input type="number" value={formData.clicks} onChange={e => setFormData(p => ({ ...p, clicks: e.target.value }))}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="350" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50">Cancel</button>
                                    <button type="submit" className="px-5 py-2.5 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand/20">{isEditing ? 'Update Ad' : 'Create Ad'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Ads;
