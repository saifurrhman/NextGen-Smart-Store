import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ShoppingCart, Heart, Star, X, Grid, List, Filter, Eye, Package, ChevronDown } from 'lucide-react';
import api from '../../utils/api';

const getMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
};

/* ─── Modern Deep Product Card (From Home.jsx) ─── */
const Card = ({ product }) => {
  const [w, setW] = useState(false);
  const img = getMediaUrl(product.main_image) || getMediaUrl(product.images?.[0]?.image);
  
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

  return (
    <Link to={`/products/${product.id}`} className="group relative bg-[#0f172a] rounded-[1.5rem] overflow-hidden border border-gray-800 hover:border-emerald-500/50 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.2)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
      <div className="relative h-64 bg-gradient-to-br from-[#1e293b] to-[#0f172a] flex items-center justify-center p-6 overflow-hidden">
        {img ? <img src={img} alt={product.title} className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" />
          : <Package size={48} className="text-gray-700" />}
        {product.discount_price && (
          <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]">SALE</span>
        )}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <button onClick={toggleW} className="w-10 h-10 bg-gray-900/80 backdrop-blur-md border border-gray-700 hover:border-red-500 hover:bg-red-500/10 rounded-full flex items-center justify-center shadow-lg transition-colors">
            <Heart size={16} fill={w ? '#ef4444' : 'none'} className={w ? "text-red-500" : "text-gray-400"} />
          </button>
          <div className="w-10 h-10 bg-gray-900/80 backdrop-blur-md border border-gray-700 hover:border-white hover:bg-white/10 rounded-full flex items-center justify-center shadow-lg transition-colors text-gray-400 hover:text-white">
            <Eye size={16} />
          </div>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1 border-t border-gray-800/50">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{product.category_name || 'Category'}</p>
          <div className="flex items-center gap-1">
            <Star size={10} fill="#f59e0b" stroke="#f59e0b" />
            <span className="text-[10px] font-bold text-gray-400">4.8</span>
          </div>
        </div>
        <h3 className="font-bold text-white text-[15px] leading-snug line-clamp-2 mb-4 flex-1 group-hover:text-emerald-400 transition-colors">{product.title}</h3>
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            {product.discount_price ? (
              <>
                <span className="text-[11px] text-gray-500 line-through mb-0.5">${parseFloat(product.price).toFixed(2)}</span>
                <span className="text-xl font-black text-white">${parseFloat(product.discount_price).toFixed(2)}</span>
              </>
            ) : <span className="text-xl font-black text-white">${parseFloat(product.price).toFixed(2)}</span>}
          </div>
          <button onClick={addCart} className="w-11 h-11 rounded-xl bg-emerald-500 text-[#050810] flex items-center justify-center hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
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
  const [priceRange, setPriceRange] = useState([0, 1000]);
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
      
      // Local filtering for price and sorting (since backend might not support it fully yet)
      data = data.filter(p => parseFloat(p.discount_price || p.price) <= priceRange[1]);
      if (sortBy === 'price_low') data.sort((a,b) => parseFloat(a.discount_price || a.price) - parseFloat(b.discount_price || b.price));
      else if (sortBy === 'price_high') data.sort((a,b) => parseFloat(b.discount_price || b.price) - parseFloat(a.discount_price || a.price));

      setProducts(data);
      setTotal(r.data.count || data.length);
    } catch { setProducts([]); } finally { setLoading(false); }
  }, [page, search, selectedCat, sortBy, priceRange]);

  useEffect(() => {
    fetchProducts();
    api.get('categories/').then(r => setCategories((r.data.results || r.data).filter(c => c.is_active))).catch(() => {});
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
    <div className="bg-[#050810] min-h-screen pb-20">
      
      {/* Page Header */}
      <div className="bg-[#0a0f1d] border-b border-gray-800 py-10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <nav className="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-4 flex items-center gap-2">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="text-emerald-500">Shop</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                {selectedCat ? `${categories.find(c => c.slug === selectedCat)?.name || 'Products'}` : 'All Products'}
              </h1>
              <p className="text-gray-400 text-sm mt-2 font-medium">Showing <span className="text-white">{products.length}</span> out of {total} products</p>
            </div>
            
            {/* Search */}
            <form onSubmit={e => { e.preventDefault(); setPage(1); fetchProducts(); }} className="flex gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-72">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search the catalog..."
                  className="w-full pl-11 pr-4 py-3.5 bg-[#050810] border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors shadow-inner" />
              </div>
              <button type="submit" className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-[#050810] text-sm font-black rounded-xl transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className={`${sidebarOpen ? 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end' : 'hidden'} lg:block w-full lg:w-72 shrink-0`} onClick={e => { if (e.target === e.currentTarget) setSidebarOpen(false); }}>
            <div className={`w-full max-w-[300px] h-full lg:h-auto bg-[#0a0f1d] lg:bg-transparent p-6 lg:p-0 overflow-y-auto ${sidebarOpen ? 'border-l border-gray-800 shadow-2xl' : ''}`}>
              <div className="lg:sticky lg:top-24 space-y-8 bg-[#0a0f1d] lg:p-6 lg:rounded-[2rem] lg:border lg:border-gray-800 lg:shadow-2xl">
                
                <div className="flex items-center justify-between lg:hidden mb-8">
                  <h2 className="font-black text-white text-lg flex items-center gap-2"><SlidersHorizontal size={18} className="text-emerald-500"/> Filters</h2>
                  <button className="text-gray-400 hover:text-white bg-gray-900 p-2 rounded-lg" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-black text-white text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Categories
                  </h3>
                  <div className="space-y-1.5">
                    <button onClick={() => { setSelectedCat(''); setPage(1); }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${!selectedCat ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}>
                      All Categories
                    </button>
                    {categories.map(cat => (
                      <button key={cat.slug} onClick={() => { setSelectedCat(cat.slug); setPage(1); }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedCat === cat.slug ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-black text-white text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Price Range
                  </h3>
                  <div className="px-2">
                    <input type="range" min="0" max="2000" value={priceRange[1]} onChange={e => setPriceRange([0, parseInt(e.target.value)])} 
                      className="w-full accent-emerald-500 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer" />
                    <div className="flex justify-between text-xs font-black mt-4">
                      <span className="text-gray-500 bg-gray-900 px-3 py-1 rounded-lg border border-gray-800">$0</span>
                      <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedCat || search || priceRange[1] < 2000) && (
                  <div className="pt-4 border-t border-gray-800">
                    <button onClick={() => { setSelectedCat(''); setSearch(''); setPriceRange([0, 2000]); setPage(1); }}
                      className="w-full py-3 text-sm font-black rounded-xl transition-all border border-gray-700 text-white hover:bg-gray-800">
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
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#0a0f1d] rounded-2xl p-4 border border-gray-800 shadow-lg">
              <button className="flex items-center gap-2 text-sm font-black text-white bg-gray-900 px-4 py-2.5 rounded-xl border border-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Filter size={16} /> Filters
              </button>
              
              <div className="flex items-center gap-4 ml-auto w-full lg:w-auto">
                <div className="flex-1 lg:flex-none relative">
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} 
                    className="w-full lg:w-48 appearance-none bg-gray-900 border border-gray-800 text-white text-sm font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors">
                    <option value="newest">Sort by: Newest</option>
                    <option value="price_low">Sort by: Price (Low)</option>
                    <option value="price_high">Sort by: Price (High)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
                <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 shrink-0">
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#0a0f1d] text-emerald-400 shadow-md' : 'text-gray-500 hover:text-white'}`}><Grid size={16} /></button>
                  <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#0a0f1d] text-emerald-400 shadow-md' : 'text-gray-500 hover:text-white'}`}><List size={16} /></button>
                </div>
              </div>
            </div>

            {/* Product Grid/List */}
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {Array(9).fill(null).map((_, i) => <div key={i} className="h-80 rounded-[1.5rem] bg-[#0a0f1d] border border-gray-800 animate-pulse" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-[#0a0f1d] rounded-[2rem] border border-dashed border-gray-800">
                <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-600" />
                </div>
                <h3 className="font-black text-white text-xl mb-2">No Products Found</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">We couldn't find anything matching your current filters. Try adjusting your search criteria.</p>
                <button onClick={() => { setSelectedCat(''); setSearch(''); setPriceRange([0, 2000]); }} 
                  className="px-8 py-3 bg-white text-gray-900 font-black rounded-xl hover:bg-gray-200 transition-colors">
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {products.map(product => {
                  const img = getMediaUrl(product.main_image);
                  return viewMode === 'grid' ? (
                    <Card key={product.id} product={product} />
                  ) : (
                    <Link key={product.id} to={`/products/${product.id}`} className="group bg-[#0f172a] rounded-[1.5rem] overflow-hidden border border-gray-800 hover:border-emerald-500/50 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.2)] transition-all flex flex-col sm:flex-row">
                      <div className="w-full sm:w-48 h-48 sm:h-auto bg-gradient-to-br from-[#1e293b] to-[#0f172a] flex items-center justify-center p-4 relative shrink-0">
                        {img ? <img src={img} alt={product.title} className="w-full h-full object-contain filter drop-shadow-xl group-hover:scale-110 transition-transform duration-500" />
                          : <Package size={32} className="text-gray-600" />}
                        {product.discount_price && <span className="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-lg">SALE</span>}
                      </div>
                      <div className="p-6 flex flex-col flex-1 border-t sm:border-t-0 sm:border-l border-gray-800/50">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{product.category_name || 'General'}</p>
                          <div className="flex items-center gap-1">
                            <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                            <span className="text-[10px] font-bold text-gray-400">4.8</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-white text-lg mb-2 group-hover:text-emerald-400 transition-colors">{product.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-6">{product.description || 'Premium quality product with exceptional features designed for everyday use.'}</p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-end gap-3">
                            {product.discount_price ? (
                              <>
                                <span className="text-2xl font-black text-white">${parseFloat(product.discount_price).toFixed(2)}</span>
                                <span className="text-sm text-gray-500 line-through mb-1">${parseFloat(product.price).toFixed(2)}</span>
                              </>
                            ) : <span className="text-2xl font-black text-white">${parseFloat(product.price).toFixed(2)}</span>}
                          </div>
                          <button onClick={e => addCartList(product, e)} className="px-6 py-2.5 bg-emerald-500 text-[#050810] text-sm font-black rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5">
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
              <div className="flex items-center justify-center gap-4 mt-12 border-t border-gray-800 pt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} 
                  className="px-6 py-3 text-sm font-black border border-gray-700 rounded-xl disabled:opacity-30 disabled:hover:bg-transparent hover:bg-gray-800 text-white transition-all">
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500 text-[#050810] font-black shadow-[0_0_15px_rgba(16,185,129,0.3)]">{page}</span>
                </div>
                <button onClick={() => setPage(p => p + 1)} disabled={products.length < 12} 
                  className="px-6 py-3 text-sm font-black border border-gray-700 rounded-xl disabled:opacity-30 disabled:hover:bg-transparent hover:bg-gray-800 text-white transition-all">
                  Next Page
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
