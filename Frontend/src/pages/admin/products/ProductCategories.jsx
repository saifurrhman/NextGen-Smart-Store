import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Plus, Trash2, Tag, Layers, Grid, Download, FileText,
    X, CheckCircle2, AlertCircle, Upload, ImageIcon, Edit2,
    Monitor, Shirt, Headphones, Coffee, Dumbbell, Book,
    Package, ChevronRight, LayoutGrid, List as ListIcon,
    Sparkles, TrendingUp, Zap, RefreshCw
} from 'lucide-react';
import api from '../../../utils/api';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';

const ICONS = [Monitor, Shirt, Headphones, Coffee, Grid, Layers, Dumbbell, Book, Package, Tag];
const ICON_COLORS = [
    { bg: '#EAF8E7', color: '#4EA674' },
    { bg: '#EFF6FF', color: '#3B82F6' },
    { bg: '#FEF3C7', color: '#D97706' },
    { bg: '#FDF2F8', color: '#EC4899' },
    { bg: '#F0FDF4', color: '#16A34A' },
    { bg: '#EDE9FE', color: '#7C3AED' },
    { bg: '#FFF1F2', color: '#E11D48' },
    { bg: '#F0F9FF', color: '#0284C7' },
];

// Converts relative Django media URLs to full URLs
// Django ImageField returns: "categories/images/file.jpg" (no /media/ prefix)
const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/media/')) return `http://localhost:8000${url}`;
    return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
};

