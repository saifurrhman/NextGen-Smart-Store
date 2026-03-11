import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, ShoppingCart, Camera, Search, X, Grid, Tag } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../utils/api';

const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/media/')) return `http://localhost:8000${url}`;
    return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
};

const ProductListing = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState(null); // slug

    // Read ?category= from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cat = params.get('category');
        setActiveCategory(cat || null);
    }, [location.search]);

    // Fetch categories
    useEffect(() => {
        api.get('categories/?page=1')
            .then(res => {
                const cats = res.data.results || res.data;
                setCategories(cats.filter(c => c.is_active));
            })
            .catch(() => { });
    }, []);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                // Build query - try both endpoints gracefully
                let params = {};
                if (search) params.search = search;
                if (activeCategory) params.category = activeCategory;

                let data = [];
                try {
                    // Primary: products API
                    const res = await api.get('products/', { params });
                    data = res.data.results || res.data;
                } catch {
                    // Fallback: try with limit
                    const res = await api.get('products/?limit=50');
                    data = res.data.results || res.data;
                    // Client-side filter
                    if (activeCategory) {
                        data = data.filter(p =>
                            p.category_slug === activeCategory ||
                            p.category_name?.toLowerCase() === activeCategory.toLowerCase()
                        );
                    }
                    if (search) {
                        data = data.filter(p =>
                            p.name?.toLowerCase().includes(search.toLowerCase())
                        );
                    }
                }
                setProducts(data);
            } catch (err) {
                console.error('Failed to fetch products', err);
                setProducts([]);
                // Don't show error, show empty state instead
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [activeCategory, search]);

    const handleCategoryClick = (slug) => {
        if (activeCategory === slug) {
            setActiveCategory(null);
            navigate('/products');
        } else {
            setActiveCategory(slug);
            navigate(`/products?category=${slug}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-brand-dark">
                    {activeCategory
                        ? categories.find(c => c.slug === activeCategory)?.name || 'Products'
                        : 'All Products'}
                </h1>
                {activeCategory && (
                    <div className="flex items-center gap-2 mt-2">
                        <Link to="/products" className="text-sm text-gray-400 hover:text-brand">All Products</Link>
                        <span className="text-gray-300">›</span>
                        <span className="text-sm font-semibold text-brand">
                            {categories.find(c => c.slug === activeCategory)?.name || activeCategory}
                        </span>
                        <button onClick={() => { setActiveCategory(null); navigate('/products'); }}
                            className="ml-2 text-xs px-2 py-0.5 bg-red-50 text-red-400 rounded-full hover:bg-red-100 transition-colors flex items-center gap-1">
                            <X size={10} /> Clear
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full md:w-64 space-y-6 shrink-0">
                    {/* Search */}
                    <div className="relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand transition-colors"
                        />
                    </div>

                    {/* Categories Filter */}
                    <div>
                        <div className="flex items-center gap-2 font-bold text-brand-dark border-b border-gray-100 pb-3 mb-3">
                            <Tag size={16} />
                            <h3>Categories</h3>
                        </div>
                        <div className="space-y-1">
                            <button
                                onClick={() => { setActiveCategory(null); navigate('/products'); }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!activeCategory ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                                All Categories
                            </button>
                            {categories.map((cat, idx) => (
                                <button
                                    key={cat.slug}
                                    onClick={() => handleCategoryClick(cat.slug)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeCategory === cat.slug ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    {(getMediaUrl(cat.icon) || getMediaUrl(cat.image)) ? (
                                        <img src={getMediaUrl(cat.icon) || getMediaUrl(cat.image)} alt="" className="w-5 h-5 rounded object-cover" />
                                    ) : (
                                        <Grid size={14} />
                                    )}
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <div className="flex items-center gap-2 font-bold text-brand-dark border-b border-gray-100 pb-3 mb-3">
                            <h3>Price Range</h3>
                        </div>
                        <input type="range" className="w-full accent-brand" />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>$0</span>
                            <span>$1000+</span>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-sm text-gray-500 font-medium">
                            {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            Sort by:
                            <button className="flex items-center font-semibold text-brand-dark hover:text-brand">
                                Popular <ChevronDown size={14} className="ml-1" />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array(8).fill(0).map((_, i) => (
                                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                                    <div className="h-64 bg-gray-100" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-3 bg-gray-100 rounded w-1/3" />
                                        <div className="h-4 bg-gray-100 rounded w-2/3" />
                                        <div className="h-4 bg-gray-100 rounded w-1/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <ShoppingCart size={28} className="text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-semibold text-lg">No products found</p>
                            <p className="text-gray-400 text-sm mt-1">
                                {activeCategory ? 'No products in this category yet.' : 'No products available.'}
                            </p>
                            {activeCategory && (
                                <button onClick={() => { setActiveCategory(null); navigate('/products'); }}
                                    className="mt-4 px-5 py-2.5 bg-brand text-white rounded-full text-sm font-bold hover:bg-brand-dark transition-colors">
                                    View All Products
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map(product => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group cursor-pointer border border-gray-100"
                                    onClick={() => navigate(`/products/${product.id}`)}>
                                    <div className="relative h-64 bg-gray-100 overflow-hidden">
                                        <img
                                            src={getMediaUrl(product.images?.[0]?.image) || 'https://placehold.co/500x500?text=No+Image'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {product.has_ar && (
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-brand-dark">
                                                <Camera size={18} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <p className="text-xs text-brand font-semibold mb-1 uppercase tracking-wider">{product.category_name || 'General'}</p>
                                        <h3 className="font-bold text-brand-dark mb-2 truncate">{product.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold text-brand-dark">${product.price}</span>
                                            <button className="p-2 bg-brand-accent text-brand rounded-full hover:bg-brand hover:text-white transition-colors">
                                                <ShoppingCart size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductListing;
