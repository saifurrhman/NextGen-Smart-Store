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
    Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [mainImage, setMainImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        sku: '',
        tag: 'New'
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories/');
                if (response.data && response.data.results) {
                    setCategories(response.data.results);
                }
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        };
        fetchCategories();
    }, []);

    const handleMainImage = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setMainImage({
                file,
                preview: URL.createObjectURL(file)
            });
        }
    };

    const handleGalleryImages = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newImages = files.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setGalleryImages(prev => [...prev, ...newImages]);
        }
    };

    const removeGalleryImage = (index) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        if (mainImage) {
            data.append('main_image', mainImage.file);
        }

        galleryImages.forEach(img => {
            data.append('gallery', img.file);
        });

        try {
            await api.post('/vendors/products/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess(true);
            setTimeout(() => navigate('/vendor/products'), 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to initialize product in network.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Product Added!</h2>
                <p className="text-gray-500 font-medium">Your product is being processed and will appear in your inventory shortly.</p>
                <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mt-4" />
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">
            {/* Header Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link to="/vendor/products" className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Add New Product</h1>
                        <p className="text-sm text-gray-500">Create a new product listing in your catalog.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/vendor/products')}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm font-medium flex items-center gap-3">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Core Data */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-base font-semibold text-gray-800 border-b border-gray-50 pb-4">Basic Information</h3>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="E.g., Samsung Galaxy S24 Ultra 256GB"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1.5">Include keywords that buyers would use to search for your item.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder="Detail the specifications, features, and condition of this item..."
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-y"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1.5">Provide detailed specifications, features, and benefits of the product.</p>
                            </div>
                        </div>
                    </div>

                    {/* Media Gallery */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-base font-semibold text-gray-800 border-b border-gray-50 pb-4">Product Images</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Main Image */}
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
                                <div className="aspect-[4/3] relative">
                                    {mainImage ? (
                                        <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
                                            <img src={mainImage.preview} className="w-full h-full object-contain p-2" alt="Main" />
                                            <button
                                                type="button"
                                                onClick={() => setMainImage(null)}
                                                className="absolute top-2 right-2 p-1.5 bg-white text-rose-600 rounded-md shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Remove Image"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                            <Upload size={24} className="text-gray-400 mb-2" />
                                            <span className="text-xs font-medium text-gray-500 text-center px-4">Upload Cover</span>
                                            <input type="file" className="hidden" onChange={handleMainImage} accept="image/*" />
                                        </label>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-500 mt-2 text-center">First image customers see. Max 5MB.</p>
                            </div>

                            {/* Gallery */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {galleryImages.map((img, idx) => (
                                        <div key={idx} className="aspect-[4/3] relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
                                            <img src={img.preview} className="w-full h-full object-contain p-2" alt={`Gallery ${idx + 1}`} />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(idx)}
                                                className="absolute top-1 right-1 p-1 bg-white text-rose-600 rounded border border-gray-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    {galleryImages.length < 5 && (
                                        <label className="aspect-[4/3] flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                            <Plus size={20} className="text-gray-400 mb-1" />
                                            <span className="text-[10px] font-medium text-gray-500">Add More</span>
                                            <input type="file" multiple className="hidden" onChange={handleGalleryImages} accept="image/*" />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Metrics & Taxonomy */}
                <div className="space-y-6">
                    {/* Pricing & Stock */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-base font-semibold text-gray-800 border-b border-gray-50 pb-4">Pricing & Inventory</h3>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                        <DollarSign size={16} />
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                        className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5">Enter the final selling price in USD. Ensure this covers your base costs.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Available Stock</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        <Package size={16} />
                                    </div>
                                    <input
                                        type="number"
                                        required
                                        placeholder="0"
                                        className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5">Quantities available for immediate fulfillment.</p>
                            </div>
                        </div>
                    </div>

                    {/* Classification */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-base font-semibold text-gray-800 border-b border-gray-50 pb-4">Classification</h3>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Category</label>
                                <select
                                    required
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-gray-700"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1.5">Helps customers find your product via filters.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Stock Keeping Unit)</label>
                                <input
                                    type="text"
                                    placeholder="Leave blank to auto-generate"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-mono"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1.5">Unique identifier for internal tracking.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
