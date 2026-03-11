import React, { useState } from 'react';
import {
    ChevronLeft,
    Box,
    Tag,
    DollarSign,
    AlignLeft,
    Send,
    CheckCircle2,
    Loader2,
    Image as ImageIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { productsAPI } from '../../services/api';

const RequestProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        estimatedPrice: '',
        description: ''
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.name);
            formDataToSend.append('category_name', formData.category);
            formDataToSend.append('suggested_price', formData.estimatedPrice);
            formDataToSend.append('description', formData.description);
            if (image) {
                formDataToSend.append('image', image);
            }

            await productsAPI.submitRequest(formDataToSend);

            setSuccess(true);
            setTimeout(() => {
                navigate('/vendor/products');
            }, 3000);
        } catch (err) {
            console.error('Failed to submit request:', err);
            setError(err.response?.data?.detail || 'Failed to submit product request. Please try again.');
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
                <h2 className="text-2xl font-bold text-gray-800">Request Submitted!</h2>
                <p className="text-gray-500 font-medium text-center max-w-md">
                    Your request to add <span className="font-bold text-gray-700">{formData.name}</span> has been sent to the Administration team for review. You will be notified once it is approved and added to the global catalog.
                </p>
                <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-500">
                    <Loader2 size={16} className="animate-spin" />
                    Redirecting back to inventory...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-10">
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 mb-8">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <Link to="/vendor/products" className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                                <ChevronLeft size={20} />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded border border-emerald-100">
                                        Collaboration
                                    </span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Request Product Addition</h1>
                                <p className="text-sm text-gray-500">Submit details for a new product to be added to the global catalog.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6">
                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50" />

                    <div className="relative z-10 space-y-8">
                        <div className="text-center space-y-2 mb-10">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                                <Box size={28} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Product Specifications</h2>
                            <p className="text-sm text-gray-500 max-w-md mx-auto">
                                Provide detailed information to help our inventory managers review and approve your suggestion efficiently.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    Product Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="E.g., Apple iPhone 15 Pro Max 256GB"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500/30 focus:bg-white transition-all shadow-sm"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                        Suggested Category <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Tag size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Smartphones, Laptops..."
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500/30 focus:bg-white transition-all shadow-sm"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                        Suggested MSRP (PKR) <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                            <DollarSign size={18} />
                                        </div>
                                        <input
                                            type="number"
                                            required
                                            placeholder="0"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500/30 focus:bg-white transition-all shadow-sm"
                                            value={formData.estimatedPrice}
                                            onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    Product Reference Image
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-100 border-dashed rounded-xl hover:border-emerald-200 transition-colors bg-gray-50/50">
                                    {imagePreview ? (
                                        <div className="space-y-4 text-center">
                                            <div className="relative inline-block">
                                                <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-xl shadow-md border border-white" />
                                                <button
                                                    type="button"
                                                    onClick={() => { setImage(null); setImagePreview(null); }}
                                                    className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-colors"
                                                >
                                                    <XCircle size={14} />
                                                </button>
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Previewing image</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 text-center">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm text-gray-400 border border-gray-100">
                                                <ImageIcon size={24} />
                                            </div>
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-bold text-emerald-600 hover:text-emerald-500">
                                                    <span>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">PNG, JPG up to 10MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    Product Description & Specs <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-3.5 text-gray-400">
                                        <AlignLeft size={18} />
                                    </div>
                                    <textarea
                                        required
                                        rows={6}
                                        placeholder="Please provide key specifications, features, and target segment..."
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-emerald-500/30 focus:bg-white transition-all shadow-sm resize-y"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-50 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/vendor/products')}
                                className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-gray-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3.5 bg-emerald-600 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Send size={16} />
                                )}
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestProduct;
