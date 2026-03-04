import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Home, ChevronRight, Image as ImageIcon, Box, Upload, X,
    Plus, Trash2, Save, AlertCircle, CheckCircle2,
    Calendar, DollarSign, Tag, List, Palette, Package,
    MoreVertical, Search, Globe, Clock, FileText, MousePointer2
} from 'lucide-react';
import api from '../../../utils/api';

const AddProduct = () => {
    const navigate = useNavigate();
    const mainImageRef = useRef(null);
    const galleryRef = useRef(null);

    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
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
        category: '',
        tag: '',
        highlight_featured: false,
        is_active: true,
    });

    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [gallery, setGallery] = useState([]); // [{ file, preview }]
    const [selectedColors, setSelectedColors] = useState([]);

    const colors = [
        { name: 'Green', code: '#D1E8D1' },
        { name: 'Pink', code: '#E8D1D1' },
        { name: 'Blue', code: '#D1DCE8' },
        { name: 'Beige', code: '#E8E1D1' },
        { name: 'Charcoal', code: '#3A3F44' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, attrRes] = await Promise.all([
                    api.get('categories/'),
                    api.get('attributes/')
                ]);
                setCategories(catRes.data.results || catRes.data);
                setAttributes(attrRes.data.results || attrRes.data);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
        fetchData();
    }, []);

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

            // Append selected colors (as attributes) if needed, or custom field
            // For now, let's just append as a tag if highlighting
            if (selectedColors.length > 0) {
                data.append('colors_data', JSON.stringify(selectedColors));
            }

            await api.post('/api/v1/products/', data, {
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
                <div className="w-full lg:w-[400px] shrink-0 space-y-8">

                    {/* Image Upload Gallery */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Upload Product Image</h2>

                        {/* Main Image */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-gray-700 mb-4">Product Image</label>
                            <div className="relative aspect-[4/3] w-full bg-gray-50 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center overflow-hidden group">
                                {mainImagePreview ? (
                                    <>
                                        <img src={mainImagePreview} alt="Preview" className="w-full h-full object-contain p-4" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => mainImageRef.current.click()}
                                                className="px-4 py-2 bg-white text-gray-900 rounded-lg text-xs font-bold shadow-lg hover:bg-gray-50 transition-all"
                                            >
                                                Browse
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setMainImage(null); setMainImagePreview(null); }}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-bold shadow-lg hover:bg-red-600 transition-all flex items-center gap-1.5"
                                            >
                                                <X size={14} /> Replace
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div
                                        className="flex flex-col items-center cursor-pointer p-8"
                                        onClick={() => mainImageRef.current.click()}
                                    >
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-gray-300">
                                            <ImageIcon size={32} />
                                        </div>
                                        <p className="text-sm font-bold text-gray-400 group-hover:text-brand transition-colors text-center">
                                            Click to browse or <br />drag and drop image
                                        </p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={mainImageRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleMainImageChange}
                                />
                            </div>
                        </div>

                        {/* Gallery Section */}
                        <div className="grid grid-cols-3 gap-4">
                            {gallery.map((item, idx) => (
                                <div key={idx} className="relative aspect-square bg-gray-50 border border-gray-100 rounded-xl overflow-hidden group">
                                    <img src={item.preview} className="w-full h-full object-cover" alt="Gallery" />
                                    <button
                                        onClick={() => removeGalleryItem(idx)}
                                        className="absolute top-1 right-1 p-1.5 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => galleryRef.current.click()}
                                className="aspect-square border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center gap-1.5 group hover:border-brand/40 transition-all hover:bg-brand/5"
                            >
                                <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                    <Plus size={18} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 group-hover:text-emerald-600 uppercase tracking-widest">Add Image</span>
                            </button>
                            <input
                                type="file"
                                ref={galleryRef}
                                multiple
                                className="hidden"
                                accept="image/*"
                                onChange={handleGalleryChange}
                            />
                        </div>
                    </div>

                    {/* Meta Config */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Categories</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Product Categories</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none appearance-none"
                                >
                                    <option value="">Select your product</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Product Tag</label>
                                <select
                                    name="tag"
                                    value={formData.tag}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none appearance-none"
                                >
                                    <option value="">Select your product</option>
                                    <option value="NEW">New Arrival</option>
                                    <option value="TRENDING">Trending</option>
                                    <option value="BEST_SELLER">Best Seller</option>
                                    <option value="DISCOUNTED">Discounted</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-4">Select your color</label>
                                <div className="flex flex-wrap gap-4">
                                    {colors.map(color => (
                                        <button
                                            key={color.code}
                                            type="button"
                                            onClick={() => toggleColor(color.code)}
                                            style={{ backgroundColor: color.code }}
                                            className={`w-10 h-10 rounded-xl transition-all shadow-sm ${selectedColors.includes(color.code) ? 'ring-2 ring-emerald-500 ring-offset-2 scale-110' : 'hover:scale-105'}`}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
