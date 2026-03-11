import React, { useState, useEffect } from 'react';
import {
    Ruler, Plus, Search, Trash2, CheckCircle2, AlertCircle,
    ChevronRight, Sparkles, RefreshCw, Download, Tag
} from 'lucide-react';
import api from '../../../../utils/api';

// ── ALL WORLD STANDARDS ──────────────────────────────────────────────────────
const PRESET_SIZES = {
    'Clothing (International)': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', '5XL'],
    'Clothing (US Numeric)': ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20'],
    'Clothing (EU Numeric)': ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52'],
    'Clothing (UK)': ['6', '8', '10', '12', '14', '16', '18', '20', '22'],
    'Clothing (IT)': ['36', '38', '40', '42', '44', '46', '48', '50'],
    'Clothing (FR)': ['34', '36', '38', '40', '42', '44', '46', '48'],
    "Men's Shirts": ['14', '14.5', '15', '15.5', '16', '16.5', '17', '17.5', '18'],
    'Kids (Age)': ['0-3M', '3-6M', '6-12M', '1Y', '2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y', '9Y', '10Y', '12Y', '14Y'],
    'Shoes (US Men)': ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14', '15'],
    'Shoes (US Women)': ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11'],
    'Shoes (EU)': ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47'],
    'Shoes (UK)': ['3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '11', '12'],
    'Waist (Inches)': ['26"', '28"', '30"', '32"', '34"', '36"', '38"', '40"', '42"', '44"', '46"'],
    'Inseam (Inches)': ['28"', '29"', '30"', '30.5"', '32"', '34"', '36"'],
    'Ring Size (US)': ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    'General': ['One Size', 'Free Size', 'Petite', 'Tall', 'Plus', 'Regular', 'Slim'],
};

const PALETTE = [
    '#4EA674', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16',
    '#6366F1', '#A855F7', '#10B981', '#E11D48', '#0EA5E9',
];

const SizeManagement = () => {
    const [sizes, setSizes] = useState([]);
    const [newSize, setNewSize] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [activeGroup, setActiveGroup] = useState('All');
    const [sizeGroups, setSizeGroups] = useState({}); // { size: groupName }

    const showMsg = (type, text) => {
        setMsg({ type, text });
        setTimeout(() => setMsg({ type: '', text: '' }), 2500);
    };

    useEffect(() => {
        fetchSizes();
    }, []);

    const fetchSizes = async () => {
        setLoading(true);
        try {
            const res = await api.get('attributes/');
            const all = res.data.results || res.data;
            const target = all.find(a =>
                a.name?.toLowerCase() === 'size' ||
                a.name?.toLowerCase() === 'sizes' ||
                a.name?.toLowerCase() === 'product size'
            );
            if (target?.terms) {
                setSizes(target.terms.split(',').map(t => t.trim()).filter(Boolean));
            }
        } catch {
            // Start with empty
        } finally {
            setLoading(false);
        }
    };

    const saveToBackend = async (updatedSizes) => {
        setSaving(true);
        try {
            const res = await api.get('attributes/');
            const all = res.data.results || res.data;
            const target = all.find(a =>
                a.name?.toLowerCase() === 'size' ||
                a.name?.toLowerCase() === 'sizes' ||
                a.name?.toLowerCase() === 'product size'
            );
            const termsStr = updatedSizes.join(', ');
            if (target) {
                await api.patch(`attributes/${target.id}/`, { terms: termsStr });
            } else {
                await api.post('attributes/', { name: 'Size', terms: termsStr });
            }
        } catch {
            // Silent - local state still updated
        } finally {
            setSaving(false);
        }
    };

    const addSize = async (e) => {
        e?.preventDefault();
        const val = newSize.trim();
        if (!val) return;
        if (sizes.includes(val)) { showMsg('error', `"${val}" already exists!`); return; }
        const updated = [...sizes, val];
        setSizes(updated);
        setNewSize('');
        showMsg('success', `Size "${val}" added!`);
        await saveToBackend(updated);
    };

    const removeSize = async (size) => {
        const updated = sizes.filter(s => s !== size);
        setSizes(updated);
        showMsg('success', `"${size}" removed.`);
        await saveToBackend(updated);
    };

    const addPresetGroup = async (groupName, groupSizes) => {
        const toAdd = groupSizes.filter(s => !sizes.includes(s));
        if (!toAdd.length) { showMsg('error', 'All sizes in this group already added!'); return; }
        const updated = [...sizes, ...toAdd];
        setSizes(updated);
        showMsg('success', `Added ${toAdd.length} sizes from "${groupName}"!`);
        await saveToBackend(updated);
    };

    const addAllPresets = async () => {
        const all = Object.values(PRESET_SIZES).flat();
        const unique = [...new Set([...sizes, ...all])];
        setSizes(unique);
        showMsg('success', `Loaded all ${unique.length} world-standard sizes!`);
        await saveToBackend(unique);
    };

    const clearAll = async () => {
        if (!window.confirm('Remove all sizes?')) return;
        setSizes([]);
        await saveToBackend([]);
        showMsg('success', 'All sizes cleared.');
    };

    const filtered = sizes.filter(s => s.toLowerCase().includes(search.toLowerCase()));
    const allGroups = ['All', ...Object.keys(PRESET_SIZES)];

    return (
        <div className="max-w-[1300px] mx-auto pb-12 space-y-6">
            <style>{`
                @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
                @keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
                .fade-up{animation:fadeUp 0.35s ease both}
            `}</style>

            {/* Toast */}
            {msg.text && (
                <div className={`fixed top-6 right-6 z-[2000] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-bold border
                    ${msg.type === 'success' ? 'bg-[#EAF8E7] text-[#4EA674] border-[#C1E6BA]' : 'bg-red-50 text-red-600 border-red-200'}`}
                    style={{ animation: 'slideIn 0.3s ease' }}>
                    {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {msg.text}
                </div>
            )}

            {/* Header */}
            <div className="fade-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-bold mb-2">
                        <span>Products</span><ChevronRight size={12} /><span>Attributes</span><ChevronRight size={12} />
                        <span className="text-[#4EA674]">Size Management</span>
                    </div>
                    <h1 className="text-2xl font-black text-[#023337] flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#EAF8E7' }}>
                            <Ruler size={18} style={{ color: '#4EA674' }} />
                        </div>
                        Size Management
                        <span className="text-sm font-black px-3 py-1 rounded-full" style={{ background: '#EAF8E7', color: '#4EA674' }}>{sizes.length} sizes</span>
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={addAllPresets}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-xl border border-[#C1E6BA] text-[#4EA674] hover:bg-[#EAF8E7] transition-all">
                        <Sparkles size={14} /> Load All World Sizes
                    </button>
                    <button onClick={clearAll}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-xl border border-red-100 text-red-400 hover:bg-red-50 transition-all">
                        <Trash2 size={14} /> Clear All
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 fade-up">
                {/* LEFT: Add + Presets */}
                <div className="space-y-4">
                    {/* Custom Add */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h3 className="text-sm font-black text-[#023337] mb-4 flex items-center gap-2">
                            <Plus size={15} style={{ color: '#4EA674' }} /> Add Custom Size
                        </h3>
                        <form onSubmit={addSize} className="space-y-3">
                            <input type="text" value={newSize} onChange={e => setNewSize(e.target.value)}
                                placeholder="e.g. XL, 42, 10.5..." autoFocus
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#4EA674] focus:bg-white transition-all" />
                            <button type="submit" disabled={!newSize.trim() || saving}
                                className="w-full py-3 text-white text-xs font-black rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                style={{ background: 'linear-gradient(135deg,#4EA674,#3d8d63)' }}>
                                <Plus size={15} /> Add Size
                            </button>
                        </form>
                    </div>

                    {/* Preset Groups */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-50" style={{ background: 'linear-gradient(to right,#f0fdf4,white)' }}>
                            <h3 className="text-sm font-black text-[#023337]">Quick Add by Category</h3>
                            <p className="text-[10px] text-gray-400 mt-0.5">Click to add entire size group</p>
                        </div>
                        <div className="p-3 space-y-1 max-h-96 overflow-y-auto">
                            {Object.entries(PRESET_SIZES).map(([group, groupSizes]) => {
                                const alreadyAdded = groupSizes.every(s => sizes.includes(s));
                                return (
                                    <button key={group} onClick={() => addPresetGroup(group, groupSizes)}
                                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group
                                            ${alreadyAdded ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50 text-gray-600'}`}>
                                        <span>{group}</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-black opacity-50">{groupSizes.length}</span>
                                            {alreadyAdded
                                                ? <CheckCircle2 size={13} className="text-green-500" />
                                                : <Plus size={13} className="opacity-0 group-hover:opacity-100 text-[#4EA674]" />
                                            }
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT: All Sizes Grid */}
                <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        style={{ background: 'linear-gradient(to right,#f0fdf4,white)' }}>
                        <h3 className="text-sm font-black text-[#023337] flex items-center gap-2">
                            All Sizes
                            {saving && <RefreshCw size={12} className="text-gray-300 animate-spin" />}
                        </h3>
                        <div className="relative w-full sm:w-72">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sizes..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#4EA674] transition-all" />
                        </div>
                    </div>
                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-8 h-8 border-4 border-[#EAF8E7] border-t-[#4EA674] rounded-full animate-spin" />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl">
                                <Ruler size={36} className="mx-auto text-gray-200 mb-3" />
                                <p className="text-gray-400 font-black">No sizes yet</p>
                                <p className="text-xs text-gray-300 mt-1">Click "Load All World Sizes" to get started instantly!</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {filtered.map((size, idx) => (
                                    <div key={size + idx}
                                        className="group flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl hover:border-[#4EA674] hover:bg-[#EAF8E7] transition-all cursor-default">
                                        <span className="text-sm font-black text-[#023337]">{size}</span>
                                        <button onClick={() => removeSize(size)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600">
                                            <Trash2 size={11} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {filtered.length > 0 && (
                        <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/50 text-xs text-gray-400 font-bold">
                            Showing {filtered.length} of {sizes.length} sizes · Hover a size to remove it
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SizeManagement;
