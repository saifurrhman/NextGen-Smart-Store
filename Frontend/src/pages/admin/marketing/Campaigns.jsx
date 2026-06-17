import React, { useState, useEffect } from 'react';
import { Flag, Search, Download as ExportIcon, Plus, MoreVertical, Edit2, Trash2, ChevronLeft, ChevronRight, ChevronDown, FileText, CheckCircle2 } from 'lucide-react';
import api from '../../../utils/api';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import { motion, AnimatePresence } from 'framer-motion';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: ''
    });
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
    const [selectedIntegration, setSelectedIntegration] = useState(null);
    const [integrationForm, setIntegrationForm] = useState({ accountId: '', accessToken: '' });
    const [connectedPlatforms, setConnectedPlatforms] = useState({
        meta: localStorage.getItem('meta_connected') === 'true',
        google: localStorage.getItem('google_connected') === 'true',
        tiktok: localStorage.getItem('tiktok_connected') === 'true',
    });

    const [formData, setFormData] = useState({
        name: '',
        status: 'scheduled',
        platform: 'facebook',
        budget: '',
        spent: '0',
        start_date: '',
        end_date: ''
    });

    const resetForm = () => {
        setFormData({
            name: '',
            status: 'scheduled',
            platform: 'facebook',
            budget: '',
            spent: '0',
            start_date: '',
            end_date: ''
        });
        setIsEditing(false);
        setSelectedCampaign(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (campaign) => {
        setFormData({
            name: campaign.name,
            status: campaign.status,
            platform: campaign.platform || 'facebook',
            budget: campaign.budget,
            spent: campaign.spent,
            start_date: campaign.start_date,
            end_date: campaign.end_date
        });
        setSelectedCampaign(campaign);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this campaign?')) {
            try {
                await api.delete(`marketing/campaigns/${id}/`);
                fetchCampaigns();
            } catch (error) {
                console.error("Failed to delete campaign:", error);
                alert("Failed to delete campaign.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                budget: parseFloat(formData.budget) || 0,
                spent: parseFloat(formData.spent) || 0,
            };
            console.log("Saving campaign payload:", payload);
            if (isEditing) {
                await api.put(`marketing/campaigns/${selectedCampaign.id}/`, payload);
            } else {
                await api.post('marketing/campaigns/', payload);
            }
            setIsModalOpen(false);
            resetForm();
            fetchCampaigns();
        } catch (error) {
            console.error("Failed to save campaign:", error.response?.data || error.message);
            const errorMsg = error.response?.data
                ? Object.entries(error.response.data).map(([field, msg]) => `${field}: ${msg}`).join('\n')
                : "Please check all fields and try again.";
            alert(`Failed to save campaign:\n${errorMsg}`);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, [page, searchTerm, filters]);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            let url = `marketing/campaigns/?page=${page}&search=${searchTerm}`;
            if (filters.status) url += `&status=${filters.status}`;
            const response = await api.get(url);
            setCampaigns(response.data.results);
            setPagination({
                count: response.data.count,
                next: response.data.next,
                previous: response.data.previous
            });
        } catch (error) {
            console.error("Failed to fetch campaigns:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({ status: '' });
        setPage(1);
    };

    const handleConnectPlatform = (platformId) => {
        setSelectedIntegration(platformId);
        setIntegrationForm({ accountId: '', accessToken: '' });
        setIsIntegrationModalOpen(true);
    };

    const handleSaveIntegration = (e) => {
        e.preventDefault();
        // Save to local storage for persistence
        localStorage.setItem(`${selectedIntegration}_connected`, 'true');
        setConnectedPlatforms(prev => ({ ...prev, [selectedIntegration]: true }));
        setIsIntegrationModalOpen(false);
        alert(`Successfully connected to ${selectedIntegration.toUpperCase()}!`);
    };

    const handleDisconnectPlatform = (platformId) => {
        if(window.confirm('Are you sure you want to disconnect this platform?')) {
            localStorage.setItem(`${platformId}_connected`, 'false');
            setConnectedPlatforms(prev => ({ ...prev, [platformId]: false }));
        }
    };

    const handleExportExcel = () => {
        const dataToExport = campaigns.map(c => ({
            "Campaign Name": c.name,
            "Platform": c.platform,
            "Status": c.status,
            "Budget": c.budget,
            "Spent": c.spent,
            "Start Date": c.start_date,
            "End Date": c.end_date
        }));
        exportToExcel(dataToExport, "Marketing_Campaigns_Report");
        setShowExportOptions(false);
    };

    const handleExportCSV = () => {
        const dataToExport = campaigns.map(c => ({
            "Campaign Name": c.name,
            "Status": c.status,
            "Budget": c.budget,
            "Spent": c.spent,
            "Start Date": c.start_date,
            "End Date": c.end_date
        }));
        exportToCSV(dataToExport, "Marketing_Campaigns_Report");
        setShowExportOptions(false);
    };

    const handleExportPDF = () => {
        const columns = ["Campaign Name", "Status", "Budget", "Spent", "Start Date", "End Date"];
        const dataToExport = campaigns.map(c => [
            c.name,
            c.status,
            `PKR ${Number(c.budget).toLocaleString()}`,
            `PKR ${Number(c.spent).toLocaleString()}`,
            c.start_date,
            c.end_date
        ]);
        exportToPDF(dataToExport, columns, "Marketing_Campaigns_Report", "Marketing Campaigns Performance Summary");
        setShowExportOptions(false);
    };

    const filterOptions = [
        {
            key: 'status',
            label: 'Campaign Status',
            options: [
                { label: 'All Status', value: '' },
                { label: 'Active', value: 'active' },
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'Ended', value: 'ended' },
            ]
        },
        {
            key: 'platform',
            label: 'Platform',
            options: [
                { label: 'All Platforms', value: '' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'Google Ads', value: 'google' },
            ]
        }
    ];

    const totalPages = Math.ceil(pagination.count / 10);

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'facebook': return <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">FB</div>;
            case 'instagram': return <div className="w-6 h-6 rounded bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white flex items-center justify-center font-bold text-[10px]">IG</div>;
            case 'google': return <div className="w-6 h-6 rounded bg-white border border-gray-200 text-gray-700 flex items-center justify-center font-bold text-[10px] shadow-sm"><span className="text-blue-500">G</span></div>;
            case 'tiktok': return <div className="w-6 h-6 rounded bg-black text-white flex items-center justify-center font-bold text-[10px]">TK</div>;
            default: return <div className="w-6 h-6 rounded bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-[10px]">?</div>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <Flag size={22} className="text-brand" />
                        All Campaigns
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and view your all campaigns</p>
                </div>
                <div className="flex items-center gap-2 relative">
                    <div className="relative">
                        <button
                            onClick={() => setShowExportOptions(!showExportOptions)}
                            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <ExportIcon size={16} className="text-emerald-500" />
                            Export
                            <ChevronDown size={14} className={`transition-transform duration-200 ${showExportOptions ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showExportOptions && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowExportOptions(false)}
                                    ></div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                                    >
                                        <div className="p-1">
                                            <button
                                                onClick={handleExportExcel}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                                    <ExportIcon size={14} className="text-emerald-500" />
                                                </div>
                                                Export Excel
                                            </button>
                                            <button
                                                onClick={handleExportCSV}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                                    <ExportIcon size={14} className="text-blue-500" />
                                                </div>
                                                Export CSV
                                            </button>
                                            <button
                                                onClick={handleExportPDF}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                                    <FileText size={14} className="text-red-500" />
                                                </div>
                                                Export PDF
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors shadow-sm"
                    >
                        <Plus size={16} />
                        Create New
                    </button>
                </div>
            </div>

            {/* Ad Integrations Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { id: 'meta', name: 'Meta Ads (Facebook & IG)', connected: connectedPlatforms.meta, bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', icon: 'FB/IG' },
                    { id: 'google', name: 'Google Ads', connected: connectedPlatforms.google, bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700', icon: 'GAds' },
                    { id: 'tiktok', name: 'TikTok Ads', connected: connectedPlatforms.tiktok, bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-500', icon: 'TK' },
                ].map((ad, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${ad.border} ${ad.bg} flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center font-black text-xs text-gray-700">
                                {ad.icon}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">{ad.name}</h4>
                                <p className={`text-xs font-semibold flex items-center gap-1 ${ad.connected ? ad.text : 'text-gray-400'}`}>
                                    {ad.connected ? <><CheckCircle2 size={12} /> Connected</> : 'Not Connected'}
                                </p>
                            </div>
                        </div>
                        {ad.connected ? (
                            <button 
                                onClick={() => handleDisconnectPlatform(ad.id)}
                                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                            >
                                Disconnect
                            </button>
                        ) : (
                            <button 
                                onClick={() => handleConnectPlatform(ad.id)}
                                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Connect
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Toolbar */}
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search in All Campaigns..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all shadow-sm text-gray-700"
                        />
                    </div>
                    <FilterDropdown
                        options={filterOptions}
                        activeFilters={filters}
                        onFilterChange={handleFilterChange}
                        onClear={clearFilters}
                    />
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Platform</th>
                                <th className="px-6 py-3">Campaign Name</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Performance</th>
                                <th className="px-6 py-3">Budget</th>
                                <th className="px-6 py-3">Spent</th>
                                <th className="px-6 py-3">Dates</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="7" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : campaigns.length > 0 ? (
                                campaigns.map((campaign) => (
                                    <tr key={campaign.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            {getPlatformIcon(campaign.platform || 'facebook')}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{campaign.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${campaign.status === 'active' ? 'bg-green-50 text-green-700' :
                                                campaign.status === 'scheduled' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${campaign.status === 'active' ? 'bg-green-500' :
                                                    campaign.status === 'scheduled' ? 'bg-blue-500' : 'bg-gray-500'
                                                    }`}></span>
                                                {campaign.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500"><span className="font-bold text-gray-800">{campaign.clicks || 0}</span> Clicks</span>
                                                <span className="text-xs text-gray-500"><span className="font-bold text-gray-800">{campaign.impressions || 0}</span> Imp.</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">PKR {Number(campaign.budget).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-emerald-600 font-bold">PKR {Number(campaign.spent).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-500 text-xs flex flex-col">
                                            <span>{campaign.start_date}</span>
                                            <span className="text-gray-400">to {campaign.end_date}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(campaign)}
                                                    className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-brand transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(campaign.id)}
                                                    className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"><MoreVertical size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center text-gray-400 font-bold italic">
                                        No campaigns found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.count > 10 && (
                    <div className="p-4 border-t border-gray-100 text-sm text-gray-500 flex items-center justify-between">
                        <span>Showing {campaigns.length} entries of {pagination.count}</span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={!pagination.previous || loading}
                                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`px-3 py-1 rounded font-bold ${page === i + 1 ? 'bg-brand text-white shadow-sm' : 'border border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={!pagination.next || loading}
                                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 text-left">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-brand-dark/20 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-800">
                                    {isEditing ? 'Edit Campaign' : 'Create New Campaign'}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <Plus size={20} className="rotate-45 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Platform</label>
                                        <select
                                            name="platform"
                                            value={formData.platform}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium"
                                        >
                                            <option value="facebook">Facebook Ads</option>
                                            <option value="instagram">Instagram Ads</option>
                                            <option value="google">Google Ads</option>
                                            <option value="tiktok">TikTok Ads</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium"
                                        >
                                            <option value="active">Active</option>
                                            <option value="scheduled">Scheduled</option>
                                            <option value="ended">Ended</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Campaign Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all font-medium"
                                        placeholder="Spring Festival Sale"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Budget (PKR)</label>
                                        <input
                                            type="number"
                                            name="budget"
                                            required
                                            value={formData.budget}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium"
                                            placeholder="50000"
                                        />
                                    </div>
                                    {isEditing && (
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Spent (PKR)</label>
                                            <input
                                                type="number"
                                                name="spent"
                                                value={formData.spent}
                                                onChange={handleFormChange}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Start Date</label>
                                        <input
                                            type="date"
                                            name="start_date"
                                            required
                                            value={formData.start_date}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">End Date</label>
                                        <input
                                            type="date"
                                            name="end_date"
                                            required
                                            value={formData.end_date}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand/20 font-bold"
                                    >
                                        {isEditing ? 'Save Changes' : 'Create Campaign'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Integration Modal */}
            <AnimatePresence>
                {isIntegrationModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 text-left">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsIntegrationModalOpen(false)}
                            className="absolute inset-0 bg-brand-dark/20 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-800 capitalize">
                                    Connect {selectedIntegration} Ads
                               </h3>
                                <button
                                    onClick={() => setIsIntegrationModalOpen(false)}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <Plus size={20} className="rotate-45 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveIntegration} className="p-6 space-y-4">
                                <p className="text-sm text-gray-500 pb-2">
                                    Enter your API credentials to securely connect your {selectedIntegration} ad account.
                                </p>
                                
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Account / Business ID</label>
                                    <input
                                        type="text"
                                        required
                                        value={integrationForm.accountId}
                                        onChange={(e) => setIntegrationForm({...integrationForm, accountId: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium"
                                        placeholder={`e.g. ${selectedIntegration === 'meta' ? '1023948573' : 'AW-123456789'}`}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Access Token / API Key</label>
                                    <input
                                        type="password"
                                        required
                                        value={integrationForm.accessToken}
                                        onChange={(e) => setIntegrationForm({...integrationForm, accessToken: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium"
                                        placeholder="Enter your secret token"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsIntegrationModalOpen(false)}
                                        className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand/20"
                                    >
                                        Connect Account
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Campaigns;
