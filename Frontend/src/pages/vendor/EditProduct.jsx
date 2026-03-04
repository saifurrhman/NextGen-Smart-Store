import React, { useState, useEffect } from 'react';
import {
    Upload,
    X,
    Plus,
    ChevronLeft,
    Image as ImageIcon,
    DollarSign,
    Package,
    Tag,
    Info,
    CheckCircle2,
    Loader2,
    Trash2
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [mainImage, setMainImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]); // {id, preview, isNew, file}

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        sku: '',
        tag: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    api.get('/categories/'),
                    api.get(`/vendors/products/${id}/`)
                ]);

                if (catRes.data && catRes.data.results) {
                    setCategories(catRes.data.results);
                }

                if (prodRes.data) {
                    const p = prodRes.data;
                    setFormData({
                        title: p.title || '',
                        description: p.description || '',
                        price: p.price || '',
                        stock: p.stock || '',
                        category: p.category || '',
                        sku: p.sku || '',
                        tag: p.tag || ''
                    });

                    if (p.main_image) {
                        setMainImage({ preview: p.main_image });
                    }

                    if (p.images) {
                        setGalleryImages(p.images.map(img => ({
                            id: img.id,
                            preview: img.image,
                            isNew: false
                        })));
                    }
                }
            } catch (err) {
                console.error("Failed to load data:", err);
                setError("Failed to synchronize with inventory network.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleMainImage = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setMainImage({
                file,
                preview: URL.createObjectURL(file),
                isNew: true
            });
        }
    };

    const handleGalleryImages = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newImages = files.map(file => ({
                file,
                preview: URL.createObjectURL(file),
                isNew: true
            }));
            setGalleryImages(prev => [...prev, ...newImages]);
        }
    };

    const removeGalleryImage = async (index) => {
        const img = galleryImages[index];
        if (!img.isNew) {
            try {
                await api.delete(`/vendors/products/gallery/${img.id}/`);
            } catch (err) {
                console.error("Failed to delete image:", err);
                return;
            }
        }
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        if (mainImage && mainImage.isNew) {
            data.append('main_image', mainImage.file);
        }

        galleryImages.forEach(img => {
            if (img.isNew) {
                data.append('gallery', img.file);
            }
        });

        try {
            await api.patch(`/vendors/products/${id}/`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess(true);
            setTimeout(() => navigate('/vendor/my-products'), 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || err.response?.data?.message || 'Update failed.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-50">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Inventory Updated</h2>
                <p className="text-gray-500 font-medium">Re-distributing updated specifications across the mesh...</p>
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mt-4" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-6">
                    <Link to="/vendor/my-products" className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all">
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Update Logistics</h1>
                        <p className="text-sm text-gray-400 font-medium">Modifying assets within the global retail network.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/vendor/my-products')}
                        className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all"
                    >
                        Cancel Update
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-8 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50 flex items-center gap-3"
                    >
                        {submitting && <Loader2 size={14} className="animate-spin" />}
                        {submitting ? 'Applying...' : 'Push Changes'}
                    </button>
                </div>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-black uppercase tracking-widest flex items-center gap-3"
                >
                    <Info size={16} />
                    {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Core Data */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <Info size={16} />
                            </div>
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Base Specifications</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1 transition-colors group-focus-within:text-emerald-600">Product Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1 transition-colors group-focus-within:text-emerald-600">Deployment Narrative</label>
                                <textarea
                                    required
                                    rows={6}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium text-gray-600 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Media Gallery */}
                    <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <ImageIcon size={16} />
                            </div>
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Product Visualization</h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {/* Main Image */}
                            <div className="col-span-full md:col-span-1">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">Master Visual</label>
                                <div className="aspect-square relative group">
                                    {mainImage ? (
                                        <div className="w-full h-full rounded-[2rem] overflow-hidden border-2 border-emerald-500 shadow-lg shadow-emerald-50">
                                            <img src={mainImage.preview} className="w-full h-full object-cover" alt="Main" />
                                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                                                <Upload size={24} />
                                                <input type="file" className="hidden" onChange={handleMainImage} accept="image/*" />
                                            </label>
                                        </div>
                                    ) : (
                                        <label className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-100 rounded-[2rem] cursor-pointer hover:bg-emerald-50/50 hover:border-emerald-200 transition-all group">
                                            <Upload size={24} className="text-gray-300 group-hover:text-emerald-600 transition-colors" />
                                            <input type="file" className="hidden" onChange={handleMainImage} accept="image/*" />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Gallery */}
                            <div className="col-span-full md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Supporting Perspectives</label>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                    <AnimatePresence mode="popLayout">
                                        {galleryImages.map((img, idx) => (
                                            <motion.div
                                                layout
                                                key={img.id || idx}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="aspect-square relative group rounded-2xl overflow-hidden border border-gray-100"
                                            >
                                                <img src={img.preview} className="w-full h-full object-cover" alt="Gallery" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeGalleryImage(idx)}
                                                    className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    <label className="aspect-square flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-100 rounded-2xl cursor-pointer hover:bg-blue-50/50 hover:border-blue-200 transition-all">
                                        <Plus size={20} className="text-gray-300" />
                                        <input type="file" multiple className="hidden" onChange={handleGalleryImages} accept="image/*" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Metrics & Taxonomy */}
                <div className="space-y-8">
                    {/* Pricing & Stock */}
                    <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                <DollarSign size={16} />
                            </div>
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Financials</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Unit Valuation ($)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xl font-black text-gray-900 focus:ring-4 focus:ring-emerald-500/5 transition-all text-right outline-none"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-black tracking-widest uppercase text-[10px]">USD</div>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Inventory Depth</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xl font-black text-gray-900 focus:ring-4 focus:ring-emerald-500/5 transition-all text-right outline-none"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    />
                                    <Package size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-200" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Classification */}
                    <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                <Tag size={16} />
                            </div>
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Taxonomy</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Global Category</label>
                                <select
                                    required
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none appearance-none cursor-pointer"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="">Select Domain</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Stock Keeping Unit (SKU)</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-black text-emerald-600 focus:ring-4 focus:ring-emerald-500/5 transition-all font-mono uppercase tracking-widest"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;

