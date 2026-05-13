import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ShoppingCart, Heart, Star, Truck, Share2,
    ChevronLeft, ChevronRight, RotateCcw, Check,
    Shield, RefreshCw, Package, Sparkles, Info,
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
    const [isHovering, setIsHovering] = useState(false);
    const frameCount = images.length;
    const autoRef = useRef(null);
    const containerRef = useRef(null);
    const lastXRef = useRef(null);

    const startAuto = () => {
        clearInterval(autoRef.current);
        autoRef.current = setInterval(() => setFrame(p => (p + 1) % frameCount), 80);
    };
    const stopAuto = () => clearInterval(autoRef.current);

    useEffect(() => {
        if (frameCount > 1 && !isHovering) startAuto();
        return stopAuto;
    }, [frameCount, isHovering]);

    const onMouseMove = useCallback((e) => {
        if (!frameCount) return;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        if (lastXRef.current === null) { lastXRef.current = x; return; }
        const delta = x - lastXRef.current;
        lastXRef.current = x;
        if (Math.abs(delta) > 1) {
            setFrame(p => ((p - Math.round(delta / 3)) % frameCount + frameCount) % frameCount);
        }
    }, [frameCount]);

    const onMouseEnter = () => {
        stopAuto();
        setIsHovering(true);
        lastXRef.current = null;
    };
    const onMouseLeave = () => {
        setIsHovering(false);
        lastXRef.current = null;
    };

    const onTouchMove = useCallback((e) => {
        if (!frameCount) return;
        const x = e.touches?.[0]?.clientX;
        if (x === undefined) return;
        if (lastXRef.current === null) { lastXRef.current = x; return; }
        const delta = x - lastXRef.current;
        lastXRef.current = x;
        if (Math.abs(delta) > 1) {
            setFrame(p => ((p - Math.round(delta / 3)) % frameCount + frameCount) % frameCount);
        }
    }, [frameCount]);

    if (!images.length) return null;

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-square bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-[2rem] overflow-hidden select-none border border-gray-800"
            onMouseMove={onMouseMove}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onTouchStart={(e) => { lastXRef.current = e.touches?.[0]?.clientX ?? null; }}
            onTouchMove={onTouchMove}
            style={{ cursor: isHovering ? 'ew-resize' : 'default' }}
        >
            {images.map((img, idx) => (
                <img key={idx} src={getMediaUrl(img.image) || img} alt={`frame-${idx}`}
                    className={`absolute inset-0 w-full h-full object-contain filter drop-shadow-2xl p-4 transition-opacity duration-75 ${idx === frame ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false} />
            ))}

            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-gray-900/80 text-emerald-400 text-[10px] font-black tracking-widest uppercase rounded-full backdrop-blur-md border border-gray-700">
                <RotateCcw size={12} className={!isHovering ? 'animate-spin' : ''} />
                {isHovering ? `Frame ${frame + 1}/${frameCount}` : 'Auto-spinning'}
            </div>

            <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 bg-gray-900/80 text-white text-xs font-bold rounded-full backdrop-blur-md border border-gray-700 transition-opacity duration-300 shadow-xl ${isHovering ? 'opacity-0' : 'opacity-100'}`}>
                🖱️ Move mouse left/right to rotate
            </div>
        </div>
    );
};

// ── Stars ────────────────────────────────────────────────────────────────────
const Stars = ({ rating = 0, count = 0 }) => (
    <div className="flex items-center gap-2">
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={14}
                    fill={i <= Math.floor(rating) ? '#10b981' : 'none'}
                    stroke={i <= Math.floor(rating) ? '#10b981' : '#374151'}
                />
            ))}
        </div>
        <span className="text-xs font-bold text-gray-500">({count} reviews)</span>
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
        const currentCart = JSON.parse(localStorage.getItem('ng_cart') || '[]');
        const img = getMediaUrl(product.main_image);
        const idx = currentCart.findIndex(i => i.id === product.id);
        
        if (idx >= 0) {
            currentCart[idx].qty += qty;
        } else {
            currentCart.push({ id: product.id, title: product.title, price: product.price, image: img, qty: qty });
        }
        
        localStorage.setItem('ng_cart', JSON.stringify(currentCart));
        window.dispatchEvent(new Event('cartUpdated'));
        
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2500);
    };

    if (loading) return (
        <div className="bg-[#050810] min-h-screen container mx-auto px-4 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
                <div className="bg-gray-900 rounded-[2rem] aspect-square" />
                <div className="space-y-4">
                    <div className="h-8 bg-gray-900 rounded w-3/4" />
                    <div className="h-4 bg-gray-900 rounded w-1/4" />
                    <div className="h-12 bg-gray-900 rounded w-1/3" />
                    <div className="h-24 bg-gray-900 rounded" />
                </div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="bg-[#050810] min-h-screen container mx-auto px-4 py-32 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-6">
                <Package size={40} className="text-gray-600" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Product Not Found</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">The product you are looking for might have been removed or is temporarily unavailable.</p>
            <Link to="/products" className="px-8 py-4 bg-emerald-500 text-[#050810] font-black rounded-xl hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] inline-flex items-center gap-2">
                <ArrowLeft size={18} /> Return to Shop
            </Link>
        </div>
    );

    const rawImages = product.images || [];
    const mainImg = product.main_image ? [{ image: product.main_image }] : [];
    const images = [...mainImg, ...rawImages].length ? [...mainImg, ...rawImages] : [{ image: 'https://placehold.co/600x600/1e293b/a1a1aa?text=No+Image' }];

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
        { key: 'shipping', label: 'Shipping' },
    ];

    return (
        <div className="bg-[#050810] min-h-screen">
            <style>{`
                @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
                .fade-up{animation:fadeUp 0.5s ease-out both}
            `}</style>

            {/* Breadcrumb */}
            <div className="bg-[#0a0f1d] border-b border-gray-900">
                <div className="container mx-auto px-4 py-4 flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gray-500">
                    <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
                    <ChevronRight size={12} className="text-gray-700" />
                    <Link to="/products" className="hover:text-emerald-400 transition-colors">Shop</Link>
                    <ChevronRight size={12} className="text-gray-700" />
                    <span className="text-white truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 fade-up">

                    {/* ── IMAGE PANEL ── */}
                    <div className="space-y-6">
                        {/* View Toggle */}
                        <div className="flex gap-2">
                            {[{ key: 'gallery', label: 'Image Gallery' }, { key: '360', label: '360° Interactive' }].map(v => (
                                <button key={v.key} onClick={() => setViewMode(v.key)}
                                    className={`px-5 py-2.5 text-xs font-black rounded-xl transition-all border ${viewMode === v.key ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-white'}`}>
                                    {v.label}
                                </button>
                            ))}
                        </div>

                        {viewMode === '360' && <Spinner360 images={images} />}

                        {viewMode === 'gallery' && (
                            <div className="space-y-4">
                                <div className="relative aspect-square bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-[2rem] overflow-hidden border border-gray-800 group shadow-2xl flex items-center justify-center">
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700/20 via-transparent to-transparent opacity-50" />
                                    <img src={getMediaUrl(images[activeImage]?.image)} alt={product.title}
                                        className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 transition-transform duration-500 group-hover:scale-110 relative z-10" />
                                    
                                    {images.length > 1 && (
                                        <>
                                            <button onClick={() => setActiveImage(p => (p - 1 + images.length) % images.length)}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-900/80 backdrop-blur-md border border-gray-700 shadow-xl rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-500 hover:border-emerald-500 text-white z-20">
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button onClick={() => setActiveImage(p => (p + 1) % images.length)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-900/80 backdrop-blur-md border border-gray-700 shadow-xl rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-500 hover:border-emerald-500 text-white z-20">
                                                <ChevronRight size={20} />
                                            </button>
                                        </>
                                    )}
                                    {product.discount_price && (
                                        <div className="absolute top-6 left-6 bg-red-500 text-white text-[10px] font-black tracking-widest px-4 py-2 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)] z-20">
                                            SALE
                                        </div>
                                    )}
                                </div>
                                {/* Thumbnails */}
                                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                    {images.map((img, idx) => (
                                        <button key={idx} onClick={() => setActiveImage(idx)}
                                            className={`shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all bg-[#0a0f1d] p-2 ${activeImage === idx ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-gray-800 hover:border-gray-600'}`}>
                                            <img src={getMediaUrl(img.image) || img.image} alt="" className="w-full h-full object-contain filter drop-shadow-md" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { icon: Shield, text: '100% Authentic', sub: 'Verified Quality' },
                                { icon: RefreshCw, text: 'Free Returns', sub: '30-Day Guarantee' },
                                { icon: Truck, text: 'Fast Delivery', sub: 'Secure Shipping' },
                            ].map(({ icon: Icon, text, sub }) => (
                                <div key={text} className="flex flex-col items-center justify-center text-center p-4 bg-[#0a0f1d] rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
                                    <Icon size={20} className="text-gray-500 mb-2" />
                                    <span className="text-[10px] font-black text-gray-300 tracking-wide uppercase">{text}</span>
                                    <span className="text-[9px] text-gray-600 mt-1">{sub}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── INFO PANEL ── */}
                    <div className="space-y-8">
                        <div>
                            {product.category_name && (
                                <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                                    {product.category_name}
                                </span>
                            )}
                            <div className="flex items-start justify-between gap-6">
                                <h1 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight">{product.title}</h1>
                                <button onClick={() => setLiked(l => !l)}
                                    className={`shrink-0 p-3 rounded-2xl border transition-all shadow-lg ${liked ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-red-500/10' : 'bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-white'}`}>
                                    <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
                                </button>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                <Stars rating={product.rating || 4.8} count={product.reviews || 0} />
                                {product.sku && <span className="text-xs text-gray-600 font-mono font-bold bg-gray-900 px-2 py-1 rounded">SKU: {product.sku}</span>}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-4">
                            {product.discount_price ? (
                                <>
                                    <span className="text-5xl font-black text-white">${parseFloat(product.discount_price).toFixed(2)}</span>
                                    <span className="text-2xl text-gray-600 line-through font-bold">${parseFloat(product.price).toFixed(2)}</span>
                                    <span className="ml-2 text-[10px] font-black text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full tracking-widest uppercase">
                                        Save ${(product.price - product.discount_price).toFixed(2)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-5xl font-black text-white">${parseFloat(product.price).toFixed(2)}</span>
                            )}
                        </div>

                        {product.description && (
                            <p className="text-gray-400 leading-relaxed text-sm">{product.description.slice(0, 250)}{product.description.length > 250 ? '...' : ''}</p>
                        )}

                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black border ${product.in_stock !== false ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                            <div className={`w-2 h-2 rounded-full animate-pulse ${product.in_stock !== false ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            {product.in_stock !== false ? `In Stock ${product.stock ? `(${product.stock} available)` : ''}` : 'Out of Stock'}
                        </div>

                        <div className="h-px bg-gradient-to-r from-gray-800 to-transparent my-8" />

                        {/* ── COLOR SELECTOR ── */}
                        {colors.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                        Color {selectedColor && <span className="text-white normal-case tracking-normal ml-2">— {selectedColor}</span>}
                                    </label>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {colors.map(color => {
                                        const isSelected = selectedColor === color;
                                        const isHex = color?.startsWith('#');
                                        return (
                                            <button key={color} onClick={() => setSelectedColor(isSelected ? null : color)}
                                                className={`group relative transition-all duration-300 ${isHex ? 'w-12 h-12 rounded-full border-2' : 'px-5 py-3 rounded-xl border border-gray-800 bg-[#0a0f1d] text-sm font-bold text-gray-400'}
                                                    ${isSelected && isHex ? 'border-emerald-500 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : isSelected && !isHex ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : isHex ? 'border-gray-800 hover:scale-105' : 'hover:border-gray-600 hover:text-white'}`}
                                                style={isHex ? { backgroundColor: color } : {}}>
                                                {isHex && isSelected && <Check size={16} className="absolute inset-0 m-auto text-white mix-blend-difference drop-shadow-md" />}
                                                {!isHex && color}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── SIZE SELECTOR ── */}
                        {sizes.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                        Size {selectedSize && <span className="text-white normal-case tracking-normal ml-2">— {selectedSize}</span>}
                                    </label>
                                    <button className="text-xs text-emerald-400 font-bold hover:text-emerald-300 flex items-center gap-1 transition-colors">
                                        <Info size={14} /> Size Guide
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {sizes.map(size => {
                                        const isSelected = selectedSize === size;
                                        return (
                                            <button key={size} onClick={() => setSelectedSize(isSelected ? null : size)}
                                                className={`min-w-[56px] px-4 py-3 rounded-xl text-sm font-black border transition-all
                                                    ${isSelected ? 'border-emerald-500 bg-emerald-500 text-[#050810] shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-gray-800 bg-[#0a0f1d] text-gray-400 hover:border-gray-600 hover:text-white'}`}>
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── CTA ── */}
                        <div className="space-y-4 pt-4">
                            <div className="flex gap-4">
                                {/* Quantity */}
                                <div className="flex items-center bg-[#0a0f1d] border border-gray-800 rounded-2xl overflow-hidden shrink-0">
                                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-5 py-4 text-gray-500 hover:text-white hover:bg-gray-900 transition-colors">
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-10 text-center text-sm font-black text-white">{qty}</span>
                                    <button onClick={() => setQty(q => q + 1)} className="px-5 py-4 text-gray-500 hover:text-white hover:bg-gray-900 transition-colors">
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {/* Add to Cart */}
                                <button onClick={handleAddToCart}
                                    className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-xl ${addedToCart ? 'bg-white text-gray-900' : 'bg-emerald-500 text-[#050810] hover:bg-emerald-400 hover:scale-[1.02] active:scale-95 shadow-emerald-500/20'}`}>
                                    {addedToCart ? <><Check size={20} /> Added to Cart</> : <><ShoppingCart size={20} /> Add to Cart — ${((product.discount_price || product.price) * qty).toFixed(2)}</>}
                                </button>
                                
                                <button className="p-4 bg-[#0a0f1d] border border-gray-800 rounded-2xl hover:bg-gray-900 text-gray-400 hover:text-white transition-all">
                                    <Share2 size={20} />
                                </button>
                            </div>
                            
                            {/* Buy Now */}
                            <button className="w-full py-4 border border-gray-700 bg-gray-900 text-white font-black text-sm rounded-2xl hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all">
                                Buy It Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── TABS ── */}
                <div className="mt-24 fade-up">
                    <div className="border-b border-gray-800 flex gap-8 overflow-x-auto custom-scrollbar">
                        {tabs.map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                className={`pb-4 text-sm font-black whitespace-nowrap transition-all border-b-2 -mb-px ${activeTab === tab.key ? 'text-emerald-400 border-emerald-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="py-12">
                        {activeTab === 'description' && (
                            <div className="prose prose-invert max-w-none text-gray-400 leading-loose">
                                <p>{product.description || 'No detailed description available for this product.'}</p>
                            </div>
                        )}

                        {activeTab === 'features' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {features.length > 0 ? features.map((f, i) => (
                                    <div key={i} className="flex items-start gap-4 p-5 bg-[#0a0f1d] rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                                            <Check size={14} className="text-emerald-400" />
                                        </div>
                                        <p className="text-sm text-gray-300 font-medium leading-relaxed">{f}</p>
                                    </div>
                                )) : (
                                    ['Premium materials', 'Durable build', 'Ergonomic design', 'Eco-friendly'].map((f, i) => (
                                        <div key={i} className="flex items-center gap-4 p-5 bg-[#0a0f1d] rounded-2xl border border-gray-800">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                                                <Sparkles size={14} className="text-emerald-400" />
                                            </div>
                                            <p className="text-sm text-gray-300 font-medium">{f}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'attributes' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { label: 'Brand', value: product.brand || '—' },
                                    { label: 'Category', value: product.category_name || '—' },
                                    { label: 'SKU', value: product.sku || '—' },
                                    { label: 'Weight', value: product.weight || '—' },
                                    { label: 'Material', value: product.material || '—' },
                                    ...(attributes.length ? attributes.map(a => ({ label: a.name, value: a.value })) : []),
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex flex-col gap-1 p-5 bg-[#0a0f1d] rounded-2xl border border-gray-800">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
                                        <span className="text-sm font-bold text-white">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'shipping' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { icon: Truck, title: 'Standard Delivery', desc: '3–5 business days · Free over $50' },
                                    { icon: Package, title: 'Express Delivery', desc: '1–2 business days · $9.99 flat rate' },
                                    { icon: RefreshCw, title: 'Free Returns', desc: '30-day return policy · Seamless process' },
                                    { icon: Shield, title: 'Buyer Protection', desc: 'Full refund guarantee for peace of mind' },
                                ].map(({ icon: Icon, title, desc }) => (
                                    <div key={title} className="flex gap-5 p-6 bg-[#0a0f1d] rounded-[2rem] border border-gray-800">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0 shadow-inner">
                                            <Icon size={20} className="text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-white mb-1">{title}</p>
                                            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
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
