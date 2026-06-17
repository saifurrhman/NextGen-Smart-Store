import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ShoppingCart, Heart, Star, X, Grid, List, Filter, Eye, Package, ChevronDown } from 'lucide-react';
import api from '../../utils/api';

const getMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
};

/* ─── Robust Product Image Helper with Fallback ─── */
const ProductImage = ({ src, alt, size = 48, className = "" }) => {
  const [error, setError] = useState(false);
  if (src && !error) {
    return <img src={src} alt={alt} onError={() => setError(true)} className={className} />;
  }
  return <Package size={size} className="text-gray-400" />;
};

const cleanProductData = (p) => {
  // Just return product as-is - no filtering needed
  return p;
};


/* ─── Modern Deep Product Card (From Home.jsx) ─── */
const Card = ({ product }) => {
  const [w, setW] = useState(false);
  
  let img = getMediaUrl(product.main_image) || getMediaUrl(product.images?.[0]?.image);
  
  const addCart = e => {
    e.preventDefault();
    const c = JSON.parse(localStorage.getItem('ng_cart') || '[]');
    const i = c.findIndex(x => x.id === product.id);
    i >= 0 ? c[i].qty++ : c.push({ id: product.id, title: product.title, price: product.price, image: img, qty: 1 });
    localStorage.setItem('ng_cart', JSON.stringify(c));
    window.dispatchEvent(new Event('cartUpdated'));
  };
  
  const toggleW = e => {
    e.preventDefault();
    const wl = JSON.parse(localStorage.getItem('ng_wishlist') || '[]');
    const upd = wl.find(x => x.id === product.id) ? wl.filter(x => x.id !== product.id) : [...wl, { id: product.id, title: product.title, price: product.price, image: img }];
    localStorage.setItem('ng_wishlist', JSON.stringify(upd));
    setW(!w); window.dispatchEvent(new Event('wishlistUpdated'));
  };

  const priceVal = parseFloat(product.price);
  const discountVal = product.discount_price ? parseFloat(product.discount_price) : null;
  const displayOriginalPrice = discountVal ? priceVal : priceVal * 1.25;
  const displaySalePrice = discountVal ? discountVal : priceVal;

  return (
    <Link to={`/products/${product.id}`} className="group relative bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:border-emerald-500/35 hover:shadow-[0_20px_40px_rgba(16,185,129,0.08)] hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="relative h-64 bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
        <ProductImage src={img} alt={product.title} size={48} className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-700 ease-out" />
        <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-md z-10">SALE</span>
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 z-10">
          <button onClick={toggleW} className="w-10 h-10 bg-white border border-gray-200 hover:border-red-500 hover:bg-red-50 rounded-full flex items-center justify-center shadow-md transition-colors">
            <Heart size={16} fill={w ? '#ef4444' : 'none'} className={w ? "text-red-500" : "text-gray-400"} />
          </button>
          <div className="w-10 h-10 bg-white border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 rounded-full flex items-center justify-center shadow-md transition-colors text-gray-400 hover:text-emerald-500">
            <Eye size={16} />
          </div>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{product.category_name || "Men's Style"}</p>
          <div className="flex items-center gap-1">
            <Star size={10} fill="#f59e0b" stroke="#f59e0b" />
            <span className="text-[10px] font-bold text-gray-500">4.8</span>
          </div>
        </div>
        <h3 className="font-bold text-gray-800 text-[15px] leading-snug line-clamp-2 mb-4 flex-1 group-hover:text-emerald-600 transition-colors">{product.title}</h3>
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[11px] text-gray-400 line-through mb-0.5">PKR {displayOriginalPrice.toFixed(0)}</span>
            <span className="text-xl font-black text-gray-900">PKR {displaySalePrice.toFixed(0)}</span>
          </div>
          <button onClick={addCart} className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 hover:scale-105 transition-all shadow-md">
            <ShoppingCart size={18} fill="currentColor" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [viewMode, setViewMode] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let url = `products/?page=${page}&page_size=12`;
      if (search) url += `&search=${search}`;
      if (selectedCat) url += `&category=${selectedCat}`;
      const r = await api.get(url);
      let data = r.data.results || r.data;

      // Map and clean product data
      data = data.map(cleanProductData);

      // Local filtering for price and sorting
      data = data.filter(p => parseFloat(p.discount_price || p.price) <= priceRange[1]);
      if (sortBy === 'price_low') data.sort((a, b) => parseFloat(a.discount_price || a.price) - parseFloat(b.discount_price || b.price));
      else if (sortBy === 'price_high') data.sort((a, b) => parseFloat(b.discount_price || b.price) - parseFloat(a.discount_price || a.price));
      else if (sortBy === 'rating') data.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
      else if (sortBy === 'discount') data.sort((a, b) => {
        const da = (parseFloat(a.price) - parseFloat(a.discount_price || a.price)) / parseFloat(a.price);
        const db = (parseFloat(b.price) - parseFloat(b.discount_price || b.price)) / parseFloat(b.price);
        return db - da;
      });

      setProducts(data);
      setTotal(r.data.count || data.length);
    } catch { setProducts([]); } finally { setLoading(false); }
  }, [page, search, selectedCat, sortBy, priceRange]);

  useEffect(() => {
    fetchProducts();
    api.get('categories/').then(r => {
      const activeCats = (r.data.results || r.data).filter(c => c.is_active);
      const uniqueCats = [];
      const catNames = new Set();
      for (const cat of activeCats) {
        const normName = cat.name.trim().toLowerCase();
        if (!catNames.has(normName)) {
          catNames.add(normName);
          uniqueCats.push(cat);
        }
      }
      setCategories(uniqueCats);
    }).catch(() => { });
  }, [fetchProducts]);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setSelectedCat(searchParams.get('category') || '');
  }, [searchParams]);

  // Handle Add to cart for List View
  const addCartList = (product, e) => {
    e.preventDefault();
    const img = getMediaUrl(product.main_image);
    const c = JSON.parse(localStorage.getItem('ng_cart') || '[]');
    const i = c.findIndex(x => x.id === product.id);
    i >= 0 ? c[i].qty++ : c.push({ id: product.id, title: product.title, price: product.price, image: img, qty: 1 });
    localStorage.setItem('ng_cart', JSON.stringify(c));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="bg-[#f9fafb] min-h-screen pb-20 text-gray-800">

      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 py-10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <nav className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-4 flex items-center gap-2">
            <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-emerald-600">Shop</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                {selectedCat ? `${categories.find(c => c.slug === selectedCat)?.name || 'Products'}` : "Men's Collection"}
              </h1>
              <p className="text-gray-500 text-sm mt-2 font-medium">Showing <span className="text-gray-900 font-bold">{products.length}</span> out of {total} products</p>
            </div>

            {/* Search Query Status Display (Removed redundant search input) */}
            {search && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-150 rounded-2xl px-4 py-2 text-sm text-emerald-800">
                <span>Active Search: <strong className="font-black">"{search}"</strong></span>
                <button type="button" onClick={() => setSearchParams(prev => { prev.delete('search'); return prev; })} className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-100 hover:bg-red-100 hover:text-red-650 transition-colors cursor-pointer text-emerald-700 font-black text-xs ml-1">×</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className={`${sidebarOpen ? 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end' : 'hidden'} lg:block w-full lg:w-72 shrink-0`} onClick={e => { if (e.target === e.currentTarget) setSidebarOpen(false); }}>
            <div className={`w-full max-w-[300px] h-full lg:h-auto bg-white lg:bg-transparent p-6 lg:p-0 overflow-y-auto ${sidebarOpen ? 'border-l border-gray-100 shadow-2xl' : ''}`}>
              <div className="lg:sticky lg:top-24 space-y-8 bg-white lg:p-6 lg:rounded-[2rem] lg:border lg:border-gray-150 lg:shadow-sm">

                <div className="flex items-center justify-between lg:hidden mb-8">
                  <h2 className="font-black text-gray-900 text-lg flex items-center gap-2"><SlidersHorizontal size={18} className="text-emerald-500" /> Filters</h2>
                  <button className="text-gray-500 hover:text-gray-900 bg-gray-100 p-2 rounded-lg" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-black text-gray-850 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Categories
                  </h3>
                  <div className="space-y-1.5">
                    <button onClick={() => { setSelectedCat(''); setPage(1); }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${!selectedCat ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'text-gray-650 hover:bg-gray-50 hover:text-gray-900'}`}>
                      All Categories
                    </button>
                    {categories.map(cat => (
                      <button key={cat.slug} onClick={() => { setSelectedCat(cat.slug); setPage(1); }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedCat === cat.slug ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'text-gray-650 hover:bg-gray-50 hover:text-gray-900'}`}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-black text-gray-850 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Price Range
                  </h3>
                  <div className="px-2">
                    <input type="range" min="0" max="500000" value={priceRange[1]} onChange={e => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-emerald-500 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer" />
                    <div className="flex justify-between text-xs font-black mt-4">
                      <span className="text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">PKR 0</span>
                      <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">PKR {priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedCat || search || priceRange[1] < 2000) && (
                  <div className="pt-4 border-t border-gray-100">
                  <button onClick={() => { setSelectedCat(''); setSearch(''); setPriceRange([0, 500000]); setPage(1); }}
                      className="w-full py-3 text-sm font-black rounded-xl transition-all border border-gray-250 text-gray-700 hover:bg-gray-50">
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white rounded-2xl p-4 border border-gray-150 shadow-sm">
              <button className="flex items-center gap-2 text-sm font-black text-gray-700 bg-white px-4 py-2.5 rounded-xl border border-gray-250 hover:bg-gray-50 lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Filter size={16} /> Filters
              </button>

              <div className="flex items-center gap-4 ml-auto w-full lg:w-auto">
                <div className="flex-1 lg:flex-none relative">
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="w-full lg:w-48 appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors">
                    <option value="newest">Sort by: Newest</option>
                    <option value="price_low">Sort by: Price (Low to High)</option>
                    <option value="price_high">Sort by: Price (High to Low)</option>
                    <option value="rating">Sort by: Customer Rating</option>
                    <option value="discount">Sort by: Biggest Discount</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <div className="flex gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1 shrink-0">
                  <button type="button" onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-emerald-500 text-white shadow-md font-bold' : 'text-gray-500 hover:text-gray-800'}`}><Grid size={16} /></button>
                  <button type="button" onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-emerald-500 text-white shadow-md font-bold' : 'text-gray-500 hover:text-gray-800'}`}><List size={16} /></button>
                </div>
              </div>
            </div>

            {/* Product Grid/List */}
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {Array(9).fill(null).map((_, i) => <div key={i} className="h-80 rounded-[2rem] bg-white border border-gray-100 animate-pulse" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="font-black text-gray-900 text-xl mb-2">No Products Found</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">We couldn't find anything matching your current filters. Try adjusting your search criteria.</p>
                <button onClick={() => { setSelectedCat(''); setSearch(''); setPriceRange([0, 500000]); }}
                  className="px-8 py-3 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-600 transition-colors shadow-md">
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {products.map(product => {
                  let img = getMediaUrl(product.main_image) || getMediaUrl(product.images?.[0]?.image);
                  const priceVal = parseFloat(product.price);
                  const discountVal = product.discount_price ? parseFloat(product.discount_price) : null;
                  const displayOriginalPrice = discountVal ? priceVal : priceVal * 1.25;
                  const displaySalePrice = discountVal ? discountVal : priceVal;

                  return viewMode === 'grid' ? (
                    <Card key={product.id} product={product} />
                  ) : (
                    <Link key={product.id} to={`/products/${product.id}`} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:border-emerald-500/35 hover:shadow-[0_20px_40px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-500 ease-out flex flex-col sm:flex-row shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                      <div className="w-full sm:w-48 h-48 sm:h-auto bg-gray-50 flex items-center justify-center p-4 relative shrink-0">
                        <ProductImage src={img} alt={product.title} size={32} className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-700 ease-out" />
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-md z-10">SALE</span>
                      </div>
                      <div className="p-6 flex flex-col flex-1 border-t sm:border-t-0 sm:border-l border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{product.category_name || "Men's Footwear"}</p>
                          <div className="flex items-center gap-1">
                            <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                            <span className="text-[10px] font-bold text-gray-500">4.8</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-emerald-600 transition-colors">{product.title}</h3>
                        <p className="text-gray-555 text-sm line-clamp-2 mb-6">{product.description || 'Premium quality product with exceptional features designed for everyday use.'}</p>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-end gap-3">
                            <span className="text-2xl font-black text-gray-900">PKR {displaySalePrice.toFixed(0)}</span>
                            <span className="text-sm text-gray-400 line-through mb-1">PKR {displayOriginalPrice.toFixed(0)}</span>
                          </div>
                          <button onClick={e => addCartList(product, e)} className="px-6 py-2.5 bg-emerald-500 text-white text-sm font-black rounded-xl hover:bg-emerald-600 transition-all shadow-md">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {total > 12 && (
              <div className="flex items-center justify-center gap-4 mt-12 border-t border-gray-100 pt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-5 py-2.5 text-xs font-black border border-gray-250 rounded-xl disabled:opacity-30 disabled:hover:bg-transparent hover:bg-gray-50 text-gray-705 transition-all">
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Page</span>
                  <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-500 text-white font-black shadow-md text-xs">{page}</span>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">of {Math.ceil(total / 12) || 1}</span>
                </div>
                <button onClick={() => setPage(p => p + 1)} disabled={products.length < 12}
                  className="px-5 py-2.5 text-xs font-black border border-gray-250 rounded-xl disabled:opacity-30 disabled:hover:bg-transparent hover:bg-gray-50 text-gray-705 transition-all">
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
