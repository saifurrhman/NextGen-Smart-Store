import React, { useState } from 'react';
import { Filter, ChevronDown, ShoppingCart, Heart, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock Data (until API linked)
const MOCK_PRODUCTS = [
    { id: 1, name: "Nike Air Zoom AR", price: 120, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", category: "Footwear", hasAr: true },
    { id: 2, name: "Smart Watch Elite", price: 250, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80", category: "Electronics", hasAr: false },
    { id: 3, name: "Urban Hoodie", price: 85, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80", category: "Apparel", hasAr: true },
    { id: 4, name: "VR Headset Pro", price: 399, image: "https://images.unsplash.com/photo-1622979135225-d2ba269fb1ac?w=500&q=80", category: "Electronics", hasAr: false },
];

const ProductListing = () => {
    const navigate = useNavigate();

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {MOCK_PRODUCTS.map(product => (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer border border-gray-100"
                                onClick={() => navigate(`/products/${product.id}`)}
                            >
                                <div className="relative h-64 bg-gray-100">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    {/* AR Badge */}
                                    {product.hasAr && (
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-brand-dark">
                                            <Camera size={18} />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <p className="text-sm text-brand font-medium mb-1">{product.category}</p>
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
                </div>
            </div>
        </div>
    );
};

export default ProductListing;