const ProductCategories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ is_active: '' });
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [viewMode, setViewMode] = useState('table');
    const [selectedSlugs, setSelectedSlugs] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [createLoading, setCreateLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const defaultForm = { name: '', slug: '', description: '', parent: null, is_active: true, imagePreview: null, imageFile: null };
    const [formData, setFormData] = useState(defaultForm);
    const [editData, setEditData] = useState(defaultForm);
    const addImageRef = useRef(null);
    const editImageRef = useRef(null);
    const pollRef = useRef(null);

    const fetchCategories = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        try {
            let url = `categories/?page=${page}&search=${searchTerm}`;
            if (filters.is_active !== '') url += `&is_active=${filters.is_active}`;
            const response = await api.get(url);
            const data = response.data.results || response.data;
            const totalCount = response.data.count || data.length;
            setCategories(data);
            setPagination({ count: totalCount, next: response.data.next, previous: response.data.previous });
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [page, searchTerm, filters]);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    // Real-time poll every 8 seconds
    useEffect(() => {
        pollRef.current = setInterval(() => fetchCategories(true), 8000);
        return () => clearInterval(pollRef.current);
    }, [fetchCategories]);

    const showMsg = (type, text) => {
        setMsg({ type, text });
        setTimeout(() => setMsg({ type: '', text: '' }), 3500);
    };

    const isAllSelected = categories.length > 0 && categories.every(c => selectedSlugs.includes(c.slug));
    const toggleAll = () => { if (isAllSelected) setSelectedSlugs([]); else setSelectedSlugs(categories.map(c => c.slug)); };
    const toggleOne = (slug) => setSelectedSlugs(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
    const clearSelection = () => setSelectedSlugs([]);
    const autoSlug = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const handleFormChange = (e, isEdit = false) => {
        const { name, value, type, checked } = e.target;
        const setter = isEdit ? setEditData : setFormData;
        setter(prev => {
            const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
            if (name === 'name' && !isEdit) updated.slug = autoSlug(value);
            return updated;
        });
    };

    const handleImageChange = (e, isEdit = false) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const setter = isEdit ? setEditData : setFormData;
            setter(prev => ({ ...prev, imagePreview: ev.target.result, imageFile: file }));
        };
        reader.readAsDataURL(file);
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        try {
            const fd = new FormData();
            fd.append('name', formData.name);
            fd.append('slug', formData.slug);
            fd.append('description', formData.description || '');
            fd.append('is_active', formData.is_active);
            if (formData.parent) fd.append('parent', formData.parent);
            if (formData.imageFile) fd.append('image', formData.imageFile);
            await api.post('categories/', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            showMsg('success', 'Category created successfully!');
            setFormData(defaultForm);
            setShowAddModal(false);
            setPage(1);
            fetchCategories();
        } catch (error) {
            showMsg('error', error.response?.data?.detail || 'Failed to create category.');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleEditOpen = (cat) => {
        setEditingCategory(cat);
        setEditData({ name: cat.name, slug: cat.slug, description: cat.description || '', parent: cat.parent || null, is_active: cat.is_active, imagePreview: cat.image || null, imageFile: null });
        setShowEditModal(true);
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        try {
            const fd = new FormData();
            fd.append('name', editData.name);
            fd.append('slug', editData.slug);
            fd.append('description', editData.description || '');
            fd.append('is_active', editData.is_active);
            if (editData.parent) fd.append('parent', editData.parent);
            if (editData.imageFile) fd.append('image', editData.imageFile);
            const res = await api.patch(`categories/${editingCategory.slug}/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setCategories(prev => prev.map(c => c.slug === editingCategory.slug ? res.data : c));
            showMsg('success', 'Category updated successfully!');
            setShowEditModal(false);
        } catch (error) {
            showMsg('error', error.response?.data?.detail || 'Failed to update category.');
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;
        setDeleteLoading(categoryToDelete.slug);
        try {
            await api.delete(`categories/${categoryToDelete.slug}/`);
            setCategories(prev => prev.filter(c => c.slug !== categoryToDelete.slug));
            setPagination(prev => ({ ...prev, count: prev.count - 1 }));
            setSelectedSlugs(prev => prev.filter(s => s !== categoryToDelete.slug));
            showMsg('success', `"${categoryToDelete.name}" deleted!`);
        } catch (error) {
            showMsg('error', 'Failed to delete category.');
        } finally {
            setDeleteLoading(null);
            setShowDeleteConfirm(false);
            setCategoryToDelete(null);
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedSlugs.length} categories?`)) return;
        setBulkDeleteLoading(true);
        try {
            const results = await Promise.allSettled(selectedSlugs.map(slug => api.delete(`categories/${slug}/`)));
            const successSlugs = selectedSlugs.filter((_, i) => results[i].status === 'fulfilled');
            if (successSlugs.length > 0) {
                setCategories(prev => prev.filter(c => !successSlugs.includes(c.slug)));
                setPagination(prev => ({ ...prev, count: prev.count - successSlugs.length }));
                setSelectedSlugs(prev => prev.filter(s => !successSlugs.includes(s)));
            }
            showMsg(results.every(r => r.status === 'fulfilled') ? 'success' : 'error', `${successSlugs.length} deleted${results.length - successSlugs.length > 0 ? `, ${results.length - successSlugs.length} failed` : ''}.`);
        } finally {
            setBulkDeleteLoading(false);
        }
    };

    const getExportData = () => (selectedSlugs.length > 0 ? categories.filter(c => selectedSlugs.includes(c.slug)) : categories);
    const handleExportExcel = () => exportToExcel(getExportData().map(c => ({ Name: c.name, Slug: c.slug, Status: c.is_active ? 'Active' : 'Inactive', Created: new Date(c.created_at).toLocaleDateString() })), 'Product_Categories');
    const handleExportCSV = () => exportToCSV(getExportData().map(c => ({ Name: c.name, Slug: c.slug, Status: c.is_active ? 'Active' : 'Inactive', Created: new Date(c.created_at).toLocaleDateString() })), 'Product_Categories');
    const handleExportPDF = () => exportToPDF(getExportData().map(c => [c.name, c.slug, c.is_active ? 'Active' : 'Inactive', new Date(c.created_at).toLocaleDateString()]), ['Name', 'Slug', 'Status', 'Created'], 'Product_Categories', 'Category Report');

    const filterOptions = [{ key: 'is_active', label: 'Status', options: [{ label: 'All Status', value: '' }, { label: 'Active', value: 'true' }, { label: 'Inactive', value: 'false' }] }];

    const ModalInput = ({ label, required, hint, children }) => (
        <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            {children}
            {hint && <p className="text-[10px] text-gray-400 ml-1">{hint}</p>}
        </div>
    );

    const ImageUploadBox = ({ preview, fileRef, onChange, label }) => (
        <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
            <div onClick={() => fileRef.current?.click()} className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all overflow-hidden ${preview ? 'border-emerald-300 bg-emerald-50/20' : 'border-gray-200 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/30'}`} style={{ height: 130 }}>
                {preview ? (
                    <>
                        <img src={preview} alt="preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                            <div className="text-white text-xs font-bold flex items-center gap-1"><Upload size={14} /> Change</div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                        <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-500 transition-all"><ImageIcon size={20} /></div>
                        <span className="text-xs font-bold">Click to upload</span>
                        <span className="text-[10px]">PNG, JPG, WebP</span>
                    </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
            </div>
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto pb-12 space-y-6">

            {/* ── TOAST ─── */}
            {msg.text && (
                <div className={`fixed top-6 right-6 z-[2000] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-bold border animate-bounce-in
                    ${msg.type === 'success' ? 'bg-[#EAF8E7] text-[#4EA674] border-[#C1E6BA]' : 'bg-red-50 text-red-600 border-red-200'}`}
                    style={{ animation: 'slideIn 0.3s ease' }}>
                    {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {msg.text}
                </div>
            )}

            <style>{`
                @keyframes slideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse-ring { 0%,100%{opacity:1} 50%{opacity:.5} }
                .fade-up { animation: fadeUp 0.4s ease both; }
                .fade-up-2 { animation: fadeUp 0.4s ease 0.08s both; }
                .fade-up-3 { animation: fadeUp 0.4s ease 0.16s both; }
                .cat-card:hover .cat-arrow { transform: translateX(4px); }
                .cat-arrow { transition: transform 0.2s ease; }
            `}</style>

            {/* ── HEADER ─── */}
            <div className="fade-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #4EA674, #023337)', boxShadow: '0 8px 24px rgba(78,166,116,0.35)' }}>
                            <Layers size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-[#023337] tracking-tight">Categories</h1>
                            <p className="text-xs text-gray-400 font-medium">Manage and organize your product categories</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Real-time indicator */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
                        {refreshing && <RefreshCw size={10} className="text-emerald-400 animate-spin" />}
                    </div>
                    <button onClick={handleExportExcel} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition-all shadow-sm"><Download size={13} className="text-[#4EA674]" /> Excel</button>
                    <button onClick={handleExportCSV} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"><Download size={13} className="text-blue-500" /> CSV</button>
                    <button onClick={handleExportPDF} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"><FileText size={13} className="text-red-500" /> PDF</button>
                    <button onClick={() => navigate('/admin/products/categories/create')} className="flex items-center gap-2 px-5 py-2.5 text-white text-xs font-black rounded-xl transition-all active:scale-95 shadow-lg" style={{ background: 'linear-gradient(135deg, #4EA674, #3d8d63)', boxShadow: '0 6px 20px rgba(78,166,116,0.35)' }}>
                        <Plus size={16} /> Add Category
                    </button>
                </div>
            </div>

            {/* ── STATS ROW ─── */}
            <div className="fade-up-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Categories', value: pagination.count, icon: Layers, color: '#4EA674', bg: '#EAF8E7' },
                    { label: 'Active', value: categories.filter(c => c.is_active).length, icon: CheckCircle2, color: '#16A34A', bg: '#F0FDF4' },
                    { label: 'Inactive', value: categories.filter(c => !c.is_active).length, icon: AlertCircle, color: '#E11D48', bg: '#FFF1F2' },
                    { label: 'Top Level', value: categories.filter(c => !c.parent).length, icon: TrendingUp, color: '#7C3AED', bg: '#EDE9FE' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: stat.bg }}>
                            <stat.icon size={22} style={{ color: stat.color }} />
                        </div>
                        <div>
                            <p className="text-2xl font-black" style={{ color: stat.color }}>{loading ? '—' : stat.value}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── BULK ACTION BAR ─── */}
            {selectedSlugs.length > 0 && (
                <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm" style={{ background: 'linear-gradient(135deg, #023337, #035a60)', boxShadow: '0 8px 32px rgba(2,51,55,0.25)' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background: '#4EA674' }}>{selectedSlugs.length}</div>
                    <span className="text-white font-bold">{selectedSlugs.length} selected</span>
                    <div className="w-px h-5 bg-white/20 mx-1" />
                    <button onClick={handleExportExcel} className="flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-bold rounded-lg hover:opacity-90" style={{ background: '#4EA674' }}><Download size={13} /> Excel</button>
                    <button onClick={handleExportCSV} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-all"><Download size={13} /> CSV</button>
                    <button onClick={handleBulkDelete} disabled={bulkDeleteLoading} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 ml-1">
                        {bulkDeleteLoading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 size={13} />} Delete
                    </button>
                    <button onClick={clearSelection} className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all ml-auto"><X size={16} /></button>
                </div>
            )}

            {/* ── DISCOVER SECTION ─── */}
            <div className="fade-up-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50" style={{ background: 'linear-gradient(to right, #f0fdf4, white)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#EAF8E7' }}>
                            <Sparkles size={15} style={{ color: '#4EA674' }} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-[#023337] tracking-tight">Discover</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Browse all category types</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl p-1 border border-gray-100">
                        <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'text-white shadow-md' : 'text-gray-400 hover:bg-white'}`} style={viewMode === 'table' ? { background: '#4EA674' } : {}}><ListIcon size={14} /></button>
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'text-white shadow-md' : 'text-gray-400 hover:bg-white'}`} style={viewMode === 'grid' ? { background: '#4EA674' } : {}}><LayoutGrid size={14} /></button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-5">
                    {(loading ? Array(8).fill(null) : [...categories].slice(0, 8)).map((cat, idx) => {
                        const Icon = ICONS[idx % ICONS.length];
                        const palette = ICON_COLORS[idx % ICON_COLORS.length];
                        if (!cat) return (
                            <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 animate-pulse">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 shrink-0" />
                                <div className="space-y-2 flex-1"><div className="h-3 bg-gray-100 rounded w-2/3" /><div className="h-2 bg-gray-50 rounded w-1/3" /></div>
                            </div>
                        );
                        return (
                            <div key={cat.slug} className="cat-card group flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:border-emerald-200 hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(234,248,231,0.4), transparent)' }} />
                                <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg" style={{ background: palette.bg }}>
                                    {getMediaUrl(cat.image) ? <img src={getMediaUrl(cat.image)} alt={cat.name} className="w-full h-full object-cover rounded-xl" /> : <Icon size={22} style={{ color: palette.color }} strokeWidth={2} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-[#023337] truncate group-hover:text-[#4EA674] transition-colors">{cat.name}</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Explore</span>
                                        <ChevronRight size={10} className="cat-arrow text-gray-300 group-hover:text-emerald-400" />
                                    </div>
                                </div>
                                <div className={`shrink-0 w-1.5 h-1.5 rounded-full ${cat.is_active ? 'bg-emerald-400' : 'bg-red-300'}`} />
                            </div>
                        );
                    })}
                    {!loading && categories.length === 0 && (
                        <div className="col-span-4 py-10 flex flex-col items-center gap-3 text-gray-300">
                            <Layers size={36} strokeWidth={1} />
                            <p className="text-xs font-black uppercase tracking-widest">No categories yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── TABLE / GRID ─── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-center px-5 py-3.5 gap-4 border-b border-gray-50" style={{ background: 'linear-gradient(to right, #f0fdf4, #f8fffe)' }}>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
                            <button className="px-4 py-2 text-xs font-black text-white rounded-lg" style={{ background: '#4EA674' }}>
                                All Categories <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-md">{pagination.count}</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-72">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Search categories..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all font-medium text-gray-700 shadow-sm" />
                        </div>
                        <FilterDropdown options={filterOptions} activeFilters={filters} onFilterChange={(k, v) => { setFilters(p => ({ ...p, [k]: v })); setPage(1); }} onClear={() => { setFilters({ is_active: '' }); setPage(1); }} />
                    </div>
                </div>

                {viewMode === 'table' ? (
                    <div className="overflow-x-auto min-h-[360px]">
                        <table className="w-full text-left">
                            <thead className="uppercase text-[10px] font-black tracking-wider border-b border-gray-50" style={{ background: '#EAF8E7', color: '#023337' }}>
                                <tr>
                                    <th className="py-4 px-5"><input type="checkbox" className="w-4 h-4 rounded cursor-pointer" style={{ accentColor: '#4EA674' }} checked={isAllSelected} onChange={toggleAll} /></th>
                                    <th className="py-4 px-3">Category</th>
                                    <th className="py-4 px-3 text-center">Slug</th>
                                    <th className="py-4 px-3 text-center">Created</th>
                                    <th className="py-4 px-3 text-center">Status</th>
                                    <th className="py-4 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    Array(6).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="py-4 px-5"><div className="w-4 h-4 bg-gray-100 rounded" /></td>
                                            <td className="py-4 px-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gray-100" /><div className="h-3 w-28 bg-gray-100 rounded" /></div></td>
                                            <td className="py-4 px-3"><div className="h-3 w-20 bg-gray-100 rounded mx-auto" /></td>
                                            <td className="py-4 px-3"><div className="h-3 w-16 bg-gray-100 rounded mx-auto" /></td>
                                            <td className="py-4 px-3"><div className="h-5 w-14 bg-gray-100 rounded-full mx-auto" /></td>
                                            <td className="py-4 px-5" />
                                        </tr>
                                    ))
                                ) : categories.length === 0 ? (
                                    <tr><td colSpan="6" className="py-28 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center"><Layers size={28} className="text-gray-200" /></div>
                                            <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No categories found</p>
                                            <button onClick={() => navigate('/admin/products/categories/create')} className="text-[11px] text-emerald-500 font-black hover:underline flex items-center gap-1"><Zap size={11} /> Add your first category</button>
                                        </div>
                                    </td></tr>
                                ) : categories.map((cat, idx) => {
                                    const Icon = ICONS[idx % ICONS.length];
                                    const palette = ICON_COLORS[idx % ICON_COLORS.length];
                                    return (
                                        <tr key={cat.slug} className={`group transition-all duration-150 ${selectedSlugs.includes(cat.slug) ? 'bg-emerald-50/60' : 'hover:bg-gray-50/60'}`}>
                                            <td className="py-4 px-5"><input type="checkbox" className="w-4 h-4 rounded cursor-pointer" style={{ accentColor: '#4EA674' }} checked={selectedSlugs.includes(cat.slug)} onChange={() => toggleOne(cat.slug)} /></td>
                                            <td className="py-4 px-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-xs border-2 transition-all group-hover:scale-105" style={{ background: palette.bg, borderColor: palette.bg }}>
                                                        {getMediaUrl(cat.image) ? <img src={getMediaUrl(cat.image)} alt={cat.name} className="w-full h-full object-cover rounded-xl" /> : <Icon size={18} style={{ color: palette.color }} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-[#023337] text-sm group-hover:text-[#4EA674] transition-colors">{cat.name}</p>
                                                        {cat.parent_name && <p className="text-[10px] text-gray-400 flex items-center gap-0.5"><ChevronRight size={9} />{cat.parent_name}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-3 text-center"><code className="text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100 font-mono">{cat.slug}</code></td>
                                            <td className="py-4 px-3 text-center text-xs font-bold text-gray-500">{new Date(cat.created_at).toLocaleDateString()}</td>
                                            <td className="py-4 px-3 text-center">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase rounded-full" style={cat.is_active ? { background: '#EAF8E7', color: '#4EA674' } : { background: '#FEE2E2', color: '#EF4444' }}>
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: cat.is_active ? '#4EA674' : '#EF4444' }} />{cat.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button onClick={() => navigate(`/admin/products/categories/edit/${cat.slug}`)} className="p-2 rounded-lg hover:bg-emerald-50 transition-colors" style={{ color: '#4EA674' }} title="Edit"><Edit2 size={15} /></button>
                                                    <button onClick={() => { setCategoryToDelete(cat); setShowDeleteConfirm(true); }} disabled={deleteLoading === cat.slug} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40" title="Delete">
                                                        {deleteLoading === cat.slug ? <div className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" /> : <Trash2 size={15} />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-5 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[360px]">
                        {loading ? Array(8).fill(0).map((_, i) => (
                            <div key={i} className="rounded-2xl border border-gray-100 p-4 animate-pulse">
                                <div className="w-full h-28 bg-gray-100 rounded-xl mb-3" />
                                <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
                            </div>
                        )) : categories.map((cat, idx) => {
                            const Icon = ICONS[idx % ICONS.length];
                            const palette = ICON_COLORS[idx % ICON_COLORS.length];
                            const isSelected = selectedSlugs.includes(cat.slug);
                            return (
                                <div key={cat.slug} className={`group rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${isSelected ? 'border-emerald-400 bg-emerald-50/30 shadow-lg shadow-emerald-100' : 'border-gray-100 hover:border-emerald-200 hover:shadow-md bg-white'}`} onClick={() => toggleOne(cat.slug)}>
                                    <div className="relative h-32 flex items-center justify-center overflow-hidden" style={{ background: palette.bg }}>
                                        {getMediaUrl(cat.image) ? <img src={getMediaUrl(cat.image)} alt={cat.name} className="w-full h-full object-cover" /> : <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md`} style={{ background: 'white', color: palette.color }}><Icon size={26} /></div>}
                                        {isSelected && <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"><CheckCircle2 size={14} className="text-white" /></div>}
                                        <div className="absolute top-2 left-2"><span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${cat.is_active ? 'bg-emerald-500 text-white' : 'bg-red-100 text-red-500'}`}>{cat.is_active ? 'Active' : 'Off'}</span></div>
                                    </div>
                                    <div className="p-4">
                                        <p className="font-black text-gray-800 text-sm truncate group-hover:text-emerald-600 transition-colors">{cat.name}</p>
                                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{cat.slug}</p>
                                        <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/products/categories/edit/${cat.slug}`); }} className="flex-1 py-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-all uppercase tracking-wider">Edit</button>
                                            <button onClick={(e) => { e.stopPropagation(); setCategoryToDelete(cat); setShowDeleteConfirm(true); }} className="flex-1 py-1.5 text-[10px] font-black text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-all uppercase tracking-wider">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {pagination.count > 0 && (
                    <div className="px-5 py-4 flex items-center justify-between border-t border-gray-50 bg-gray-50/30">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={!pagination.previous || loading} className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-white transition-all disabled:opacity-40 bg-white shadow-sm">← Prev</button>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Page {page} of {Math.max(1, Math.ceil(pagination.count / 10))}</span>
                        <button onClick={() => setPage(p => p + 1)} disabled={!pagination.next || loading} className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-white transition-all disabled:opacity-40 bg-white shadow-sm">Next →</button>
                    </div>
                )}
            </div>

            {/* ══ ADD MODAL ══ */}
            {showAddModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => !createLoading && setShowAddModal(false)} />
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col" style={{ animation: 'fadeUp 0.3s ease' }}>
                        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 shrink-0" style={{ background: 'linear-gradient(135deg, #EAF8E7, white)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg,#4EA674,#3d8d63)', boxShadow: '0 4px 14px rgba(78,166,116,0.3)' }}><Plus size={20} className="text-white" /></div>
                                <div>
                                    <h3 className="text-base font-black text-gray-900">Create New Category</h3>
                                    <p className="text-xs text-gray-400 font-medium">Add a new product category</p>
                                </div>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleCreateCategory} className="flex-1 overflow-y-auto">
                            <div className="px-7 py-5 space-y-5">
                                <ImageUploadBox preview={formData.imagePreview} fileRef={addImageRef} onChange={(e) => handleImageChange(e, false)} label="Category Image" />
                                <div className="grid grid-cols-2 gap-4">
                                    <ModalInput label="Category Name" required>
                                        <input type="text" name="name" required value={formData.name} onChange={e => handleFormChange(e, false)} placeholder="e.g. Smart Watches" className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-400 focus:bg-white transition-all" />
                                    </ModalInput>
                                    <ModalInput label="URL Slug" required hint="Auto-generated from name.">
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm select-none">/</span>
                                            <input type="text" name="slug" required value={formData.slug} onChange={e => handleFormChange(e, false)} placeholder="smart-watches" className="w-full pl-7 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium text-gray-500 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all" />
                                        </div>
                                    </ModalInput>
                                </div>
                                <ModalInput label="Parent Category" hint="Assign a parent to create a sub-category.">
                                    <select name="parent" value={formData.parent || ''} onChange={e => setFormData(prev => ({ ...prev, parent: e.target.value || null }))} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-400 focus:bg-white transition-all">
                                        <option value="">— None (top level) —</option>
                                        {categories.filter(c => !c.parent).map(c => <option key={c.slug} value={c.id}>{c.name}</option>)}
                                    </select>
                                </ModalInput>
                                <ModalInput label="Description">
                                    <textarea name="description" value={formData.description} onChange={e => handleFormChange(e, false)} placeholder="Brief details about this category..." rows="3" className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-400 focus:bg-white transition-all resize-none" />
                                </ModalInput>
                                <div className="flex items-center justify-between p-4 rounded-xl border-2" style={{ background: '#EAF8E7', borderColor: '#C1E6BA' }}>
                                    <div>
                                        <p className="text-xs font-black text-gray-700">Active Status</p>
                                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">Visible to customers in storefront</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" name="is_active" checked={formData.is_active} onChange={e => handleFormChange(e, false)} className="sr-only peer" />
                                        <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:shadow-sm after:transition-all peer-checked:after:translate-x-5" />
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-3 px-7 py-5 border-t border-gray-50 bg-gray-50/30 shrink-0">
                                <button type="button" onClick={() => setShowAddModal(false)} disabled={createLoading} className="flex-1 py-3 text-sm font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all">Cancel</button>
                                <button type="submit" disabled={createLoading} className="flex-[2] py-3 text-white text-sm font-black rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg,#4EA674,#3d8d63)', boxShadow: '0 4px 14px rgba(78,166,116,0.25)' }}>
                                    {createLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><Plus size={16} /> Create Category</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ══ EDIT MODAL ══ */}
            {showEditModal && editingCategory && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => !editLoading && setShowEditModal(false)} />
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col" style={{ animation: 'fadeUp 0.3s ease' }}>
                        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-200"><Edit2 size={18} className="text-white" /></div>
                                <div>
                                    <h3 className="text-base font-black text-gray-900">Edit Category</h3>
                                    <p className="text-xs text-gray-400 font-medium">Update category details</p>
                                </div>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleUpdateCategory} className="flex-1 overflow-y-auto">
                            <div className="px-7 py-5 space-y-5">
                                <ImageUploadBox preview={editData.imagePreview} fileRef={editImageRef} onChange={(e) => handleImageChange(e, true)} label="Category Image" />
                                <div className="grid grid-cols-2 gap-4">
                                    <ModalInput label="Category Name" required>
                                        <input type="text" name="name" required value={editData.name} onChange={e => handleFormChange(e, true)} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-400 focus:bg-white transition-all" />
                                    </ModalInput>
                                    <ModalInput label="URL Slug" required>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm select-none">/</span>
                                            <input type="text" name="slug" required value={editData.slug} onChange={e => handleFormChange(e, true)} className="w-full pl-7 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium text-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white transition-all" />
                                        </div>
                                    </ModalInput>
                                </div>
                                <ModalInput label="Parent Category">
                                    <select value={editData.parent || ''} onChange={e => setEditData(prev => ({ ...prev, parent: e.target.value || null }))} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-400 focus:bg-white transition-all">
                                        <option value="">— None (top level) —</option>
                                        {categories.filter(c => c.slug !== editingCategory.slug && !c.parent).map(c => <option key={c.slug} value={c.id}>{c.name}</option>)}
                                    </select>
                                </ModalInput>
                                <ModalInput label="Description">
                                    <textarea name="description" value={editData.description} onChange={e => handleFormChange(e, true)} rows="3" className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-400 focus:bg-white transition-all resize-none" />
                                </ModalInput>
                                <div className="flex items-center justify-between p-4 bg-blue-50/40 rounded-xl border-2 border-blue-100/60">
                                    <div>
                                        <p className="text-xs font-black text-gray-700">Active Status</p>
                                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">Visible to customers in storefront</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" name="is_active" checked={editData.is_active} onChange={e => handleFormChange(e, true)} className="sr-only peer" />
                                        <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:shadow-sm after:transition-all peer-checked:after:translate-x-5" />
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-3 px-7 py-5 border-t border-gray-50 bg-gray-50/30 shrink-0">
                                <button type="button" onClick={() => setShowEditModal(false)} disabled={editLoading} className="flex-1 py-3 text-sm font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all">Cancel</button>
                                <button type="submit" disabled={editLoading} className="flex-[2] py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-black rounded-xl shadow-lg shadow-blue-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                    {editLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><CheckCircle2 size={16} /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ══ DELETE CONFIRM ══ */}
            {showDeleteConfirm && categoryToDelete && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => !deleteLoading && setShowDeleteConfirm(false)} />
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden" style={{ animation: 'fadeUp 0.3s ease' }}>
                        <div className="h-1.5 bg-gradient-to-r from-red-400 to-red-600" />
                        <div className="p-7 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4"><Trash2 size={26} className="text-red-500" /></div>
                            <h3 className="text-lg font-black text-gray-900">Delete Category?</h3>
                            <p className="text-sm text-gray-500 font-medium mt-2 leading-relaxed">You are about to permanently delete <span className="font-black text-gray-800">"{categoryToDelete.name}"</span>.<br />Products in this category may become uncategorized.</p>
                        </div>
                        <div className="flex gap-3 px-7 pb-7">
                            <button onClick={() => { setShowDeleteConfirm(false); setCategoryToDelete(null); }} disabled={!!deleteLoading} className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all disabled:opacity-50">Cancel</button>
                            <button onClick={handleDeleteCategory} disabled={!!deleteLoading} className="flex-[1.5] py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-black rounded-xl shadow-lg shadow-red-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                {deleteLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deleting...</> : <><Trash2 size={15} /> Yes, Delete</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCategories;
