import React, { useState, useEffect } from 'react';
import {
    Palette, Plus, Search, Trash2, CheckCircle2, AlertCircle,
    ChevronRight, Sparkles, RefreshCw, X
} from 'lucide-react';
import api from '../../../../utils/api';

// ── ALL WORLD COLORS WITH HEX ────────────────────────────────────────────────
const PRESET_COLORS = {
    'Neutral': [
        { name: 'White', hex: '#FFFFFF' }, { name: 'Off White', hex: '#FAF9F6' },
        { name: 'Ivory', hex: '#FFFFF0' }, { name: 'Cream', hex: '#FFFDD0' },
        { name: 'Beige', hex: '#F5F5DC' }, { name: 'Sand', hex: '#C2B280' },
        { name: 'Khaki', hex: '#C3B091' }, { name: 'Taupe', hex: '#483C32' },
        { name: 'Light Gray', hex: '#D3D3D3' }, { name: 'Gray', hex: '#808080' },
        { name: 'Dark Gray', hex: '#A9A9A9' }, { name: 'Charcoal', hex: '#36454F' },
        { name: 'Black', hex: '#000000' },
    ],
    'Browns': [
        { name: 'Light Brown', hex: '#C19A6B' }, { name: 'Brown', hex: '#964B00' },
        { name: 'Dark Brown', hex: '#5C4033' }, { name: 'Chocolate', hex: '#7B3F00' },
        { name: 'Caramel', hex: '#C68642' }, { name: 'Tan', hex: '#D2B48C' },
        { name: 'Rust', hex: '#B7410E' }, { name: 'Mahogany', hex: '#C04000' },
        { name: 'Sienna', hex: '#A0522D' }, { name: 'Umber', hex: '#635147' },
    ],
    'Reds': [
        { name: 'Pastel Pink', hex: '#FFD1DC' }, { name: 'Baby Pink', hex: '#F4C2C2' },
        { name: 'Hot Pink', hex: '#FF69B4' }, { name: 'Pink', hex: '#FFC0CB' },
        { name: 'Rose', hex: '#E8A6B0' }, { name: 'Blush', hex: '#DE5D83' },
        { name: 'Coral', hex: '#FF7F7F' }, { name: 'Salmon', hex: '#FA8072' },
        { name: 'Light Red', hex: '#FF6B6B' }, { name: 'Red', hex: '#FF0000' },
        { name: 'Crimson', hex: '#DC143C' }, { name: 'Dark Red', hex: '#8B0000' },
        { name: 'Maroon', hex: '#800000' }, { name: 'Wine', hex: '#722F37' },
        { name: 'Burgundy', hex: '#800020' },
    ],
    'Oranges & Yellows': [
        { name: 'Light Orange', hex: '#FFB347' }, { name: 'Orange', hex: '#FF7F00' },
        { name: 'Dark Orange', hex: '#FF4500' }, { name: 'Amber', hex: '#FFBF00' },
        { name: 'Gold', hex: '#FFD700' }, { name: 'Yellow', hex: '#FFFF00' },
        { name: 'Lemon', hex: '#FFF44F' }, { name: 'Mustard', hex: '#FFDB58' },
        { name: 'Ochre', hex: '#CC7722' }, { name: 'Peach', hex: '#FFDAB9' },
        { name: 'Apricot', hex: '#FBCEB1' }, { name: 'Champagne', hex: '#F7E7CE' },
    ],
    'Greens': [
        { name: 'Mint', hex: '#C3FBD8' }, { name: 'Mint Green', hex: '#98FF98' },
        { name: 'Lime', hex: '#32CD32' }, { name: 'Light Green', hex: '#90EE90' },
        { name: 'Green', hex: '#008000' }, { name: 'Emerald', hex: '#50C878' },
        { name: 'Sage', hex: '#B2AC88' }, { name: 'Olive', hex: '#808000' },
        { name: 'Moss', hex: '#8A9A5B' }, { name: 'Forest Green', hex: '#228B22' },
        { name: 'Dark Green', hex: '#006400' }, { name: 'Hunter Green', hex: '#355E3B' },
        { name: 'Teal', hex: '#008080' }, { name: 'Jade', hex: '#00A86B' },
        { name: 'Pistachio', hex: '#93C572' },
    ],
    'Blues': [
        { name: 'Baby Blue', hex: '#89CFF0' }, { name: 'Sky Blue', hex: '#87CEEB' },
        { name: 'Powder Blue', hex: '#B0E0E6' }, { name: 'Light Blue', hex: '#ADD8E6' },
        { name: 'Cornflower', hex: '#6495ED' }, { name: 'Blue', hex: '#0000FF' },
        { name: 'Royal Blue', hex: '#4169E1' }, { name: 'Cobalt', hex: '#0047AB' },
        { name: 'Navy', hex: '#001F5B' }, { name: 'Dark Blue', hex: '#00008B' },
        { name: 'Midnight Blue', hex: '#191970' }, { name: 'Denim', hex: '#1560BD' },
        { name: 'Steel Blue', hex: '#4682B4' }, { name: 'Slate Blue', hex: '#6A5ACD' },
        { name: 'Periwinkle', hex: '#CCCCFF' },
    ],
    'Purples': [
        { name: 'Lavender', hex: '#E6E6FA' }, { name: 'Lilac', hex: '#C8A2C8' },
        { name: 'Light Purple', hex: '#D8B4FE' }, { name: 'Purple', hex: '#800080' },
        { name: 'Violet', hex: '#7F00FF' }, { name: 'Plum', hex: '#DDA0DD' },
        { name: 'Mauve', hex: '#E0B0FF' }, { name: 'Amethyst', hex: '#9966CC' },
        { name: 'Orchid', hex: '#DA70D6' }, { name: 'Fuchsia', hex: '#FF00FF' },
        { name: 'Magenta', hex: '#FF00FF' }, { name: 'Dark Purple', hex: '#4B0082' },
        { name: 'Indigo', hex: '#4B0082' }, { name: 'Eggplant', hex: '#614051' },
    ],
    'Metallic': [
        { name: 'Silver', hex: '#C0C0C0' }, { name: 'Gold', hex: '#FFD700' },
        { name: 'Rose Gold', hex: '#B76E79' }, { name: 'Bronze', hex: '#CD7F32' },
        { name: 'Copper', hex: '#B87333' }, { name: 'Platinum', hex: '#E5E4E2' },
        { name: 'Gunmetal', hex: '#2a3439' },
    ],
    'Special': [
        { name: 'Multi-Color', hex: 'linear-gradient(135deg,#ff0000,#ff7700,#ffff00,#00ff00,#0000ff,#8b00ff)' },
        { name: 'Print', hex: '#6B7280' }, { name: 'Tie-Dye', hex: '#9333EA' },
        { name: 'Striped', hex: '#374151' }, { name: 'Camouflage', hex: '#78866B' },
        { name: 'Transparent', hex: 'rgba(0,0,0,0)' }, { name: 'Neon Green', hex: '#39FF14' },
        { name: 'Neon Pink', hex: '#FF10F0' }, { name: 'Neon Orange', hex: '#FF6700' },
        { name: 'Neon Yellow', hex: '#DFFF11' },
    ],
};

