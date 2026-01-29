import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Heart, Camera, Box, Star, Truck, Share2 } from 'lucide-react';
import api from '../../utils/api';

const ProductDetail = () => {
    const { id } = useParams();
    const [activeImage, setActiveImage] = useState(0);
    const [viewMode, setViewMode] = useState('image'); // image, 3d, ar
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/store/public/products/${id}/`);
                setProduct(response.data);
            } catch (err) {
                console.error("Failed to fetch product details", err);
                setError("Product not found or failed to load.");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center py-40 font-bold text-brand animate-pulse">Loading Details...</div>;
    if (error || !product) return <div className="flex justify-center items-center py-40 text-functional-error font-bold">{error || "Product not found"}</div>;

    // Helper to get image URL safely
    const getImageUrl = (index) => product.images?.[index]?.image || 'https://via.placeholder.com/600';
    const images = product.images?.length > 0 ? product.images : [{ image: 'https://via.placeholder.com/600' }]; // Fallback array

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-12">

                {/* Gallery / 3D Viewer */}
                <div className="w-full md:w-1/2 space-y-4">
                    <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                        {viewMode === 'image' && (
                            <img src={getImageUrl(activeImage)} alt={product.name} className="w-full h-full object-cover" />
                        )}
                        {viewMode === '3d' && (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                                <div className="text-center">
                                    <Box size={48} className="mx-auto mb-2 animate-spin-slow" />
                                    <p>3D Model Viewer Loading...</p>
                                    <span className="text-xs text-xs text-gray-400">Three.js Canvas will render here</span>
                                </div>
                            </div>
                        )}
                        {viewMode === 'ar' && (
                            <div className="w-full h-full flex items-center justify-center bg-black text-white relative">
                                {/* Placeholder for camera feed */}
                                <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80')] bg-cover bg-center"></div>
                                <div className="z-10 text-center">
                                    <Camera size={48} className="mx-auto mb-2 text-blue-400" />
                                    <p className="font-bold">AR Try-On Active</p>
                                    <p className="text-sm">Point camera at your feet</p>
                                </div>
                            </div>
                        )}

                        {/* View Toggles */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                            <button
                                onClick={() => setViewMode('image')}
                                className={`p-2 rounded-full ${viewMode === 'image' ? 'bg-brand text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                                title="View Images"
                            >
                                <Star size={20} />
                            </button>
                            {product.has_3d && (
                                <button
                                    onClick={() => setViewMode('3d')}
                                    className={`p-2 rounded-full ${viewMode === '3d' ? 'bg-brand text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                                    title="3D View"
                                >
                                    <Box size={20} />
                                </button>
                            )}
                            {product.has_ar && (
                                <button
                                    onClick={() => setViewMode('ar')}
                                    className={`p-2 rounded-full ${viewMode === 'ar' ? 'bg-brand text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                                    title="AR Try-On"
                                >
                                    <Camera size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {images.map((imgObj, idx) => (
                            <button
                                key={idx}
                                onClick={() => { setActiveImage(idx); setViewMode('image'); }}
                                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${activeImage === idx && viewMode === 'image' ? 'border-brand' : 'border-transparent'}`}
                            >
                                <img src={imgObj.image} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="w-full md:w-1/2 space-y-6">
                    <div>
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl font-bold text-brand-dark">{product.name}</h1>
                            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-functional-error">
                                <Heart size={24} />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex text-functional-pending">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <span className="text-sm text-text-sub">({product.reviews} reviews)</span>
                        </div>
                    </div>

                    <div className="text-4xl font-bold text-brand-dark">${product.price}</div>

                    <p className="text-text-main leading-relaxed">{product.description}</p>

                    {/* Selectors (Dynamic Check) */}
                    <div className="space-y-4">
                        {product.colors && product.colors.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-text-sub mb-2">Select Color</label>
                                <div className="flex gap-3">
                                    {product.colors.map(color => (
                                        <button key={color} className="px-4 py-2 border border-gray-300 rounded-lg hover:border-brand focus:outline-none focus:ring-2 focus:ring-brand text-text-main">
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.sizes && product.sizes.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-text-sub mb-2">Select Size</label>
                                <div className="flex gap-3">
                                    {product.sizes.map(size => (
                                        <button key={size} className="w-12 h-12 border border-gray-300 rounded-lg hover:border-brand flex items-center justify-center font-medium text-text-main">
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-gray-100">
                        <button className="flex-1 bg-action text-white py-4 rounded-xl font-bold text-lg hover:bg-action-hover transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                            <ShoppingCart size={20} />
                            Add to Cart
                        </button>
                        <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 text-text-sub">
                            <Share2 size={24} />
                        </button>
                    </div>

                    {/* Delivery Info */}
                    <div className="flex items-center gap-3 text-sm text-text-sub bg-brand-accent p-4 rounded-lg">
                        <Truck size={20} className="text-brand" />
                        <span>Free delivery on orders over $50. Estimated delivery: <strong>3-5 days</strong></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
