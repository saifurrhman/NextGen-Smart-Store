import React, { useState, useEffect } from 'react';
import {
    Package, Star, ShoppingBag, Eye,
    ArrowUpRight, Download, Search
} from 'lucide-react';
import api from '../../../utils/api';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';

const ProductPerformance = () => {
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        period: '30days',
        stock: ''
    });
    const [topProducts, setTopProducts] = useState([]);
    const [topCategories, setTopCategories] = useState([]);
    const [stats, setStats] = useState({
        totalProducts: 0,
        bestSeller: 'None',
        avgRating: 0.0,
        lowStock: 0
    });

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                let url = '/api/v1/analytics/dashboard/?';
                if (searchTerm) url += `search=${searchTerm}&`;
                if (filters.period) url += `period=${filters.period}&`;
                if (filters.stock) url += `stock=${filters.stock}&`;

                const response = await api.get(url);
                const data = response.data;

                setTopProducts(data.topProducts || []);

                // Aggregate stats
                const overview = data.overview || {};
                setTopCategories(data.topCategories || []);

                setStats({
                    totalProducts: overview.totalProducts || 0,
                    bestSeller: data.topProducts && data.topProducts.length > 0 ? data.topProducts[0].name : 'None',
                    avgRating: 0.0,
                    lowStock: overview.lowStock || 0
                });
            } catch (error) {
                console.error("Error fetching product performance:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [searchTerm, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ period: '30days', stock: '' });
    };

    const filterOptions = [
        {
            key: 'period',
            label: 'Time Period',
            options: [
                { label: 'Last 7 Days', value: '7days' },
                { label: 'Last 30 Days', value: '30days' },
                { label: 'Last 90 Days', value: '90days' },
                { label: 'Year to Date', value: 'ytd' },
            ]
        },
        {
            key: 'stock',
            label: 'Stock Status',
            options: [
                { label: 'All Status', value: '' },
                { label: 'In Stock', value: 'Stock' },
                { label: 'Low Stock', value: 'Low Stock' },
                { label: 'Out of Stock', value: 'Out of Stock' },
            ]
        }
    ];

    const performanceCards = [
        { label: 'Total Products', value: stats.totalProducts.toLocaleString(), icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Best Seller', value: stats.bestSeller, icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Avg. Rating', value: `${stats.avgRating}/5.0`, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Low Stock Alerts', value: stats.lowStock, icon: Package, color: 'text-red-600', bg: 'bg-red-50' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Product Performance</h1>
                    <p className="text-[10px] md:text-sm text-gray-500 mt-1">Analyze which products are driving revenue and customer interest.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Download size={16} />
                        <span>Export CSV</span>
                    </button>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
                        View Detailed Report
                    </button>
                </div>
            </div>

            {/* Performance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                {performanceCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-sm">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${card.bg} ${card.color} flex items-center justify-center mb-4`}>
                            <card.icon size={20} className="md:w-6 md:h-6" />
                        </div>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">{card.label}</p>
                        <h3 className="text-lg md:text-xl font-bold text-gray-800 mt-1">{loading ? '...' : card.value}</h3>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Best Selling Products Table */}
                <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800">Best Selling Products</h3>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-gray-50 border-none rounded-lg pl-9 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500/20 w-48 text-gray-700 placeholder:text-gray-400"
                                />
                            </div>
                            <FilterDropdown
                                options={filterOptions}
                                activeFilters={filters}
                                onFilterChange={handleFilterChange}
                                onClear={clearFilters}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 font-bold text-xs text-gray-500 uppercase">
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Sales</th>
                                    <th className="px-6 py-4">Revenue</th>
                                    <th className="px-6 py-4">Stock</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-10 text-center text-gray-400 italic">Loading performance data...</td></tr>
                                ) : topProducts.length > 0 ? topProducts.map((product, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-400 text-xs uppercase">
                                                    {product.name.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{product.name}</p>
                                                    <p className="text-xs text-gray-400">{product.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                                        <td className="px-6 py-4 font-bold text-gray-800">{product.orders}</td>
                                        <td className="px-6 py-4 font-bold text-emerald-600">${(product.price * product.orders).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${product.stockStatus === 'Stock' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                {product.stockStatus}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="p-10 text-center text-gray-400 italic">No products Found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Conversion by Category */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-6">Top Categories</h3>
                    <div className="space-y-6">
                        {topCategories.map((category, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-700">{category.name}</span>
                                    <span className="font-bold text-gray-800">{category.count} sales</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 transition-all duration-1000"
                                        style={{ width: `${category.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-8 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors uppercase tracking-wider">
                        All Categories
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductPerformance;