const ColorManagement = () => {
    const [colors, setColors] = useState([]); // [{name, hex}]
    const [newName, setNewName] = useState('');
    const [newHex, setNewHex] = useState('#000000');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [activeGroup, setActiveGroup] = useState('All');

    const showMsg = (type, text) => {
        setMsg({ type, text });
        setTimeout(() => setMsg({ type: '', text: '' }), 2500);
    };

    // Serialize: "Red:#FF0000,Blue:#0000FF"
    const serialize = (list) => list.map(c => `${c.name}:${c.hex}`).join(',');
    const deserialize = (str) => {
        if (!str) return [];
        return str.split(',').map(item => {
            const colonIdx = item.indexOf(':');
            if (colonIdx === -1) return { name: item.trim(), hex: '#888888' };
            return { name: item.slice(0, colonIdx).trim(), hex: item.slice(colonIdx + 1).trim() };
        }).filter(c => c.name);
    };

    useEffect(() => { fetchColors(); }, []);

    const fetchColors = async () => {
        setLoading(true);
        try {
            const res = await api.get('attributes/');
            const all = res.data.results || res.data;
            const target = all.find(a =>
                a.name?.toLowerCase() === 'color' ||
                a.name?.toLowerCase() === 'colors' ||
                a.name?.toLowerCase() === 'product color'
            );
            if (target?.terms) setColors(deserialize(target.terms));
        } catch {
        } finally { setLoading(false); }
    };

    const saveToBackend = async (list) => {
        setSaving(true);
        try {
            const res = await api.get('attributes/');
            const all = res.data.results || res.data;
            const target = all.find(a =>
                a.name?.toLowerCase() === 'color' ||
                a.name?.toLowerCase() === 'colors' ||
                a.name?.toLowerCase() === 'product color'
            );
            const termsStr = serialize(list);
            if (target) {
                await api.patch(`attributes/${target.id}/`, { terms: termsStr });
            } else {
                await api.post('attributes/', { name: 'Color', terms: termsStr });
            }
        } catch { } finally { setSaving(false); }
    };

    const addColor = async (e) => {
        e?.preventDefault();
        const name = newName.trim();
        if (!name) return;
        if (colors.find(c => c.name.toLowerCase() === name.toLowerCase())) {
            showMsg('error', `"${name}" already exists!`); return;
        }
        const updated = [...colors, { name, hex: newHex }];
        setColors(updated);
        setNewName(''); setNewHex('#000000');
        showMsg('success', `Color "${name}" added!`);
        await saveToBackend(updated);
    };

    const removeColor = async (name) => {
        const updated = colors.filter(c => c.name !== name);
        setColors(updated);
        await saveToBackend(updated);
    };

    const addPresetGroup = async (groupName, groupColors) => {
        const toAdd = groupColors.filter(pc => !colors.find(c => c.name === pc.name));
        if (!toAdd.length) { showMsg('error', 'All colors in this group already added!'); return; }
        const updated = [...colors, ...toAdd];
        setColors(updated);
        showMsg('success', `Added ${toAdd.length} colors from "${groupName}"!`);
        await saveToBackend(updated);
    };

    const addAllPresets = async () => {
        const all = Object.values(PRESET_COLORS).flat();
        const merged = [...colors];
        all.forEach(pc => { if (!merged.find(c => c.name === pc.name)) merged.push(pc); });
        setColors(merged);
        showMsg('success', `Loaded ${merged.length} world-standard colors!`);
        await saveToBackend(merged);
    };

    const clearAll = async () => {
        if (!window.confirm('Remove all colors?')) return;
        setColors([]);
        await saveToBackend([]);
        showMsg('success', 'All colors cleared.');
    };

    const filtered = colors.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const isGradient = (hex) => hex?.startsWith('linear') || hex?.startsWith('rgba(0,0,0,0)');

    const Swatch = ({ color, onRemove }) => (
        <div className="group relative flex flex-col items-center gap-1.5 p-2 rounded-xl border border-gray-100 hover:border-gray-300 transition-all bg-white cursor-default">
            <div className="w-10 h-10 rounded-lg shadow-sm border border-white/50 ring-1 ring-gray-200"
                style={isGradient(color.hex)
                    ? { background: color.hex }
                    : { backgroundColor: color.hex, border: color.hex === '#FFFFFF' ? '1px solid #e5e7eb' : undefined }
                } />
            <span className="text-[9px] font-black text-gray-600 text-center leading-tight max-w-[56px] truncate">{color.name}</span>
            <span className="text-[8px] text-gray-300 font-mono">{color.hex.startsWith('#') ? color.hex.toUpperCase() : '—'}</span>
            <button onClick={() => onRemove(color.name)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-md">
                <X size={9} className="text-white" />
            </button>
        </div>
    );

    const groups = ['All', ...Object.keys(PRESET_COLORS)];

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
                        <span className="text-[#4EA674]">Color Management</span>
                    </div>
                    <h1 className="text-2xl font-black text-[#023337] flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden"
                            style={{ background: 'linear-gradient(135deg,#FF6B6B,#FFD700,#4EA674,#3B82F6,#8B5CF6)' }}>
                            <Palette size={18} className="text-white drop-shadow" />
                        </div>
                        Color Management
                        <span className="text-sm font-black px-3 py-1 rounded-full" style={{ background: '#EAF8E7', color: '#4EA674' }}>{colors.length} colors</span>
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={addAllPresets}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-xl border border-[#C1E6BA] text-[#4EA674] hover:bg-[#EAF8E7] transition-all">
                        <Sparkles size={14} /> Load All World Colors
                    </button>
                    <button onClick={clearAll}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-xl border border-red-100 text-red-400 hover:bg-red-50 transition-all">
                        <Trash2 size={14} /> Clear All
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 fade-up">
                {/* LEFT */}
                <div className="space-y-4">
                    {/* Custom Add */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h3 className="text-sm font-black text-[#023337] mb-4 flex items-center gap-2">
                            <Plus size={15} style={{ color: '#4EA674' }} /> Add Custom Color
                        </h3>
                        <form onSubmit={addColor} className="space-y-3">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Color Name</label>
                                <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
                                    placeholder="e.g. Midnight Blue"
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#4EA674] transition-all" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Color Picker</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={newHex} onChange={e => setNewHex(e.target.value)}
                                        className="w-14 h-12 rounded-xl border-2 border-gray-100 cursor-pointer p-0.5" />
                                    <input type="text" value={newHex} onChange={e => setNewHex(e.target.value)} maxLength={7}
                                        className="flex-1 px-3 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-mono focus:outline-none focus:border-[#4EA674] transition-all" />
                                </div>
                            </div>
                            <button type="submit" disabled={!newName.trim() || saving}
                                className="w-full py-3 text-white text-xs font-black rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                style={{ background: 'linear-gradient(135deg,#4EA674,#3d8d63)' }}>
                                <Plus size={15} /> Add Color
                            </button>
                        </form>
                    </div>

                    {/* Preset Groups */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-50" style={{ background: 'linear-gradient(to right,#f0fdf4,white)' }}>
                            <h3 className="text-sm font-black text-[#023337]">Quick Add by Family</h3>
                        </div>
                        <div className="p-3 space-y-1">
                            {Object.entries(PRESET_COLORS).map(([group, groupColors]) => {
                                const alreadyAdded = groupColors.every(pc => colors.find(c => c.name === pc.name));
                                const samples = groupColors.slice(0, 4);
                                return (
                                    <button key={group} onClick={() => addPresetGroup(group, groupColors)}
                                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all group
                                            ${alreadyAdded ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50 text-gray-600'}`}>
                                        <div className="flex items-center justify-between">
                                            <span>{group}</span>
                                            <div className="flex items-center gap-1">
                                                {samples.map((s, i) => (
                                                    <div key={i} className="w-3.5 h-3.5 rounded-full border border-white shadow-sm"
                                                        style={{ backgroundColor: s.hex.startsWith('#') ? s.hex : '#888' }} />
                                                ))}
                                                {alreadyAdded
                                                    ? <CheckCircle2 size={12} className="text-green-500 ml-1" />
                                                    : <Plus size={12} className="opacity-0 group-hover:opacity-100 text-[#4EA674] ml-1" />
                                                }
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Color Swatches */}
                <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        style={{ background: 'linear-gradient(to right,#f0fdf4,white)' }}>
                        <h3 className="text-sm font-black text-[#023337] flex items-center gap-2">
                            All Colors
                            {saving && <RefreshCw size={12} className="text-gray-300 animate-spin" />}
                        </h3>
                        <div className="relative w-full sm:w-72">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search colors..."
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
                                <Palette size={36} className="mx-auto text-gray-200 mb-3" />
                                <p className="text-gray-400 font-black">No colors yet</p>
                                <p className="text-xs text-gray-300 mt-1">Click "Load All World Colors" to get all {Object.values(PRESET_COLORS).flat().length}+ colors instantly!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
                                {filtered.map((color, idx) => (
                                    <Swatch key={color.name + idx} color={color} onRemove={removeColor} />
                                ))}
                            </div>
                        )}
                    </div>

                    {filtered.length > 0 && (
                        <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/50 text-xs text-gray-400 font-bold">
                            {filtered.length} of {colors.length} colors · Hover a swatch to remove it
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ColorManagement;
