import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Home, ChevronRight, Image as ImageIcon, Box, Upload, X,
    Plus, Trash2, Save, AlertCircle, CheckCircle2,
    Calendar, DollarSign, Tag, List, Palette, Package,
    MoreVertical, Search, Globe, Clock, FileText, MousePointer2,
    RotateCcw, Ruler, Sparkles, Scale, Layers, Hash, Barcode, ArrowRight,
    RefreshCw
} from 'lucide-react';
import api from '../../../utils/api';

// ── 360° Spinner (live preview from uploaded frames) ─────────────────────────
const Spinner360 = ({ images }) => {
    const [frame, setFrame] = useState(0);
    const [dragging, setDragging] = useState(false);
    const startXRef = useRef(0);
    const frameCount = images.length;
    const autoRef = useRef(null);

    const startAuto = () => {
        clearInterval(autoRef.current);
        autoRef.current = setInterval(() => setFrame(p => (p + 1) % frameCount), 100);
    };
    const stopAuto = () => clearInterval(autoRef.current);

    useEffect(() => { if (frameCount > 1) startAuto(); return stopAuto; }, [frameCount]);

    const onDown = (e) => { stopAuto(); setDragging(true); startXRef.current = e.clientX || e.touches?.[0]?.clientX || 0; };
    const onMove = useCallback((e) => {
        if (!dragging) return;
        const x = e.clientX || e.touches?.[0]?.clientX || 0;
        const delta = x - startXRef.current;
        startXRef.current = x;
        setFrame(p => ((p - Math.round(delta / 2)) % frameCount + frameCount) % frameCount);
    }, [dragging, frameCount]);
    const onUp = () => setDragging(false);

    useEffect(() => {
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchend', onUp);
        return () => { window.removeEventListener('mouseup', onUp); window.removeEventListener('touchend', onUp); };
    }, []);

    if (!frameCount) return (
        <div className="aspect-[4/3] w-full bg-gray-50 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-300">
            <RotateCcw size={32} />
            <p className="text-xs font-bold mt-2">Upload images to preview 360°</p>
        </div>
    );

    return (
        <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden select-none"
            onMouseDown={onDown} onMouseMove={onMove}
            onTouchStart={onDown} onTouchMove={onMove}
            style={{ cursor: dragging ? 'grabbing' : 'grab' }}>
            {images.map((src, idx) => (
                <img key={idx} src={src} alt={`frame-${idx}`} draggable={false}
                    className={`absolute inset-0 w-full h-full object-contain p-3 transition-opacity duration-75 ${idx === frame ? 'opacity-100' : 'opacity-0'}`} />
            ))}
            <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 text-white text-[10px] font-bold rounded-full backdrop-blur-sm transition-opacity ${dragging ? 'opacity-0' : 'opacity-100'}`}>
                <RotateCcw size={11} /> Drag to rotate · {frame + 1}/{frameCount}
            </div>
        </div>
    );
};

const AddProduct = () => {
    const navigate = useNavigate();
    const mainImageRef = useRef(null);
    const galleryRef = useRef(null);

    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    // --- Form State ---
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        discount_price: '',
        discount_type: 'NONE',
        discount_value: 0,
        is_tax_included: true,
        currency: 'USD',
        sale_start_date: '',
        sale_end_date: '',
        stock: '',
        min_stock: 10,
        stock_status: 'IN_STOCK',
        is_unlimited: false,
        sku: '',
        barcode: '',
        brand: '',
        weight: '',
        material: '',
        dimensions: '',
        category: '',
        tag: '',
        highlight_featured: false,
        is_active: true,
    });

    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [gallery, setGallery] = useState([]); // [{ file, preview }]
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [features, setFeatures] = useState(['']); // array of feature strings
    const [previewMode, setPreviewMode] = useState('360'); // '360' | 'static'

    // All preview images (main + gallery)
    const allPreviews = [
        ...(mainImagePreview ? [mainImagePreview] : []),
        ...(Array.isArray(gallery) ? gallery.map(g => g.preview).filter(Boolean) : [])
    ];

    const FALLBACK_COLORS = [
        { name: 'White', code: '#FFFFFF' }, { name: 'Black', code: '#000000' },
        { name: 'Red', code: '#EF4444' }, { name: 'Blue', code: '#3B82F6' },
        { name: 'Green', code: '#22C55E' }, { name: 'Yellow', code: '#EAB308' },
        { name: 'Pink', code: '#EC4899' }, { name: 'Purple', code: '#8B5CF6' },
        { name: 'Orange', code: '#F97316' }, { name: 'Navy', code: '#1E3A8A' },
        { name: 'Brown', code: '#92400E' }, { name: 'Gray', code: '#6B7280' },
        { name: 'Beige', code: '#D4C5A9' }, { name: 'Teal', code: '#14B8A6' },
        { name: 'Maroon', code: '#800000' }, { name: 'Gold', code: '#FFD700' },
    ];

    const colors = availableColors.length ? availableColors : FALLBACK_COLORS;

    const fetchData = useCallback(async () => {
        try {
            const [catRes, attrRes] = await Promise.all([
                api.get('categories/'),
                api.get('attributes/')
            ]);

            // Robust category extraction
            const fetchedCats = catRes.data?.results || (Array.isArray(catRes.data) ? catRes.data : []);
            setCategories(fetchedCats);

            // Robust attribute extraction
            const fetchedAttrs = attrRes.data?.results || (Array.isArray(attrRes.data) ? attrRes.data : []);
            setAttributes(fetchedAttrs);

            // Extract sizes from attributes (check size, sizes)
            const sizeAttr = Array.isArray(fetchedAttrs)
                ? fetchedAttrs.find(a =>
                    a.name?.toLowerCase() === 'size' ||
                    a.name?.toLowerCase() === 'sizes' ||
                    a.name?.toLowerCase() === 'product size')
                : null;

            if (sizeAttr?.terms) {
                setAvailableSizes(sizeAttr.terms.split(',').map(t => t.trim()).filter(Boolean));
            }

            // Extract colors from attributes (check color, colors)
            const colorAttr = Array.isArray(fetchedAttrs)
                ? fetchedAttrs.find(a =>
                    a.name?.toLowerCase() === 'color' ||
                    a.name?.toLowerCase() === 'colors' ||
                    a.name?.toLowerCase() === 'product color')
                : null;

            if (colorAttr?.terms) {
                const parsed = colorAttr.terms.split(',').map(item => {
                    const ci = item.indexOf(':');
                    if (ci === -1) return { name: item.trim(), code: '#888888' };
                    return { name: item.slice(0, ci).trim(), code: item.slice(ci + 1).trim() };
                }).filter(c => c.name);
                if (parsed.length) setAvailableColors(parsed);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            // Default to empty arrays on failure to avoid crashes
            setCategories([]);
            setAttributes([]);
        }
    }, []);

    useEffect(() => {
        fetchData();
        return () => {
            // Cleanup previews
            if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
            gallery.forEach(item => URL.revokeObjectURL(item.preview));
        };
    }, []); // Only initial mount and cleanup

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // --- Image Handlers ---
    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImage(file);
            setMainImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setGallery(prev => [...prev, ...newImages]);
    };

    const removeGalleryItem = (index) => {
        setGallery(prev => prev.filter((_, i) => i !== index));
    };

    const toggleColor = (colorCode) => {
        setSelectedColors(prev =>
            prev.includes(colorCode) ? prev.filter(c => c !== colorCode) : [...prev, colorCode]
        );
    };

    const toggleSize = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const addFeature = () => setFeatures(prev => [...prev, '']);
    const updateFeature = (idx, val) => setFeatures(prev => prev.map((f, i) => i === idx ? val : f));
    const removeFeature = (idx) => setFeatures(prev => prev.filter((_, i) => i !== idx));

    const handleSubmit = async (e, isDraft = false) => {
        if (e) e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });

        try {
            const data = new FormData();

            // Append regular fields
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
                    data.append(key, formData[key]);
                }
            });

            // Adjust status if draft
            if (isDraft) data.set('is_active', 'false');

            // Append images
            if (mainImage) data.append('main_image', mainImage);
            gallery.forEach(item => {
                data.append('gallery', item.file);
            });

            // Colors, Sizes, Features
            if (selectedColors.length > 0) data.append('colors_data', JSON.stringify(selectedColors));
            if (selectedSizes.length > 0) data.append('sizes_data', JSON.stringify(selectedSizes));
            const cleanFeatures = features.filter(f => f.trim());
            if (cleanFeatures.length > 0) data.append('features', JSON.stringify(cleanFeatures));

            await api.post('products/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMsg({ type: 'success', text: isDraft ? 'Draft saved!' : 'Product published successfully!' });
            setTimeout(() => navigate('/admin/products/all'), 2000);
        } catch (err) {
            console.error("Submit error:", err);
            setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to save product.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto pb-20">
            {/* Header / Nav */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Add Product</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <Home size={14} />
                        <ChevronRight size={12} />
                        <span>Add Product</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search product for add"
                            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-[240px]"
                        />
                    </div>
                    <button
                        onClick={(e) => handleSubmit(e, false)}
                        disabled={loading}
                        className="px-6 py-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-all shadow-sm hover:shadow-emerald-200 shadow-md text-sm"
                    >
                        Publish Product
                    </button>
                    <button
                        onClick={(e) => handleSubmit(e, true)}
                        className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all shadow-sm text-sm flex items-center gap-2"
                    >
                        <Save size={16} /> Save to draft
                    </button>
                    <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-emerald-500 transition-colors">
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {msg.text && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 font-bold text-sm ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {msg.text}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* LEFT COLUMN: Main Form */}
                <div className="flex-1 space-y-8 w-full">

                    {/* Basic Details */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Basic Details
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. iPhone 15"
                                    className="w-full px-5 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Product Description</label>
                                <div className="relative">
                                    <textarea
                                        name="description"
                                        rows="6"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="The iPhone 15 delivers cutting-edge performance..."
                                        className="w-full p-5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 transition-all resize-none min-h-[160px]"
                                    ></textarea>
                                    <div className="absolute right-4 bottom-4 flex items-center gap-2 text-gray-400">
                                        <button type="button" className="hover:text-emerald-500 transition-colors"><FileText size={18} /></button>
                                        <button type="button" className="hover:text-emerald-500 transition-colors"><MousePointer2 size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Pricing
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Product Price</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-1.5 flex items-center pointer-events-none">
                                        <span className="text-gray-400 font-bold ml-4 pr-3 border-r border-gray-200">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="999.89"
                                        className="w-full pl-[52px] pr-[100px] py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 transition-all"
                                    />
                                    <div className="absolute inset-y-0 right-0 py-1.5 pr-1.5 flex items-center">
                                        <select
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleChange}
                                            className="h-full px-3 text-xs font-bold border-l border-gray-200 bg-transparent text-gray-600 focus:outline-none"
                                        >
                                            <option value="USD">🇺🇸 USD</option>
                                            <option value="PKR">🇵🇰 PKR</option>
                                            <option value="EUR">🇪🇺 EUR</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Discount Price</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                        <input
                                            type="number"
                                            name="discount_price"
                                            value={formData.discount_price}
                                            onChange={handleChange}
                                            placeholder="99"
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-brand/40"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-end">
                                    <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600">
                                        Sale= ${formData.discount_price || '0.00'}
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Tax Included</label>
                                <div className="flex items-center gap-6 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="is_tax_included"
                                            value="true"
                                            checked={formData.is_tax_included === true || formData.is_tax_included === 'true'}
                                            onChange={() => setFormData(prev => ({ ...prev, is_tax_included: true }))}
                                            className="w-4 h-4 text-emerald-500 border-gray-300 focus:ring-emerald-500"
                                        />
                                        <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">Yes</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="is_tax_included"
                                            value="false"
                                            checked={formData.is_tax_included === false || formData.is_tax_included === 'false'}
                                            onChange={() => setFormData(prev => ({ ...prev, is_tax_included: false }))}
                                            className="w-4 h-4 text-emerald-500 border-gray-300 focus:ring-emerald-500"
                                        />
                                        <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">No</span>
                                    </label>
                                </div>
                            </div>

                            <div className="col-span-1 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Expiration (Start)</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="sale_start_date"
                                            value={formData.sale_start_date}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:outline-none"
                                        />
                                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Expiration (End)</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="sale_end_date"
                                            value={formData.sale_end_date}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:outline-none"
                                        />
                                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Inventory
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Stock Quantity</label>
                                <input
                                    type="text"
                                    name="stock"
                                    value={formData.is_unlimited ? 'Unlimited' : formData.stock}
                                    onChange={handleChange}
                                    disabled={formData.is_unlimited}
                                    placeholder="Enter quantity"
                                    className="w-full px-5 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-brand/40 transition-all disabled:text-emerald-600 font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Stock Status</label>
                                <select
                                    name="stock_status"
                                    value={formData.stock_status}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none appearance-none"
                                >
                                    <option value="IN_STOCK">In Stock</option>
                                    <option value="OUT_OF_STOCK">Out of Stock</option>
                                    <option value="ON_BACKORDER">On Backorder</option>
                                </select>
                            </div>
                            <div className="col-span-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, is_unlimited: !prev.is_unlimited }))}
                                        className={`w-10 h-6 rounded-full relative transition-colors ${formData.is_unlimited ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.is_unlimited ? 'translate-x-4' : ''}`} />
                                    </button>
                                    <span className="text-sm font-bold text-gray-700">Unlimited</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, highlight_featured: !prev.highlight_featured }))}
                                        className={`w-10 h-6 rounded-full relative transition-colors ${formData.highlight_featured ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.highlight_featured ? 'translate-x-4' : ''}`} />
                                    </button>
                                    <span className="text-sm font-bold text-gray-700">Highlight this product in a featured section.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Features Section ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <Sparkles size={18} className="text-emerald-500" /> Product Features
                        </h2>
                        <p className="text-xs text-gray-400 font-medium mb-6">Add key selling points — shown as bullet list on product page.</p>
                        <div className="space-y-3">
                            {features.map((f, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={12} className="text-emerald-500" />
                                    </div>
                                    <input
                                        type="text"
                                        value={f}
                                        onChange={(e) => updateFeature(idx, e.target.value)}
                                        placeholder={`Feature ${idx + 1} — e.g. "Waterproof material"`}
                                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition-all"
                                    />
                                    {features.length > 1 && (
                                        <button type="button" onClick={() => removeFeature(idx)}
                                            className="p-1.5 text-gray-300 hover:text-red-400 transition-colors">
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={addFeature}
                                className="w-full mt-2 py-2.5 border-2 border-dashed border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:text-emerald-500 hover:border-emerald-200 transition-all flex items-center justify-center gap-2">
                                <Plus size={14} /> Add Feature
                            </button>
                        </div>
                    </div>

                    {/* ── Additional Product Details ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Layers size={18} className="text-emerald-500" /> Product Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: 'SKU', name: 'sku', icon: Hash, placeholder: 'e.g. PRD-0012' },
                                { label: 'Barcode (EAN/UPC)', name: 'barcode', icon: Barcode, placeholder: 'e.g. 8901234567890' },
                                { label: 'Brand', name: 'brand', icon: Tag, placeholder: 'e.g. Apple, Nike...' },
                                { label: 'Material', name: 'material', icon: Layers, placeholder: 'e.g. 100% Cotton' },
                                { label: 'Weight (kg)', name: 'weight', icon: Scale, placeholder: 'e.g. 0.5' },
                                { label: 'Dimensions (L×W×H cm)', name: 'dimensions', icon: Ruler, placeholder: 'e.g. 30×15×5' },
                            ].map(({ label, name, icon: Icon, placeholder }) => (
                                <div key={name}>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                                        <Icon size={13} className="text-gray-400" /> {label}
                                    </label>
                                    <input
                                        type="text"
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        placeholder={placeholder}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition-all font-medium"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Sticky Action for Mobile */}
                    <div className="lg:hidden flex items-center gap-3 pt-6">
                        <button
                            onClick={(e) => handleSubmit(e, true)}
                            className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm text-sm"
                        >
                            Save to draft
                        </button>
                        <button
                            onClick={(e) => handleSubmit(e, false)}
                            className="flex-1 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-md text-sm"
                        >
                            Publish Product
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN: Sidebar Config */}
                <div className="w-full lg:w-[420px] shrink-0 space-y-8">

                    {/* ── 360° LIVE PREVIEW ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <RotateCcw size={16} className="text-emerald-500" /> Live 360° Preview
                            </h2>
                            <div className="flex gap-1">
                                {['360', 'static'].map(m => (
                                    <button key={m} type="button" onClick={() => setPreviewMode(m)}
                                        className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all
                                            ${previewMode === m ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                                        {m === '360' ? '🔄 360°' : '📷 Static'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {previewMode === '360'
                            ? <Spinner360 images={allPreviews} />
                            : (
                                <div className="relative aspect-[4/3] w-full bg-gray-50 border-2 border-dashed border-gray-100 rounded-2xl overflow-hidden">
                                    {mainImagePreview
                                        ? <img src={mainImagePreview} alt="Preview" className="w-full h-full object-contain p-4" />
                                        : <div className="flex flex-col items-center justify-center h-full text-gray-300"><ImageIcon size={32} /><p className="text-xs mt-2 font-bold">No image yet</p></div>
                                    }
                                </div>
                            )
                        }

                        {/* Thumbnail strip */}
                        {allPreviews.length > 1 && (
                            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                                {allPreviews.map((src, i) => (
                                    <img key={i} src={src} alt="" className="shrink-0 w-12 h-12 rounded-lg object-cover border-2 border-gray-100" />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Image Upload Gallery */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6">
                        <h2 className="text-base font-bold text-gray-900 mb-4">Upload Product Images</h2>

                        {/* Main Image */}
                        <div className="mb-5">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Cover Image (Main)</label>
                            <div className="relative aspect-[4/3] w-full bg-gray-50 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center overflow-hidden group">
                                {mainImagePreview ? (
                                    <>
                                        <img src={mainImagePreview} alt="Preview" className="w-full h-full object-contain p-4" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button type="button" onClick={() => mainImageRef.current.click()}
                                                className="px-4 py-2 bg-white text-gray-900 rounded-lg text-xs font-bold shadow-lg">Browse</button>
                                            <button type="button" onClick={() => { setMainImage(null); setMainImagePreview(null); }}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5">
                                                <X size={14} /> Remove
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center cursor-pointer p-8" onClick={() => mainImageRef.current.click()}>
                                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-gray-300">
                                            <ImageIcon size={28} />
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 text-center">Click to browse or<br />drag and drop image</p>
                                    </div>
                                )}
                                <input type="file" ref={mainImageRef} className="hidden" accept="image/*" onChange={handleMainImageChange} />
                            </div>
                        </div>

                        {/* Gallery Section */}
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Gallery (360° frames)</label>
                        <div className="grid grid-cols-4 gap-3">
                            {gallery.map((item, idx) => (
                                <div key={idx} className="relative aspect-square bg-gray-50 border border-gray-100 rounded-xl overflow-hidden group">
                                    <img src={item.preview} className="w-full h-full object-cover" alt="Gallery" />
                                    <button onClick={() => removeGalleryItem(idx)}
                                        className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                        <X size={11} />
                                    </button>
                                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/40 text-white text-[8px] font-bold rounded">{idx + 1}</div>
                                </div>
                            ))}
                            <button type="button" onClick={() => galleryRef.current.click()}
                                className="aspect-square border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center gap-1 group hover:border-emerald-300 transition-all hover:bg-emerald-50">
                                <div className="w-7 h-7 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                    <Plus size={16} />
                                </div>
                                <span className="text-[9px] font-bold text-gray-400 group-hover:text-emerald-600 uppercase tracking-widest">Add</span>
                            </button>
                            <input type="file" ref={galleryRef} multiple className="hidden" accept="image/*" onChange={handleGalleryChange} />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">💡 Upload multiple angles for a better 360° rotation experience</p>
                    </div>

                    {/* ── Categories & Tags ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6 space-y-5">
                        <h2 className="text-base font-bold text-gray-900">Classification</h2>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:border-emerald-400 appearance-none">
                                <option value="">Select category</option>
                                {Array.isArray(categories) && categories.map(cat => (
                                    <option key={cat.id || cat.slug || cat.name} value={cat.id || cat.slug}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Product Tag</label>
                            <select name="tag" value={formData.tag} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:border-emerald-400 appearance-none">
                                <option value="">Select tag</option>
                                <option value="NEW">🆕 New Arrival</option>
                                <option value="TRENDING">🔥 Trending</option>
                                <option value="BEST_SELLER">⭐ Best Seller</option>
                                <option value="DISCOUNTED">💸 Discounted</option>
                            </select>
                        </div>
                    </div>

                    {/* ── Size Selector ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <Ruler size={15} className="text-emerald-500" /> Sizes
                            </h2>
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={fetchData} className="p-1.5 text-gray-400 hover:text-emerald-500 transition-colors" title="Sync attributes">
                                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                                </button>
                                {selectedSizes.length > 0 && (
                                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{selectedSizes.length} selected</span>
                                )}
                            </div>
                        </div>
                        {availableSizes.length === 0 ? (
                            <div className="text-center py-4 border-2 border-dashed border-gray-100 rounded-xl">
                                <p className="text-xs text-gray-400 font-bold">No sizes found</p>
                                <p className="text-[10px] text-gray-300 mt-1">Go to Attributes → Size to add sizes</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {availableSizes.map(size => (
                                    <button key={size} type="button" onClick={() => toggleSize(size)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all
                                            ${selectedSizes.includes(size)
                                                ? 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-100'
                                                : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-emerald-300'}`}>
                                        {size}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Color Selector ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <Palette size={15} className="text-emerald-500" /> Colors
                            </h2>
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={fetchData} className="p-1.5 text-gray-400 hover:text-emerald-500 transition-colors" title="Sync attributes">
                                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                                </button>
                                {selectedColors.length > 0 && (
                                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{selectedColors.length} selected</span>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-8 gap-2">
                            {colors.map(color => {
                                const isSelected = selectedColors.includes(color.code);
                                return (
                                    <button key={color.code} type="button" title={color.name}
                                        onClick={() => toggleColor(color.code)}
                                        style={{ backgroundColor: color.code }}
                                        className={`w-8 h-8 rounded-lg transition-all shadow-sm border-2
                                            ${isSelected ? 'ring-2 ring-emerald-500 ring-offset-1 scale-110 border-white' : 'border-gray-100 hover:scale-110'}
                                            ${color.code === '#FFFFFF' ? 'border-gray-200' : ''}`}
                                    />
                                );
                            })}
                        </div>
                        {selectedColors.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {selectedColors.map(code => {
                                    const c = Array.isArray(colors) ? colors.find(cl => cl.code === code) : null;
                                    return (
                                        <span key={code} className="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-600">
                                            <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: code }} />
                                            {c?.name || code}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
