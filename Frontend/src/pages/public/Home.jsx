import React, { useEffect, useState } from 'react';
import { Camera, ArrowRight, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from '../../utils/api'; // Use centralized API

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [heroData, setHeroData] = useState({
        title: "Discover the Latest",
        highlight: "Deals Up to 50% Off",
        description: "Experience the future of shopping with our AR Try-On technology. Find the perfect fit from the comfort of your home.",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        badge: "New Collection 2026"
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Trending Products
                const prodResponse = await api.get('products/?limit=4');
                setProducts(prodResponse.data.results || prodResponse.data);

                // 2. Fetch Hero Banner (If API exists)
                try {
                    const bannerResponse = await api.get('hero-banner/');
                    if (bannerResponse.data) {
                        setHeroData(prev => ({ ...prev, ...bannerResponse.data }));
                    }
                } catch (bannerError) {
                    console.log("Hero banner API not ready, using default.");
                }

            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-gray-50">
            {/* Hero Section - Light & Fresh */}
            <div className="bg-[#EAF8E7] relative overflow-hidden">
                <div className="container mx-auto px-4 py-20 md:py-32 relative z-10 flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-1/2 space-y-8">
                        <span className="inline-block px-4 py-1.5 bg-white text-brand-dark text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                            {heroData.badge}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight text-brand-dark">
                            {heroData.title} <br />
                            <span className="text-brand">{heroData.highlight}</span>
                        </h1>
                        <p className="text-text-sub text-lg max-w-lg leading-relaxed">
                            {heroData.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link to="/products" className="px-8 py-4 bg-brand text-white font-bold rounded-full hover:bg-brand-dark transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                                <span>Shop Now</span>
                                <ArrowRight size={20} />
                            </Link>
                            <Link to="/ar-demo" className="px-8 py-4 bg-white text-brand-dark font-bold rounded-full border-2 border-transparent hover:border-brand transition-all flex items-center justify-center space-x-2 shadow-sm hover:shadow-md">
                                <Camera size={20} />
                                <span>Watch Demo</span>
                            </Link>
                        </div>
                    </div>
                    {/* Hero Image */}
                    <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center relative">
                        <div className="absolute w-[120%] h-[120%] bg-white/40 rounded-full blur-3xl -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        <img
                            src={heroData.image}
                            alt="Fashion Model"
                            className="relative z-10 w-full max-w-lg rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-700"
                        />
                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl z-20 animate-bounce-slow hidden md:block">
                            <div className="flex items-center gap-3">
                                <div className="bg-brand-light p-2 rounded-full text-brand-dark">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-brand-dark font-bold uppercase">Authentic</p>
                                    <p className="text-sm font-bold">100% Verified</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: Truck, title: "Free Shipping", subtitle: "On all orders over $50" },
                            { icon: RefreshCw, title: "Easy Returns", subtitle: "30-day money back guarantee" },
                            { icon: ShieldCheck, title: "Secure Payment", subtitle: "100% secure checkout" },
                            { icon: Camera, title: "AR Try-On", subtitle: "Visualize before you buy" },
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 border border-gray-50 rounded-xl hover:border-brand-accent/50 transition-colors group">
                                <div className="w-12 h-12 bg-gray-50 text-brand rounded-full flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
                                    <feature.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-brand-dark">{feature.title}</h3>
                                    <p className="text-xs text-text-sub">{feature.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-brand font-bold uppercase tracking-wider text-sm">Top Selling</span>
                            <h2 className="text-3xl font-bold text-brand-dark mt-2">Trending Products</h2>
                        </div>
                        <Link to="/products" className="text-brand hover:text-brand-dark font-medium flex items-center gap-1">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* Dynamic Product Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-brand text-lg animate-pulse">Loading Trending Products...</p>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.slice(0, 4).map((product) => (
                                <div key={product.id} className="bg-white rounded-2xl p-4 hover:shadow-xl transition-all group">
                                    <div className="relative bg-gray-100 rounded-xl h-64 overflow-hidden mb-4">
                                        <img
                                            src={product.images?.[0]?.image || 'https://via.placeholder.com/500'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <button className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg text-brand-dark hover:text-brand hover:scale-110 transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
                                            <Camera size={20} />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-bold text-brand-dark text-lg truncate">{product.name}</h3>
                                        <p className="text-text-sub text-sm">{product.category_name || 'Fashion'}</p>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-xl font-bold text-brand">${product.price}</span>
                                            <button className="text-sm font-bold text-brand hover:underline">Add to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                            <p className="text-text-sub">No products found. Be the first to add one!</p>
                            <Link to="/login" className="mt-4 inline-block text-brand font-bold hover:underline">
                                Login as Vendor to Add Products
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
