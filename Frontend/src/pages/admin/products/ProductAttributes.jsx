import React, { useState, useEffect, useRef } from 'react';
import {
    Tag, Search, Download, Plus, Edit2, Trash2, FileText,
    X, CheckCircle2, AlertCircle, ChevronRight, Settings,
    Hash, Type, ToggleLeft, List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../utils/api';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';

// ─── helpers ──────────────────────────────────────────────
const slugify = (str) => str.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

// ─── Inline Add Form (left panel like WooCommerce) ────────
const AddAttributePanel = ({ onCreated }) => {
    const [form, setForm] = useState({ name: '', slug: '', terms: '', type: 'select', is_active: true });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => {
            const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
            if (name === 'name' && (!prev.slug || prev.slug === slugify(prev.name))) {
                next.slug = slugify(value);
            }
            return next;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setMsg({ type: '', text: '' });
        try {
            await api.post('attributes/', form);
            setMsg({ type: 'success', text: 'Attribute added!' });
            setForm({ name: '', slug: '', terms: '', type: 'select', is_active: true });
            onCreated();
            setTimeout(() => setMsg({ type: '', text: '' }), 2000);
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to add attribute.' });
        } finally { setLoading(false); }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Plus size={14} className="text-brand" /> Add New Attribute
            </h2>

            {msg.text && (
                <div className={`mb-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${msg.type === 'success' ? 'bg-brand/10 text-brand border border-brand/20' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {msg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Type size={11} /> Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        name="name" required value={form.name} onChange={handleChange}
                        placeholder="e.g. Color, Size, Material"
                        className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-800 placeholder-gray-300 focus:outline-none focus:border-brand/40 focus:bg-white transition-all"
                    />
                    <p className="text-[10px] text-gray-400 font-medium">Unique name to identify this attribute. Used on the frontend.</p>
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Hash size={11} /> Slug <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-medium">pa_</span>
                        <input
                            name="slug" required value={form.slug} onChange={handleChange}
                            placeholder="color"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-500 placeholder-gray-300 focus:outline-none focus:border-brand/40 focus:bg-white transition-all"
                        />
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">Auto-generated. Used in URLs and product variations.</p>
                </div>

                {/* Type */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Settings size={11} /> Type
                    </label>
                    <select
                        name="type" value={form.type} onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:border-brand/40 focus:bg-white transition-all"
                    >
                        <option value="select">Select</option>
                        <option value="text">Text</option>
                        <option value="color">Color Swatch</option>
                        <option value="image">Image</option>
                        <option value="button">Button / Label</option>
                    </select>
                    <p className="text-[10px] text-gray-400 font-medium">Determines how this attribute is displayed.</p>
                </div>

                {/* Default Terms */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <List size={11} /> Default Terms
                    </label>
                    <input
                        name="terms" value={form.terms} onChange={handleChange}
                        placeholder="Red, Blue, Green, Black"
                        className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-800 placeholder-gray-300 focus:outline-none focus:border-brand/40 focus:bg-white transition-all"
                    />
                    <p className="text-[10px] text-gray-400 font-medium">Comma-separated terms. You can configure terms after saving.</p>
                </div>

                {/* Active toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 border-2 border-gray-100 rounded-xl">
                    <div>
                        <p className="text-xs font-black text-gray-700">Enabled</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Visible on the frontend</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="sr-only peer" />
                        <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-brand transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:shadow-sm after:transition-all peer-checked:after:translate-x-5" />
                    </label>
                </div>

                <button
                    type="submit" disabled={loading}
                    className="w-full py-3 bg-brand text-white text-sm font-black rounded-xl hover:bg-brand-dark transition-all shadow-lg shadow-brand/30 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                >
                    {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><Plus size={16} /> Add Attribute</>}
                </button>
            </form>
        </div>
    );
};

// ─── Edit / Terms Modal ────────────────────────────────────
const EditModal = ({ attr, onClose, onUpdated }) => {
    const [form, setForm] = useState({
        name: attr.name, slug: attr.slug,
        terms: attr.terms || '', type: attr.type || 'select', is_active: attr.is_active
    });
    const [newTerm, setNewTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const termsList = form.terms ? form.terms.split(',').map(t => t.trim()).filter(Boolean) : [];

    const addTerm = () => {
        if (!newTerm.trim()) return;
        const updated = [...termsList, newTerm.trim()].join(', ');
        setForm(p => ({ ...p, terms: updated }));
        setNewTerm('');
    };

    const removeTerm = (t) => {
        const updated = termsList.filter(x => x !== t).join(', ');
        setForm(p => ({ ...p, terms: updated }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setMsg({ type: '', text: '' });
        try {
            await api.patch(`attributes/${attr.id}/`, form);
            setMsg({ type: 'success', text: 'Saved!' });
            onUpdated();
            setTimeout(onClose, 1200);
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.detail || 'Update failed.' });
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 shrink-0 bg-brand-accent/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                            <Edit2 size={18} className="text-brand" />
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900">Edit Attribute: {attr.name}</h3>
                            <p className="text-xs text-gray-400 font-medium">Configure attribute and manage its terms</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-400"><X size={18} /></button>
                </div>

                <form className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    {msg.text && (
                        <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${msg.type === 'success' ? 'bg-brand/10 text-brand border border-brand/20' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            {msg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                            {msg.text}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Name *</label>
                            <input name="name" required value={form.name} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:border-brand/40 focus:bg-white transition-all" />
                        </div>
                        {/* Slug */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Slug *</label>
                            <input name="slug" required value={form.slug} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-500 focus:outline-none focus:border-brand/40 focus:bg-white transition-all" />
                        </div>
                    </div>

                    {/* Type */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Type</label>
                        <select name="type" value={form.type} onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:border-brand/40 focus:bg-white transition-all">
                            <option value="select">Select</option>
                            <option value="text">Text</option>
                            <option value="color">Color Swatch</option>
                            <option value="image">Image</option>
                            <option value="button">Button / Label</option>
                        </select>
                    </div>

                    {/* Terms Manager */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                            <List size={11} /> Configure Terms
                        </label>
                        {/* Add term input */}
                        <div className="flex gap-2">
                            <input value={newTerm} onChange={e => setNewTerm(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTerm())}
                                placeholder="Add a term (press Enter)"
                                className="flex-1 px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-800 placeholder-gray-300 focus:outline-none focus:border-brand/40 focus:bg-white transition-all"
                            />
                            <button type="button" onClick={addTerm}
                                className="px-4 py-2.5 bg-brand text-white text-xs font-black rounded-xl hover:bg-brand-dark transition-all">
                                Add
                            </button>
                        </div>
                        {/* Terms list */}
                        <div className="flex flex-wrap gap-2 min-h-[44px] p-3 bg-gray-50 border-2 border-gray-100 rounded-xl">
                            {termsList.length === 0 && <p className="text-[11px] text-gray-300 font-bold italic">No terms yet. Add terms above.</p>}
                            <AnimatePresence>
                                {termsList.map(t => (
                                    <motion.span key={t}
                                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-black text-gray-700 shadow-sm"
                                    >
                                        {t}
                                        <button type="button" onClick={() => removeTerm(t)} className="text-gray-400 hover:text-red-500 transition-colors ml-0.5">
                                            <X size={11} />
                                        </button>
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Active */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 border-2 border-gray-100 rounded-xl">
                        <div>
                            <p className="text-xs font-black text-gray-700">Enabled</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Visible on frontend</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="sr-only peer" />
                            <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-brand transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:shadow-sm after:transition-all peer-checked:after:translate-x-5" />
                        </label>
                    </div>
                </form>

                <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
                    <button type="button" onClick={onClose}
                        className="flex-1 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSubmit} disabled={loading}
                        className="flex-[2] py-2.5 bg-brand hover:bg-brand-dark text-white text-sm font-black rounded-xl shadow-lg shadow-brand/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                        {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><CheckCircle2 size={16} /> Save Changes</>}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// ─── Delete Confirm ────────────────────────────────────────
const DeleteConfirm = ({ attr, onClose, onDeleted }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await api.delete(`attributes/${attr.id}/`);
            onDeleted(attr.id);
            onClose();
        } catch (err) {
            console.error('Delete failed:', err.response?.data || err.message);
            const errorMsg = err.response?.data?.detail || 'This attribute may be in use by products.';
            alert(`Delete failed: ${errorMsg}`);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-red-400 to-red-600" />
                <div className="px-6 py-6 text-center">
                    <div className="mx-auto w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
                        <Trash2 size={24} className="text-red-500" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Delete Attribute?</h3>
                    <p className="text-sm text-gray-500 font-medium mt-2 leading-relaxed">
                        You are about to delete <span className="font-black text-gray-800">"{attr.name}"</span>.
                        <br />Associated terms will be removed and products may be affected.
                    </p>
                </div>
                <div className="px-6 pb-6 flex gap-3">
                    <button onClick={onClose} disabled={loading}
                        className="flex-1 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all disabled:opacity-50">
                        Cancel
                    </button>
                    <button onClick={handleDelete} disabled={loading}
                        className="flex-[1.5] py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-black rounded-xl shadow-lg shadow-red-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deleting...</> : <><Trash2 size={15} /> Yes, Delete</>}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// ══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════
const ProductAttributes = () => {
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [editingAttr, setEditingAttr] = useState(null);
    const [deletingAttr, setDeletingAttr] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const refresh = () => setRefreshKey(k => k + 1);

    const fetchAttributes = async () => {
        setLoading(true);
        try {
            let url = `attributes/?page=${page}`;
            if (searchTerm) url += `&search=${searchTerm}`;
            const res = await api.get(url);
            const data = res.data.results || res.data;
            setAttributes(data);
            setPagination({ count: res.data.count || data.length, next: res.data.next, previous: res.data.previous });
        } catch (err) {
            console.error(err);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchAttributes(); }, [page, searchTerm, refreshKey]);

    // Exports
    const handleExportExcel = () => exportToExcel(attributes.map(a => ({ Name: a.name, Slug: a.slug, Terms: a.terms, Type: a.type, Status: a.is_active ? 'Active' : 'Inactive' })), 'Attributes');
    const handleExportCSV = () => exportToCSV(attributes.map(a => ({ Name: a.name, Slug: a.slug, Terms: a.terms, Type: a.type, Status: a.is_active ? 'Active' : 'Inactive' })), 'Attributes');
    const handleExportPDF = () => exportToPDF(attributes.map(a => [a.name, a.slug, a.terms || '', a.is_active ? 'Active' : 'Inactive']), ['Name', 'Slug', 'Terms', 'Status'], 'Attributes', 'Product Attributes');

    return (
        <div className="max-w-[1600px] mx-auto pb-10">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Tag size={22} className="text-brand" /> Product Attributes</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Define global product attributes like Color, Size, Material for use in product variations.</p>
                </div>
                <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all">
                        <Download size={15} className="text-brand" /> Excel
                    </button>
                    <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all">
                        <Download size={15} className="text-blue-500" /> CSV
                    </button>
                    <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all">
                        <FileText size={15} className="text-red-500" /> PDF
                    </button>
                </div>
            </div>

            {/* Two-column WooCommerce layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* LEFT: Add Form */}
                <div className="xl:col-span-1">
                    <AddAttributePanel onCreated={refresh} />
                </div>

                {/* RIGHT: Table */}
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                        {/* Toolbar */}
                        <div className="p-4 border-b border-gray-50 flex items-center gap-3 bg-gray-50/30">
                            <div className="relative flex-1 max-w-sm">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text" placeholder="Search attributes..."
                                    value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand/40 font-medium text-gray-700 shadow-sm transition-all"
                                />
                            </div>
                            <span className="text-xs text-gray-400 font-black ml-auto">{pagination.count} attribute{pagination.count !== 1 ? 's' : ''}</span>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-brand-accent/50 text-brand-dark font-bold uppercase text-[10px] tracking-wider">
                                    <tr>
                                        <th className="px-5 py-4">Attribute</th>
                                        <th className="px-5 py-4 text-center">Slug</th>
                                        <th className="px-5 py-4 text-center">Type</th>
                                        <th className="px-5 py-4">Terms</th>
                                        <th className="px-5 py-4 text-center">Status</th>
                                        <th className="px-5 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading && Array(4).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                                            <td className="px-5 py-4 text-center"><div className="h-4 bg-gray-100 rounded w-16 mx-auto" /></td>
                                            <td className="px-5 py-4 text-center"><div className="h-4 bg-gray-100 rounded w-14 mx-auto" /></td>
                                            <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-32" /></td>
                                            <td className="px-5 py-4 text-center"><div className="h-6 bg-gray-100 rounded-full w-16 mx-auto" /></td>
                                            <td className="px-5 py-4" />
                                        </tr>
                                    ))}
                                    {!loading && attributes.map(attr => {
                                        const termsList = (attr.terms || '').split(',').map(t => t.trim()).filter(Boolean);
                                        return (
                                            <tr key={attr.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 font-black text-xs border border-brand/20 group-hover:bg-brand group-hover:text-white transition-all uppercase">
                                                            {attr.name.slice(0, 2)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-800 text-sm group-hover:text-brand transition-colors">{attr.name}</p>
                                                            <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                                                <ChevronRight size={10} /> Configure terms
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <span className="text-xs font-black text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg font-mono">pa_{attr.slug}</span>
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <span className="text-[10px] font-black uppercase text-gray-500 bg-gray-100 px-2 py-1 rounded">{attr.type || 'select'}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {termsList.slice(0, 4).map((t, i) => (
                                                            <span key={i} className="px-2 py-0.5 bg-brand-accent border border-brand/20 text-brand-dark text-[10px] font-black rounded">{t}</span>
                                                        ))}
                                                        {termsList.length > 4 && (
                                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-black rounded">+{termsList.length - 4}</span>
                                                        )}
                                                        {termsList.length === 0 && <span className="text-[10px] text-gray-300 font-bold italic">No terms</span>}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase rounded-full ${attr.is_active ? 'bg-brand/10 text-brand' : 'bg-gray-100 text-gray-500'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${attr.is_active ? 'bg-brand' : 'bg-gray-400'}`} />
                                                        {attr.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                        <button
                                                            onClick={() => setEditingAttr(attr)}
                                                            className="p-2 text-brand hover:bg-brand-accent rounded-lg transition-colors border border-brand/10 bg-white shadow-sm"
                                                            title="Edit / Configure Terms"
                                                        >
                                                            <Edit2 size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeletingAttr(attr)}
                                                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors border border-red-50 bg-white shadow-sm"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {!loading && attributes.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Tag size={40} className="text-gray-200" />
                                                    <p className="text-gray-400 font-black uppercase text-xs">No attributes found.</p>
                                                    <p className="text-gray-300 font-medium text-xs">Use the form on the left to add your first attribute.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.count > 0 && (
                            <div className="p-4 flex items-center justify-between border-t border-gray-50 bg-gray-50/30">
                                <span className="text-[10px] text-gray-400 font-black uppercase">Page {page}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={!pagination.previous || loading}
                                        className="px-4 py-2 text-[10px] font-black uppercase border border-gray-200 rounded-xl bg-white shadow-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                                        ← Prev
                                    </button>
                                    <button onClick={() => setPage(p => p + 1)} disabled={!pagination.next || loading}
                                        className="px-4 py-2 text-[10px] font-black uppercase border border-gray-200 rounded-xl bg-white shadow-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                                        Next →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Info box */}
                    <div className="mt-4 p-4 bg-brand-accent/50 border border-brand/10 rounded-2xl text-xs text-brand-dark font-bold flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">i</div>
                        <div>
                            <p className="font-black">About Product Attributes</p>
                            <p className="font-medium mt-0.5 opacity-80">Attributes you define here can be used in product variations. For example, a "Color" attribute with terms "Red, Blue, Green" lets you create separate variations per color.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {editingAttr && (
                <EditModal
                    attr={editingAttr}
                    onClose={() => setEditingAttr(null)}
                    onUpdated={refresh}
                />
            )}
            {deletingAttr && (
                <DeleteConfirm
                    attr={deletingAttr}
                    onClose={() => setDeletingAttr(null)}
                    onDeleted={(id) => { setAttributes(p => p.filter(a => a.id !== id)); setPagination(p => ({ ...p, count: p.count - 1 })); }}
                />
            )}
        </div>
    );
};

export default ProductAttributes;
