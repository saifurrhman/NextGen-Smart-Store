import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Package, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import api from '../../../utils/api';

const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/media/')) return `http://localhost:8000${url}`;
    return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
};

const ProductPreview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}/`);
                setProduct(response.data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-[1200px] mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mb-4"></div>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading Preview...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-[1200px] mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <AlertTriangle size={64} className="text-red-400 mb-4" />
                <h2 className="text-2xl font-black text-gray-800 mb-2">Product Not Found</h2>
                <p className="text-gray-500 mb-6">The product you are trying to preview does not exist or was deleted.</p>
                <button onClick={() => navigate('/admin/products/all')} className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-600 transition-all">Back to Products</button>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto pb-10 space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/products/all')} className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors shadow-sm">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 leading-none">Product Preview</h2>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 block">Quick Look</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link to={`/admin/products/edit/${product.id}`} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-emerald-100 text-emerald-600 text-sm font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-sm">
                        <Edit2 size={16} /> Edit Product
                    </Link>
                    <Link to={`/products/${product.id}`} target="_blank" className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                        <ExternalLink size={16} /> View on Store
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col lg:flex-row">
                <div className="w-full lg:w-5/12 bg-gray-50 flex items-center justify-center p-12 border-b lg:border-b-0 lg:border-r border-gray-100 relative min-h-[400px]">
                    {product.main_image ? (
                        <img src={getMediaUrl(product.main_image)} alt={product.title} className="w-full h-full max-h-[500px] object-contain drop-shadow-2xl" />
                    ) : (
                        <div className="flex flex-col items-center text-gray-300"><Package size={80} /><span className="font-bold mt-4">No Image Uploaded</span></div>
                    )}
                    {product.discount_price && (
                        <div className="absolute top-6 left-6 px-3 py-1.5 bg-red-500 text-white text-xs font-black uppercase rounded-lg shadow-lg">SALE</div>
                    )}
                </div>

                <div className="w-full lg:w-7/12 p-8 lg:p-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg text-xs font-black uppercase tracking-widest">{product.category_name || 'Uncategorized'}</span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase rounded-lg border ${product.stock <= 0 ? 'text-red-600 border-red-100 bg-red-50' : product.stock < 10 ? 'text-amber-600 border-amber-100 bg-amber-50' : 'text-emerald-600 border-emerald-100 bg-emerald-50'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${product.stock <= 0 ? 'bg-red-500' : product.stock < 10 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                            {product.stock <= 0 ? 'Out of Stock' : `${product.stock} Units Available`}
                        </span>
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3">{product.title}</h1>
                    <p className="text-sm font-mono font-bold text-gray-400 mb-6 bg-gray-50 px-3 py-1.5 rounded-lg inline-block">SKU: {product.sku || product.id.toString().slice(-4).toUpperCase()}</p>

                    <div className="flex items-baseline gap-4 mb-8">
                        <span className="text-4xl font-black text-gray-900">PKR {parseFloat(product.price).toLocaleString()}</span>
                        {product.discount_price && <span className="text-xl font-bold text-gray-400 line-through">PKR {parseFloat(product.discount_price).toLocaleString()}</span>}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed max-w-2xl">{product.description || 'No description provided for this product.'}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 mt-0">Dimensions / Weight</h4>
                                <p className="font-bold text-gray-800">{product.dimensions || 'N/A'} / {product.weight ? `${product.weight} kg` : 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 mt-0">Brand / Material</h4>
                                <p className="font-bold text-gray-800">{product.brand || 'N/A'} / {product.material || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPreview;
