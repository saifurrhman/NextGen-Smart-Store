import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    Home, ChevronRight, Image as ImageIcon, Box, Upload, X,
    Plus, Trash2, Save, AlertCircle, CheckCircle2, ArrowLeft
} from 'lucide-react';
import api from '../../../utils/api';

const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/media/')) return `http://localhost:8000${url}`;
    return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
};

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        discount_price: '',
        discount_type: 'NONE',
        discount_value: 0,
        is_tax_included: true,
        stock: '',
        sku: '',
        barcode: '',
        category: '',
        attributes: [],
        min_stock: 10,
        is_active: true
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [catRes, attrRes, prodRes] = await Promise.all([
                    api.get('categories/'),
                    api.get('attributes/'),
                    api.get(`products/${id}/`)
                ]);
                setCategories(catRes.data.results || catRes.data);
                setAttributes(attrRes.data.results || attrRes.data);

                const p = prodRes.data;
                setFormData({
                    title: p.title || '',
                    description: p.description || '',
                    price: p.price || '',
                    discount_price: p.discount_price || '',
                    discount_type: p.discount_type || 'NONE',
                    discount_value: p.discount_value || 0,
                    is_tax_included: p.is_tax_included ?? true,
                    stock: p.stock || '',
                    sku: p.sku || '',
                    barcode: p.barcode || '',
                    category: p.category || (p.category_id || ''),
                    attributes: p.attributes || [],
                    min_stock: p.min_stock || 10,
                    is_active: p.is_active ?? true,
                    main_image: p.main_image || null
                });
            } catch (err) {
                console.error("Fetch error:", err);
                setMsg({ type: 'error', text: 'Failed to load product data.' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAttributeToggle = (attrId) => {
        setFormData(prev => {
            const current = [...prev.attributes];
            if (current.includes(attrId)) {
                return { ...prev, attributes: current.filter(id => id !== attrId) };
            } else {
                return { ...prev, attributes: [...current, attrId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMsg({ type: '', text: '' });

        try {
            // Create a payload without the main_image URL string, 
            // as Django ImageField will reject a URL string in JSON PUT request.
            const payload = { ...formData };
            delete payload.main_image;

            await api.put(`products/${id}/`, payload);
            setMsg({ type: 'success', text: 'Product updated successfully!' });
            setTimeout(() => navigate('/admin/products/all'), 1500);
        } catch (err) {
            console.error("Submit error:", err);
            setMsg({ type: 'error', text: err.response?.data?.detail || JSON.stringify(err.response?.data) || 'Failed to update product.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header Content */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-gray-50/95 backdrop-blur-sm z-30 py-4 -mx-4 px-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <Link to="/admin/products/all" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={18} />
                        </Link>
                        <Home size={16} />
                        <ChevronRight size={14} className="text-gray-400" />
                        <span>eCommerce</span>
                        <ChevronRight size={14} className="text-gray-400" />
                        <span className="text-emerald-500 font-bold">Edit Product</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/admin/products/all" className="px-5 py-2 border border-gray-200 text-gray-600 bg-white font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm shadow-sm">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`flex items-center gap-2 px-5 py-2 bg-emerald-500 text-white font-bold rounded-lg transition-colors text-sm shadow-sm ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-600'}`}
                        >
                            {submitting ? 'Updating...' : <><Save size={16} /> Update Product</>}
                        </button>
                    </div>
                </div>

                {msg.text && (
                    <div className={`p-4 rounded-lg flex items-center gap-3 font-bold text-sm ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        {msg.text}
                    </div>
                )}

                <div className="flex flex-col xl:flex-row gap-6 items-start">
                    {/* LEFT COLUMN (Forms) */}
                    <div className="flex-1 space-y-6 w-full">

                        {/* Basic Information */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-5">Basic Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Type name here"
                                        className="w-full px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 font-medium text-gray-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                    <textarea
                                        name="description"
                                        rows="6"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Type Description here"
                                        className="w-full p-4 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 min-h-[150px] resize-y font-medium text-gray-700"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-5">Pricing & Tax</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Base Price (PKR)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Discount Price</label>
                                    <input
                                        type="number"
                                        name="discount_price"
                                        value={formData.discount_price}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                            <div className="pt-2 border-t border-gray-100 flex items-center gap-3">
                                <label className="flex items-center cursor-pointer relative">
                                    <input
                                        type="checkbox"
                                        name="is_tax_included"
                                        checked={formData.is_tax_included}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                                <span className="text-sm font-medium text-gray-700">Tax is included in price</span>
                            </div>
                        </div>

                        {/* Inventory */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-5">Inventory</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">SKU</label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock Position</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        required
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Low Stock Threshold</label>
                                    <input
                                        type="number"
                                        name="min_stock"
                                        value={formData.min_stock}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-blue-50/10 border border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-bold"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">System triggers alert below this level</p>
                                </div>
                            </div>
                        </div>

                        {/* Attributes */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-5">Product Attributes</h3>
                            <div className="flex flex-wrap gap-3">
                                {attributes.map(attr => (
                                    <button
                                        key={attr.id}
                                        type="button"
                                        onClick={() => handleAttributeToggle(attr.id)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${formData.attributes.includes(attr.id)
                                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-500'
                                            }`}
                                    >
                                        {attr.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="w-full xl:w-[350px] shrink-0 space-y-6">
                        {/* Status Config */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-gray-800 mb-4">Product Visibility</h3>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-700">Active</span>
                                    <span className="text-[10px] text-gray-400 font-medium">Visible to customers</span>
                                </div>
                                <label className="flex items-center cursor-pointer relative">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-gray-800 mb-3">Product Category</h3>
                            <select
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-white font-bold text-gray-700 shadow-sm"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Image */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-gray-800 mb-4">Product Thumbnail</h3>
                            <div className="relative aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden group hover:border-emerald-400 transition-colors cursor-pointer">
                                {formData.main_image ? (
                                    <img
                                        src={getMediaUrl(formData.main_image)}
                                        alt="Product"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <>
                                        <ImageIcon size={28} className="text-gray-300 mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Update Image</span>
                                    </>
                                )}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-3 text-center leading-relaxed italic">Click to upload a new thumbnail. Previous image will be replaced.</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
