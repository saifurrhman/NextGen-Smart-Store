import React, { useState, useEffect } from 'react';
import { Percent, Save, RefreshCw, ChevronDown, Store, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../../utils/api';

const CommissionSettings = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [globalRate, setGlobalRate] = useState('10');
    const [overrides, setOverrides] = useState({});
    const [msg, setMsg] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const res = await api.get('vendors/?page_size=100');
            const results = res.data.results || res.data;
            setVendors(results);
            // Initialize overrides map
            const init = {};
            results.forEach(v => {
                init[v.id] = v.commission_rate != null ? String(v.commission_rate) : '';
            });
            setOverrides(init);
        } catch (err) {
            console.error('Failed to fetch vendors', err);
        } finally {
            setLoading(false);
        }
    };

    const showMsg = (text, type) => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    };

    const handleSaveGlobal = async () => {
        setSaving(true);
        try {
            // Save global rate as a setting (PATCH all vendors without override)
            const vendorsWithoutOverride = vendors.filter(v => !overrides[v.id]);
            await Promise.allSettled(
                vendorsWithoutOverride.map(v =>
                    api.patch(`vendors/${v.id}/`, { commission_rate: parseFloat(globalRate) })
                )
            );
            showMsg('Global commission rate saved!', 'success');
            fetchVendors();
        } catch {
            showMsg('Failed to save global rate.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveOverride = async (vendorId) => {
        const rate = overrides[vendorId];
        setSaving(true);
        try {
            await api.patch(`vendors/${vendorId}/`, {
                commission_rate: rate ? parseFloat(rate) : null
            });
            showMsg('Vendor override saved!', 'success');
        } catch {
            showMsg('Failed to save vendor override.', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <Percent size={22} className="text-brand" />
                        Commission Settings
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Set global commission rate and per-vendor overrides</p>
                </div>
            </div>

            {/* Message */}
            {msg.text && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {msg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {msg.text}
                </div>
            )}

            {/* Global Rate Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EAF8E7' }}>
                        <Percent size={20} style={{ color: '#4EA674' }} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">Global Default Rate</h3>
                        <p className="text-xs text-gray-400">Applied to all vendors without a custom override</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative w-48">
                        <input
                            type="number"
                            min="0" max="100" step="0.5"
                            value={globalRate}
                            onChange={e => setGlobalRate(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl text-lg font-bold focus:outline-none focus:border-brand transition-all"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">%</span>
                    </div>
                    <button
                        onClick={handleSaveGlobal}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold transition-all shadow-md disabled:opacity-60"
                        style={{ background: '#4EA674' }}
                    >
                        <Save size={16} />
                        Save Global Rate
                    </button>
                </div>
            </div>

            {/* Per-vendor Overrides */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/30">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Store size={16} className="text-brand" />
                        Per-Vendor Commission Override
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Leave blank to use global rate</p>
                </div>

                <div className="divide-y divide-gray-100">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-5 animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-200" />
                                    <div>
                                        <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                                        <div className="h-3 w-24 bg-gray-100 rounded" />
                                    </div>
                                </div>
                                <div className="h-10 w-32 bg-gray-200 rounded-xl" />
                            </div>
                        ))
                    ) : vendors.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 font-bold">No vendors found.</div>
                    ) : (
                        vendors.map(vendor => (
                            <div key={vendor.id} className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                                        style={{ background: '#023337' }}>
                                        {(vendor.store_name || vendor.user?.email || '?')[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{vendor.store_name || 'Unnamed Store'}</p>
                                        <p className="text-xs text-gray-400">{vendor.user?.email || ''}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0" max="100" step="0.5"
                                            placeholder={`${globalRate} (global)`}
                                            value={overrides[vendor.id] || ''}
                                            onChange={e => setOverrides(prev => ({ ...prev, [vendor.id]: e.target.value }))}
                                            className="w-36 pl-4 pr-8 py-2 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-brand transition-all"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                                    </div>
                                    <button
                                        onClick={() => handleSaveOverride(vendor.id)}
                                        disabled={saving}
                                        className="p-2 rounded-xl text-white transition-all disabled:opacity-60"
                                        style={{ background: '#4EA674' }}
                                        title="Save override"
                                    >
                                        <Save size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {!loading && vendors.length > 0 && (
                    <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                        {vendors.length} vendor(s) listed
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommissionSettings;
