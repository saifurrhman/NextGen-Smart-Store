import React, { useState } from 'react';
import {
    ChevronLeft,
    Box,
    Tag,
    DollarSign,
    AlignLeft,
    Send,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api'; // We'll need to create this endpoint later

const RequestProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        estimatedPrice: '',
        description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // TODO: Wire this up to the actual backend endpoint once created
            // await api.post('/vendors/product-requests/', formData);

            // Simulating API call for now
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSuccess(true);
            setTimeout(() => {
                navigate('/vendor/products');
            }, 3000);
        } catch (err) {
            console.error('Failed to submit request:', err);
            setError('Failed to submit product request. Please try again.');
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
        <div className="max-w-[1200px] mx-auto pb-10 space-y-6">
            {/* Header Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link to="/vendor/products" className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Request Product Addition</h1>
                        <p className="text-sm text-gray-500">Submit details for a new product to be added to the global catalog.</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm">
                <div className="max-w-2xl mx-auto space-y-8">

                    <div className="text-center space-y-2 mb-8">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Box size={24} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">Product Details</h2>
                        <p className="text-sm text-gray-500">
                            Please provide as much detail as possible. This helps our admin team quickly review and approve the addition of this product to the platform.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Product Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="E.g., Apple iPhone 15 Pro Max 256GB"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Category & Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Suggested Category <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Tag size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="E.g., Smartphones, Laptops..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Estimated Selling Price ($) <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <DollarSign size={18} />
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                                        value={formData.estimatedPrice}
                                        onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Product Description & Specifications <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-gray-400">
                                    <AlignLeft size={18} />
                                </div>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder="Please provide key specifications, brand details, and why this should be added to the catalog..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors resize-y"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/vendor/products')}
                            className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Send size={18} />
                            )}
                            {loading ? 'Submitting Request...' : 'Submit Request'}
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default RequestProduct;
