import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
    Home, ChevronRight, Image as ImageIcon, Box, Upload, X,
    Plus, Trash2, Save, AlertCircle, CheckCircle2
} from 'lucide-react';
import api from '../../../utils/api';

const AddProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const location = useLocation();

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
        is_active: true
    });

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

        if (location.state?.categoryId) {
            setFormData(prev => ({ ...prev, category: location.state.categoryId }));
        }
    }, [location.state]);

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
        setLoading(true);
        setMsg({ type: '', text: '' });

        try {
            await api.post('/api/v1/products/', formData);
            setMsg({ type: 'success', text: 'Product created successfully!' });
            setTimeout(() => navigate('/admin/products/all'), 2000);
        } catch (err) {
            console.error("Submit error:", err);
            setMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to create product.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header Content */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-gray-50/95 backdrop-blur-sm z-30 py-4 -mx-4 px-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <Home size={16} />
                        <ChevronRight size={14} className="text-gray-400" />
                        <span>eCommerce</span>
                        <ChevronRight size={14} className="text-gray-400" />
                        <span className="text-emerald-500 font-bold">Add Product</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/admin/products/all" className="px-5 py-2 border border-gray-200 text-gray-600 bg-white font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm shadow-sm">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center gap-2 px-5 py-2 bg-emerald-500 text-white font-bold rounded-lg transition-colors text-sm shadow-sm ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-600'}`}
                        >
                            {loading ? 'Processing...' : <><Save size={16} /> Submit Product</>}
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
                            <h2 className="text-lg font-bold text-gray-800 mb-5">Basic Information</h2>
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
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-gray-50/50"
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
                                        className="w-full p-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-white min-h-[120px] resize-y"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-5">Pricing</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Base Price (PKR)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-gray-50/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Discount Price</label>
                                    <input
                                        type="number"
                                        name="discount_price"
                                        value={formData.discount_price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-gray-50/50"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Discount Type</label>
                                    <select
                                        name="discount_type"
                                        value={formData.discount_type}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-white font-medium text-gray-700"
                                    >
                                        <option value="NONE">No Discount</option>
                                        <option value="PERCENTAGE">Percentage</option>
                                        <option value="FIXED">Fixed Amount</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Discount Value</label>
                                    <input
                                        type="number"
                                        name="discount_value"
                                        value={formData.discount_value}
                                        onChange={handleChange}
                                        placeholder="10"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-gray-50/50"
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
                                <span className="text-sm font-medium text-gray-700">Tax Included</span>
                            </div>
                        </div>

                        {/* Inventory */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-5">Inventory</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">SKU</label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        placeholder="SKU-1234"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-gray-50/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Barcode</label>
                                    <input
                                        type="text"
                                        name="barcode"
                                        value={formData.barcode}
                                        onChange={handleChange}
                                        placeholder="1234567890"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-gray-50/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock Quantity</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        required
                                        value={formData.stock}
                                        onChange={handleChange}
                                        placeholder="100"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-gray-50/50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Variants placeholder logic */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                                <h2 className="text-lg font-bold text-gray-800">Product Attributes</h2>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Real Attributes</span>
                            </div>
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
                                        {attr.name} ({attr.terms.split(',').length})
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="w-full xl:w-[350px] shrink-0 space-y-6">
                        {/* Image Upload Mockup */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                            <h2 className="text-sm font-bold text-gray-800 mb-4">Product Image</h2>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 hover:border-emerald-400 transition-colors cursor-pointer group mb-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <ImageIcon size={20} className="text-emerald-500" />
                                </div>
                                <p className="text-xs font-semibold text-gray-700 text-center mb-1">Click to upload</p>
                                <p className="text-[10px] text-gray-400">PNG, JPG recommended</p>
                            </div>
                        </div>

                        {/* Categories Config */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                            <h2 className="text-sm font-bold text-gray-800 mb-3">Category</h2>
                            <select
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-white font-medium text-gray-700"
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Config */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                            <h2 className="text-sm font-bold text-gray-800 mb-3">Product Visibility</h2>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-bold text-gray-700">Active Status</span>
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
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
