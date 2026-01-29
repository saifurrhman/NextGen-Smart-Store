import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, ShoppingCart, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api'; // Use centralized API utility

const ProductListing = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/store/public/products/');
                setProducts(response.data.results || response.data);
            } catch (err) {
                console.error("Failed to fetch products", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div className="text-center py-20 text-brand font-bold animate-pulse">Loading Products...</div>;
    if (error) return <div className="text-center py-20 text-functional-error">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full md:w-64 space-y-6">
                    <div className="flex items-center gap-2 font-bold text-text-main border-b border-gray-100 pb-2">
                        <Filter size={20} />
                        <h2>Filters</h2>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold mb-3 text-text-main">Categories</h3>
                        <div className="space-y-2 text-sm text-text-sub">
                            <label className="flex items-center gap-2"><input type="checkbox" className="rounded text-brand focus:ring-brand" /> Footwear</label>
                            <label className="flex items-center gap-2"><input type="checkbox" className="rounded text-brand focus:ring-brand" /> Electronics</label>
                            <label className="flex items-center gap-2"><input type="checkbox" className="rounded text-brand focus:ring-brand" /> Apparel</label>
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h3 className="font-semibold mb-3 text-text-main">Price Range</h3>
                        <input type="range" className="w-full accent-brand" />
                        <div className="flex justify-between text-xs text-text-sub mt-1">
                            <span>$0</span>
                            <span>$1000+</span>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-brand-dark">All Products</h1>
                        <div className="flex items-center gap-2 text-sm text-text-sub">
                            Sort by:
                            <button className="flex items-center font-medium text-text-main hover:text-brand">
                                Popular <ChevronDown size={14} className="ml-1" />
                            </button>
                        </div>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                            <p className="text-text-sub text-lg">No products found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map(product => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer border border-gray-100"
                                    onClick={() => navigate(`/products/${product.id}`)}
                                >
                                    <div className="relative h-64 bg-gray-100">
                                        <img
                                            src={product.images?.[0]?.image || 'https://via.placeholder.com/500'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {/* AR Badge */}
                                        {product.has_ar && ( // Assuming has_ar comes from backend
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-brand-dark">
                                                <Camera size={18} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm text-brand font-medium mb-1">{product.category_name || 'General'}</p>
                                        <h3 className="font-bold text-lg text-brand-dark mb-2 truncate">{product.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold text-brand-dark">${product.price}</span>
                                            <button className="p-2 bg-brand-accent text-brand rounded-full hover:bg-brand hover:text-white transition-colors">
                                                <ShoppingCart size={20} />
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
