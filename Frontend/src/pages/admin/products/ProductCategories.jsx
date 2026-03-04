import React, { useState, useEffect, useRef } from 'react';
import {
    Search, Plus, Trash2, Tag, Layers, Grid, Download, FileText,
    X, CheckCircle2, AlertCircle, Upload, ImageIcon, Edit2,
    Monitor, Shirt, Headphones, Coffee, Dumbbell, Book,
    Package, ChevronRight, LayoutGrid, List as ListIcon
} from 'lucide-react';
import api from '../../../utils/api';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';

const ICONS = [Monitor, Shirt, Headphones, Coffee, Grid, Layers, Dumbbell, Book, Package, Tag];

const ProductCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ is_active: '' });
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    // Selection
    const [selectedSlugs, setSelectedSlugs] = useState([]);

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    // Loading states
    const [createLoading, setCreateLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

    // Message
    const [msg, setMsg] = useState({ type: '', text: '' });

    // Form state
    const defaultForm = { name: '', slug: '', description: '', parent: null, is_active: true, imagePreview: null, imageFile: null };
    const [formData, setFormData] = useState(defaultForm);
    const [editData, setEditData] = useState(defaultForm);
    const addImageRef = useRef(null);
    const editImageRef = useRef(null);

    useEffect(() => {
        fetchCategories();
    }, [page, searchTerm, filters]);

    const fetchCategories = async () => {
        setLoading(true);
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
        }
    };

    const showMsg = (type, text) => {
        setMsg({ type, text });
        setTimeout(() => setMsg({ type: '', text: '' }), 3500);
    };

    // ─── Selection ────────────────────────────────────────
    const isAllSelected = categories.length > 0 && categories.every(c => selectedSlugs.includes(c.slug));
    const toggleAll = () => {
        if (isAllSelected) setSelectedSlugs([]);
        else setSelectedSlugs(categories.map(c => c.slug));
    };
    const toggleOne = (slug) => setSelectedSlugs(prev =>
        prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
    const clearSelection = () => setSelectedSlugs([]);

    // ─── Form Handlers ─────────────────────────────────────
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

    // ─── CRUD ─────────────────────────────────────────────
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
        setEditData({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
            parent: cat.parent || null,
            is_active: cat.is_active,
            imagePreview: cat.image || null,
            imageFile: null
        });
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
            showMsg('success', `"${categoryToDelete.name}" deleted successfully!`);
        } catch (error) {
            showMsg('error', 'Failed to delete category.');
        } finally {
            setDeleteLoading(null);
            setShowDeleteConfirm(false);
            setCategoryToDelete(null);
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedSlugs.length} categories? This action cannot be undone.`)) return;
        setBulkDeleteLoading(true);
        try {
            const results = await Promise.allSettled(selectedSlugs.map(slug => api.delete(`categories/${slug}/`)));
            const successSlugs = selectedSlugs.filter((_, i) => results[i].status === 'fulfilled');
            const failCount = results.length - successSlugs.length;

            if (successSlugs.length > 0) {
                setCategories(prev => prev.filter(c => !successSlugs.includes(c.slug)));
                setPagination(prev => ({ ...prev, count: prev.count - successSlugs.length }));
                setSelectedSlugs(prev => prev.filter(s => !successSlugs.includes(s)));
            }

            if (failCount === 0) {
                showMsg('success', 'Selected categories deleted successfully!');
            } else if (successSlugs.length > 0) {
                showMsg('error', `${successSlugs.length} deleted, but ${failCount} could not be deleted.`);
            } else {
                showMsg('error', 'Failed to delete the selected categories. Please try again.');
            }
        } finally {
            setBulkDeleteLoading(false);
        }
    };

    // ─── Export ─────────────────────────────────────────────
    const getExportData = () => {
        const toProcess = selectedSlugs.length > 0 ? categories.filter(c => selectedSlugs.includes(c.slug)) : categories;
        return toProcess;
    };

    const handleExportExcel = () => {
        const data = getExportData().map(c => ({ Name: c.name, Slug: c.slug, Status: c.is_active ? 'Active' : 'Inactive', Created: new Date(c.created_at).toLocaleDateString() }));
        exportToExcel(data, 'Product_Categories');
    };

    const handleExportCSV = () => {
        const data = getExportData().map(c => ({ Name: c.name, Slug: c.slug, Status: c.is_active ? 'Active' : 'Inactive', Created: new Date(c.created_at).toLocaleDateString() }));
        exportToCSV(data, 'Product_Categories');
    };

    const handleExportPDF = () => {
        const cols = ['Name', 'Slug', 'Status', 'Created'];
        const data = getExportData().map(c => [c.name, c.slug, c.is_active ? 'Active' : 'Inactive', new Date(c.created_at).toLocaleDateString()]);
        exportToPDF(data, cols, 'Product_Categories', 'Category Hierarchy Report');
    };

    const filterOptions = [{
        key: 'is_active', label: 'Status',
        options: [{ label: 'All Status', value: '' }, { label: 'Active', value: 'true' }, { label: 'Inactive', value: 'false' }]
    }];

    // ─── Image Component ─────────────────────────────────────
    const ImageUploadBox = ({ preview, fileRef, onChange, label = 'Upload Image' }) => (
        <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
            <div
                onClick={() => fileRef.current?.click()}
                className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all overflow-hidden
                    ${preview ? 'border-emerald-300 bg-emerald-50/20' : 'border-gray-200 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/30'}`}
                style={{ height: '140px' }}
            >
                {preview ? (
                    <>
                        <img src={preview} alt="preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                            <div className="text-white text-xs font-bold flex items-center gap-1"><Upload size={14} /> Change</div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-500 transition-all">
                            <ImageIcon size={22} />
                        </div>
                        <span className="text-xs font-bold">Click to upload</span>
                        <span className="text-[10px]">PNG, JPG, WebP</span>
                    </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
            </div>
        </div>
    );

    // ─── Modal Field ─────────────────────────────────────
    const Field = ({ label, required, hint, children }) => (
        <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {label} {required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            {children}
            {hint && <p className="text-[10px] text-gray-400 ml-1">{hint}</p>}
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">
            {/* Global message */}
            {msg.text && (
                <div className={`fixed top-6 right-6 z-[2000] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-bold border transition-all
                    ${msg.type === 'success' ? 'bg-[#EAF8E7] text-[#4EA674] border-[#C1E6BA]' : 'bg-red-50 text-red-600 border-red-200'}`}>
                    {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {msg.text}
                </div>
            )}

            {/* ── PAGE HEADER ─────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#023337] flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#4EA674] rounded-lg flex items-center justify-center">
                            <Layers size={18} className="text-white" />
                        </div>
                        Categories
                    </h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Manage and organize your product categories</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleExportExcel} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-[#EAF8E7] hover:border-[#C1E6BA] transition-all shadow-sm">
                        <Download size={14} className="text-[#4EA674]" /> Excel
                    </button>
                    <button onClick={handleExportCSV} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm">
                        <Download size={14} className="text-blue-600" /> CSV
                    </button>
                    <button onClick={handleExportPDF} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition-all shadow-sm">
                        <FileText size={14} className="text-red-500" /> PDF
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#4EA674] text-white text-xs font-bold rounded-xl hover:bg-[#3d8d63] active:scale-95 transition-all shadow-lg"
                        style={{ boxShadow: '0 4px 14px rgba(78,166,116,0.3)' }}
                    >
                        <Plus size={16} /> Add Category
                    </button>
                </div>
            </div>

            {/* ── BULK ACTION BAR (top, always visible when selection active) ── */}
            {selectedSlugs.length > 0 && (
                <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm" style={{ background: '#023337' }}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background: '#4EA674' }}>{selectedSlugs.length}</div>
                        <span className="text-white font-bold">{selectedSlugs.length === 1 ? '1 category' : `${selectedSlugs.length} categories`} selected</span>
                    </div>
                    <div className="w-px h-5 bg-white/20 mx-1" />
                    <div className="flex items-center gap-2 flex-1">
                        <button onClick={handleExportExcel} className="flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-bold rounded-lg transition-all hover:opacity-90" style={{ background: '#4EA674' }}>
                            <Download size={13} /> Excel
                        </button>
                        <button onClick={handleExportCSV} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-all">
                            <Download size={13} /> CSV
                        </button>
                        <button onClick={handleExportPDF} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-all">
                            <FileText size={13} /> PDF
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            disabled={bulkDeleteLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 ml-1"
                        >
                            {bulkDeleteLoading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 size={13} />}
                            Delete Selected
                        </button>
                    </div>
                    <button onClick={clearSelection} className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* ── DISCOVER GRID ──────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                    <div>
                        <h2 className="text-base font-bold text-[#023337]">Discover</h2>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">Browse all category types</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'text-white' : 'text-gray-400 hover:bg-gray-100'}`} style={viewMode === 'table' ? { background: '#4EA674' } : {}}><ListIcon size={16} /></button>
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'text-white' : 'text-gray-400 hover:bg-gray-100'}`} style={viewMode === 'grid' ? { background: '#4EA674' } : {}}><LayoutGrid size={16} /></button>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-0 divide-x divide-y divide-gray-50">
                    {(loading ? Array(6).fill(null) : categories.slice(0, 6)).map((cat, idx) => {
                        const Icon = ICONS[idx % ICONS.length];
                        if (!cat) return (
                            <div key={idx} className="p-5 animate-pulse">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 mb-3" />
                                <div className="h-3 bg-gray-100 rounded w-2/3" />
                            </div>
                        );
                        return (
                            <div key={cat.slug} className="p-5 group hover:bg-[#EAF8E7]/40 transition-all cursor-pointer">
                                {cat.image ? (
                                    <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-xl object-cover mb-3 ring-2 ring-[#C1E6BA]" />
                                ) : (
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300" style={{ background: '#EAF8E7', color: '#4EA674' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#4EA674'; e.currentTarget.style.color = 'white'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = '#EAF8E7'; e.currentTarget.style.color = '#4EA674'; }}>
                                        <Icon size={22} />
                                    </div>
                                )}
                                <p className="text-sm font-bold text-[#023337] truncate group-hover:text-[#4EA674] transition-colors">{cat.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Explore</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── TABLE / GRID SECTION ────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-center px-5 py-3.5 gap-4 border-b border-gray-50" style={{ background: '#EAF8E7' }}>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
                            <button className="px-4 py-2 text-xs font-black text-white rounded-lg" style={{ background: '#4EA674' }}>
                                All Categories <span className="ml-1">({pagination.count})</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-72">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition-all font-medium text-gray-700 shadow-sm"
                            />
                        </div>
                        <FilterDropdown options={filterOptions} activeFilters={filters} onFilterChange={(k, v) => { setFilters(p => ({ ...p, [k]: v })); setPage(1); }} onClear={() => { setFilters({ is_active: '' }); setPage(1); }} />
                    </div>
                </div>

                {viewMode === 'table' ? (
                    <div className="overflow-x-auto min-h-[360px]">
                        <table className="w-full text-left">
                            <thead className="uppercase text-[10px] font-black tracking-wider" style={{ background: '#EAF8E7', color: '#023337' }}>
                                <tr>
                                    <th className="py-4 px-5">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-400 cursor-pointer"
                                            checked={isAllSelected}
                                            onChange={toggleAll}
                                        />
                                    </th>
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
                                    <tr>
                                        <td colSpan="6" className="py-24 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                                                    <Layers size={28} className="text-gray-200" />
                                                </div>
                                                <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No categories found</p>
                                                <button onClick={() => setShowAddModal(true)} className="text-xs text-emerald-500 font-bold hover:underline">+ Add your first category</button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : categories.map((cat, idx) => {
                                    const Icon = ICONS[idx % ICONS.length];
                                    return (
                                        <tr
                                            key={cat.slug}
                                            className={`group transition-colors ${selectedSlugs.includes(cat.slug) ? 'bg-[#EAF8E7]/60' : 'hover:bg-gray-50/60'}`}
                                        >
                                            <td className="py-4 px-5">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded cursor-pointer"
                                                    style={{ accentColor: '#4EA674' }}
                                                    checked={selectedSlugs.includes(cat.slug)}
                                                    onChange={() => toggleOne(cat.slug)}
                                                />
                                            </td>
                                            <td className="py-4 px-3">
                                                <div className="flex items-center gap-3">
                                                    {cat.image ? (
                                                        <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-100 shrink-0" />
                                                    ) : (
                                                        <div
                                                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-xs border transition-all"
                                                            style={{ background: '#EAF8E7', color: '#4EA674', borderColor: '#C1E6BA' }}
                                                        >
                                                            {cat.name.slice(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-[#023337] text-sm group-hover:text-[#4EA674] transition-colors">{cat.name}</p>
                                                        {cat.parent_name && <p className="text-[10px] text-gray-400 flex items-center gap-0.5"><ChevronRight size={9} />{cat.parent_name}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-3 text-center">
                                                <code className="text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100 font-mono">{cat.slug}</code>
                                            </td>
                                            <td className="py-4 px-3 text-center text-xs font-bold text-gray-500">
                                                {new Date(cat.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-3 text-center">
                                                <span
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase rounded-full"
                                                    style={cat.is_active
                                                        ? { background: '#EAF8E7', color: '#4EA674' }
                                                        : { background: '#FEE2E2', color: '#EF4444' }}
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: cat.is_active ? '#4EA674' : '#EF4444' }} />
                                                    {cat.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button
                                                        onClick={() => handleEditOpen(cat)}
                                                        className="p-2 rounded-lg transition-colors hover:bg-[#EAF8E7]"
                                                        style={{ color: '#4EA674' }}
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setCategoryToDelete(cat); setShowDeleteConfirm(true); }}
                                                        disabled={deleteLoading === cat.slug}
                                                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                                                        title="Delete"
                                                    >
                                                        {deleteLoading === cat.slug
                                                            ? <div className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                                                            : <Trash2 size={15} />}
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
                    /* Grid view */
                    <div className="p-5 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[360px]">
                        {loading ? Array(8).fill(0).map((_, i) => (
                            <div key={i} className="rounded-2xl border border-gray-100 p-4 animate-pulse">
                                <div className="w-full h-28 bg-gray-100 rounded-xl mb-3" />
                                <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
                                <div className="h-2 bg-gray-100 rounded w-1/3" />
                            </div>
                        )) : categories.map((cat, idx) => {
                            const Icon = ICONS[idx % ICONS.length];
                            const isSelected = selectedSlugs.includes(cat.slug);
                            return (
                                <div
                                    key={cat.slug}
                                    className={`group rounded-2xl border-2 transition-all cursor-pointer overflow-hidden
                                        ${isSelected ? 'border-emerald-400 bg-emerald-50/30 shadow-md shadow-emerald-100' : 'border-gray-100 hover:border-emerald-200 hover:shadow-sm bg-white'}`}
                                    onClick={() => toggleOne(cat.slug)}
                                >
                                    <div className="relative h-32 bg-gradient-to-br from-gray-50 to-emerald-50/20 flex items-center justify-center overflow-hidden">
                                        {cat.image ? (
                                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-500 shadow-md'}`}>
                                                <Icon size={26} />
                                            </div>
                                        )}
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                                <CheckCircle2 size={14} className="text-white" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 left-2">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${cat.is_active ? 'bg-emerald-500 text-white' : 'bg-red-100 text-red-500'}`}>
                                                {cat.is_active ? 'Active' : 'Off'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="font-bold text-gray-800 text-sm truncate group-hover:text-emerald-600 transition-colors">{cat.name}</p>
                                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{cat.slug}</p>
                                        <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={(e) => { e.stopPropagation(); handleEditOpen(cat); }} className="flex-1 py-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-all uppercase tracking-wider">Edit</button>
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
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={!pagination.previous || loading}
                            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-white transition-all disabled:opacity-40 bg-white shadow-sm"
                        >← Prev</button>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Page {page} of {Math.max(1, Math.ceil(pagination.count / 10))}
                        </span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={!pagination.next || loading}
                            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-white transition-all disabled:opacity-40 bg-white shadow-sm"
                        >Next →</button>
                    </div>
                )}
            </div>

            {/* ══════════════════ ADD MODAL ══════════════════ */}
            {showAddModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => !createLoading && setShowAddModal(false)} />
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 shrink-0" style={{ background: 'linear-gradient(to right, #EAF8E7, white)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: '#4EA674', boxShadow: '0 4px 14px rgba(78,166,116,0.3)' }}>
                                    <Plus size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-gray-900">Create New Category</h3>
                                    <p className="text-xs text-gray-400 font-medium">Add a new product category with image</p>
                                </div>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleCreateCategory} className="flex-1 overflow-y-auto">
                            <div className="px-7 py-5 space-y-5">
                                {/* Image upload */}
                                <ImageUploadBox
                                    preview={formData.imagePreview}
                                    fileRef={addImageRef}
                                    onChange={(e) => handleImageChange(e, false)}
                                    label="Category Image"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Category Name" required>
                                        <input
                                            type="text" name="name" required value={formData.name}
                                            onChange={e => handleFormChange(e, false)}
                                            placeholder="e.g. Smart Watches"
                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
                                        />
                                    </Field>
                                    <Field label="URL Slug" required hint="Auto-generated from name.">
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm font-medium select-none">/</span>
                                            <input
                                                type="text" name="slug" required value={formData.slug}
                                                onChange={e => handleFormChange(e, false)}
                                                placeholder="smart-watches"
                                                className="w-full pl-7 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium text-gray-500 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </Field>
                                </div>

                                <Field label="Parent Category" hint="Assign a parent to create a sub-category.">
                                    <select
                                        name="parent"
                                        value={formData.parent || ''}
                                        onChange={e => setFormData(prev => ({ ...prev, parent: e.target.value || null }))}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
                                    >
                                        <option value="">— None (top level) —</option>
                                        {categories.filter(c => !c.parent).map(c => (
                                            <option key={c.slug} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="Description">
                                    <textarea
                                        name="description" value={formData.description}
                                        onChange={e => handleFormChange(e, false)}
                                        placeholder="Brief details about this category..."
                                        rows="3"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-400 focus:bg-white transition-all resize-none"
                                    />
                                </Field>

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
                                <button
                                    type="button" onClick={() => setShowAddModal(false)} disabled={createLoading}
                                    className="flex-1 py-3 text-sm font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all"
                                >Cancel</button>
                                <button
                                    type="submit" disabled={createLoading}
                                    className="flex-[2] py-3 text-white text-sm font-black rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    style={{ background: '#4EA674', boxShadow: '0 4px 14px rgba(78,166,116,0.25)' }}
                                >
                                    {createLoading
                                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                                        : <><Plus size={16} /> Create Category</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ══════════════════ EDIT MODAL ══════════════════ */}
            {showEditModal && editingCategory && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => !editLoading && setShowEditModal(false)} />
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-200">
                                    <Edit2 size={18} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-gray-900">Edit Category</h3>
                                    <p className="text-xs text-gray-400 font-medium">Update category details and image</p>
                                </div>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateCategory} className="flex-1 overflow-y-auto">
                            <div className="px-7 py-5 space-y-5">
                                <ImageUploadBox
                                    preview={editData.imagePreview}
                                    fileRef={editImageRef}
                                    onChange={(e) => handleImageChange(e, true)}
                                    label="Category Image"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Category Name" required>
                                        <input
                                            type="text" name="name" required value={editData.name}
                                            onChange={e => handleFormChange(e, true)}
                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                                        />
                                    </Field>
                                    <Field label="URL Slug" required>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm font-medium select-none">/</span>
                                            <input
                                                type="text" name="slug" required value={editData.slug}
                                                onChange={e => handleFormChange(e, true)}
                                                className="w-full pl-7 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium text-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </Field>
                                </div>

                                <Field label="Parent Category">
                                    <select
                                        value={editData.parent || ''}
                                        onChange={e => setEditData(prev => ({ ...prev, parent: e.target.value || null }))}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                                    >
                                        <option value="">— None (top level) —</option>
                                        {categories.filter(c => c.slug !== editingCategory.slug && !c.parent).map(c => (
                                            <option key={c.slug} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="Description">
                                    <textarea
                                        name="description" value={editData.description}
                                        onChange={e => handleFormChange(e, true)}
                                        rows="3"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-400 focus:bg-white transition-all resize-none"
                                    />
                                </Field>

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
                                <button
                                    type="button" onClick={() => setShowEditModal(false)} disabled={editLoading}
                                    className="flex-1 py-3 text-sm font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all"
                                >Cancel</button>
                                <button
                                    type="submit" disabled={editLoading}
                                    className="flex-[2] py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-black rounded-xl shadow-lg shadow-blue-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {editLoading
                                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                                        : <><CheckCircle2 size={16} /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ══════════════════ DELETE CONFIRM ══════════════════ */}
            {showDeleteConfirm && categoryToDelete && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => !deleteLoading && setShowDeleteConfirm(false)} />
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden">
                        <div className="h-1.5 bg-gradient-to-r from-red-400 to-red-600" />
                        <div className="p-7 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={26} className="text-red-500" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900">Delete Category?</h3>
                            <p className="text-sm text-gray-500 font-medium mt-2 leading-relaxed">
                                You are about to permanently delete <span className="font-black text-gray-800">"{categoryToDelete.name}"</span>.
                                <br />Products in this category may become uncategorized.
                            </p>
                        </div>
                        <div className="flex gap-3 px-7 pb-7">
                            <button
                                onClick={() => { setShowDeleteConfirm(false); setCategoryToDelete(null); }}
                                disabled={!!deleteLoading}
                                className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all disabled:opacity-50"
                            >Cancel</button>
                            <button
                                onClick={handleDeleteCategory}
                                disabled={!!deleteLoading}
                                className="flex-[1.5] py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-black rounded-xl shadow-lg shadow-red-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {deleteLoading
                                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deleting...</>
                                    : <><Trash2 size={15} /> Yes, Delete</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCategories;
