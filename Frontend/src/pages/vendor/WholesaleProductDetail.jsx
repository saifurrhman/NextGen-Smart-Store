import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, bulkOrdersAPI } from '../../services/api';
import {
    ArrowLeft,
    ShoppingBag,
    Tag,
    ShieldCheck,
    Check,
    Info,
    ArrowRight,
    Loader2,
    AlertCircle,
    Truck,
    Clock,
    CheckCircle2,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WholesaleProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [bulkQuantity, setBulkQuantity] = useState(50);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const response = await productsAPI.getById(id);
            setProduct(response.data);
        } catch (err) {
            setError('Failed to load product details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceBulkOrder = async () => {
        if (bulkQuantity < 50) {
            alert('Minimum bulk order quantity is 50 units.');
            return;
        }

        try {
            setIsSubmitting(true);
            const orderData = {
                items: [{
                    master_product: product.id,
                    quantity: bulkQuantity,
                    price: product.price
                }]
            };
            await bulkOrdersAPI.create(orderData);
            setSuccessMessage(`Order for ${bulkQuantity} units placed!`);
            setShowOrderModal(false);
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (err) {
            console.error('Bulk Order Error:', err);
            let errorMsg = 'Failed to place bulk order.';

            if (err.response?.data) {
                const data = err.response.data;
                // If data is an object, try to extract error/detail or stringify the whole thing
                if (typeof data === 'object') {
                    errorMsg = data.error || data.detail || JSON.stringify(data);
                } else {
                    errorMsg = data;
                }
            }
            alert(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getImageUrl = (url) => {
        if (!url || url === 'undefined' || url === 'null') return 'https://via.placeholder.com/600?text=No+Image';
        if (url.startsWith('http')) return url;
        const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
        const prefix = url.startsWith('media/') ? '' : 'media/';
        return `http://localhost:8000/${prefix}${cleanUrl}`;
    };

    const parseJSON = (data, fallback = []) => {
        if (!data) return fallback;
        try { return typeof data === 'string' ? JSON.parse(data) : data; }
        catch { return fallback; }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
        </div>
    );

    if (error || !product) return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
            <div className="bg-white p-8 rounded-2xl border text-center max-w-sm w-full">
                <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                <h2 className="text-xl font-bold mb-4">Product Not Found</h2>
                <button onClick={() => navigate('/vendor/wholesale-catalog')} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold">
                    Back to Catalog
                </button>
            </div>
        </div>
    );

    const features = parseJSON(product.features);
    const colors = parseJSON(product.colors_data);
    const sizes = parseJSON(product.sizes_data);
    const images = [product.main_image, ...(product.images?.map(img => img.image) || [])];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b bg-white sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={() => navigate('/vendor/wholesale-catalog')} className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors">
                        <ArrowLeft size={20} />
                        <span className="text-sm font-bold">Wholesale Catalog</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                            Verified Master Template
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                <AnimatePresence>
                    {successMessage && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-emerald-500 text-white rounded-xl flex items-center gap-3">
                            <CheckCircle2 size={20} />
                            <span className="text-sm font-bold">{successMessage}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Gallery Section */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="bg-white border rounded-3xl p-8 flex items-center justify-center relative group h-[400px] md:h-[500px]">
                            <img src={getImageUrl(images[activeImageIndex])} className="max-w-full max-h-full object-contain" alt={product.title} />
                            <div className="absolute top-4 right-4">
                                <span className="bg-gray-900/5 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-900 tracking-wider">
                                    {product.category_name || 'MASTER'}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {images.map((img, idx) => (
                                <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`w-20 h-20 rounded-xl border-2 shrink-0 p-2 bg-white transition-all ${activeImageIndex === idx ? 'border-emerald-500' : 'border-gray-100'}`}>
                                    <img src={getImageUrl(img)} className="w-full h-full object-contain" alt="" />
                                </button>
                            ))}
                        </div>

                        {/* Details Card */}
                        <div className="bg-white border rounded-3xl p-8 space-y-8">
                            <div>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Product Description</h3>
                                <p className="text-gray-600 leading-relaxed">{product.description || 'Premium master product template curated for B2B wholesale distribution.'}</p>
                            </div>

                            {features.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Key Specifications</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                                    <Check size={12} className="text-emerald-600" />
                                                </div>
                                                <span className="text-sm font-bold text-gray-700">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Side Panel */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 space-y-4">
                            <div className="bg-white border rounded-3xl p-8 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <ShieldCheck className="text-emerald-500" size={18} />
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">In Stock - Priority Handling</span>
                                </div>

                                <h1 className="text-3xl font-black text-gray-900 leading-tight mb-6">{product.title}</h1>

                                <div className="bg-gray-50 rounded-2xl p-6 border mb-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Wholesale PRICE</p>
                                            <span className="text-4xl font-black text-emerald-600">PKR {product.price}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Retail Target</p>
                                            <span className="text-lg font-bold text-gray-400 line-through">PKR {(product.price * 1.5).toFixed(0)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-8">
                                    {colors.length > 0 && (
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Batch Palette</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {colors.map(c => (
                                                    <div key={c} className="w-8 h-8 rounded-lg border-2 border-white shadow-sm ring-1 ring-gray-100" style={{ backgroundColor: c }} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {sizes.length > 0 && (
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Size Grid</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {sizes.map(s => (
                                                    <span key={s} className="px-4 py-2 bg-gray-50 border rounded-lg text-xs font-black text-gray-600">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-6 pb-8 border-b border-dashed mb-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Brand</p>
                                        <p className="text-sm font-bold">{product.brand || 'Luxury Line'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Material</p>
                                        <p className="text-sm font-bold">{product.material || 'Organic'}</p>
                                    </div>
                                </div>

                                <button onClick={() => setShowOrderModal(true)} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
                                    Start Bulk Order
                                    <ShoppingBag size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white border p-6 rounded-2xl flex items-center gap-3">
                                    <Truck className="text-emerald-500" size={20} />
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase">Shipping</p>
                                        <p className="text-xs font-bold">Priority Air</p>
                                    </div>
                                </div>
                                <div className="bg-white border p-6 rounded-2xl flex items-center gap-3">
                                    <Clock className="text-emerald-500" size={20} />
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase">Sync</p>
                                        <p className="text-xs font-bold">Real-time</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal */}
            <AnimatePresence>
                {showOrderModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowOrderModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative z-10">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-lg font-black tracking-tight uppercase">Configure Order</h3>
                                    <button
                                        onClick={() => setShowOrderModal(false)}
                                        className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="Close"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-2">Quantity (Min 50)</label>
                                        <input
                                            type="number"
                                            min="50"
                                            value={bulkQuantity}
                                            onChange={(e) => setBulkQuantity(parseInt(e.target.value))}
                                            className="w-full px-6 py-4 bg-gray-50 border focus:border-emerald-500 rounded-2xl text-2xl font-black outline-none transition-all"
                                        />
                                    </div>

                                    <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex justify-between items-center">
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Valuation</span>
                                        <span className="text-2xl font-black text-emerald-700">PKR {(product.price * bulkQuantity).toLocaleString()}</span>
                                    </div>

                                    <button onClick={handlePlaceBulkOrder} disabled={isSubmitting} className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isSubmitting ? 'bg-gray-100 text-gray-400' : 'bg-gray-900 text-white hover:bg-black'}`}>
                                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Authorize Purchase'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WholesaleProductDetail;
