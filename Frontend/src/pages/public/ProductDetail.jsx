import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ShoppingCart, Heart, Camera, Star, Truck, Share2,
    ChevronLeft, ChevronRight, ZoomIn, RotateCcw, Check,
    Shield, RefreshCw, Package, Tag, Sparkles, Info,
    Minus, Plus, ArrowLeft
} from 'lucide-react';
import api from '../../utils/api';

const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/media/')) return `http://localhost:8000${url}`;
    return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
};

// ── 360° Spinner Component ───────────────────────────────────────────────────
const Spinner360 = ({ images }) => {
    const [frame, setFrame] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [rotation, setRotation] = useState(0);
    const containerRef = useRef(null);

    const frameCount = images.length;
    const sensitivity = 2; // Increased for 540-degree feel

    const onMouseDown = useCallback((e) => {
        setDragging(true);
        setStartX(e.clientX || e.touches?.[0]?.clientX || 0);
    }, []);

    const onMouseMove = useCallback((e) => {
        if (!dragging) return;
        const x = e.clientX || e.touches?.[0]?.clientX || 0;
        const delta = x - startX;
        setStartX(x);
        setFrame(prev => {
            let next = prev - Math.round(delta / sensitivity);
            return ((next % frameCount) + frameCount) % frameCount;
        });
    }, [dragging, startX, frameCount]);

    const onMouseUp = useCallback(() => setDragging(false), []);

    useEffect(() => {
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('touchend', onMouseUp);
        return () => {
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchend', onMouseUp);
        };
    }, [onMouseUp]);

    const auto = useRef(null);
    const startAuto = () => {
        auto.current = setInterval(() => setFrame(p => (p + 1) % frameCount), 80);
    };
    const stopAuto = () => clearInterval(auto.current);
    useEffect(() => { startAuto(); return stopAuto; }, [frameCount]);

    if (!images.length) return null;

    return (
        <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden select-none"
            ref={containerRef}
            onMouseDown={(e) => { stopAuto(); onMouseDown(e); }}
            onMouseMove={onMouseMove}
            onTouchStart={(e) => { stopAuto(); onMouseDown(e); }}
            onTouchMove={onMouseMove}
            style={{ cursor: dragging ? 'grabbing' : 'grab' }}>
            {images.map((img, idx) => (
                <img key={idx} src={getMediaUrl(img.image) || img} alt={`frame-${idx}`}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-75 ${idx === frame ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false} />
            ))}
            {/* Drag hint */}
            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/50 text-white text-xs font-bold rounded-full backdrop-blur-sm transition-opacity ${dragging ? 'opacity-0' : 'opacity-100'}`}>
                <RotateCcw size={13} />
                Drag to rotate 360°
            </div>
            {/* Frame indicator */}
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/40 text-white text-[10px] font-bold rounded-full backdrop-blur-sm">
                {frame + 1}/{frameCount}
            </div>
        </div>
    );
};

// ── Stars ────────────────────────────────────────────────────────────────────
const Stars = ({ rating = 0, count = 0 }) => (
    <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={15}
                    fill={i <= Math.floor(rating) ? '#F59E0B' : 'none'}
                    stroke={i <= Math.floor(rating) ? '#F59E0B' : '#D1D5DB'}
                />
            ))}
        </div>
        <span className="text-sm font-bold text-gray-500">({count} reviews)</span>
    </div>
);

// ── Main ─────────────────────────────────────────────────────────────────────
const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [viewMode, setViewMode] = useState('gallery'); // gallery | 360
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [qty, setQty] = useState(1);
    const [liked, setLiked] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const fetch = async () => {
            try {
                // Try main products API
                let res;
                try { res = await api.get(`products/${id}/`); }
                catch { res = await api.get(`products/?id=${id}`); }
                setProduct(res.data?.results ? res.data.results[0] : res.data);
            } catch {
                setProduct(null);
            } finally { setLoading(false); }
        };
        fetch();
    }, [id]);

    const handleAddToCart = () => {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2500);
    };

    if (loading) return (
        <div className="container mx-auto px-4 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
                <div className="bg-gray-100 rounded-2xl aspect-square" />
                <div className="space-y-4">
                    <div className="h-8 bg-gray-100 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/4" />
                    <div className="h-12 bg-gray-100 rounded w-1/3" />
                    <div className="h-24 bg-gray-100 rounded" />
                </div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="container mx-auto px-4 py-20 text-center">
            <Package size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-xl font-bold text-gray-400">Product not found</p>
            <Link to="/products" className="mt-4 inline-flex items-center gap-2 text-brand font-bold hover:underline">
                <ArrowLeft size={16} /> Back to Products
            </Link>
        </div>
    );

    // Merge main image and gallery images for a complete 360° experience
    const rawImages = product.images || [];
    const mainImg = product.main_image ? [{ image: product.main_image }] : [];
    const images = [...mainImg, ...rawImages].length ? [...mainImg, ...rawImages] : [{ image: 'https://placehold.co/600x600?text=No+Image' }];

    // Parse JSON data safely
    const parseJSON = (data, fallback = []) => {
        if (!data) return fallback;
        try { return typeof data === 'string' ? JSON.parse(data) : data; }
        catch { return fallback; }
    };

    const colors = parseJSON(product.colors_data || product.colors);
    const sizes = parseJSON(product.sizes_data || product.sizes);
    const features = parseJSON(product.features);
    const attributes = product.attributes || [];

    const tabs = [
        { key: 'description', label: 'Description' },
        { key: 'features', label: 'Features' },
        { key: 'attributes', label: 'Specifications' },
        { key: 'shipping', label: 'Shipping & Returns' },
    ];

    return (
        <div className="bg-white min-h-screen">
            <style>{`
                @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
                .fade-up{animation:fadeUp 0.4s ease both}
                @keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.12)}100%{transform:scale(1)}}
                .pop{animation:pop 0.3s ease}
            `}</style>

            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                    <Link to="/" className="hover:text-brand transition-colors">Home</Link>
                    <ChevronRight size={12} />
                    <Link to="/products" className="hover:text-brand transition-colors">Products</Link>
                    <ChevronRight size={12} />
                    <span className="text-gray-600 truncate max-w-xs">{product.title}</span>
                </div>
            </div>

            {/* Main Section */}
            <div className="container mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 fade-up">

                    {/* ── IMAGE PANEL ── */}
                    <div className="space-y-4">
                        {/* View Toggle */}
                        <div className="flex gap-2 mb-3">
                            {[{ key: 'gallery', label: '📷 Gallery' }, { key: '360', label: '🔄 360° View' }].map(v => (
                                <button key={v.key} onClick={() => setViewMode(v.key)}
                                    className={`px-4 py-2 text-xs font-black rounded-xl transition-all border ${viewMode === v.key ? 'bg-brand text-white border-brand shadow-lg' : 'bg-white border-gray-200 text-gray-600 hover:border-brand/50'}`}>
                                    {v.label}
                                </button>
                            ))}
                        </div>

                        {/* 360 Spinner */}
                        {viewMode === '360' && <Spinner360 images={images} />}

                        {/* Gallery */}
                        {viewMode === 'gallery' && (
                            <div className="space-y-4">
                                <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group">
                                    <img src={getMediaUrl(images[activeImage]?.image)}
                                        alt={product.title}
                                        className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105" />
                                    {images.length > 1 && (
                                        <>
                                            <button onClick={() => setActiveImage(p => (p - 1 + images.length) % images.length)}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-brand hover:text-white">
                                                <ChevronLeft size={18} />
                                            </button>
                                            <button onClick={() => setActiveImage(p => (p + 1) % images.length)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-brand hover:text-white">
                                                <ChevronRight size={18} />
                                            </button>
                                        </>
                                    )}
                                    {product.discount_price && (
                                        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                                            SALE {Math.round((1 - product.discount_price / product.price) * 100)}% OFF
                                        </div>
                                    )}
                                </div>
                                {/* Thumbnails */}
                                <div className="flex gap-3 overflow-x-auto pb-1">
                                    {images.map((img, idx) => (
                                        <button key={idx} onClick={() => setActiveImage(idx)}
                                            className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-brand shadow-md shadow-brand/20' : 'border-gray-100 hover:border-gray-300'}`}>
                                            <img src={getMediaUrl(img.image) || img.image} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-3 mt-2">
                            {[
                                { icon: Shield, text: '100% Authentic', sub: 'Verified seller' },
                                { icon: RefreshCw, text: 'Free Returns', sub: '30-day policy' },
                                { icon: Truck, text: 'Fast Delivery', sub: '3-5 business days' },
                            ].map(({ icon: Icon, text, sub }) => (
                                <div key={text} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <Icon size={18} className="text-brand mb-1" />
                                    <span className="text-[10px] font-black text-gray-700">{text}</span>
                                    <span className="text-[9px] text-gray-400">{sub}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── INFO PANEL ── */}
                    <div className="space-y-6">
                        {/* Title & Category */}
                        <div>
                            {product.category_name && (
                                <span className="inline-block text-xs font-black text-brand uppercase tracking-widest mb-2 px-2.5 py-1 bg-brand-accent rounded-full">{product.category_name}</span>
                            )}
                            <div className="flex items-start justify-between gap-4">
                                <h1 className="text-3xl font-black text-brand-dark leading-tight">{product.title}</h1>
                                <button onClick={() => setLiked(l => !l)}
                                    className={`shrink-0 p-2.5 rounded-xl border transition-all ${liked ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500'}`}>
                                    <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                                </button>
                            </div>
                            <div className="flex items-center gap-4 mt-3">
                                <Stars rating={product.rating || 4.5} count={product.reviews || 0} />
                                {product.sku && <span className="text-xs text-gray-400 font-mono">SKU: {product.sku}</span>}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-black text-brand-dark">${product.price}</span>
                            {product.discount_price && (
                                <>
                                    <span className="text-xl text-gray-400 line-through">${product.discount_price}</span>
                                    <span className="text-sm font-black text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
                                        Save ${(product.discount_price - product.price).toFixed(2)}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Short Description */}
                        {product.description && (
                            <p className="text-gray-600 leading-relaxed text-sm">{product.description.slice(0, 200)}{product.description.length > 200 ? '...' : ''}</p>
                        )}

                        {/* Stock Status */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black ${product.in_stock !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                            <div className={`w-2 h-2 rounded-full ${product.in_stock !== false ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            {product.in_stock !== false
                                ? `In Stock${product.stock ? ` — ${product.stock} available` : ''}`
                                : 'Out of Stock'}
                        </div>

                        {/* ── COLOR SELECTOR ── */}
                        {colors.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-black text-gray-700">
                                        Color {selectedColor && <span className="text-brand font-black">— {selectedColor}</span>}
                                    </label>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {colors.map(color => {
                                        const isSelected = selectedColor === color;
                                        // Handle both hex and color names
                                        const isHex = color?.startsWith('#');
                                        return (
                                            <button key={color} onClick={() => setSelectedColor(isSelected ? null : color)}
                                                className={`group relative transition-all duration-200 ${isHex ? 'w-10 h-10 rounded-full border-2 shadow-sm hover:scale-110' : 'px-4 py-2 rounded-xl border-2 text-xs font-black'}
                                                    ${isSelected ? 'border-brand shadow-lg scale-110' : 'border-gray-200 hover:border-brand/50'}`}
                                                style={isHex ? { backgroundColor: color } : {}}>
                                                {isHex ? (
                                                    <>{isSelected && <Check size={14} className="absolute inset-0 m-auto text-white drop-shadow" />}</>
                                                ) : (
                                                    <span className={isSelected ? 'text-brand' : 'text-gray-600'}>{color}</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── SIZE SELECTOR ── */}
                        {sizes.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-black text-gray-700">
                                        Size {selectedSize && <span className="text-brand font-black">— {selectedSize}</span>}
                                    </label>
                                    <button className="text-xs text-brand font-bold hover:underline flex items-center gap-1">
                                        <Info size={12} /> Size Guide
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map(size => {
                                        const isSelected = selectedSize === size;
                                        return (
                                            <button key={size} onClick={() => setSelectedSize(isSelected ? null : size)}
                                                className={`min-w-[48px] px-3 py-2.5 rounded-xl text-sm font-black border-2 transition-all
                                                    ${isSelected ? 'border-brand bg-brand text-white shadow-lg shadow-brand/25' : 'border-gray-200 text-gray-600 hover:border-brand hover:text-brand'}`}>
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── QTY + ADD TO CART ── */}
                        <div className="flex gap-3 pt-2">
                            {/* Quantity */}
                            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="px-4 py-3.5 hover:bg-gray-50 transition-colors text-gray-600 font-black">
                                    <Minus size={14} />
                                </button>
                                <span className="w-12 text-center text-sm font-black text-gray-800">{qty}</span>
                                <button onClick={() => setQty(q => q + 1)}
                                    className="px-4 py-3.5 hover:bg-gray-50 transition-colors text-gray-600 font-black">
                                    <Plus size={14} />
                                </button>
                            </div>

                            {/* Add to Cart */}
                            <button onClick={handleAddToCart}
                                className={`flex-1 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${addedToCart ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-brand text-white hover:bg-brand-dark shadow-brand/20 active:scale-95'}`}>
                                {addedToCart ? <><Check size={18} /> Added to Cart!</> : <><ShoppingCart size={18} /> Add to Cart — ${(product.price * qty).toFixed(2)}</>}
                            </button>

                            <button className="p-3.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-600">
                                <Share2 size={18} />
                            </button>
                        </div>

                        {/* Buy Now */}
                        <button className="w-full py-3.5 border-2 border-brand text-brand font-black text-sm rounded-xl hover:bg-brand hover:text-white transition-all">
                            Buy Now
                        </button>

                        {/* Delivery */}
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                            <Truck size={20} className="text-emerald-600 shrink-0" />
                            <div>
                                <p className="text-xs font-black text-emerald-800">Free delivery on orders over $50</p>
                                <p className="text-[11px] text-emerald-600">Estimated delivery: <strong>3–5 business days</strong></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── TABS: Description / Features / Specifications / Shipping ── */}
                <div className="mt-16 fade-up">
                    <div className="border-b border-gray-100 flex gap-6 overflow-x-auto">
                        {tabs.map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                className={`pb-4 text-sm font-black whitespace-nowrap transition-all border-b-2 -mb-px ${activeTab === tab.key ? 'text-brand border-brand' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="py-8">
                        {/* Description */}
                        {activeTab === 'description' && (
                            <div className="prose max-w-none text-gray-600 leading-relaxed">
                                <p>{product.description || 'No description available.'}</p>
                            </div>
                        )}

                        {/* Features */}
                        {activeTab === 'features' && (
                            <div className="space-y-4">
                                {features.length > 0 ? features.map((f, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center shrink-0 mt-0.5">
                                            <Check size={12} className="text-white" />
                                        </div>
                                        <p className="text-sm text-gray-700 font-medium">{f}</p>
                                    </div>
                                )) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {[
                                            'Premium quality materials',
                                            'Durable construction',
                                            'Comfortable fit',
                                            'Versatile design',
                                            'Easy to maintain',
                                            'Eco-friendly packaging',
                                        ].map((f, i) => (
                                            <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                                                    <Sparkles size={12} className="text-brand" />
                                                </div>
                                                <p className="text-sm text-gray-700 font-medium">{f}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Specifications / Attributes */}
                        {activeTab === 'attributes' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    { label: 'Brand', value: product.brand || '—' },
                                    { label: 'Category', value: product.category_name || '—' },
                                    { label: 'SKU', value: product.sku || '—' },
                                    { label: 'Stock', value: product.stock ?? '—' },
                                    { label: 'Available Sizes', value: sizes.join(', ') || '—' },
                                    { label: 'Available Colors', value: colors.join(', ') || '—' },
                                    { label: 'Weight', value: product.weight || '—' },
                                    { label: 'Material', value: product.material || '—' },
                                    ...(attributes.length ? attributes.map(a => ({ label: a.name, value: a.value })) : []),
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</span>
                                        <span className="text-sm font-bold text-gray-700 text-right">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Shipping */}
                        {activeTab === 'shipping' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { icon: Truck, title: 'Standard Delivery', desc: '3–5 business days · Free on orders over $50' },
                                    { icon: Package, title: 'Express Delivery', desc: '1–2 business days · $9.99 flat rate' },
                                    { icon: RefreshCw, title: 'Free Returns', desc: '30-day return policy · No questions asked' },
                                    { icon: Shield, title: 'Buyer Protection', desc: 'Full refund if item not received or not as described' },
                                ].map(({ icon: Icon, title, desc }) => (
                                    <div key={title} className="flex gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                                            <Icon size={18} className="text-brand" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-800">{title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
