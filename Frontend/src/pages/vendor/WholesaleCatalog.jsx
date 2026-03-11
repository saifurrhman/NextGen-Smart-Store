import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import {
    ShoppingBag,
    Search,
    Filter,
    ArrowRight,
    Package,
    Loader2,
    AlertCircle,
    ShieldCheck,
    Maximize2,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WholesaleCatalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMasterCatalog();
    }, []);

    const fetchMasterCatalog = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await productsAPI.getMasterCatalog();
            setProducts(response.data.results || []);
        } catch (err) {
            console.error('Catalog Fetch Error:', err);
            const errorMsg = err.response?.data?.error || err.message || 'Unknown network error';
            setError(`Failed to load master catalog: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (url) => {
        if (!url || url === 'undefined' || url === 'null' || url === '') {
            return 'https://via.placeholder.com/300?text=No+Image';
        }
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (url.startsWith('/media/')) return `http://localhost:8000${url}`;
        return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-10">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 mb-8">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-100">
                                    B2B Wholesale Hub
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
                                Master Catalog
                                <ShieldCheck className="text-emerald-500" size={24} />
                            </h1>
                            <p className="text-gray-500 text-sm mt-1 max-w-lg">
                                Purchase premium stock in bulk directly from the official store inventory.
                                Minimum order: <span className="font-bold text-gray-800">50 units</span>.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative group lg:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-500/30 rounded-xl text-sm font-medium transition-all outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-emerald-600 rounded-xl transition-all">
                                <Filter size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <AnimatePresence>
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-8 p-4 bg-emerald-500 text-white rounded-xl flex items-center gap-4 shadow-lg shadow-emerald-500/20"
                        >
                            <CheckCircle2 size={24} />
                            <span className="font-bold text-sm">{successMessage}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="animate-spin text-emerald-500" size={40} />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Syncing Catalog...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Sync Error</h3>
                        <p className="text-gray-500 mb-6">{error}</p>
                        <button onClick={fetchMasterCatalog} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all">
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.length === 0 ? (
                            <div className="col-span-full py-32 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
                                <Package className="mx-auto text-gray-200 mb-4" size={64} />
                                <h3 className="text-lg font-bold text-gray-800 mb-1">Empty Catalog</h3>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No master products available.</p>
                            </div>
                        ) : (
                            products.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => (
                                <motion.div
                                    key={product.id}
                                    whileHover={{ y: -4 }}
                                    className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-[480px]"
                                >
                                    <div className="relative h-60 shrink-0 flex items-center justify-center p-2 bg-white">
                                        <img
                                            src={getImageUrl(product.main_image)}
                                            alt={product.title}
                                            className="w-full h-full object-contain"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-gray-900 text-[10px] font-bold tracking-widest border border-gray-100 shadow-sm">
                                                {product.category_name || 'GENERAL'}
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => navigate(`/vendor/wholesale-catalog/${product.id}`)}
                                                className="p-3 bg-white text-emerald-600 rounded-full hover:bg-emerald-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl"
                                                title="View Full Details"
                                            >
                                                <Maximize2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="mb-4 flex-1">
                                            <h3 className="text-base font-bold text-gray-800 leading-tight mb-2 group-hover:text-emerald-600 transition-colors truncate">
                                                {product.title}
                                            </h3>
                                            <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                                                {product.description || 'No description provided.'}
                                            </p>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-gray-50">
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Wholesale</p>
                                                    <span className="text-xl font-bold text-gray-800 tracking-tight">
                                                        PKR {product.price}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">MSRP</p>
                                                    <span className="text-xs font-bold text-gray-500 line-through">
                                                        PKR {(parseFloat(product.price) * 1.5).toFixed(0)}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => navigate(`/vendor/wholesale-catalog/${product.id}`)}
                                                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-sm"
                                            >
                                                View Details
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WholesaleCatalog;
