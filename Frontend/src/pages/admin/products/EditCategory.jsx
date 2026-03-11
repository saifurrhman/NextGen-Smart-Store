import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, Upload, ImageIcon, Layers, X, CheckCircle2,
    AlertCircle, Tag, ChevronRight, Sparkles, Eye, EyeOff, Edit2, Save
} from 'lucide-react';
import api from '../../../utils/api';

const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/media/')) return `http://localhost:8000${url}`;
    return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
};

const EditCategory = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const imageRef = useRef(null);
    const iconImageRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '', slug: '', description: '', parent: null,
        is_active: true, imagePreview: null, imageFile: null, iconPreview: null, iconFile: null,
    });
    const [originalSlug, setOriginalSlug] = useState('');
    const [parentCategories, setParentCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [preview, setPreview] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, allCatsRes] = await Promise.all([
                    api.get(`categories/${slug}/`),
                    api.get('categories/?page=1'),
                ]);
                const cat = catRes.data;
                setOriginalSlug(cat.slug);
                setFormData({
                    name: cat.name || '',
                    slug: cat.slug || '',
                    description: cat.description || '',
                    parent: cat.parent || null,
                    is_active: cat.is_active,
                    imagePreview: cat.image ? getMediaUrl(cat.image) : null,
                    imageFile: null,
                    iconPreview: cat.icon ? getMediaUrl(cat.icon) : null,
                    iconFile: null,
                });
                const all = allCatsRes.data.results || allCatsRes.data;
                setParentCategories(all.filter(c => !c.parent && c.slug !== slug));
            } catch {
                showMsg('error', 'Failed to load category.');
            } finally {
                setFetchLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageChange = (e, isIcon = false) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setFormData(prev => isIcon
                ? { ...prev, iconPreview: ev.target.result, iconFile: file }
                : { ...prev, imagePreview: ev.target.result, imageFile: file }
            );
        };
        reader.readAsDataURL(file);
    };

    const showMsg = (type, text) => {
        setMsg({ type, text });
        setTimeout(() => setMsg({ type: '', text: '' }), 3500);
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('name', formData.name);
            fd.append('slug', formData.slug);
            fd.append('description', formData.description || '');
            fd.append('is_active', formData.is_active);
            if (formData.parent) fd.append('parent', formData.parent);
            if (formData.imageFile) fd.append('image', formData.imageFile);
            if (formData.iconFile) fd.append('icon', formData.iconFile);
            await api.patch(`categories/${originalSlug}/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            showMsg('success', 'Category updated successfully!');
            setTimeout(() => navigate('/admin/products/categories'), 1200);
        } catch (error) {
            showMsg('error', error.response?.data?.name?.[0] || error.response?.data?.detail || 'Failed to update category.');
        } finally {
            setLoading(false);
        }
    };

    const ImageUpload = ({ preview: pv, fileRef, onChange, onClear, label, subtitle }) => (
        <div
            onClick={() => fileRef.current?.click()}
            className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all overflow-hidden flex items-center justify-center h-52
                ${pv ? 'border-emerald-300' : 'border-gray-200 hover:border-emerald-400'}`}
            style={{ background: pv ? 'transparent' : '#fafafa' }}
        >
            {pv ? (
                <>
                    <img src={pv} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Upload size={18} className="text-white" /></div>
                        <span className="text-white text-xs font-black">Change Image</span>
                    </div>
                    <button type="button" onClick={(ev) => { ev.stopPropagation(); onClear(); }} className="absolute top-2 right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-10">
                        <X size={12} className="text-white" />
                    </button>
                </>
            ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-500 transition-all">
                        <ImageIcon size={22} />
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-black">{label}</p>
                        <p className="text-[10px] text-gray-300 mt-0.5">{subtitle}</p>
                    </div>
                </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
        </div>
    );

    if (fetchLoading) return (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading category...</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-[1200px] mx-auto pb-12 space-y-6">
            <style>{`
                @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                @keyframes slideIn { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
                .fade-up{animation:fadeUp 0.4s ease both}
                .fade-up-2{animation:fadeUp 0.4s ease 0.08s both}
                .fade-up-3{animation:fadeUp 0.4s ease 0.16s both}
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

            {/* HEADER */}
            <div className="fade-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/admin/products/categories" className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 transition-all shadow-sm">
                        <ArrowLeft size={18} className="text-gray-600" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-bold mb-1">
                            <Link to="/admin/products/categories" className="hover:text-emerald-500 transition-colors">Categories</Link>
                            <ChevronRight size={12} />
                            <span className="text-gray-600">Edit Category</span>
                        </div>
                        <h1 className="text-2xl font-black text-[#023337] tracking-tight flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#EAF8E7' }}>
                                <Edit2 size={16} style={{ color: '#4EA674' }} />
                            </div>
                            Edit Category
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setPreview(p => !p)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black border transition-all ${preview ? 'bg-[#023337] text-white border-[#023337]' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        {preview ? <EyeOff size={14} /> : <Eye size={14} />} {preview ? 'Edit Mode' : 'Preview'}
                    </button>
                    <button type="button" onClick={handleSubmit} disabled={loading || !formData.name}
                        className="flex items-center gap-2 px-5 py-2.5 text-white text-xs font-black rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-lg"
                        style={{ background: 'linear-gradient(135deg,#4EA674,#3d8d63)', boxShadow: '0 6px 20px rgba(78,166,116,0.35)' }}>
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={14} /> Save Changes</>}
                    </button>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="fade-up-2 grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* LEFT */}
                <div className="xl:col-span-2 space-y-5">

                    {/* Basic Details */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3" style={{ background: 'linear-gradient(to right,#f0fdf4,white)' }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#EAF8E7' }}>
                                <Tag size={14} style={{ color: '#4EA674' }} />
                            </div>
                            <h2 className="text-sm font-black text-[#023337]">Basic Details</h2>
                        </div>
                        <div className="px-6 py-5 space-y-5">
                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Category Name <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                        className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-400 focus:bg-white transition-all pr-20" />
                                    {formData.name && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-500 text-[10px] font-black">
                                            <CheckCircle2 size={12} /> OK
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">URL Slug <span className="text-red-400">*</span></label>
                                <div className="flex items-center rounded-xl overflow-hidden border-2 border-gray-100 focus-within:border-emerald-400 transition-all bg-gray-50">
                                    <span className="px-4 py-3.5 text-sm font-bold text-gray-400 bg-gray-100 border-r border-gray-200 whitespace-nowrap select-none">/categories/</span>
                                    <input type="text" name="slug" value={formData.slug} onChange={handleChange} required
                                        className="flex-1 px-4 py-3.5 bg-transparent text-sm font-mono text-gray-600 focus:outline-none" />
                                </div>
                                <p className="text-[10px] text-amber-500 font-bold ml-1">⚠ Changing the slug will break existing URLs</p>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows="4"
                                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-400 focus:bg-white transition-all resize-none leading-relaxed" />
                                <div className="flex justify-end"><span className="text-[10px] text-gray-300 font-bold">{formData.description.length} chars</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3" style={{ background: 'linear-gradient(to right,#f0fdf4,white)' }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#EAF8E7' }}>
                                <ImageIcon size={14} style={{ color: '#4EA674' }} />
                            </div>
                            <h2 className="text-sm font-black text-[#023337]">Category Images</h2>
                        </div>
                        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Cover Image</label>
                                <ImageUpload preview={formData.imagePreview} fileRef={imageRef} onChange={(e) => handleImageChange(e, false)} onClear={() => setFormData(p => ({ ...p, imagePreview: null, imageFile: null }))} label="Click to change cover" subtitle="PNG, JPG, WebP — max 5MB" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Icon Image</label>
                                <ImageUpload preview={formData.iconPreview} fileRef={iconImageRef} onChange={(e) => handleImageChange(e, true)} onClear={() => setFormData(p => ({ ...p, iconPreview: null, iconFile: null }))} label="Click to change icon" subtitle="Square recommended — PNG, SVG" />
                            </div>
                        </div>
                    </div>

                    {/* Store Preview */}
                    {preview && formData.name && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ animation: 'fadeUp 0.3s ease' }}>
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3" style={{ background: 'linear-gradient(to right,#f0fdf4,white)' }}>
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#EAF8E7' }}>
                                    <Eye size={14} style={{ color: '#4EA674' }} />
                                </div>
                                <h2 className="text-sm font-black text-[#023337]">Store Preview</h2>
                            </div>
                            <div className="px-6 py-5">
                                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                    {formData.imagePreview && <img src={formData.imagePreview} alt="preview" className="w-full h-40 object-cover" />}
                                    <div className="p-5" style={{ background: formData.imagePreview ? 'white' : '#f9fafb' }}>
                                        <div className="flex items-center gap-3 mb-3">
                                            {formData.iconPreview ? (
                                                <img src={formData.iconPreview} alt="icon" className="w-10 h-10 rounded-xl object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EAF8E7' }}>
                                                    <Layers size={18} style={{ color: '#4EA674' }} />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-black text-gray-900">{formData.name}</p>
                                                <p className="text-xs text-gray-400 font-mono">/categories/{formData.slug}</p>
                                            </div>
                                            <span className={`ml-auto text-[10px] font-black px-2.5 py-1 rounded-full ${formData.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                                {formData.is_active ? '● Active' : '● Inactive'}
                                            </span>
                                        </div>
                                        {formData.description && <p className="text-sm text-gray-500 leading-relaxed">{formData.description}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="space-y-5 fade-up-3">

                    {/* Status */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-50" style={{ background: 'linear-gradient(to right,#f0fdf4,white)' }}>
                            <h3 className="text-sm font-black text-[#023337]">Publish Settings</h3>
                        </div>
                        <div className="px-5 py-4">
                            <div className="flex items-center justify-between p-3.5 rounded-xl" style={{ background: formData.is_active ? '#EAF8E7' : '#FEF2F2', border: `1.5px solid ${formData.is_active ? '#C1E6BA' : '#FECACA'}` }}>
                                <div>
                                    <p className="text-xs font-black" style={{ color: formData.is_active ? '#023337' : '#B91C1C' }}>Status</p>
                                    <p className="text-[10px] font-bold mt-0.5" style={{ color: formData.is_active ? '#4EA674' : '#EF4444' }}>{formData.is_active ? '● Active — visible in store' : '● Draft — hidden from store'}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-md after:transition-all peer-checked:after:translate-x-5" />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Parent Category */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-50" style={{ background: 'linear-gradient(to right,#f0fdf4,white)' }}>
                            <h3 className="text-sm font-black text-[#023337]">Parent Category</h3>
                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Assign to make this a sub-category</p>
                        </div>
                        <div className="px-5 py-4">
                            <select name="parent" value={formData.parent || ''} onChange={(e) => setFormData(p => ({ ...p, parent: e.target.value || null }))}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-400 focus:bg-white transition-all">
                                <option value="">— None (top level) —</option>
                                {parentCategories.map(c => <option key={c.slug} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Live Card Preview */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-50" style={{ background: 'linear-gradient(to right,#f0fdf4,white)' }}>
                            <h3 className="text-sm font-black text-[#023337]">Card Preview</h3>
                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">How it appears in Discover grid</p>
                        </div>
                        <div className="px-5 py-5">
                            <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl bg-gray-50/50 hover:border-emerald-200 transition-all">
                                <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#EAF8E7' }}>
                                    {formData.iconPreview ? (
                                        <img src={formData.iconPreview} alt="icon" className="w-full h-full object-cover rounded-xl" />
                                    ) : formData.imagePreview ? (
                                        <img src={formData.imagePreview} alt="cover" className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        <Layers size={22} style={{ color: '#4EA674' }} strokeWidth={2} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-[#023337] truncate">{formData.name || 'Category Name'}</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Explore</span>
                                        <ChevronRight size={10} className="text-gray-300" />
                                    </div>
                                </div>
                                <div className={`shrink-0 w-2 h-2 rounded-full ${formData.is_active ? 'bg-emerald-400' : 'bg-red-300'}`} />
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="rounded-2xl p-5 space-y-3" style={{ background: 'linear-gradient(135deg,#EAF8E7,#f0fdf4)', border: '1.5px solid #C1E6BA' }}>
                        <div className="flex items-center gap-2">
                            <Sparkles size={14} style={{ color: '#4EA674' }} />
                            <p className="text-xs font-black text-[#023337]">Edit Tips</p>
                        </div>
                        {[
                            'Changing the slug will break existing URLs — be careful',
                            'Update the icon for a better Discover grid appearance',
                            'Toggle status to hide a category from the storefront',
                        ].map((tip, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#4EA674' }} />
                                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCategory;
